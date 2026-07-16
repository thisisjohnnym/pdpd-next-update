"use client";

import { useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";

import { PDP_REVIEWS_AI_SUMMARY, PDP_REVIEWS_SUMMARY } from "../pdp-data";
import { PdpStarRating } from "../pdp-review-comment";
import { pdpPressableClass, pdpType } from "../pdp-type";
import { getPdpVersionConfig } from "./pdp-version-config";
import { usePdpVersion } from "./pdp-version-context";

type PdpV5ReviewTeaserProps = {
  className?: string;
  onViewReviews: () => void;
};

/** Soft insight tray — distinct from the plain store-pickup action row. */
const reviewCardClass =
  "overflow-hidden rounded-none border-0 bg-neutral-50 shadow-none outline-none";

// fallow-ignore-next-line complexity
function ReviewSummaryClamp({ text }: { text: string }) {
  const textRef = useRef<HTMLSpanElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);

  useLayoutEffect(() => {
    const node = textRef.current;
    if (!node) {
      return;
    }

    const measure = () => {
      if (!expanded) {
        setOverflowing(node.scrollHeight - 1 > node.clientHeight);
      }
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [expanded, text]);

  return (
    <span
      className={cn(
        "relative block !text-xs lg:!text-[10px]",
        pdpType.body,
      )}
    >
      <span
        ref={textRef}
        className={cn(
          "leading-[1.35] text-pretty text-neutral-600",
          !expanded && "line-clamp-2",
        )}
      >
        {text}
        {expanded ? (
          <>
            {" "}
            <button
              type="button"
              onClick={() => setExpanded(false)}
              aria-expanded
              className={cn(
                "relative leading-[1.35] text-neutral-600 underline underline-offset-2 transition-colors after:absolute after:-inset-x-1 after:-inset-y-3 hover:text-neutral-900 active:text-neutral-900",
                pdpPressableClass,
              )}
            >
              Read less
            </button>
          </>
        ) : null}
      </span>
      {overflowing && !expanded ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          aria-expanded={false}
          className={cn(
            "absolute top-[1.35em] right-0 z-10 bg-neutral-50 pl-1 leading-[1.35] text-neutral-600 underline underline-offset-2 transition-colors after:absolute after:-inset-x-1 after:-inset-y-3 hover:text-neutral-900 active:text-neutral-900",
            pdpPressableClass,
          )}
        >
          … Read more
        </button>
      ) : null}
    </span>
  );
}

/**
 * Reviews card — tappable stars/score, plus an AI summary (2 lines max).
 * Soft fill so it reads as a post-purchase cue under Add to bag.
 * The rating row opens the reviews tray.
 */
export function PdpV5ReviewTeaser({
  className,
  onViewReviews,
}: PdpV5ReviewTeaserProps) {
  const { showSubtleReviewTeaser } = getPdpVersionConfig(usePdpVersion());
  const { average, count } = PDP_REVIEWS_SUMMARY;
  const { body: aiSummary, attribution } = PDP_REVIEWS_AI_SUMMARY;

  if (!showSubtleReviewTeaser) {
    return null;
  }

  return (
    <div
      className={cn(
        reviewCardClass,
        "flex w-full flex-col gap-2 px-4 py-4 text-left",
        className,
      )}
    >
      <button
        type="button"
        onClick={onViewReviews}
        aria-label={`View ${count} reviews`}
        className={cn(
          "-my-2 flex min-w-0 items-center gap-2 py-2 text-left",
          pdpPressableClass,
        )}
      >
        <PdpStarRating rating={average} size={16} />
        <span
          className={cn(
            pdpType.label,
            "font-extended tabular-nums text-neutral-900",
          )}
        >
          {average.toFixed(1)} ({count})
        </span>
      </button>
      <ReviewSummaryClamp text={aiSummary} />
      <span className="-mt-1 flex w-full items-center">
        <span
          className={cn(
            pdpType.micro,
            "inline-flex min-w-0 items-center gap-1 text-neutral-500",
          )}
        >
          <span className="min-w-0 line-clamp-1">{attribution}</span>
        </span>
      </span>
    </div>
  );
}
