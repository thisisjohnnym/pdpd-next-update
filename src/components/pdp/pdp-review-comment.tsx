"use client";

import Image from "next/image";
import {
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { pdpCarouselImageClass } from "./pdp-carousel";
import { PdpReviewLikeButton } from "./pdp-review-like-button";
import { pdpPressableClass, pdpType } from "./pdp-type";
import {
  PDP_REVIEW_REPLIES,
  type PdpFeaturedReview,
  type PdpReviewReply,
} from "./pdp-data";

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
  replies?: PdpReviewReply[];
};

const INITIAL_VISIBLE_REPLIES = 2;

function isAnimatedCommentMedia(src: string) {
  return /\.(?:gif|webp)($|\?)/i.test(src);
}

function ReplyThread({
  children,
  footer,
}: {
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="ml-4 border-l border-neutral-200 pl-4">
      {children}
      {footer}
    </div>
  );
}

type CommentRowProps = {
  author: string;
  quote: string;
  date: string;
  verified?: boolean;
  likes: number;
  photos?: PdpFeaturedReview["photos"];
  variant: "compact" | "full";
  isReply?: boolean;
};

function CommentRow({
  author,
  quote,
  date,
  verified,
  likes,
  photos,
  variant,
  isReply = false,
}: CommentRowProps) {
  const [expanded, setExpanded] = useState(false);
  const hasPhoto = Boolean(photos?.length);
  const clampLines = variant === "compact" ? 2 : expanded ? undefined : 2;
  const canExpand = variant === "full" && quote.length > 80 && !expanded;

  return (
    <div className={cn("flex gap-2", isReply ? "py-2" : "py-3")}>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <p className={`text-black ${pdpType.label}`}>{author}</p>
          {verified ? (
            <MaterialIcon
              name="verified"
              size={18}
              filled
              className="shrink-0 text-[#0095F6]"
              style={{ fontSize: 11 }}
              aria-label="Verified buyer"
              ariaHidden={false}
            />
          ) : null}
        </div>

        <p
          className={cn(
            `mt-0.5 text-black ${pdpType.body}`,
            clampLines === 2 && "line-clamp-2",
          )}
        >
          {quote}
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

        {hasPhoto && photos?.[0] ? (
          <div className="relative mt-2 size-24 overflow-hidden bg-neutral-100">
            {isAnimatedCommentMedia(photos[0].src) ? (
              // Animated GIF/WebP — native img keeps animation; Next/Image can flatten frames
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photos[0].src}
                alt={photos[0].alt}
                loading="lazy"
                decoding="async"
                className={cn(
                  "size-full object-cover object-center",
                  pdpCarouselImageClass,
                )}
              />
            ) : (
              <Image
                src={photos[0].src}
                alt={photos[0].alt}
                fill
                className={cn("object-cover object-center", pdpCarouselImageClass)}
                sizes="96px"
              />
            )}
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
            {formatRelativeCommentDate(date)}
          </span>
        </div>
      </div>

      <PdpReviewLikeButton initialLikes={likes} layout="stacked" />
    </div>
  );
}

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

/** Instagram-style comment — username above text, optional reply thread */
export function PdpReviewComment({
  comment,
  variant = "compact",
}: PdpReviewCommentProps) {
  const [repliesExpanded, setRepliesExpanded] = useState(false);
  const replies = comment.replies ?? [];
  const hiddenReplyCount = Math.max(replies.length - INITIAL_VISIBLE_REPLIES, 0);
  const visibleReplies = repliesExpanded
    ? replies
    : replies.slice(0, INITIAL_VISIBLE_REPLIES);

  return (
    <article>
      <CommentRow
        author={comment.author}
        quote={comment.quote}
        date={comment.date}
        verified={comment.verified}
        likes={comment.likes}
        photos={comment.photos}
        variant={variant}
      />

      {replies.length > 0 ? (
        <ReplyThread
          footer={
            <>
              {hiddenReplyCount > 0 && !repliesExpanded ? (
                <button
                  type="button"
                  onClick={() => setRepliesExpanded(true)}
                  className={cn(
                    "flex items-center gap-2 py-2 text-neutral-500",
                    pdpType.micro,
                    pdpPressableClass,
                  )}
                >
                  View {hiddenReplyCount} more replies
                </button>
              ) : null}

              {repliesExpanded && replies.length > INITIAL_VISIBLE_REPLIES ? (
                <button
                  type="button"
                  onClick={() => setRepliesExpanded(false)}
                  className={cn(
                    "flex items-center gap-2 py-2 text-neutral-500",
                    pdpType.micro,
                    pdpPressableClass,
                  )}
                >
                  Hide replies
                </button>
              ) : null}
            </>
          }
        >
          {visibleReplies.map((reply) => (
            <div key={reply.id}>
              <CommentRow
                author={reply.author}
                quote={reply.quote}
                date={reply.date}
                verified={reply.verified}
                likes={reply.likes}
                variant={variant}
                isReply
              />
            </div>
          ))}
        </ReplyThread>
      ) : null}
    </article>
  );
}

export function mapReviewToComment(review: PdpFeaturedReview): PdpReviewCommentData {
  return {
    id: review.id,
    quote: review.quote,
    author: review.author,
    date: review.date,
    verified: review.verified,
    photos: review.photos,
    likes: review.likes,
    rating: review.rating,
    replies: PDP_REVIEW_REPLIES[review.id],
  };
}

export function sortCommentsByLikes(
  comments: PdpReviewCommentData[],
): PdpReviewCommentData[] {
  return [...comments].sort((a, b) => b.likes - a.likes);
}

type PdpReviewCommentsSectionProps = {
  children: ReactNode;
  className?: string;
  /** Bleed dividers to sheet edges */
  bleed?: boolean;
};

/** Comment thread list with dividers */
export function PdpReviewCommentsSection({
  children,
  className,
  bleed = false,
}: PdpReviewCommentsSectionProps) {
  return (
    <section
      className={cn(
        "divide-y divide-neutral-200",
        bleed ? "-mx-3 px-3" : "",
        className,
      )}
    >
      {children}
    </section>
  );
}

type PdpReviewCommentBoxProps = {
  onPost?: (text: string) => void;
  className?: string;
  /** Pinned to bottom of a sheet — border-top + safe area padding */
  pinned?: boolean;
  /** iOS keyboard visible — tighten bottom padding */
  keyboardOpen?: boolean;
  /** Keep focus in the field after posting — off when the sheet closes */
  refocusAfterPost?: boolean;
};

/** Instagram-style comment composer */
export function PdpReviewCommentBox({
  onPost,
  className,
  pinned = false,
  keyboardOpen = false,
  refocusAfterPost = true,
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
    if (refocusAfterPost) {
      inputRef.current?.focus();
    } else {
      inputRef.current?.blur();
    }
  };

  const handleFocus = () => {
    requestAnimationFrame(() => {
      inputRef.current?.scrollIntoView({ block: "nearest", inline: "nearest" });
    });
  };

  return (
    <div
      className={cn(
        "bg-white",
        pinned
          ? cn(
              "pdp-comment-composer shrink-0 border-t border-neutral-200 px-3 pt-3",
              keyboardOpen ? "pb-2" : "pb-[max(12px,var(--pdp-safe-area-bottom))]",
            )
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
          inputMode="text"
          enterKeyHint="send"
          autoComplete="off"
          autoCorrect="on"
          autoCapitalize="sentences"
          value={text}
          onChange={(event) => setText(event.target.value)}
          onFocus={handleFocus}
          onKeyDown={(event) => {
            if (event.key === "Enter" && canPost) {
              event.preventDefault();
              handlePost();
            }
          }}
          placeholder="Add a comment..."
          className={cn(
            "pdp-comment-composer__input min-h-11 min-w-0 flex-1 rounded-full border-0 bg-[#f3f3f3] px-4 pt-3 pb-2.5",
            "font-extended text-base tracking-[0.2px] text-black outline-none",
            "placeholder:text-neutral-500 focus:bg-[#ececec]",
            "[touch-action:manipulation] [-webkit-tap-highlight-color:transparent]",
          )}
        />
        <button
          type="button"
          onClick={handlePost}
          disabled={!canPost}
          className={cn(
            "shrink-0 font-extended text-base leading-none tracking-[0.2px] transition-opacity",
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
