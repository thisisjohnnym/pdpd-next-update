"use client";

import { useCallback, useMemo, useState, type ReactNode, type RefObject } from "react";

import { cn } from "@/lib/cn";

import {
  pdpCarouselScrollClass,
  pdpCarouselScrollWrapClass,
  pdpUgcStoryCardCompactClass,
} from "./pdp-carousel";
import { PDP_REVIEWS_SUMMARY, type PdpReviewReply } from "./pdp-data";
import { useActiveProduct } from "./pdp-active-product-context";
import { getPdpReviewsContent } from "./pdp-reviews-content";
import { PdpModuleHeading } from "./pdp-module-heading";
import { pdpModuleHeadingClass } from "./pdp-module-section";
import { PdpAiInsightCard } from "./pdp-ai-insight-card";
import { PdpFaqAccordion } from "./pdp-faq-module";
import { collectUserPhotos, PdpUserPhotoList } from "./pdp-user-photo-list";
import { PdpUgcStoryCard } from "./pdp-ugc-story-card";
import {
  createUserComment,
  createUserReply,
  curateReviewsPreview,
  feedFilterSupportsComposer,
  filterCommentsByFeedFilter,
  mapCustomerCommentToData,
  mapReviewToComment,
  mergeCommentReplies,
  PdpReviewComment,
  PdpReviewCommentBox,
  PdpReviewCommentsSection,
  PdpReviewFeedFilterBar,
  PdpStarRating,
  sortCommentsByLikes,
  type PdpReplyTarget,
  type PdpReviewCommentData,
  type PdpReviewFeedFilter,
} from "./pdp-review-comment";
import { pdpType } from "./pdp-type";
import { PdpTextLinkCta } from "./pdp-text-link-cta";

export function usePdpReviewsComments(onRootPost?: () => void) {
  const { productId } = useActiveProduct();
  const { customerReviews, customerComments, commentReplies } =
    getPdpReviewsContent(productId);
  const [userComments, setUserComments] = useState<PdpReviewCommentData[]>([]);
  const [userReplies, setUserReplies] = useState<Record<string, PdpReviewReply[]>>({});
  const [replyTarget, setReplyTarget] = useState<PdpReplyTarget | null>(null);

  const enrichComment = (comment: PdpReviewCommentData) =>
    mergeCommentReplies(comment, userReplies);

  const handlePostComment = (text: string, target?: PdpReplyTarget | null) => {
    if (target) {
      setUserReplies((current) => ({
        ...current,
        [target.parentCommentId]: [
          ...(current[target.parentCommentId] ?? []),
          createUserReply(text),
        ],
      }));
      setReplyTarget(null);
      return;
    }

    setUserComments((current) => [createUserComment(text), ...current]);
    onRootPost?.();
  };

  const allReviews = sortCommentsByLikes(
    customerReviews.map(mapReviewToComment),
  );

  const allComments = sortCommentsByLikes([
    ...userComments.map(enrichComment),
    ...customerComments
      .map((comment) => mapCustomerCommentToData(comment, commentReplies))
      .map(enrichComment),
  ]);

  const clearReplyTarget = useCallback(() => setReplyTarget(null), []);

  return {
    allReviews,
    allComments,
    userReplies,
    replyTarget,
    setReplyTarget,
    clearReplyTarget,
    handlePostComment,
  };
}

type PdpReviewsBodyProps = {
  titleId?: string;
  /** Limit visible reviews on inline PDP — reviews only, never mixed with comments */
  reviewLimit?: number;
  onReadAll?: () => void;
  onWriteReview?: () => void;
  showReadAll?: boolean;
  showFeedFilters?: boolean;
  feedFilter?: PdpReviewFeedFilter;
  onFeedFilterChange?: (filter: PdpReviewFeedFilter) => void;
  showInlineComposer?: boolean;
  composerInputRef?: RefObject<HTMLInputElement | null>;
  composerPinned?: boolean;
  composerKeyboardOpen?: boolean;
  composerRefocusAfterPost?: boolean;
  wrapComment?: (comment: ReactNode, commentId: string, index: number) => ReactNode;
  className?: string;
  allReviews: PdpReviewCommentData[];
  allComments: PdpReviewCommentData[];
  userReplies: Record<string, PdpReviewReply[]>;
  replyTarget: PdpReplyTarget | null;
  setReplyTarget: (target: PdpReplyTarget | null) => void;
  onPostComment: (text: string, target?: PdpReplyTarget | null) => void;
  onCancelReply: () => void;
};

