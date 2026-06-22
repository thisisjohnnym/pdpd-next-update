"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import {
  pdpBottomSheetCloseButtonClass,
  pdpBottomSheetGrabHandleClass,
  pdpBottomSheetHeaderClass,
  pdpBottomSheetPanelClass,
  pdpBottomSheetViewportFrameClass,
  PDP_BOTTOM_SHEET_CLOSE_ICON_SIZE,
} from "./pdp-bottom-sheet";
import { type PdpAiConciergePrompt } from "./pdp-data";
import { useActiveProduct } from "./pdp-active-product-context";
import {
  getPdpCoachAiContent,
  resolveCoachAiAnswer,
} from "./pdp-coach-ai-content";
import { pdpBodyRhythm, pdpPressableClass } from "./pdp-type";
import {
  useBodyScrollLock,
  useVisualViewportFrame,
} from "./use-visual-viewport-frame";

/** Resolved answer payload — matches a known prompt or falls back to the catch-all */
type ConciergeAnswer = {
  headline: string;
  body: string;
  highlights?: readonly string[];
  images?: readonly { src: string; alt: string }[];
};

type ChatMessage =
  | { id: string; role: "user"; text: string }
  | { id: string; role: "ai"; answer: ConciergeAnswer };

/** Externally triggered ask — token forces a fresh submission even on repeat text */
export type PdpCoachAiAsk = {
  token: number;
  question: string;
  promptId: string | null;
};

type PdpCoachAiSheetProps = {
  open: boolean;
  onClose: () => void;
  ask: PdpCoachAiAsk | null;
};

const TYPING_DELAY_MS = 750;

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div
        className={cn(
          "max-w-[82%] rounded-[20px] rounded-br-md bg-black px-4 py-2.5 text-white",
          "font-extended text-sm",
          pdpBodyRhythm,
        )}
      >
        {text}
      </div>
    </div>
  );
}

function AiBubble({ answer }: { answer: ConciergeAnswer }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="flex min-w-0 flex-col gap-3">
        <div>
          <p
            className={cn(
              "font-extended text-sm leading-[1.35] tracking-[0.2px] text-black",
            )}
          >
            {answer.headline}
          </p>
          <p
            className={cn(
              "font-extended mt-1.5 text-sm leading-[1.35] tracking-[0.2px] text-neutral-600",
            )}
          >
            {answer.body}
          </p>
        </div>

        {answer.highlights?.length ? (
          <ul className="ml-4 flex list-disc flex-col gap-1">
            {answer.highlights.map((highlight) => (
              <li
                key={highlight}
                className="font-extended text-sm leading-[1.35] tracking-[0.2px] text-neutral-600 marker:text-neutral-400"
              >
                {highlight}
              </li>
            ))}
          </ul>
        ) : null}

        {answer.images?.length ? (
          <div className="grid grid-cols-2 gap-1.5">
            {answer.images.map((image) => (
              <div
                key={image.src}
                className="relative aspect-[4/5] overflow-hidden rounded-lg bg-neutral-200"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover object-center"
                  sizes="40vw"
                />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex items-start gap-2.5">
      <div className="flex items-center gap-1 py-2">
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            className="size-1.5 animate-bounce rounded-full bg-neutral-400"
            style={{ animationDelay: `${dot * 0.15}s`, animationDuration: "1s" }}
          />
        ))}
      </div>
    </div>
  );
}

function QuickReplyRow({
  prompts,
  onPick,
}: {
  prompts: PdpAiConciergePrompt[];
  onPick: (prompt: PdpAiConciergePrompt) => void;
}) {
  if (!prompts.length) {
    return null;
  }

  return (
    <div className="-mx-3 flex gap-2 overflow-x-auto overscroll-x-contain px-3 pb-1 pr-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pdp-build-picker-scroll pdp-carousel-scroll">
      {prompts.map((prompt) => (
        <button
          key={prompt.id}
          type="button"
          onClick={() => onPick(prompt)}
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-3 py-2 text-left transition-colors active:bg-neutral-50",
            pdpPressableClass,
          )}
        >
          <MaterialIcon
            name={prompt.icon}
            size={16}
            className="shrink-0 text-neutral-600"
            aria-hidden
          />
          <span className="font-extended whitespace-nowrap text-[12px] tracking-[0.2px] text-black">
            {prompt.question}
          </span>
        </button>
      ))}
    </div>
  );
}

function ChatComposer({
  onSend,
  keyboardOpen,
  placeholder,
}: {
  onSend: (text: string) => void;
  keyboardOpen: boolean;
  placeholder: string;
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState("");
  const trimmed = text.trim();
  const canSend = trimmed.length > 0;

  const handleSend = () => {
    if (!canSend) {
      return;
    }
    onSend(trimmed);
    setText("");
    inputRef.current?.focus();
  };

  return (
    <div
      className={cn(
        "shrink-0 border-t border-neutral-200 bg-white px-3 pt-3",
        keyboardOpen ? "pb-2" : "pb-[max(12px,var(--pdp-safe-area-bottom))]",
      )}
    >
      <div className="flex items-center gap-2">
        <label htmlFor={inputId} className="sr-only">
          Ask Coach AI
        </label>
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          inputMode="text"
          enterKeyHint="send"
          autoComplete="off"
          autoCapitalize="sentences"
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && canSend) {
              event.preventDefault();
              handleSend();
            }
          }}
          placeholder={placeholder}
          className={cn(
            "min-h-11 min-w-0 flex-1 rounded-full border-0 bg-[#f3f3f3] px-4 pt-3 pb-2.5",
            "font-extended text-base tracking-[0.2px] text-black outline-none",
            "placeholder:text-neutral-500 focus:bg-[#ececec]",
            "[touch-action:manipulation] [-webkit-tap-highlight-color:transparent]",
          )}
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          aria-label="Send message"
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-full transition-colors",
            canSend
              ? "bg-black text-white active:bg-neutral-800"
              : "bg-neutral-100 text-neutral-400",
            pdpPressableClass,
          )}
        >
          <MaterialIcon
            name="arrow_upward"
            size={20}
            className={canSend ? "text-white" : "text-neutral-400"}
          />
        </button>
      </div>
    </div>
  );
}

