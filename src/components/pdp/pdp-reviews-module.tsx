"use client";

import { GridItem, PageGrid } from "@/components/grid/page-grid";

import { PdpRevealItem } from "./pdp-reveal-item";
import { pdpModuleSectionClass } from "./pdp-module-section";
import { PdpReviewsBody, usePdpReviewsComments } from "./pdp-reviews-body";

const PAGE_REVIEW_COUNT = 4;

type PdpReviewsModuleProps = {
  onReadAll?: () => void;
  onWriteReview?: () => void;
  /** First module after gallery — tighter top padding */
  first?: boolean;
};

/** Inline reviews — summary, UGC, and social-style comments on the page */
export function PdpReviewsModule({
  onReadAll,
  onWriteReview,
  first = true,
}: PdpReviewsModuleProps) {
  const {
    allComments,
    userReplies,
    replyTarget,
    setReplyTarget,
    clearReplyTarget,
    handlePostComment,
  } = usePdpReviewsComments();

  return (
    <section
      data-header-surface="light"
      className={pdpModuleSectionClass({ first })}
    >
      <PageGrid fullWidth>
        <GridItem mobile={12} desktop={24} className="min-w-0">
          <PdpRevealItem>
            <PdpReviewsBody
              commentLimit={PAGE_REVIEW_COUNT}
              onReadAll={onReadAll}
              onWriteReview={onWriteReview}
              allComments={allComments}
              userReplies={userReplies}
              replyTarget={replyTarget}
              setReplyTarget={setReplyTarget}
              onPostComment={handlePostComment}
              onCancelReply={clearReplyTarget}
              wrapComment={(comment, commentId, index) => (
                <PdpRevealItem key={commentId} as="div" delay={index * 50}>
                  {comment}
                </PdpRevealItem>
              )}
            />
          </PdpRevealItem>
        </GridItem>
      </PageGrid>
    </section>
  );
}
