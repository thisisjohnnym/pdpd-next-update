"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import {
  pdpCarouselScrollClass,
  pdpCarouselScrollWrapClass,
} from "./pdp-carousel";

import {
  type PdpAiConciergePrompt,
} from "./pdp-data";
import { useActiveProduct } from "./pdp-active-product-context";
import { getPdpCoachAiContent } from "./pdp-coach-ai-content";
import { PdpAiInsightContent } from "./pdp-ai-insight-card";
import { pdpModuleSectionClass, pdpModuleHeadingClass } from "./pdp-module-section";
import { pdpType } from "./pdp-type";

function ConciergeResponse({
  prompt,
  userQuery,
  flat = false,
  fallbackResponse,
}: {
  prompt: PdpAiConciergePrompt | null;
  userQuery: string;
  flat?: boolean;
  fallbackResponse: { headline: string; body: string };
}) {
  const response = prompt?.response ?? fallbackResponse;
  const highlights = prompt?.response.highlights;

  return (
    <div
      className={cn(
        "flex flex-col gap-4 border border-neutral-200 bg-white p-4",
        flat ? "shadow-none" : "rounded-2xl shadow-sm",
      )}
      aria-live="polite"
    >
      <PdpAiInsightContent
        eyebrow="AI Concierge"
        title={response.headline}
        body={response.body}
      />

      {highlights?.length ? (
        <ul className="ml-4 flex list-disc flex-col gap-1">
          {highlights.map((highlight) => (
            <li
              key={highlight}
              className="font-extended text-sm leading-[1.35] tracking-[0.2px] text-neutral-600 marker:text-neutral-400"
            >
              {highlight}
            </li>
          ))}
        </ul>
      ) : null}

      {prompt?.response.images.length ? (
        <div className="grid grid-cols-2 gap-1.5">
          {prompt.response.images.map((image) => (
            <div
              key={image.src}
              className="relative aspect-[4/5] overflow-hidden bg-neutral-100"
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

      {userQuery ? (
        <p className={`border-t border-neutral-100 pt-3 text-neutral-500 ${pdpType.micro}`}>
          You asked: &ldquo;{userQuery}&rdquo;
        </p>
      ) : null}
    </div>
  );
}

type PdpAiConciergePanelProps = {
  /** Suffix for form field ids when multiple panels could mount */
  idSuffix?: string;
  showTitle?: boolean;
  onClose?: () => void;
  className?: string;
  /** Square corners — for embedded discovery card */
  variant?: "default" | "flat";
  /**
   * When provided, prompts and the composer hand off to a chat experience
   * (e.g. a tray) instead of rendering an inline response below the form.
   */
  onAsk?: (question: string, promptId: string | null) => void;
};

/** Inline AI Concierge — form, prompts, and responses without page section wrapper */
export function PdpAiConciergePanel({
  idSuffix = "",
  showTitle = true,
  onClose,
  className,
  variant = "default",
  onAsk,
}: PdpAiConciergePanelProps) {
  const flat = variant === "flat";
  const { productId } = useActiveProduct();
  const { placeholder, prompts, fallbackResponse } = getPdpCoachAiContent(productId);
  const [query, setQuery] = useState("");
  const [activePromptId, setActivePromptId] = useState<string | null>(null);
  const [submittedQuery, setSubmittedQuery] = useState<string | null>(null);
  const [showResponse, setShowResponse] = useState(false);

  const promptFieldId = `pdp-ai-prompt${idSuffix}`;
  const hasQuery = query.trim().length > 0;
  const activePrompt =
    prompts.find((prompt) => prompt.id === activePromptId) ?? null;

  const runPrompt = useCallback(
    (prompt: PdpAiConciergePrompt) => {
      if (onAsk) {
        onAsk(prompt.question, prompt.id);
        setQuery("");
        return;
      }

      setQuery(prompt.question);
      setActivePromptId(prompt.id);
      setSubmittedQuery(prompt.question);
      setShowResponse(true);
    },
    [onAsk],
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const trimmed = query.trim();
      if (!trimmed) {
        return;
      }

      const matchedPrompt = prompts.find(
        (prompt) => prompt.question.toLowerCase() === trimmed.toLowerCase(),
      );

      if (onAsk) {
        onAsk(trimmed, matchedPrompt?.id ?? null);
        setQuery("");
        return;
      }

      setSubmittedQuery(trimmed);
      setActivePromptId(matchedPrompt?.id ?? null);
      setShowResponse(true);
    },
    [query, prompts, onAsk],
  );

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {showTitle ? (
        <div className="flex items-center justify-between gap-2">
          <h3 className={pdpModuleHeadingClass({ lead: false, size: "sm" })}>
            Coach AI
          </h3>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className={`font-extended shrink-0 text-neutral-500 ${pdpType.micro}`}
            >
              Close
            </button>
          ) : null}
        </div>
      ) : onClose ? (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className={`font-extended text-neutral-500 ${pdpType.micro}`}
          >
            Close
          </button>
        </div>
      ) : null}

      <form
        className={cn(
          "bg-white p-3",
          flat ? "border border-neutral-200" : "rounded-2xl shadow-sm",
        )}
        onSubmit={handleSubmit}
      >
        <label htmlFor={promptFieldId} className="sr-only">
          Ask the AI Concierge
        </label>

        <div className="flex items-start gap-2.5">
          <MaterialIcon
            name="auto_awesome"
            size={20}
            className="mt-0.5 shrink-0 text-black"
          />
          <textarea
            id={promptFieldId}
            rows={2}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
            className="font-extended min-h-[3.25rem] w-full resize-none bg-transparent text-sm leading-[1.35] tracking-[0.2px] text-black outline-none placeholder:text-neutral-400"
          />
        </div>

        <div className="mt-2 flex justify-end">
          <button
            type="submit"
            disabled={!hasQuery}
            aria-label="Send prompt"
            className={cn(
              "flex size-9 items-center justify-center transition-colors",
              flat ? "rounded-none" : "rounded-full",
              hasQuery
                ? "bg-black text-white active:bg-neutral-800"
                : "bg-neutral-100 text-neutral-400",
            )}
          >
            <MaterialIcon
              name="arrow_upward"
              size={20}
              className={hasQuery ? "text-white" : "text-neutral-400"}
            />
          </button>
        </div>
      </form>

      <div className={pdpCarouselScrollWrapClass}>
        <div
          className={cn(
            "flex gap-2",
            pdpCarouselScrollClass,
            "pdp-build-picker-scroll pr-3 lg:pr-5",
          )}
        >
          {prompts.map((prompt) => {
            const isActive = activePromptId === prompt.id && showResponse;

            return (
              <button
                key={prompt.id}
                type="button"
                onClick={() => runPrompt(prompt)}
                aria-pressed={isActive}
                className={cn(
                  "font-extended inline-flex shrink-0 items-center whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[13px] leading-[1.4] transition-colors duration-200",
                  isActive
                    ? "border-black bg-black text-white"
                    : "border-neutral-200 bg-white text-black active:bg-neutral-50",
                )}
              >
                {prompt.question}
              </button>
            );
          })}
        </div>
      </div>

      {showResponse ? (
        <ConciergeResponse
          prompt={activePrompt}
          userQuery={submittedQuery ?? ""}
          flat={flat}
          fallbackResponse={fallbackResponse}
        />
      ) : null}
    </div>
  );
}

/** AI Concierge — experiential prompts with inline styling answers */
function PdpAiConciergeModule() {
  return (
    <section
      data-header-surface="light"
      className={pdpModuleSectionClass({ variant: "muted", rhythm: "compact" })}
    >
      <PageGrid fullWidth>
        <GridItem mobile={12} desktop={24}>
          <PdpAiConciergePanel />
        </GridItem>
      </PageGrid>
    </section>
  );
}

/** @deprecated Use PdpAiConciergeModule */
const PdpProductSearchModule = PdpAiConciergeModule;
