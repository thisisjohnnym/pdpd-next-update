"use client";

import Image from "next/image";
import { useId, useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { pdpModuleSectionClass, pdpModuleHeadingClass } from "./pdp-module-section";
import { PdpReviewLikeButton } from "./pdp-review-like-button";
import {
  PDP_COMMENTS_SUMMARY,
  PDP_CUSTOMER_REVIEWS,
  PDP_REVIEW_PHOTOS,
  PDP_REVIEWS_AI_SUMMARY,
  PDP_REVIEWS_RATING_BREAKDOWN,
  PDP_REVIEWS_SUMMARY,
  type PdpFeaturedReview,
} from "./pdp-data";

const PAGE_REVIEW_COUNT = 4;

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
            <MaterialIcon name="star" size={18} className="text-neutral-300" />
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
        <span className="text-xs tracking-[0.2px] text-black">{stars}</span>
      </div>
      <div className="h-1 min-w-0 flex-1 overflow-hidden rounded-full bg-white">
        <div
          className="h-full rounded-full bg-black transition-[width] duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="w-8 shrink-0 text-right text-xs tracking-[0.2px] text-black">
        {percent}%
      </span>
    </div>
  );
}

function ReviewCard({ review }: { review: PdpFeaturedReview }) {
  return (
    <article className="flex flex-col gap-2.5 border-t border-neutral-200 py-5">
      <StarRating rating={review.rating} />
      <p className="text-sm leading-[1.35] text-[#4a4a4a]">{review.quote}</p>

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
        <p className="min-w-0 text-xs tracking-[0.2px] text-neutral-500">
          {review.author} · {review.date}
          {review.verified ? " · Verified buyer" : ""}
        </p>
        <PdpReviewLikeButton initialLikes={review.likes} />
      </div>
    </article>
  );
}

type PdpReviewsModuleProps = {
  onReadAll?: () => void;
  onWriteReview?: () => void;
};

/** Inline reviews — summary, UGC, and featured quotes exposed on the page */
export function PdpReviewsModule({ onReadAll, onWriteReview }: PdpReviewsModuleProps) {
  const breakdownId = useId();
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const { average, count, recommendPercent } = PDP_REVIEWS_SUMMARY;
  const pageReviews = PDP_CUSTOMER_REVIEWS.slice(0, PAGE_REVIEW_COUNT);

  return (
    <section
      data-header-surface="light"
      className={pdpModuleSectionClass({ rhythm: "break" })}
    >
      <PageGrid fullWidth>
        <GridItem mobile={12} desktop={24}>
          <div className="flex w-full flex-col gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className={pdpModuleHeadingClass({ lead: false })}>Reviews</h2>
                <button
                  type="button"
                  onClick={onWriteReview}
                  className="font-extended inline-flex shrink-0 items-center gap-1 rounded-full border border-neutral-300 px-3 py-2 text-xs tracking-[0.2px] text-black"
                >
                  <span className="translate-y-[1.5px]">Write a review</span>
                  <MaterialIcon name="edit" size={16} className="text-black" />
                </button>
              </div>

              <div className="flex items-center gap-2.5">
                <p className="font-extended m-0 text-2xl leading-none tracking-[0.4px] text-black">
                  {average.toFixed(1)}
                </p>
                <div className="h-8 w-px bg-neutral-200" aria-hidden />
                <div className="flex flex-col gap-1">
                  <StarRating rating={average} />
                  <div className="flex items-center gap-1">
                    <p className="font-extended m-0 text-sm tracking-[0.2px] text-black">
                      {PDP_COMMENTS_SUMMARY.count} reviews
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

              <p className="font-extended m-0 text-xs leading-[1.35] tracking-[0.2px] text-neutral-600">
                {recommendPercent}% would recommend · Based on {count} reviews
              </p>

              <section
                id={breakdownId}
                hidden={!breakdownOpen}
                className={cn(
                  "flex w-full flex-col gap-3 rounded-lg bg-neutral-100 px-3 py-4 transition-opacity duration-200",
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

            <section className="flex flex-col gap-3">
              <p className="font-extended m-0 text-sm tracking-[0.2px] text-black">
                {PDP_REVIEWS_AI_SUMMARY.headline}
              </p>
              <p className="font-extended m-0 text-sm leading-[1.35] tracking-[0.2px] text-[#4a4a4a]">
                {PDP_REVIEWS_AI_SUMMARY.body}
              </p>
              <div className="flex items-center gap-2">
                <MaterialIcon name="auto_awesome" size={18} className="text-black" />
                <p className="font-extended m-0 text-sm leading-[1.35] tracking-[0.2px] text-black">
                  {PDP_REVIEWS_AI_SUMMARY.attribution}
                </p>
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <p className="font-extended m-0 text-sm tracking-[0.2px] text-black">
                Customer photos
              </p>

              <div className="flex gap-2 overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {PDP_REVIEW_PHOTOS.map((photo) => (
                  <div
                    key={photo.src}
                    className="relative aspect-[4/5] w-[42%] shrink-0 overflow-hidden bg-neutral-100"
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      className="object-cover object-center"
                      sizes="42vw"
                    />
                  </div>
                ))}
              </div>
            </section>

            <section className="flex flex-col">
              {pageReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </section>

            <button
              type="button"
              onClick={onReadAll}
              className="font-extended w-full rounded-full border border-neutral-300 py-3 text-sm tracking-[0.2px] text-black"
            >
              Read all {PDP_COMMENTS_SUMMARY.count} reviews
            </button>
          </div>
        </GridItem>
      </PageGrid>
    </section>
  );
}
