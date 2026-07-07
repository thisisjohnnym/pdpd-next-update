"use client";

import Image from "next/image";
import { useRef } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import {
  PDP_CUSTOMER_REVIEWS,
  PDP_REVIEWS_AI_SUMMARY,
  PDP_REVIEWS_SUMMARY,
} from "../pdp-data";
import {
  pdpCarouselImageClass,
  pdpCarouselScrollClass,
  pdpCarouselScrollWrapClass,
  pdpReviewUgcMomentCardClass,
} from "../pdp-carousel";
import { PdpAiInsightCard } from "../pdp-ai-insight-card";
import { PdpStarRating } from "../pdp-review-comment";
import { PdpRevealItem } from "../pdp-reveal-item";
import { PdpTextReveal } from "../pdp-text-reveal";
import { pdpModuleHeadlineDisplayClass } from "../pdp-module-section";
import { pdpPillRadiusClass, pdpPressableClass, pdpType } from "../pdp-type";
import { revealStaggerDelay } from "../use-pdp-element-reveal";
import { useDragToScroll } from "../use-infinite-centered-carousel";

import { PDP_UGC_COMMUNITY_PHOTOS, type PdpUgcCommunityPhoto } from "./pdp-data-v2";
import { PDP_V4_REVIEWS_SUMMARY } from "./pdp-v4-reviews-summary";
import { getPdpVersionConfig } from "./pdp-version-config";
import { usePdpVersion } from "./pdp-version-context";

