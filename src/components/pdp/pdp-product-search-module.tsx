"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import {
  PDP_AI_CONCIERGE,
  type PdpAiConciergePrompt,
} from "./pdp-data";
import { PdpAiInsightContent } from "./pdp-ai-insight-card";
import { pdpModuleSectionClass, pdpModuleHeadingClass } from "./pdp-module-section";
import { pdpBodyRhythm, pdpType } from "./pdp-type";

function ConciergeResponse({
  prompt,
  userQuery,
  flat = false,
}: {
  prompt: PdpAiConciergePrompt | null;
  userQuery: string;
  flat?: boolean;
}) {
  const response = prompt?.response ?? PDP_AI_CONCIERGE.fallbackResponse;
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
        <ul className="flex flex-wrap gap-1.5">
          {highlights.map((highlight) => (
            <li
              key={highlight}
              className={cn(
                "font-extended bg-neutral-100 px-2.5 py-1 text-[10px] tracking-[0.2px] text-neutral-700",
                !flat && "rounded-full",
              )}
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
};

/** Inline AI Concierge — form, prompts, and responses without page section wrapper */
export function PdpAiConciergePanel({
  idSuffix = "",
  showTitle = true,
  onClose,
  className,
  variant = "default",
}: PdpAiConciergePanelProps) {
  const flat = variant === "flat";
  const { title, placeholder, prompts } = PDP_AI_CONCIERGE;
  const [query, setQuery] = useState("");
  const [activePromptId, setActivePromptId] = useState<string | null>(null);
  const [submittedQuery, setSubmittedQuery] = useState<string | null>(null);
  const [showResponse, setShowResponse] = useState(false);

  const promptFieldId = `pdp-ai-prompt${idSuffix}`;
  const hasQuery = query.trim().length > 0;
  const activePrompt =
    prompts.find((prompt) => prompt.id === activePromptId) ?? null;

  const runPrompt = useCallback((prompt: PdpAiConciergePrompt) => {
    setQuery(prompt.question);
    setActivePromptId(prompt.id);
    setSubmittedQuery(prompt.question);
    setShowResponse(true);
  }, []);

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

      setSubmittedQuery(trimmed);
      setActivePromptId(matchedPrompt?.id ?? null);
      setShowResponse(true);
    },
    [query, prompts],
  );

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {showTitle ? (
        <div className="flex items-center justify-between gap-2">
          <h3 className={pdpModuleHeadingClass({ lead: false, size: "sm" })}>
            {title}
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

      <div className="flex flex-col gap-2">
        <p className={`font-extended m-0 text-neutral-500 ${pdpType.micro}`}>
          Try asking
        </p>
        {prompts.map((prompt) => {
          const isActive = activePromptId === prompt.id && showResponse;

          return (
            <button
              key={prompt.id}
              type="button"
              onClick={() => runPrompt(prompt)}
              aria-pressed={isActive}
              className={cn(
                "flex w-full items-start gap-3 p-3 text-left transition-colors duration-200",
                isActive ? "bg-neutral-100 shadow-sm" : "bg-white active:bg-neutral-50",
              )}
            >
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center transition-colors",
                  isActive ? "bg-black text-white" : "bg-neutral-100 text-neutral-600",
                )}
              >
                <MaterialIcon name={prompt.icon} size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="font-extended block text-[10px] tracking-[0.2px] text-neutral-500">
                  {prompt.category}
                </span>
                <span className={`font-extended mt-1 block text-sm text-black ${pdpBodyRhythm}`}>
                  {prompt.question}
                </span>
              </span>
              <MaterialIcon
                name="chevron_right"
                size={20}
                className={cn(
                  "mt-1 shrink-0 transition-colors",
                  isActive ? "text-black" : "text-neutral-300",
                )}
              />
            </button>
          );
        })}
      </div>

      {showResponse ? (
        <ConciergeResponse
          prompt={activePrompt}
          userQuery={submittedQuery ?? ""}
          flat={flat}
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
