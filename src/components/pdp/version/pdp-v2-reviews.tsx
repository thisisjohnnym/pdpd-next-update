"use client";

import { cn } from "@/lib/cn";

import {
  PDP_CUSTOMER_REVIEWS,
  PDP_REVIEWS_AI_SUMMARY,
  PDP_REVIEWS_SUMMARY,
} from "../pdp-data";
import { PdpStarRating } from "../pdp-review-comment";
import { PdpRevealItem } from "../pdp-reveal-item";
import { PdpTextReveal } from "../pdp-text-reveal";
import { pdpPressableClass, pdpType } from "../pdp-type";
import { revealStaggerDelay } from "../use-pdp-element-reveal";

import { getPdpVersionConfig } from "./pdp-version-config";
import { usePdpVersion } from "./pdp-version-context";

/**
 * v2-only simplified reviews section (Paper AYJ-0 "v2 — Reviews (reviews only)").
 *
 * Shows: heading + aggregate stars + AI summary card + 1 full review card +
 * 1 clipped preview card + "Read all reviews" pill + underlined "Write a review" link + arrow.
 *
 * No tabs, no comments, no like buttons — those are off in v2 via version config.
 */

function ReviewCard({
  review,
}: {
  review: (typeof PDP_CUSTOMER_REVIEWS)[number];
}) {
  return (
    <div className="flex flex-col gap-3 border-t border-neutral-200 pt-4">
      <PdpStarRating rating={review.rating ?? 0} size={18} />
      <p
        className={cn(
          "font-extended m-0 leading-snug text-black",
          pdpType.body,
        )}
      >
        {review.body}
      </p>

      {review.recommendTags?.length ? (
        <div className="flex flex-wrap gap-1.5">
          {review.recommendTags.map((tag) => (
            <span
              key={tag}
              className={cn(
                "font-extended rounded-[4px] px-[8px] pt-[8px] pb-[7px] text-neutral-600 [outline:1px_solid_#EDEDED] -outline-offset-1",
                pdpType.micro,
              )}
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

type PdpV2ReviewsProps = {
  onReadAll?: () => void;
  onWriteReview?: () => void;
};

export function PdpV2Reviews({ onReadAll, onWriteReview }: PdpV2ReviewsProps) {
  const { leftAlignModuleHeadings, hideTextLinkArrows, useV4ModuleSpacing } =
    getPdpVersionConfig(usePdpVersion());
  const { average, count } = PDP_REVIEWS_SUMMARY;
  const { body: aiBody } = PDP_REVIEWS_AI_SUMMARY;

  const firstReview = PDP_CUSTOMER_REVIEWS[0];
  const secondReview = PDP_CUSTOMER_REVIEWS[1];

  return (
    <section
      data-header-surface="light"
      className={cn(
        "flex w-full shrink-0 flex-col items-center bg-white",
        useV4ModuleSpacing ? "px-4 pb-[8px] pt-[56px]" : "px-3 pb-10 pt-8",
      )}
    >
      <div
        className={cn(
          "flex w-full flex-col",
          useV4ModuleSpacing ? "gap-4" : "gap-6",
        )}
      >
        <div
          className={cn(
            "flex flex-col",
            useV4ModuleSpacing ? "gap-1" : "gap-2",
            leftAlignModuleHeadings ? "items-start" : "items-center",
          )}
        >
          <PdpTextReveal
            as="h2"
            className="font-extended m-0 text-xl font-normal tracking-tight text-black"
          >
            Reviews
          </PdpTextReveal>
          <PdpRevealItem delay={revealStaggerDelay(1)}>
            <div className="flex items-center gap-2">
            <PdpStarRating rating={average} size={18} />
            <span className={cn("font-extended text-black", pdpType.body)}>
              {average.toFixed(1)} ({count} reviews)
            </span>
          </div>
          </PdpRevealItem>
        </div>

        <PdpRevealItem delay={revealStaggerDelay(2)}>
        <div
          className={cn(
            "flex flex-col rounded-xl bg-[#F6F6F6]",
            useV4ModuleSpacing ? "gap-4 p-[14px]" : "px-4 py-3.5",
          )}
        >
          <p
            className={cn(
              "font-extended m-0 leading-snug text-neutral-600",
              pdpType.label,
            )}
          >
            {aiBody}
          </p>
          <p
            className={cn(
              "font-extended m-0 text-neutral-600 opacity-[0.7]",
              useV4ModuleSpacing ? "" : "mt-2",
              pdpType.micro,
            )}
          >
            AI-generated summary
          </p>
        </div>
        </PdpRevealItem>

        <PdpRevealItem delay={revealStaggerDelay(3)}>
        <div className="relative h-[213px] overflow-clip">
          <div className="flex flex-col">
            {firstReview ? <ReviewCard review={firstReview} /> : null}
            {secondReview ? <ReviewCard review={secondReview} /> : null}
          </div>

          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 top-[55px] bg-gradient-to-t from-white to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 top-[185px] bg-gradient-to-t from-white to-transparent"
          />
        </div>
        </PdpRevealItem>
      </div>

      <PdpRevealItem delay={revealStaggerDelay(4)}>
      <div
        className={cn(
          "flex w-full flex-col items-center",
          useV4ModuleSpacing ? "gap-6" : "pt-6",
        )}
      >
        {onReadAll ? (
          <button
            type="button"
            onClick={onReadAll}
            className={cn(
              "font-extended h-[48px] w-fit rounded-full border border-[#D4D4D4] px-[24px] text-center text-black transition-colors active:bg-neutral-100",
              pdpType.label,
            )}
          >
            Read all reviews
          </button>
        ) : null}

        {onWriteReview ? (
          <button
            type="button"
            onClick={onWriteReview}
            className={cn(
              "flex items-center justify-center gap-1 self-stretch text-neutral-900",
              useV4ModuleSpacing ? "" : "pl-2 pt-[11px]",
              pdpPressableClass,
            )}
          >
            <span
              className={cn(
                "font-extended underline underline-offset-[3px]",
                pdpType.label,
              )}
            >
              Write a review
            </span>
            {!hideTextLinkArrows ? (
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                aria-hidden
                className="shrink-0"
              >
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : null}
          </button>
        ) : null}
      </div>
      </PdpRevealItem>
    </section>
  );
}