/**
 * v2-only simplified reviews section (Paper AYJ-0 "v2 — Reviews (reviews only)").
 *
 * v2: heading + aggregate stars + AI summary card + clipped review cards + CTAs.
 * v4: "What owners say" — rating, UGC photo rail, compact highlights, then
 * Read all reviews (depth lives in the tray).
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
    </div>
  );
}

type PdpV2ReviewsProps = {
  onReadAll?: () => void;
  onWriteReview?: () => void;
};

function ReviewUgcMomentCard({
  photo,
  className,
}: {
  photo: PdpUgcCommunityPhoto;
  className?: string;
}) {
  const { hideReviewUgcMomentCaption, enlargeReviewUgcMomentText } =
    getPdpVersionConfig(usePdpVersion());
  const showCaption = Boolean(photo.caption) && !hideReviewUgcMomentCaption;

  return (
    <figure className={cn("m-0 flex min-w-0 flex-col gap-1.5", className)}>
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-none bg-neutral-100">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          className={cn("object-cover object-center", pdpCarouselImageClass)}
          sizes="32vw"
        />
      </div>
      {(showCaption || photo.quote || photo.handle) ? (
        <figcaption className="flex flex-col gap-0.5">
          {showCaption ? (
            <p className={cn(pdpType.micro, "m-0 text-neutral-500")}>{photo.caption}</p>
          ) : null}
          {photo.quote ? (
            <p
              className={cn(
                enlargeReviewUgcMomentText ? pdpType.body : pdpType.label,
                "m-0 text-pretty text-neutral-600",
              )}
            >
              &ldquo;{photo.quote}&rdquo;
            </p>
          ) : null}
          {photo.handle ? (
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  enlargeReviewUgcMomentText ? pdpType.label : pdpType.micro,
                  "text-neutral-400",
                )}
              >
                {photo.handle}
              </span>
              {photo.verified ? (
                <svg
                  width={enlargeReviewUgcMomentText ? 13 : 12}
                  height={enlargeReviewUgcMomentText ? 13 : 12}
                  viewBox="0 0 24 24"
                  aria-label="Verified customer"
                >
                  <circle cx="12" cy="12" r="10" fill="#1D9BF0" />
                  <path
                    d="M8 12.5l2.5 2.5 5-5.5"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : null}
            </div>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  );
}

function ReviewUgcMomentsRail() {
  const scrollRef = useRef<HTMLDivElement>(null);
  useDragToScroll(scrollRef);

  return (
    <div className={pdpCarouselScrollWrapClass}>
      <div
        ref={scrollRef}
        className={cn(
          pdpCarouselScrollClass,
          "pdp-carousel-draggable flex items-start gap-3 pb-1",
        )}
        aria-label="Real customer moments"
      >
        {PDP_UGC_COMMUNITY_PHOTOS.map((photo) => (
          <ReviewUgcMomentCard
            key={photo.id}
            photo={photo}
            className={pdpReviewUgcMomentCardClass}
          />
        ))}
      </div>
    </div>
  );
}

function V4ReviewSummary({
  onReadAll,
  leftAlignModuleHeadings,
}: PdpV2ReviewsProps & {
  leftAlignModuleHeadings: boolean;
}) {
  const { average, count } = PDP_REVIEWS_SUMMARY;
  const { headline, reviewHighlights } = PDP_V4_REVIEWS_SUMMARY;
  const { body: aiBody, attribution: aiAttribution } = PDP_REVIEWS_AI_SUMMARY;
  const {
    useConsistentModuleHeadings,
    squareButtonCorners,
    showReviewHighlightTags,
    hideReviewCountRecommend,
    hideReviewSummaryRating,
    enlargeReviewAiSummary,
  } = getPdpVersionConfig(usePdpVersion());
  const alignClass = leftAlignModuleHeadings ? "items-start text-left" : "items-center text-center";

  return (
    <section
      data-header-surface="light"
      className="flex w-full shrink-0 flex-col bg-white px-4 pb-4 pt-14"
    >
      <div className={cn("flex w-full flex-col gap-5", alignClass)}>
        {/* Title + aggregate rating */}
        <div className="flex w-full flex-col gap-2">
          <PdpTextReveal
            as="h2"
            className={cn(
              pdpModuleHeadlineDisplayClass(useConsistentModuleHeadings),
              leftAlignModuleHeadings ? "text-left" : "text-center",
            )}
          >
            {headline}
          </PdpTextReveal>
          {!hideReviewSummaryRating ? (
            <PdpRevealItem delay={revealStaggerDelay(1)}>
              <div
                className={cn(
                  "flex flex-wrap items-center gap-x-2 gap-y-1",
                  leftAlignModuleHeadings ? "justify-start" : "justify-center",
                )}
              >
                <PdpStarRating rating={average} size={18} />
                <span
                  className={cn(
                    "font-extended tabular-nums text-neutral-500",
                    pdpType.micro,
                  )}
                >
                  {hideReviewCountRecommend
                    ? average.toFixed(1)
                    : `${average.toFixed(1)} · ${count} reviews`}
                </span>
              </div>
            </PdpRevealItem>
          ) : null}
        </div>

        {/* AI review summary — flat grey tray (matches reviews sheet) */}
        <PdpRevealItem delay={revealStaggerDelay(2)} className="w-full">
          <PdpAiInsightCard
            variant="minimal"
            size={enlargeReviewAiSummary ? "compact" : "xs"}
            contained
            containedSurface="flat"
            squareCorners={squareButtonCorners}
            showIcon={false}
            clampBodyLines={2}
            moreLabel="See more"
            lessLabel="See less"
            body={aiBody}
            eyebrow={aiAttribution}
            eyebrowPosition="below"
            className="w-full"
          />
        </PdpRevealItem>

        {/* Customer photo rail — primary evidence */}
        <PdpRevealItem delay={revealStaggerDelay(3)} className="w-full">
          <ReviewUgcMomentsRail />
        </PdpRevealItem>

        {/* Compact review highlights — secondary to photos */}
        {showReviewHighlightTags ? (
          <PdpRevealItem delay={revealStaggerDelay(4)} className="w-full">
            <ul
              className={cn(
                "m-0 flex list-none flex-wrap gap-x-4 gap-y-1.5 p-0",
                leftAlignModuleHeadings ? "justify-start" : "justify-center",
              )}
              aria-label="Review highlights"
            >
              {reviewHighlights.map((item) => (
                <li key={item} className="flex items-center gap-1.5">
                  <MaterialIcon
                    name="check"
                    size={14}
                    className="shrink-0 text-neutral-400"
                    aria-hidden
                  />
                  <span
                    className={cn(
                      pdpType.micro,
                      "text-neutral-600",
                    )}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </PdpRevealItem>
        ) : null}

      </div>

      <PdpRevealItem delay={revealStaggerDelay(5)}>
        <div
          className={cn(
            "flex w-full flex-col pt-5",
            leftAlignModuleHeadings ? "items-stretch" : "items-center",
          )}
        >
          {onReadAll ? (
            <button
              type="button"
              onClick={onReadAll}
              className={cn(
                "font-extended flex h-[48px] w-full items-center justify-center px-6 text-center transition-colors",
                pdpPillRadiusClass(squareButtonCorners),
                pdpPressableClass,
                useConsistentModuleHeadings
                  ? "border border-neutral-200 bg-white text-black active:bg-neutral-50"
                  : "border border-[#D4D4D4] text-black active:bg-neutral-100",
                useConsistentModuleHeadings ? pdpType.body : pdpType.label,
              )}
            >
              <span
                className={cn(
                  useConsistentModuleHeadings && "inline-block translate-y-[2px]",
                )}
              >
                {useConsistentModuleHeadings
                  ? `View all ${count} reviews`
                  : "Read all reviews"}
              </span>
            </button>
          ) : null}
        </div>
      </PdpRevealItem>
    </section>
  );
}

export function PdpV2Reviews({
  onReadAll,
  onWriteReview,
}: PdpV2ReviewsProps) {
  const { leftAlignModuleHeadings, hideTextLinkArrows, useV4ModuleSpacing } =
    getPdpVersionConfig(usePdpVersion());

  if (useV4ModuleSpacing) {
    return (
      <V4ReviewSummary
        onReadAll={onReadAll}
        leftAlignModuleHeadings={leftAlignModuleHeadings}
      />
    );
  }

  const { average, count } = PDP_REVIEWS_SUMMARY;
  const { body: aiBody } = PDP_REVIEWS_AI_SUMMARY;

  const firstReview = PDP_CUSTOMER_REVIEWS[0];
  const secondReview = PDP_CUSTOMER_REVIEWS[1];

  return (
    <section
      data-header-surface="light"
      className="flex w-full shrink-0 flex-col items-center bg-white px-3 pb-10 pt-8"
    >
      <div className="flex w-full flex-col gap-6">
        <div
          className={cn(
            "flex flex-col gap-2",
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
          <div className="flex flex-col rounded-xl bg-[#F6F6F6] px-4 py-3.5">
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
                "font-extended m-0 mt-2 text-neutral-600 opacity-[0.7]",
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
        <div className="flex w-full flex-col items-center pt-6">
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
                "flex items-center justify-center gap-1 self-stretch pl-2 pt-[11px] text-neutral-900",
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
