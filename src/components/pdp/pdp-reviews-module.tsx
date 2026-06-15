"use client";

import Image from "next/image";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import {
  pdpCarouselImageClass,
  pdpCarouselInsetScrollClass,
  pdpCarouselScrollClass,
  pdpCarouselScrollWrapClass,
  pdpUgcStoryCardClass,
} from "./pdp-carousel";
import { PdpModuleHeading } from "./pdp-module-heading";
import { PdpRevealItem } from "./pdp-reveal-item";
import { pdpModuleSectionClass, pdpModuleHeadingClass } from "./pdp-module-section";
import { PdpTextReveal } from "./pdp-text-reveal";
import { PdpReviewLikeButton } from "./pdp-review-like-button";
import { PdpAiInsightCard } from "./pdp-ai-insight-card";
import { PdpUgcStoryCard } from "./pdp-ugc-story-card";
import { pdpType } from "./pdp-type";
import { PdpTextLinkCta } from "./pdp-text-link-cta";
import {
  PDP_COMMENTS_SUMMARY,
  PDP_CUSTOMER_REVIEWS,
  PDP_UGC_REVIEW_STORIES,
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
      <p className={`font-extended text-[#4a4a4a] ${pdpType.caption}`}>
        {review.quote}
      </p>

      {review.photos?.length ? (
        <div className={cn("flex", pdpCarouselInsetScrollClass, "pt-1")}>
          {review.photos.map((photo) => (
            <div
              key={photo.src}
              className="relative size-28 shrink-0 overflow-hidden bg-neutral-100"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className={cn("object-cover object-center", pdpCarouselImageClass)}
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
  const { average } = PDP_REVIEWS_SUMMARY;
  const pageReviews = PDP_CUSTOMER_REVIEWS.slice(0, PAGE_REVIEW_COUNT);

  return (
    <section
      data-header-surface="light"
      className={pdpModuleSectionClass()}
    >
      <PageGrid fullWidth>
        <GridItem mobile={12} desktop={24} className="min-w-0">
          <div className="flex w-full flex-col gap-8">
            <PdpRevealItem className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <PdpModuleHeading spacing="none">Reviews</PdpModuleHeading>
                <PdpTextLinkCta
                  type="button"
                  onClick={onWriteReview}
                  className={cn("shrink-0", pdpType.label)}
                >
                  Write a review
                </PdpTextLinkCta>
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
            </PdpRevealItem>

            <PdpRevealItem delay={140}>
            <PdpAiInsightCard
              variant="minimal"
              eyebrow={PDP_REVIEWS_AI_SUMMARY.attribution}
              eyebrowPosition="below"
              title={PDP_REVIEWS_AI_SUMMARY.headline}
              body={PDP_REVIEWS_AI_SUMMARY.body}
            />
            </PdpRevealItem>

            <PdpRevealItem as="section" delay={210} className="flex flex-col gap-4">
              <PdpTextReveal
                as="p"
                delay={80}
                className={pdpModuleHeadingClass({ lead: false, size: "sm" })}
              >
                In real life
              </PdpTextReveal>

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
            </PdpRevealItem>

            <PdpRevealItem as="section" delay={280} className="flex flex-col">
              {pageReviews.map((review, index) => (
                <PdpRevealItem key={review.id} as="div" delay={index * 70}>
                  <ReviewCard review={review} />
                </PdpRevealItem>
              ))}
            </PdpRevealItem>

            <PdpRevealItem delay={140}>
              <PdpTextLinkCta
                type="button"
                onClick={onReadAll}
                className={cn("self-start", pdpType.body)}
              >
                Read all {PDP_COMMENTS_SUMMARY.count} reviews
              </PdpTextLinkCta>
            </PdpRevealItem>
          </div>
        </GridItem>
      </PageGrid>
    </section>
  );
}
