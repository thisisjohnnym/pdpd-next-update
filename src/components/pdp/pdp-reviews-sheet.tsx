"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import {
  pdpCarouselScrollClass,
  pdpCarouselScrollWrapClass,
  pdpUgcStoryCardClass,
} from "./pdp-carousel";
import {
  pdpModuleHeadingClass,
  pdpSheetHeadingClass,
} from "./pdp-module-section";
import {
  PDP_COMMENTS_SUMMARY,
  PDP_CUSTOMER_REVIEWS,
  PDP_UGC_REVIEW_STORIES,
  PDP_REVIEWS_AI_SUMMARY,
  PDP_REVIEWS_RATING_BREAKDOWN,
  PDP_REVIEWS_SUMMARY,
  type PdpFeaturedReview,
} from "./pdp-data";
import { PdpReviewLikeButton } from "./pdp-review-like-button";
import { PdpAiInsightCard } from "./pdp-ai-insight-card";
import { PdpUgcStoryCard } from "./pdp-ugc-story-card";
import { pdpType } from "./pdp-type";
import { PdpTextLinkCta } from "./pdp-text-link-cta";

type PdpReviewsSheetProps = {
  open: boolean;
  onClose: () => void;
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div
      className="flex items-center gap-1"
      aria-label={`${rating.toFixed(1)} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, index) => {
        const fill = Math.min(Math.max(rating - index, 0), 1);

        return (
          <span key={index} className="relative inline-flex size-4 shrink-0">
            <MaterialIcon
              name="star"
              size={18}
              className="text-neutral-300"
            />
            {fill > 0 ? (
              <span
                className="absolute inset-y-0 left-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <MaterialIcon name="star" size={18} filled className="text-black" />
              </span>
            ) : null}
          </span>
        );
      })}
    </div>
  );
}

function RatingBreakdownRow({
  stars,
  percent,
}: {
  stars: number;
  percent: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex w-[26px] shrink-0 items-center gap-0.5">
        <MaterialIcon name="star" size={18} filled className="text-black" />
        <span className="font-extended text-xs tracking-[0.2px] text-black">{stars}</span>
      </div>
      <div className="h-1 min-w-0 flex-1 overflow-hidden rounded-full bg-white">
        <div
          className="h-full rounded-full bg-black transition-[width] duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="font-extended w-8 shrink-0 text-right text-xs tracking-[0.2px] text-black">
        {percent}%
      </span>
    </div>
  );
}

function CustomerReviewCard({ review }: { review: PdpFeaturedReview }) {
  return (
    <article className="flex flex-col gap-2 border-t border-neutral-200 py-4">
      <StarRating rating={review.rating} />
      <p className="font-extended text-sm leading-[1.35] tracking-[0.2px] text-[#4a4a4a]">
        {review.quote}
      </p>

      {review.photos?.length ? (
        <div className="flex gap-2 overflow-x-auto overscroll-x-contain pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {review.photos.map((photo) => (
            <div
              key={photo.src}
              className="relative size-28 shrink-0 overflow-hidden bg-neutral-100"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover object-center"
                sizes="112px"
              />
            </div>
          ))}
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <p className="font-extended min-w-0 text-xs tracking-[0.2px] text-neutral-500">
          {review.author} · {review.date}
          {review.verified ? " · Verified buyer" : ""}
        </p>
        <PdpReviewLikeButton initialLikes={review.likes} />
      </div>
    </article>
  );
}

/** Bottom sheet — bag reviews pulled up from comments rail */
export function PdpReviewsSheet({ open, onClose }: PdpReviewsSheetProps) {
  const titleId = useId();
  const breakdownId = useId();
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const [hasBeenOpen, setHasBeenOpen] = useState(false);
  const { average } = PDP_REVIEWS_SUMMARY;
  const reviewCount = PDP_COMMENTS_SUMMARY.count;

  useEffect(() => {
    if (open) {
      setHasBeenOpen(true);
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      setBreakdownOpen(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-end justify-center transition-opacity duration-300",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      )}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close reviews"
        className="absolute inset-0 bg-black/45 transition-opacity"
        onClick={onClose}
        tabIndex={open ? 0 : -1}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "font-extended relative flex max-h-[92dvh] w-full max-w-[430px] flex-col overflow-hidden rounded-t-[20px] bg-white shadow-[0_-8px_40px_rgba(0,0,0,0.18)] transition-transform duration-300 ease-out",
          open ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="relative shrink-0 px-2.5 pb-0 pt-2.5">
          <div className="mx-auto mb-[30px] h-[3px] w-[50px] rounded-full bg-black/70" />
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute right-2.5 top-2.5 flex size-8 items-center justify-center rounded-full text-neutral-900"
          >
            <MaterialIcon name="close" size={24} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-[max(24px,env(safe-area-inset-bottom))]">
          {hasBeenOpen ? (
          <>
          <div className="flex flex-col items-start gap-3 pb-6">
            <h2 id={titleId} className={pdpSheetHeadingClass()}>
              Reviews
            </h2>

            <div className="flex items-center gap-2.5">
              <p className="font-extended text-2xl leading-none tracking-[0.4px] text-black">
                {average.toFixed(1)}
              </p>
              <div className="h-8 w-px bg-[#e1e1e1]" aria-hidden />
              <div className="flex flex-col gap-1">
                <StarRating rating={average} />
                <div className="flex items-center gap-1">
                  <p className="font-extended text-sm tracking-[0.2px] text-black">
                    {reviewCount} Reviews
                  </p>
                  <button
                    type="button"
                    onClick={() => setBreakdownOpen((current) => !current)}
                    aria-expanded={breakdownOpen}
                    aria-controls={breakdownId}
                    aria-label={
                      breakdownOpen
                        ? "Hide rating breakdown"
                        : "Show rating breakdown"
                    }
                    className="flex size-5 shrink-0 items-center justify-center text-neutral-500"
                  >
                    <MaterialIcon name="info" size={18} className="text-neutral-500" />
                  </button>
                </div>
              </div>
            </div>

            <section
              id={breakdownId}
              hidden={!breakdownOpen}
              className={cn(
                "flex w-full flex-col gap-3 rounded-lg bg-[#f2f2f2] px-3 py-4 transition-opacity duration-200",
                breakdownOpen ? "opacity-100" : "opacity-0",
              )}
            >
              {PDP_REVIEWS_RATING_BREAKDOWN.map((row) => (
                <RatingBreakdownRow
                  key={row.stars}
                  stars={row.stars}
                  percent={row.percent}
                />
              ))}
            </section>
          </div>

          <div className="flex flex-col gap-6">
            <PdpAiInsightCard
              variant="minimal"
              eyebrow={PDP_REVIEWS_AI_SUMMARY.attribution}
              eyebrowPosition="below"
              title={PDP_REVIEWS_AI_SUMMARY.headline}
              body={PDP_REVIEWS_AI_SUMMARY.body}
            />

            <section className="flex flex-col gap-4 pt-1">
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <p className={pdpModuleHeadingClass({ lead: false, size: "sm" })}>
                    In real life
                  </p>
                </div>
                <PdpTextLinkCta type="button" className={cn("shrink-0", pdpType.body)}>
                  View all
                </PdpTextLinkCta>
              </div>

              <div className={pdpCarouselScrollWrapClass}>
                <div className={cn("flex gap-2", pdpCarouselScrollClass)}>
                  {PDP_UGC_REVIEW_STORIES.map((story) => (
                    <PdpUgcStoryCard
                      key={story.id}
                      story={story}
                      className={pdpUgcStoryCardClass}
                      imageSizes="72vw"
                    />
                  ))}
                </div>
              </div>
            </section>

            <section className="flex flex-col pt-2">
              {PDP_CUSTOMER_REVIEWS.map((review) => (
                <CustomerReviewCard key={review.id} review={review} />
              ))}
            </section>
          </div>
          </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
