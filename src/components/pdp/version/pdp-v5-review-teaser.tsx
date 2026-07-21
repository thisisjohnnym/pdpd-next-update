"use client";

import { cn } from "@/lib/cn";

import { PDP_REVIEWS_SUMMARY } from "../pdp-data";
import { PdpStarRating } from "../pdp-review-comment";
import {
  pdpPillRadiusClass,
  pdpPressableClass,
  pdpType,
} from "../pdp-type";
import { getPdpVersionConfig } from "./pdp-version-config";
import { usePdpVersion } from "./pdp-version-context";

type PdpV5ReviewTeaserProps = {
  className?: string;
  onViewReviews: () => void;
};

/** Soft insight tray — distinct from the plain store-pickup action row. */
const reviewCardClass =
  "overflow-hidden rounded-none border-0 bg-neutral-50 shadow-none outline-none";

/** Short praise line — land teaser only (not pdp-data). */
const PRAISE_LINE =
  "Loved for its soft leather, roomy interior, and comfortable carry.";

/**
 * Reviews card — rating summary, compact praise line, then open highlights.
 */
export function PdpV5ReviewTeaser({
  className,
  onViewReviews,
}: PdpV5ReviewTeaserProps) {
  const { showSubtleReviewTeaser, squareButtonCorners } = getPdpVersionConfig(
    usePdpVersion(),
  );
  const { average, count } = PDP_REVIEWS_SUMMARY;

  if (!showSubtleReviewTeaser) {
    return null;
  }

  return (
    <div
      className={cn(
        reviewCardClass,
        "flex w-full flex-col gap-3 px-4 py-4 text-left",
        className,
      )}
    >
      <div
        className="flex flex-wrap items-center gap-x-1.5 gap-y-1"
        aria-label={`${average.toFixed(1)} out of 5 stars, ${count} reviews`}
      >
        <PdpStarRating rating={average} size={16} />
        <span
          className={cn(
            pdpType.label,
            "font-extended tabular-nums text-black",
          )}
        >
          {average.toFixed(1)} · {count} Reviews
        </span>
      </div>

      <p className={cn(pdpType.label, "m-0 text-pretty text-neutral-600")}>
        {PRAISE_LINE}
      </p>

      <button
        type="button"
        onClick={onViewReviews}
        aria-label={`See what customers say, ${count} reviews`}
        className={cn(
          "font-extended flex h-10 w-full items-center justify-center border border-neutral-200 bg-white px-4 text-center text-black transition-colors active:bg-neutral-50",
          pdpPillRadiusClass(squareButtonCorners),
          pdpPressableClass,
          pdpType.label,
        )}
      >
        <span className="inline-block translate-y-px">See what customers say</span>
      </button>
    </div>
  );
}
