"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import {
  pdpBottomSheetBackdropClass,
  pdpBottomSheetOverlayClass,
  pdpBottomSheetPanelClass,
} from "./pdp-bottom-sheet";

import {
  pdpCarouselScrollClass,
  pdpCarouselScrollWrapClass,
  pdpUgcStoryCardCompactClass,
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
} from "./pdp-data";
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
import { PdpAiInsightCard } from "./pdp-ai-insight-card";
import { PdpUgcStoryCard } from "./pdp-ugc-story-card";
import { pdpType } from "./pdp-type";
import { PdpTextLinkCta } from "./pdp-text-link-cta";

type PdpReviewsSheetProps = {
  open: boolean;
  onClose: () => void;
};

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

function RatingBreakdownInfo({ active }: { active: boolean }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const tooltipId = useId();
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (!active) {
      setOpen(false);
    }
  }, [active]);

  useEffect(() => {
    if (!open) {
      setPosition(null);
      return;
    }

    const updatePosition = () => {
      const button = buttonRef.current;
      if (!button) {
        return;
      }

      const rect = button.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        left: rect.left + rect.width / 2,
      });
    };

    updatePosition();

    const close = (event: PointerEvent) => {
      const target = event.target as Node;

      if (
        buttonRef.current?.contains(target) ||
        document.getElementById(tooltipId)?.contains(target)
      ) {
        return;
      }

      setOpen(false);
    };

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    document.addEventListener("pointerdown", close);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      document.removeEventListener("pointerdown", close);
    };
  }, [open, tooltipId]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls={tooltipId}
        aria-label={open ? "Hide rating breakdown" : "Show rating breakdown"}
        className="flex size-5 shrink-0 items-center justify-center text-neutral-500"
      >
        <MaterialIcon name="info" size={18} className="text-neutral-500" />
      </button>

      {open && position
        ? createPortal(
            <div
              id={tooltipId}
              role="tooltip"
              style={{
                top: position.top,
                left: position.left,
                transform: "translateX(-50%)",
              }}
              className="fixed z-[60] w-[min(17rem,calc(100vw-2rem))] rounded-lg border border-neutral-200 bg-[#f2f2f2] px-3 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.1)]"
            >
              <div className="flex flex-col gap-3">
                {PDP_REVIEWS_RATING_BREAKDOWN.map((row) => (
                  <RatingBreakdownRow
                    key={row.stars}
                    stars={row.stars}
                    percent={row.percent}
                  />
                ))}
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

/** Bottom sheet — bag reviews pulled up from comments rail */
export function PdpReviewsSheet({ open, onClose }: PdpReviewsSheetProps) {
  const titleId = useId();
  const [hasBeenOpen, setHasBeenOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [userComments, setUserComments] = useState<PdpReviewCommentData[]>([]);
  const { average } = PDP_REVIEWS_SUMMARY;
  const reviewCount = PDP_COMMENTS_SUMMARY.count;

  const handlePostComment = (text: string) => {
    setUserComments((current) => [createUserComment(text), ...current]);
  };

  const allComments = sortCommentsByLikes([
    ...userComments,
    ...PDP_CUSTOMER_REVIEWS.map(mapReviewToComment),
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      setHasBeenOpen(true);
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

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div
      className={pdpBottomSheetOverlayClass({ open })}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close reviews"
        className={pdpBottomSheetBackdropClass()}
        onClick={onClose}
        tabIndex={open ? 0 : -1}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={pdpBottomSheetPanelClass({ open, maxHeight: "92dvh" })}
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

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3">
          {hasBeenOpen ? (
          <>
          <div className="flex flex-col items-start gap-3 pb-4 pt-0">
            <h2 id={titleId} className={pdpSheetHeadingClass()}>
              Comments
            </h2>

            <div className="flex items-center gap-2.5">
              <p className="font-extended text-2xl leading-none tracking-[0.4px] text-black">
                {average.toFixed(1)}
              </p>
              <div className="h-8 w-px bg-[#e1e1e1]" aria-hidden />
              <div className="flex flex-col gap-1">
                <PdpStarRating rating={average} />
                <div className="flex items-center gap-1">
                  <p className="font-extended text-sm tracking-[0.2px] text-black">
                    {reviewCount} Reviews
                  </p>
                  <RatingBreakdownInfo active={open} />
                </div>
              </div>
            </div>
          </div>

          <PdpAiInsightCard
            variant="minimal"
            size="compact"
            className="pb-4"
            eyebrow={PDP_REVIEWS_AI_SUMMARY.attribution}
            eyebrowPosition="below"
            title={PDP_REVIEWS_AI_SUMMARY.headline}
            body={PDP_REVIEWS_AI_SUMMARY.body}
          />

          <PdpReviewCommentsSection bleed className="pb-2">
            {allComments.map((comment) => (
              <PdpReviewComment
                key={comment.id}
                comment={comment}
                variant="full"
              />
            ))}
          </PdpReviewCommentsSection>

          <div className="flex flex-col gap-2 border-t border-neutral-200 pt-6">
            <div className="flex items-start justify-between gap-4">
              <p className={cn(pdpModuleHeadingClass({ lead: false, size: "sm" }), "text-neutral-600")}>
                In real life
              </p>
              <PdpTextLinkCta type="button" className={cn("shrink-0", pdpType.label)}>
                View all
              </PdpTextLinkCta>
            </div>

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
          </div>
          </>
          ) : null}
          </div>

          {hasBeenOpen ? (
            <PdpReviewCommentBox onPost={handlePostComment} pinned />
          ) : null}
        </div>
      </div>
    </div>,
    document.body,
  );
}
