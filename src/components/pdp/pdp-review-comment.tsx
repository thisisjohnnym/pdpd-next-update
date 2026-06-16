"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { pdpCarouselImageClass } from "./pdp-carousel";
import { PdpReviewLikeButton } from "./pdp-review-like-button";
import { pdpPressableClass, pdpType } from "./pdp-type";
import type { PdpFeaturedReview } from "./pdp-data";

type StarSize = 18 | 20;

export function PdpStarRating({
  rating,
  size = 18,
}: {
  rating: number;
  size?: StarSize;
}) {
  return (
    <div
      className="flex shrink-0 items-center gap-0.5"
      aria-label={`${rating.toFixed(1)} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, index) => {
        const fill = Math.min(Math.max(rating - index, 0), 1);

        return (
          <span
            key={index}
            className="relative inline-flex shrink-0"
            style={{ width: size, height: size }}
          >
            <MaterialIcon name="star" size={size} className="text-neutral-300" />
            {fill > 0 ? (
              <span
                className="absolute inset-y-0 left-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <MaterialIcon name="star" size={size} filled className="text-black" />
              </span>
            ) : null}
          </span>
        );
      })}
    </div>
  );
}

export type PdpReviewCommentData = Pick<
  PdpFeaturedReview,
  "id" | "quote" | "author" | "date" | "verified" | "photos" | "likes"
> & {
  rating?: number;
};

type PdpReviewCommentProps = {
  comment: PdpReviewCommentData;
  variant?: "compact" | "full";
};

function formatRelativeCommentDate(dateLabel: string) {
  if (dateLabel === "now") {
    return "now";
  }

  const parsed = new Date(dateLabel);
  if (Number.isNaN(parsed.getTime())) {
    return dateLabel;
  }

  const diffMs = Date.now() - parsed.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffMinutes < 1) {
    return "now";
  }
  if (diffHours < 1) {
    return `${diffMinutes}m`;
  }
  if (diffDays < 1) {
    return `${diffHours}h`;
  }
  if (diffWeeks < 1) {
    return `${diffDays}d`;
  }
  if (diffWeeks < 5) {
    return `${diffWeeks}w`;
  }

  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** Instagram-style comment — username above text, heart on the right */
export function PdpReviewComment({
  comment,
  variant = "compact",
}: PdpReviewCommentProps) {
  const [expanded, setExpanded] = useState(false);
  const hasPhoto = Boolean(comment.photos?.length);
  const clampLines = variant === "compact" ? 2 : expanded ? undefined : 2;
  const canExpand = variant === "full" && comment.quote.length > 80 && !expanded;

  return (
    <article className="flex gap-2 py-3">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <p className="font-extended font-semibold tracking-[0.2px] text-black">
            {comment.author}
          </p>
          {comment.verified ? (
            <MaterialIcon
              name="verified"
              size={18}
              className="shrink-0 text-neutral-300 opacity-70"
              style={{ fontSize: 11 }}
              aria-label="Verified buyer"
              ariaHidden={false}
            />
          ) : null}
        </div>

        <p
          className={cn(
            `mt-0.5 text-black ${pdpType.caption}`,
            clampLines === 2 && "line-clamp-2",
          )}
        >
          {comment.quote}
          {canExpand ? (
            <>
              {" "}
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className={cn("text-neutral-500", pdpPressableClass)}
              >
                more
              </button>
            </>
          ) : null}
        </p>

        {hasPhoto && comment.photos?.[0] ? (
          <div className="relative mt-2 size-[4.5rem] overflow-hidden bg-neutral-100">
            <Image
              src={comment.photos[0].src}
              alt={comment.photos[0].alt}
              fill
              className={cn("object-cover object-center", pdpCarouselImageClass)}
              sizes="72px"
            />
          </div>
        ) : null}

        <div className="mt-2 flex items-center gap-3">
          <button
            type="button"
            className={cn("text-neutral-500", pdpType.micro, pdpPressableClass)}
          >
            Reply
          </button>
          <span className={`text-neutral-400 ${pdpType.micro}`}>
            {formatRelativeCommentDate(comment.date)}
          </span>
        </div>
      </div>

      <PdpReviewLikeButton initialLikes={comment.likes} layout="stacked" />
    </article>
  );
}

type PdpReviewCommentBoxProps = {
  onPost?: (text: string) => void;
  className?: string;
  /** Pinned to bottom of a sheet — border-top + safe area padding */
  pinned?: boolean;
};

/** Instagram-style comment composer */
export function PdpReviewCommentBox({
  onPost,
  className,
  pinned = false,
}: PdpReviewCommentBoxProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState("");

  const trimmed = text.trim();
  const canPost = trimmed.length > 0;

  const handlePost = () => {
    if (!canPost) {
      return;
    }

    onPost?.(trimmed);
    setText("");
    inputRef.current?.focus();
  };

  return (
    <div
      className={cn(
        "bg-white",
        pinned
          ? "shrink-0 border-t border-neutral-200 px-3 pb-[max(12px,var(--pdp-safe-area-bottom))] pt-3"
          : "border-t border-neutral-200 pt-4",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <label htmlFor={inputId} className="sr-only">
          Add a comment
        </label>
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && canPost) {
              event.preventDefault();
              handlePost();
            }
          }}
          placeholder="Add a comment..."
          className={cn(
            "min-w-0 flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-black outline-none placeholder:text-neutral-400 focus:border-neutral-400",
            pdpType.caption,
          )}
        />
        <button
          type="button"
          onClick={handlePost}
          disabled={!canPost}
          className={cn(
            "shrink-0 font-extended text-sm tracking-[0.2px] transition-opacity",
            canPost
              ? "text-[#0095F6] active:opacity-70"
              : "pointer-events-none text-neutral-300",
            pdpPressableClass,
          )}
        >
          Post
        </button>
      </div>
    </div>
  );
}

export function createUserComment(quote: string): PdpReviewCommentData {
  return {
    id: `user-${Date.now()}`,
    quote,
    author: "You",
    date: "now",
    likes: 0,
  };
}