/** Chat tray — Coach AI conversation with back-and-forth message bubbles */
export function PdpCoachAiSheet({ open, onClose, ask }: PdpCoachAiSheetProps) {
  const { productId } = useActiveProduct();
  const coachAi = getPdpCoachAiContent(productId);
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const viewportFrame = useVisualViewportFrame(open);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messageSeq = useRef(0);
  const lastTokenRef = useRef<number | null>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const nextId = (role: string) => {
    messageSeq.current += 1;
    return `${role}-${messageSeq.current}`;
  };

  const submit = useCallback((question: string, promptId: string | null) => {
    const trimmed = question.trim();
    if (!trimmed) {
      return;
    }

    setMessages((current) => [
      ...current,
      { id: nextId("user"), role: "user", text: trimmed },
    ]);
    setIsTyping(true);

    if (typingTimer.current) {
      clearTimeout(typingTimer.current);
    }
    typingTimer.current = setTimeout(() => {
      const answer = resolveCoachAiAnswer(coachAi, trimmed, promptId);
      setMessages((current) => [
        ...current,
        { id: nextId("ai"), role: "ai", answer },
      ]);
      setIsTyping(false);
    }, TYPING_DELAY_MS);
  }, [coachAi]);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (typingTimer.current) {
        clearTimeout(typingTimer.current);
      }
    };
  }, []);

  useBodyScrollLock(open);

  // Apply externally triggered asks (prompt taps / composer submits on the page)
  useEffect(() => {
    if (!ask || ask.token === lastTokenRef.current) {
      return;
    }
    lastTokenRef.current = ask.token;
    submit(ask.question, ask.promptId);
  }, [ask, submit]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Keep the latest message in view as the conversation grows
  useEffect(() => {
    const node = scrollRef.current;
    if (!node) {
      return;
    }
    node.scrollTo({ top: node.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  if (!mounted) {
    return null;
  }

  const askedQuestions = new Set(
    messages
      .filter((message) => message.role === "user")
      .map((message) => (message as { text: string }).text.toLowerCase()),
  );
  const remainingPrompts = coachAi.prompts.filter(
    (prompt) => !askedQuestions.has(prompt.question.toLowerCase()),
  );

  const isEmpty = messages.length === 0 && !isTyping;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-50 transition-opacity duration-300",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      )}
      aria-hidden={!open}
    >
      <div className="absolute inset-0 bg-black/45" aria-hidden />

      <div
        className={pdpBottomSheetViewportFrameClass}
        style={{
          top: viewportFrame.top,
          left: viewportFrame.left,
          width: viewportFrame.width,
          height: viewportFrame.height,
        }}
      >
        <button
          type="button"
          aria-label="Close Coach AI"
          className="absolute inset-0"
          onClick={onClose}
          tabIndex={open ? 0 : -1}
        />

        <div
          role="dialog"
          aria-modal="true"
          aria-label="Coach AI"
          className={cn(
            pdpBottomSheetPanelClass({ open, maxHeight: "88dvh", fitViewportFrame: true }),
            "relative z-[1] min-h-0",
          )}
        >
          <div className={pdpBottomSheetHeaderClass}>
            <div className={pdpBottomSheetGrabHandleClass} />
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className={pdpBottomSheetCloseButtonClass}
            >
              <MaterialIcon name="close" size={PDP_BOTTOM_SHEET_CLOSE_ICON_SIZE} />
            </button>
          </div>

          <div className="flex min-h-0 flex-1 flex-col">
            <div
              ref={scrollRef}
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pt-2"
            >
              {isEmpty ? (
                <div className="flex flex-col gap-3 pb-3">
                  <AiBubble
                    answer={{
                      headline: "Hi, I'm Coach AI",
                      body: "Ask me about styling, sizing, charm pairings, or real customer photos for this bag.",
                    }}
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-3 pb-3">
                  {messages.map((message) =>
                    message.role === "user" ? (
                      <UserBubble key={message.id} text={message.text} />
                    ) : (
                      <AiBubble key={message.id} answer={message.answer} />
                    ),
                  )}
                  {isTyping ? <TypingBubble /> : null}
                </div>
              )}
            </div>

            <div className="shrink-0 px-3 pb-2 pt-1">
              <QuickReplyRow
                prompts={remainingPrompts}
                onPick={(prompt) => submit(prompt.question, prompt.id)}
              />
            </div>

            <ChatComposer
              onSend={(text) => submit(text, null)}
              keyboardOpen={viewportFrame.keyboardLikelyOpen}
              placeholder={coachAi.sheetPlaceholder}
            />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
