"use client";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { PDP_CUSTOMER_REVIEWS, PDP_REVIEWS_SUMMARY } from "../pdp-data";
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

/** Featured buyer for the above-fold teaser — first verified review. */
const FEATURED_REVIEW =
  PDP_CUSTOMER_REVIEWS.find((review) => review.verified) ??
  PDP_CUSTOMER_REVIEWS[0]!;

/**
 * Reviews card — aggregate rating, one featured review, plus CTA.
 * Soft fill so it reads as a post-purchase cue under Add to bag.
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
          {average.toFixed(1)} · {count} reviews
        </span>
      </div>

      <div className="flex flex-col gap-3 border-t border-neutral-200 pt-3">
        <article className="flex flex-col gap-2">
          {FEATURED_REVIEW.verified ? (
            <span
              className={cn(
                pdpType.micro,
                "flex items-center gap-1 text-neutral-500",
              )}
            >
              <MaterialIcon
                name="verified"
                size={14}
                className="text-[#1D9BF0]"
                aria-hidden
              />
              Verified buyer
            </span>
          ) : null}
          {FEATURED_REVIEW.title ? (
            <h3 className={cn(pdpType.body, "m-0 text-pretty text-black")}>
              {FEATURED_REVIEW.title}
            </h3>
          ) : null}
          {FEATURED_REVIEW.body ? (
            <p
              className={cn(
                pdpType.label,
                "m-0 line-clamp-3 text-pretty text-neutral-600",
              )}
            >
              {FEATURED_REVIEW.body}
            </p>
          ) : (
            <p
              className={cn(
                pdpType.label,
                "m-0 line-clamp-3 text-pretty text-neutral-600",
              )}
            >
              {FEATURED_REVIEW.quote}
            </p>
          )}
          <p className={cn(pdpType.micro, "m-0 text-neutral-500")}>
            {FEATURED_REVIEW.author} · {FEATURED_REVIEW.date}
          </p>
        </article>

        <button
          type="button"
          onClick={onViewReviews}
          aria-label={`View all ${count} reviews`}
          className={cn(
            "font-extended flex h-10 w-full items-center justify-center border border-neutral-200 bg-white px-4 text-center text-black transition-colors active:bg-neutral-50",
            pdpPillRadiusClass(squareButtonCorners),
            pdpPressableClass,
            pdpType.label,
          )}
        >
          <span className="inline-block translate-y-px">View more reviews</span>
        </button>
      </div>
    </div>
  );
}