/** Shared reviews layout — summary, UGC, formal reviews, or Reddit-style comments */
export function PdpReviewsBody({
  titleId,
  reviewLimit,
  onReadAll,
  onWriteReview,
  showReadAll = Boolean(onReadAll),
  showFeedFilters = false,
  feedFilter: feedFilterProp,
  onFeedFilterChange,
  showInlineComposer = true,
  composerInputRef,
  composerPinned = false,
  composerKeyboardOpen = false,
  composerRefocusAfterPost = true,
  wrapComment,
  className,
  allReviews,
  allComments,
  userReplies,
  replyTarget,
  setReplyTarget,
  onPostComment,
  onCancelReply,
}: PdpReviewsBodyProps) {
  const { productId } = useActiveProduct();
  const { aiSummaryBody, ugcStories } = getPdpReviewsContent(productId);
  const { average, count, recommendPercent } = PDP_REVIEWS_SUMMARY;
  const [internalFeedFilter, setInternalFeedFilter] =
    useState<PdpReviewFeedFilter>("reviews");
  const feedFilter = feedFilterProp ?? internalFeedFilter;
  const setFeedFilter = onFeedFilterChange ?? setInternalFeedFilter;

  const userPhotos = useMemo(
    () => collectUserPhotos(ugcStories, allReviews, allComments),
    [allComments, allReviews, ugcStories],
  );

  const visibleItems = useMemo(() => {
    if (showFeedFilters) {
      if (feedFilter === "questions") {
        return [];
      }

      const items = filterCommentsByFeedFilter(allReviews, allComments, feedFilter);

      if (feedFilter === "reviews" && reviewLimit != null) {
        return curateReviewsPreview(items, reviewLimit);
      }

      return items;
    }

    if (reviewLimit != null) {
      return curateReviewsPreview(allReviews, reviewLimit);
    }

    return allReviews;
  }, [allComments, allReviews, feedFilter, reviewLimit, showFeedFilters]);

  const showComposer =
    showInlineComposer && feedFilterSupportsComposer(feedFilter);
  const showAiSummary =
    !showFeedFilters || feedFilter === "reviews";
  const showUgcCarousel = !showFeedFilters;
  const showPhotoList = showFeedFilters && feedFilter === "photos";
  const showReviewFeed = !showFeedFilters || feedFilter === "reviews";
  const showCommentFeed = showFeedFilters && feedFilter === "comments";
  const showFaq = showFeedFilters && feedFilter === "questions";
  const feedAriaLabel =
    feedFilter === "comments"
      ? "Community comments"
      : feedFilter === "photos"
        ? "Customer photos"
        : feedFilter === "questions"
          ? "Frequently asked questions"
          : "Customer reviews";

  return (
    <div className={cn("flex w-full flex-col gap-6", className)}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          {titleId ? (
            <h2 id={titleId} className={pdpModuleHeadingClass({ lead: false })}>
              Reviews
            </h2>
          ) : (
            <PdpModuleHeading spacing="none">Reviews</PdpModuleHeading>
          )}
          {onWriteReview ? (
            <PdpTextLinkCta
              type="button"
              onClick={onWriteReview}
              className={cn("shrink-0", pdpType.label)}
            >
              Write a review
            </PdpTextLinkCta>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <PdpStarRating rating={average} />
          <p className="font-extended m-0 text-sm tracking-[0.2px] text-black">
            {average.toFixed(1)} · {count} reviews · {recommendPercent}% recommend
          </p>
        </div>
      </div>

      {showFeedFilters ? (
        <PdpReviewFeedFilterBar value={feedFilter} onChange={setFeedFilter} />
      ) : null}

      {showAiSummary ? (
        <PdpAiInsightCard
          variant="minimal"
          size="xs"
          contained
          containedSurface="flat"
          showIcon={false}
          clampBodyLines={1}
          body={aiSummaryBody}
        />
      ) : null}

      {showPhotoList ? (
        <section aria-label="Customer photos">
          <PdpUserPhotoList items={userPhotos} />
        </section>
      ) : null}

      {showFaq ? (
        <section aria-label="Frequently asked questions" className="flex flex-col gap-3">
          <PdpModuleHeading spacing="none">FAQs</PdpModuleHeading>
          <PdpFaqAccordion />
        </section>
      ) : null}

      {showReviewFeed || showCommentFeed ? (
        <section className="flex flex-col" aria-label={feedAriaLabel}>
          <PdpReviewCommentsSection>
            {(showCommentFeed ? allComments : visibleItems).map((item, index) => {
              const row = (
                <PdpReviewComment
                  comment={item}
                  variant="compact"
                  onReply={showCommentFeed ? setReplyTarget : undefined}
                  expandReplies={Boolean(userReplies[item.id]?.length)}
                />
              );

              return wrapComment
                ? wrapComment(row, item.id, index)
                : (
                    <div key={item.id}>{row}</div>
                  );
            })}
          </PdpReviewCommentsSection>

          {showComposer ? (
            <PdpReviewCommentBox
              onPost={onPostComment}
              replyTarget={replyTarget}
              onCancelReply={onCancelReply}
              composerIntent="comment"
              pinned={composerPinned}
              keyboardOpen={composerKeyboardOpen}
              refocusAfterPost={composerRefocusAfterPost}
              inputRef={composerInputRef}
            />
          ) : null}
        </section>
      ) : null}

      {showUgcCarousel ? (
        <section aria-label="Customer photos">
          <div className={pdpCarouselScrollWrapClass}>
            <div className={cn("flex gap-2", pdpCarouselScrollClass)}>
              {ugcStories.map((story) => (
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
        </section>
      ) : null}

      {showReadAll && onReadAll && (!showFeedFilters || feedFilter === "reviews") ? (
        <PdpTextLinkCta
          type="button"
          onClick={onReadAll}
          className={cn("self-start", pdpType.body)}
        >
          Read all {count} reviews
        </PdpTextLinkCta>
      ) : null}
    </div>
  );
}
