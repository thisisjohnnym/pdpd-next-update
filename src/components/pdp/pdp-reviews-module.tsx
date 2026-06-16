"use client";

import { useState } from "react";

import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import {
  pdpCarouselScrollClass,
  pdpCarouselScrollWrapClass,
  pdpUgcStoryCardCompactClass,
} from "./pdp-carousel";
import { PdpModuleHeading } from "./pdp-module-heading";
import { PdpRevealItem } from "./pdp-reveal-item";
import { pdpModuleSectionClass, pdpModuleHeadingClass } from "./pdp-module-section";
import { PdpTextReveal } from "./pdp-text-reveal";
import { PdpAiInsightCard } from "./pdp-ai-insight-card";
import { PdpUgcStoryCard } from "./pdp-ugc-story-card";
import {
  createUserComment,
  mapReviewToComment,
  PdpReviewComment,
  PdpReviewCommentBox,
  PdpReviewCommentsSection,
  PdpStarRating,
  sortCommentsByLikes,
  type PdpReviewCommentData,
} from "./pdp-review-comment";
import { pdpType } from "./pdp-type";
import { PdpTextLinkCta } from "./pdp-text-link-cta";
import {
  PDP_COMMENTS_SUMMARY,
  PDP_CUSTOMER_REVIEWS,
  PDP_UGC_REVIEW_STORIES,
  PDP_REVIEWS_AI_SUMMARY,
  PDP_REVIEWS_SUMMARY,
} from "./pdp-data";

const PAGE_REVIEW_COUNT = 4;

type PdpReviewsModuleProps = {
  onReadAll?: () => void;
  onWriteReview?: () => void;
};

/** Inline reviews — summary, UGC, and social-style comments on the page */
export function PdpReviewsModule({ onReadAll, onWriteReview }: PdpReviewsModuleProps) {
  const { average } = PDP_REVIEWS_SUMMARY;
  const pageReviews = PDP_CUSTOMER_REVIEWS.slice(0, PAGE_REVIEW_COUNT);
  const [userComments, setUserComments] = useState<PdpReviewCommentData[]>([]);

  const handlePostComment = (text: string) => {
    setUserComments((current) => [createUserComment(text), ...current]);
  };

  const allComments = sortCommentsByLikes([
    ...userComments,
    ...pageReviews.map(mapReviewToComment),
  ]);

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
                  <PdpStarRating rating={average} />
                  <p className="font-extended m-0 text-sm tracking-[0.2px] text-black">
                    {PDP_COMMENTS_SUMMARY.count} reviews
                  </p>
                </div>
              </div>
            </PdpRevealItem>

            <PdpRevealItem delay={140}>
            <PdpAiInsightCard
              variant="minimal"
              size="compact"
              eyebrow={PDP_REVIEWS_AI_SUMMARY.attribution}
              eyebrowPosition="below"
              title={PDP_REVIEWS_AI_SUMMARY.headline}
              body={PDP_REVIEWS_AI_SUMMARY.body}
            />
            </PdpRevealItem>

            <PdpRevealItem as="section" delay={210} className="flex flex-col gap-2">
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
                      size="compact"
                      className={pdpUgcStoryCardCompactClass}
                      imageSizes="30vw"
                    />
                  ))}
                </div>
              </div>
            </PdpRevealItem>

            <PdpRevealItem as="section" delay={280} className="flex flex-col">
              <PdpReviewCommentsSection>
                {allComments.map((comment, index) => (
                  <PdpRevealItem key={comment.id} as="div" delay={index * 50}>
                    <PdpReviewComment comment={comment} variant="compact" />
                  </PdpRevealItem>
                ))}
              </PdpReviewCommentsSection>

              <PdpReviewCommentBox onPost={handlePostComment} />
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
