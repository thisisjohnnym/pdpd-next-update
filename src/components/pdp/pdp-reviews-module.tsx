"use client";

import Image from "next/image";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";

import { pdpModuleSectionClass, pdpModuleHeadingClass } from "./pdp-module-section";
import { PdpReviewLikeButton } from "./pdp-review-like-button";
import { pdpType } from "./pdp-type";
import {
  PDP_COMMENTS_SUMMARY,
  PDP_CUSTOMER_REVIEWS,
  PDP_REVIEW_PHOTOS,
  PDP_REVIEWS_AI_SUMMARY,
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
        <p className={`min-w-0 text-neutral-500 ${pdpType.label}`}>
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
  const { average, recommendPercent } = PDP_REVIEWS_SUMMARY;
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
                  className={`font-extended inline-flex shrink-0 items-center gap-1 rounded-full border border-neutral-300 px-3 py-2 text-black ${pdpType.label}`}
                >
                  <span>Write a review</span>
                  <MaterialIcon name="edit" size={18} className="text-black" />
                </button>
              </div>

              <div className="flex items-center gap-2.5">
                <p className="font-extended m-0 text-2xl leading-none tracking-[0.4px] text-black">
                  {average.toFixed(1)}
                </p>
                <div className="h-8 w-px bg-neutral-200" aria-hidden />
                <div className="flex flex-col gap-1">
                  <StarRating rating={average} />
                  <p className="font-extended m-0 text-sm tracking-[0.2px] text-black">
                    {PDP_COMMENTS_SUMMARY.count} reviews
                  </p>
                </div>
              </div>

              <p className={`font-extended m-0 text-neutral-600 ${pdpType.caption}`}>
                {recommendPercent}% would recommend
              </p>
            </div>

            <section className="flex flex-col gap-3">
              <p className="font-extended m-0 text-sm font-bold tracking-[0.2px] text-black">
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
              <p className="font-extended m-0 text-sm font-bold tracking-[0.2px] text-black">
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
