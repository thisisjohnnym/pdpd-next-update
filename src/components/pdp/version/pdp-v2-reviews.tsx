"use client";

import Image from "next/image";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import {
  PDP_CUSTOMER_REVIEWS,
  PDP_REVIEWS_AI_SUMMARY,
  PDP_REVIEWS_SUMMARY,
} from "../pdp-data";
import { pdpCarouselImageClass } from "../pdp-carousel";
import { PdpStarRating } from "../pdp-review-comment";
import { PdpRevealItem } from "../pdp-reveal-item";
import { PdpTextReveal } from "../pdp-text-reveal";
import { pdpPressableClass, pdpType } from "../pdp-type";
import { revealStaggerDelay } from "../use-pdp-element-reveal";

import {
  PDP_V4_REVIEWS_SUMMARY,
  PDP_V4_REVIEW_UGC_MOMENTS,
} from "./pdp-v4-reviews-summary";
import { getPdpVersionConfig } from "./pdp-version-config";
import { usePdpVersion } from "./pdp-version-context";

/**
 * v2-only simplified reviews section (Paper AYJ-0 "v2 — Reviews (reviews only)").
 *
 * v2: heading + aggregate stars + AI summary card + clipped review cards + CTAs.
 * v4: "What owners say" — rating, review highlights, UGC evidence, one
 * light pull-quote, then Read all reviews (depth lives in the tray).
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

function V4SectionLabel({ children }: { children: string }) {
  return (
    <p className="font-sans m-0 text-[11px] leading-[14px] tracking-[0.06em] text-neutral-400 uppercase">
      {children}
    </p>
  );
}

function V4ReviewSummary({
  onReadAll,
  leftAlignModuleHeadings,
}: PdpV2ReviewsProps & {
  leftAlignModuleHeadings: boolean;
}) {
  const { average, count, recommendPercent } = PDP_REVIEWS_SUMMARY;
  const { headline, reviewHighlights, featuredQuote } = PDP_V4_REVIEWS_SUMMARY;
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
              "font-extended m-0 text-[24px] leading-[1.2] font-normal tracking-[-0.02em] text-black",
              leftAlignModuleHeadings ? "text-left" : "text-center",
            )}
          >
            {headline}
          </PdpTextReveal>
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
                {average.toFixed(1)} · {count} reviews · {recommendPercent}% recommend
              </span>
            </div>
          </PdpRevealItem>
        </div>

        {/* Review highlights */}
        <PdpRevealItem delay={revealStaggerDelay(2)} className="w-full">
          <div className="flex flex-col gap-2">
            <V4SectionLabel>Review highlights</V4SectionLabel>
            <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
              {reviewHighlights.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <MaterialIcon
                    name="check"
                    size={14}
                    className="shrink-0 text-neutral-400"
                    aria-hidden
                  />
                  <span className="font-extended text-[13px] leading-[1.35] tracking-[0.2px] text-neutral-800">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </PdpRevealItem>

        {/* Real customer moments */}
        <PdpRevealItem delay={revealStaggerDelay(3)} className="w-full">
          <div className="flex flex-col gap-2.5">
            <V4SectionLabel>Real customer moments</V4SectionLabel>
            <div className="grid w-full grid-cols-3 gap-2">
              {PDP_V4_REVIEW_UGC_MOMENTS.map((moment) => (
                <figure key={moment.id} className="m-0 flex min-w-0 flex-col gap-1">
                  <div className="relative aspect-square w-full overflow-hidden rounded-none bg-neutral-100">
                    <Image
                      src={moment.src}
                      alt={moment.alt}
                      fill
                      className={cn("object-cover object-center", pdpCarouselImageClass)}
                      sizes="30vw"
                    />
                  </div>
                  <figcaption className="font-sans text-[10px] leading-[1.3] tracking-[0.02em] text-balance text-neutral-400">
                    {moment.context}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </PdpRevealItem>

        {/* Representative quote — light supporting read */}
        <PdpRevealItem delay={revealStaggerDelay(4)} className="w-full">
          <figure
            className={cn(
              "m-0",
              !leftAlignModuleHeadings && "mx-auto max-w-[20rem]",
            )}
          >
            <blockquote className="font-extended m-0 text-[13px] leading-[1.4] tracking-[0.2px] text-pretty text-neutral-600">
              &ldquo;{featuredQuote.body}&rdquo;
            </blockquote>
            <figcaption className="font-sans mt-1.5 text-[11px] leading-[14px] text-neutral-400">
              — {featuredQuote.author}
              {featuredQuote.verified ? ", verified buyer" : ""}
            </figcaption>
          </figure>
        </PdpRevealItem>
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
                "font-extended h-[48px] w-full rounded-full border border-[#D4D4D4] px-[24px] text-center text-black transition-colors active:bg-neutral-100",
                pdpType.label,
              )}
            >
              Read all reviews
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
