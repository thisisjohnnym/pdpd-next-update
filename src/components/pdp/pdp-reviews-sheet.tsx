"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import {
  pdpBottomSheetCloseButtonClass,
  pdpBottomSheetGrabHandleClass,
  pdpBottomSheetHeaderClass,
  pdpBottomSheetPanelClass,
  pdpBottomSheetViewportFrameClass,
  PDP_BOTTOM_SHEET_CLOSE_ICON_SIZE,
} from "./pdp-bottom-sheet";
import { PdpReviewCommentBox, type PdpReviewFeedFilter } from "./pdp-review-comment";
import { PdpReviewsBody, usePdpReviewsComments } from "./pdp-reviews-body";
import { useBodyScrollLock, useVisualViewportFrame } from "./use-visual-viewport-frame";

type PdpReviewsSheetProps = {
  open: boolean;
  onClose: () => void;
  /** Which feed tab opens in the sheet */
  openFeedFilter?: PdpReviewFeedFilter;
};

/** Bottom sheet — full reviews tray matching inline page layout */
export function PdpReviewsSheet({
  open,
  onClose,
  openFeedFilter = "reviews",
}: PdpReviewsSheetProps) {
  const titleId = useId();
  const composerInputRef = useRef<HTMLInputElement>(null);
  const [hasBeenOpen, setHasBeenOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [feedFilter, setFeedFilter] = useState<PdpReviewFeedFilter>(openFeedFilter);
  const viewportFrame = useVisualViewportFrame(open);

  const {
    allReviews,
    allComments,
    userReplies,
    replyTarget,
    setReplyTarget,
    clearReplyTarget,
    handlePostComment,
  } = usePdpReviewsComments(onClose);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      setHasBeenOpen(true);
      setFeedFilter(openFeedFilter);
    }
  }, [open, openFeedFilter]);

  useEffect(() => {
    if (!open) {
      clearReplyTarget();
    }
  }, [open, clearReplyTarget]);

  useEffect(() => {
    if (!open || openFeedFilter !== "comments") {
      return;
    }

    requestAnimationFrame(() => {
      composerInputRef.current?.focus();
    });
  }, [open, openFeedFilter]);

  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  const handleWriteReview = () => {
    setFeedFilter("reviews");
  };

  const showComposer = feedFilter === "comments";

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-50 transition-opacity duration-300",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      )}
      aria-hidden={!open}
    >
      <div className="absolute inset-0 bg-black/45" aria-hidden />

      <div
        className={pdpBottomSheetViewportFrameClass}
        style={{
          top: viewportFrame.top,
          left: viewportFrame.left,
          width: viewportFrame.width,
          height: viewportFrame.height,
        }}
      >
        <button
          type="button"
          aria-label="Close reviews"
          className="absolute inset-0"
          onClick={onClose}
          tabIndex={open ? 0 : -1}
        />

        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className={cn(
            pdpBottomSheetPanelClass({ open, fitViewportFrame: true }),
            "relative z-[1] min-h-0",
          )}
        >
          <div className={cn(pdpBottomSheetHeaderClass, "pb-3")}>
            <div className={pdpBottomSheetGrabHandleClass} />
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className={pdpBottomSheetCloseButtonClass}
            >
              <MaterialIcon name="close" size={PDP_BOTTOM_SHEET_CLOSE_ICON_SIZE} />
            </button>
          </div>

          <div className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-4 pt-2">
              {hasBeenOpen ? (
                <PdpReviewsBody
                  titleId={titleId}
                  onWriteReview={handleWriteReview}
                  showFeedFilters
                  feedFilter={feedFilter}
                  onFeedFilterChange={setFeedFilter}
                  showReadAll={false}
                  showInlineComposer={false}
                  allReviews={allReviews}
                  allComments={allComments}
                  userReplies={userReplies}
                  replyTarget={replyTarget}
                  setReplyTarget={setReplyTarget}
                  onPostComment={handlePostComment}
                  onCancelReply={clearReplyTarget}
                />
              ) : null}
            </div>

            {hasBeenOpen && showComposer ? (
              <PdpReviewCommentBox
                onPost={handlePostComment}
                composerIntent="comment"
                pinned
                refocusAfterPost={false}
                keyboardOpen={viewportFrame.keyboardLikelyOpen}
                replyTarget={replyTarget}
                onCancelReply={clearReplyTarget}
                inputRef={composerInputRef}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
