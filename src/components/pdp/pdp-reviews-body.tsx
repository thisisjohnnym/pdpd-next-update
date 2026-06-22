"use client";

import { useCallback, useState, type ReactNode, type RefObject } from "react";

import { cn } from "@/lib/cn";

import {
  pdpCarouselScrollClass,
  pdpCarouselScrollWrapClass,
  pdpUgcStoryCardCompactClass,
} from "./pdp-carousel";
import {
  PDP_COMMENTS_SUMMARY,
  PDP_REVIEWS_SUMMARY,
  type PdpReviewReply,
} from "./pdp-data";
import { useActiveProduct } from "./pdp-active-product-context";
import { getPdpReviewsContent } from "./pdp-reviews-content";
import { PdpModuleHeading } from "./pdp-module-heading";
import { pdpModuleHeadingClass } from "./pdp-module-section";
import { PdpAiInsightCard } from "./pdp-ai-insight-card";
import { PdpUgcStoryCard } from "./pdp-ugc-story-card";
import {
  createUserComment,
  createUserReply,
  mapReviewToComment,
  mergeCommentReplies,
  PdpReviewComment,
  PdpReviewCommentBox,
  PdpReviewCommentsSection,
  PdpStarRating,
  sortCommentsByLikes,
  type PdpReplyTarget,
  type PdpReviewCommentData,
} from "./pdp-review-comment";
import { pdpType } from "./pdp-type";
import { PdpTextLinkCta } from "./pdp-text-link-cta";

export function usePdpReviewsComments(onRootPost?: () => void) {
  const { productId } = useActiveProduct();
  const { customerReviews, reviewReplies } = getPdpReviewsContent(productId);
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

  const allComments = sortCommentsByLikes([
    ...userComments.map(enrichComment),
    ...customerReviews
      .map((review) => mapReviewToComment(review, reviewReplies))
      .map(enrichComment),
  ]);

  const clearReplyTarget = useCallback(() => setReplyTarget(null), []);

  return {
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
  /** Limit visible comments — omit for full list */
  commentLimit?: number;
  onReadAll?: () => void;
  onWriteReview?: () => void;
  showReadAll?: boolean;
  showInlineComposer?: boolean;
  composerInputRef?: RefObject<HTMLInputElement | null>;
  composerPinned?: boolean;
  composerKeyboardOpen?: boolean;
  composerRefocusAfterPost?: boolean;
  wrapComment?: (comment: ReactNode, commentId: string, index: number) => ReactNode;
  className?: string;
  allComments: PdpReviewCommentData[];
  userReplies: Record<string, PdpReviewReply[]>;
  replyTarget: PdpReplyTarget | null;
  setReplyTarget: (target: PdpReplyTarget | null) => void;
  onPostComment: (text: string, target?: PdpReplyTarget | null) => void;
  onCancelReply: () => void;
};

/** Shared comments layout — summary, UGC, and social-style thread */
export function PdpReviewsBody({
  titleId,
  commentLimit,
  onReadAll,
  onWriteReview,
  showReadAll = Boolean(onReadAll),
  showInlineComposer = true,
  composerInputRef,
  composerPinned = false,
  composerKeyboardOpen = false,
  composerRefocusAfterPost = true,
  wrapComment,
  className,
  allComments,
  userReplies,
  replyTarget,
  setReplyTarget,
  onPostComment,
  onCancelReply,
}: PdpReviewsBodyProps) {
  const { productId } = useActiveProduct();
  const { aiSummaryBody, ugcStories } = getPdpReviewsContent(productId);
  const { average } = PDP_REVIEWS_SUMMARY;
  const visibleComments =
    commentLimit != null ? allComments.slice(0, commentLimit) : allComments;

  return (
    <div className={cn("flex w-full flex-col gap-6", className)}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          {titleId ? (
            <h2 id={titleId} className={pdpModuleHeadingClass({ lead: false })}>
              Comments
            </h2>
          ) : (
            <PdpModuleHeading spacing="none">Comments</PdpModuleHeading>
          )}
          {onWriteReview ? (
            <PdpTextLinkCta
              type="button"
              onClick={onWriteReview}
              className={cn("shrink-0", pdpType.label)}
            >
              Write a comment
            </PdpTextLinkCta>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <PdpStarRating rating={average} />
          <p className="font-extended m-0 text-sm tracking-[0.2px] text-black">
            {average.toFixed(1)} · {PDP_COMMENTS_SUMMARY.count} comments
          </p>
        </div>
      </div>

      <PdpAiInsightCard
        variant="minimal"
        size="xs"
        contained
        containedSurface="flat"
        showIcon={false}
        clampBodyLines={1}
        body={aiSummaryBody}
      />

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

      <section className="flex flex-col">
        <PdpReviewCommentsSection>
          {visibleComments.map((comment, index) => {
            const row = (
              <PdpReviewComment
                comment={comment}
                variant="compact"
                onReply={setReplyTarget}
                expandReplies={Boolean(userReplies[comment.id]?.length)}
              />
            );

            return wrapComment
              ? wrapComment(row, comment.id, index)
              : (
                  <div key={comment.id}>{row}</div>
                );
          })}
        </PdpReviewCommentsSection>

        {showInlineComposer ? (
          <PdpReviewCommentBox
            onPost={onPostComment}
            replyTarget={replyTarget}
            onCancelReply={onCancelReply}
            pinned={composerPinned}
            keyboardOpen={composerKeyboardOpen}
            refocusAfterPost={composerRefocusAfterPost}
            inputRef={composerInputRef}
          />
        ) : null}
      </section>

      {showReadAll && onReadAll ? (
        <PdpTextLinkCta
          type="button"
          onClick={onReadAll}
          className={cn("self-start", pdpType.body)}
        >
          Read all {PDP_COMMENTS_SUMMARY.count} comments
        </PdpTextLinkCta>
      ) : null}
    </div>
  );
}
