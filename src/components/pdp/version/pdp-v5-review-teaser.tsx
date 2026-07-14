"use client";

import { cn } from "@/lib/cn";

import { PDP_REVIEWS_SUMMARY } from "../pdp-data";
import { PdpStarRating } from "../pdp-review-comment";
import { pdpChapterAnchorId } from "../pdp-section-chapters";
import { pdpPressableClass, pdpType } from "../pdp-type";
import { PDP_CHROME_HEADER_OFFSET } from "../use-pdp-chrome-mode";
import { getPdpVersionConfig } from "./pdp-version-config";
import { usePdpVersion } from "./pdp-version-context";

type PdpV5ReviewTeaserProps = {
  className?: string;
  /** v7 meta strip — full-width row with trailing affordance */
  metaStripRow?: boolean;
  showDivider?: boolean;
};

function scrollToReviews(behavior: ScrollBehavior) {
  const el = document.getElementById(pdpChapterAnchorId("reviews"));
  if (!el) {
    return;
  }
  const top =
    el.getBoundingClientRect().top + window.scrollY - PDP_CHROME_HEADER_OFFSET;
  window.scrollTo({ top: Math.max(0, top), behavior });
}

/**
 * Compact ratings summary under the hero land — full star row, score/count,
 * and a recommend line. Metadata module (not a muted text-link CTA); scrolls
 * to the reviews chapter.
 */
export function PdpV5ReviewTeaser({
  className,
  metaStripRow = false,
  showDivider = false,
}: PdpV5ReviewTeaserProps) {
  const { showSubtleReviewTeaser } = getPdpVersionConfig(usePdpVersion());
  const { average, count, recommendPercent } = PDP_REVIEWS_SUMMARY;

  if (!showSubtleReviewTeaser) {
    return null;
  }

  const handleClick = () => {
    scrollToReviews("smooth");
    // Lazy sections between here and reviews can mount mid-scroll and shift
    // layout — re-resolve once it settles so we land precisely.
    window.setTimeout(() => scrollToReviews("smooth"), 420);
  };

  return (
    <div
      className={cn(
        "flex justify-start",
        metaStripRow && showDivider && "border-t border-neutral-200/80",
        className,
      )}
    >
      <button
        type="button"
        onClick={handleClick}
        aria-label={`${average.toFixed(1)} out of 5 stars, ${count} reviews, ${recommendPercent}% of owners recommend`}
        className={cn(
          metaStripRow
            ? "flex min-h-[44px] w-full items-center justify-between gap-3 px-3 py-2.5 text-left active:bg-neutral-100/80"
            : "flex w-full flex-col items-start gap-1 py-1 text-left",
          "transition-opacity active:opacity-70",
          pdpPressableClass,
        )}
      >
        <span
          className={cn(
            metaStripRow
              ? "flex min-w-0 flex-1 items-center gap-2"
              : "flex flex-wrap items-center gap-x-2 gap-y-1",
          )}
        >
          <PdpStarRating rating={average} size={16} />
          <span
            className={cn(
              pdpType.label,
              "font-extended tabular-nums text-neutral-900",
            )}
          >
            {average.toFixed(1)} · {count} reviews
          </span>
        </span>
        {metaStripRow ? (
          <span
            className={cn(
              pdpType.micro,
              "shrink-0 font-extended text-neutral-600",
            )}
          >
            View reviews
          </span>
        ) : (
          <span className={cn(pdpType.micro, "text-neutral-500")}>
            {recommendPercent}% of owners recommend
          </span>
        )}
      </button>
    </div>
  );
}
