"use client";

import Image from "next/image";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { pdpCarouselImageClass } from "./pdp-carousel";
import { PdpParallaxMedia, refreshPdpParallax } from "./pdp-parallax-media";
import { PdpReviewLikeButton } from "./pdp-review-like-button";
import { pdpPressableClass, pdpType } from "./pdp-type";
import {
  getCommentAuthorAvatar,
  type PdpCustomerComment,
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

export type PdpReplyTarget = {
  parentCommentId: string;
  replyToAuthor: string;
};

export type PdpReviewCommentData = Pick<
  PdpFeaturedReview,
  | "id"
  | "quote"
  | "author"
  | "date"
  | "verified"
  | "photos"
  | "likes"
  | "title"
  | "body"
  | "recommendTags"
> & {
  rating?: number;
  replies?: PdpReviewReply[];
};

function isFormalReview(comment: PdpReviewCommentData) {
  return comment.rating != null;
}

const INITIAL_VISIBLE_REPLIES = 2;

const COMMENT_AVATAR_COLORS = [
  "bg-rose-100 text-rose-900",
  "bg-sky-100 text-sky-900",
  "bg-amber-100 text-amber-900",
  "bg-violet-100 text-violet-900",
  "bg-teal-100 text-teal-900",
  "bg-orange-100 text-orange-900",
] as const;

function isAnimatedCommentMedia(src: string) {
  return /\.(?:gif|webp)($|\?)/i.test(src);
}

function isCoachBrandAuthor(author: string) {
  return author.trim().toLowerCase() === "coach";
}

function isProductReviewPhoto(src: string) {
  return !isAnimatedCommentMedia(src);
}

export type PdpReviewFeedFilter = "reviews" | "comments" | "questions" | "photos";

const REVIEW_FEED_FILTERS: { id: PdpReviewFeedFilter; label: string }[] = [
  { id: "reviews", label: "Reviews" },
  { id: "comments", label: "Comments" },
  { id: "questions", label: "Questions" },
  { id: "photos", label: "Photos" },
];

function hasCoachReply(comment: PdpReviewCommentData) {
  return (
    comment.replies?.some((reply) => isCoachBrandAuthor(reply.author)) ?? false
  );
}

export function filterCommentsByFeedFilter(
  reviews: PdpReviewCommentData[],
  comments: PdpReviewCommentData[],
  filter: PdpReviewFeedFilter,
): PdpReviewCommentData[] {
  switch (filter) {
    case "reviews":
      return sortCommentsByLikes(reviews);
    case "comments":
      return sortCommentsByLikes(comments);
    case "questions":
      return sortCommentsByLikes(comments.filter((comment) => hasCoachReply(comment)));
    case "photos":
      return sortCommentsByLikes([
        ...reviews.filter((comment) => Boolean(comment.photos?.length)),
        ...comments.filter((comment) => Boolean(comment.photos?.length)),
      ]);
  }
}

export function feedFilterSupportsComposer(filter: PdpReviewFeedFilter) {
  return filter === "comments";
}

type PdpReviewFeedFilterBarProps = {
  value: PdpReviewFeedFilter;
  onChange: (filter: PdpReviewFeedFilter) => void;
  className?: string;
  /** Hide the Comments tab (v2 removes comments from reviews) */
  hideComments?: boolean;
};

/** Sheet-only filters — reviews, comments, questions, and photos */
export function PdpReviewFeedFilterBar({
  value,
  onChange,
  className,
  hideComments = false,
}: PdpReviewFeedFilterBarProps) {
  const filters = hideComments
    ? REVIEW_FEED_FILTERS.filter((filter) => filter.id !== "comments")
    : REVIEW_FEED_FILTERS;

  return (
    <div
      className={cn("-mx-1 overflow-x-auto overscroll-x-contain", className)}
      role="tablist"
      aria-label="Filter reviews"
    >
      <div className="flex w-max min-w-full gap-2 px-1 pb-1">
        {filters.map((filter) => {
          const active = value === filter.id;

          return (
            <button
              key={filter.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(filter.id)}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1.5 transition-colors",
                pdpType.micro,
                pdpPressableClass,
                active
                  ? "border-black bg-black text-white"
                  : "border-neutral-200 bg-white text-black active:bg-neutral-50",
              )}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function getCommentAuthorInitials(author: string) {
  const parts = author
    .replace(/\./g, "")
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

function getCommentAvatarColor(author: string) {
  let hash = 0;

  for (const char of author) {
    hash = (hash + char.charCodeAt(0)) | 0;
  }

  return COMMENT_AVATAR_COLORS[Math.abs(hash) % COMMENT_AVATAR_COLORS.length];
}

function CommentAvatar({ author }: { author: string }) {
  const isCoach = isCoachBrandAuthor(author);
  const photoSrc = getCommentAuthorAvatar(author);

  return (
    <div
      className={cn(
        "relative mt-0.5 size-7 shrink-0 overflow-hidden rounded-full ring-1 ring-black/6",
        isCoach ? "bg-black" : !photoSrc && getCommentAvatarColor(author),
      )}
      aria-hidden
    >
      {isCoach ? (
        <Image
          src="/images/coach-c-mark.png"
          alt=""
          fill
          className="object-contain object-center p-1.5"
          sizes="28px"
        />
      ) : photoSrc ? (
        <Image
          src={photoSrc}
          alt=""
          fill
          className="object-cover object-center"
          sizes="28px"
        />
      ) : (
        <span
          className={cn(
            "flex size-full items-center justify-center font-extended text-[10px] font-medium tracking-[0.2px]",
          )}
        >
          {getCommentAuthorInitials(author)}
        </span>
      )}
    </div>
  );
}

function ReplyThread({
  children,
  footer,
}: {
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="mt-1">
      <div className="divide-y divide-neutral-100">{children}</div>
      {footer}
    </div>
  );
}

function ReplyThreadAction({
  children,
  onClick,
  collapsed = true,
}: {
  children: ReactNode;
  onClick: () => void;
  collapsed?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex items-center gap-2 py-2.5 pl-9 text-left text-neutral-600",
        pdpType.micro,
        pdpPressableClass,
      )}
    >
      <span className="font-medium text-neutral-700 group-active:text-black">
        {children}
      </span>
      <MaterialIcon
        name={collapsed ? "expand_more" : "expand_less"}
        size={18}
        className="shrink-0 text-neutral-500 transition-transform group-active:translate-y-px"
        style={{ fontSize: 16 }}
      />
    </button>
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
  onReply?: () => void;
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
  onReply,
}: CommentRowProps) {
  const [expanded, setExpanded] = useState(false);
  const hasPhoto = Boolean(photos?.length);
  const clampLines = variant === "compact" ? 2 : expanded ? undefined : 2;
  const canExpand = variant === "full" && quote.length > 80 && !expanded;
  const isCoachBrand = isCoachBrandAuthor(author);

  return (
    <div
      className={cn(
        "flex gap-2.5",
        isReply ? "py-2.5 pl-9" : "py-3",
        isReply &&
          isCoachBrand &&
          "rounded-xl bg-neutral-50/90 px-2 py-2.5 pl-10",
      )}
    >
      <CommentAvatar author={author} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <p
            className={cn(
              "text-black",
              pdpType.label,
              isCoachBrand && "font-medium",
            )}
          >
            {author}
          </p>
          {verified ? (
            <MaterialIcon
              name="verified"
              size={18}
              filled
              className="shrink-0 text-[#0095F6]"
              style={{ fontSize: 11 }}
              aria-label={isCoachBrand ? "Official account" : "Verified buyer"}
              ariaHidden={false}
            />
          ) : null}
        </div>

        <p
          className={cn(
            `mt-0.5 text-black ${pdpType.body}`,
            isReply && "text-[13px] leading-[1.4]",
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

        <div className="mt-1.5 flex items-center gap-3">
          {onReply ? (
            <button
              type="button"
              onClick={onReply}
              className={cn(
                "font-medium text-neutral-600 active:text-black",
                pdpType.micro,
                pdpPressableClass,
              )}
            >
              Reply
            </button>
          ) : null}
          <span className={`text-neutral-400 ${pdpType.micro}`}>
            {formatRelativeCommentDate(date)}
          </span>
        </div>
      </div>

      <PdpReviewLikeButton
        initialLikes={likes}
        layout={isReply ? "inline" : "stacked"}
        className={isReply ? "self-start pt-1" : undefined}
      />
    </div>
  );
}

type PdpReviewCommentProps = {
  comment: PdpReviewCommentData;
  variant?: "compact" | "full";
  onReply?: (target: PdpReplyTarget) => void;
  /** Expand nested replies — e.g. after the user posts a reply */
  expandReplies?: boolean;
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

function formatFormalReviewDate(dateLabel: string) {
  if (dateLabel === "now") {
    return "Just now";
  }

  const parsed = new Date(dateLabel);
  if (Number.isNaN(parsed.getTime())) {
    return dateLabel;
  }

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

type FormalReviewCardProps = {
  comment: PdpReviewCommentData;
  variant: "compact" | "full";
};

/** Structured buyer review — title, description, stars, and recommend tags */
function FormalReviewCard({ comment, variant }: FormalReviewCardProps) {
  const [expanded, setExpanded] = useState(false);
  const description = comment.body ?? comment.quote;
  const clampLines = variant === "compact" ? 3 : expanded ? undefined : 5;
  const canExpand =
    variant === "full" && description.length > 160 && !expanded;
  const photo = comment.photos?.find(
    (entry) => !isAnimatedCommentMedia(entry.src),
  );

  return (
    <div className="flex gap-3 py-4">
      <CommentAvatar author={comment.author} />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-1 gap-y-0.5">
              <p className={cn("text-black", pdpType.label)}>{comment.author}</p>
              {comment.verified ? (
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
            <p className={cn("mt-0.5 text-neutral-500", pdpType.micro)}>
              {comment.verified ? "Verified buyer · " : null}
              {formatFormalReviewDate(comment.date)}
            </p>
          </div>

          <PdpReviewLikeButton
            initialLikes={comment.likes}
            layout="stacked"
            className="shrink-0"
          />
        </div>

        {comment.rating != null ? (
          <div className="mt-2">
            <PdpStarRating rating={comment.rating} size={18} />
          </div>
        ) : null}

        <p
          className={cn(
            "mt-2 text-black",
            pdpType.body,
            clampLines === 3 && "line-clamp-3",
            clampLines === 5 && "line-clamp-5",
          )}
        >
          {description}
          {canExpand ? (
            <>
              {" "}
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className={cn("text-neutral-500", pdpPressableClass)}
              >
                Read more
              </button>
            </>
          ) : null}
        </p>

        {comment.recommendTags?.length ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {comment.recommendTags.map((tag) => (
              <span
                key={tag}
                className={cn(
                  "rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-neutral-700",
                  pdpType.micro,
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        {photo ? (
          <PdpParallaxMedia className="relative mt-3 aspect-[4/3] w-full max-w-[220px] bg-neutral-100">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className={cn("object-cover object-center", pdpCarouselImageClass)}
              sizes="220px"
              onLoadingComplete={refreshPdpParallax}
            />
          </PdpParallaxMedia>
        ) : null}
      </div>
    </div>
  );
}

/** Instagram-style comment — username above text, optional reply thread */
export function PdpReviewComment({
  comment,
  variant = "compact",
  onReply,
  expandReplies = false,
}: PdpReviewCommentProps) {
  const [repliesExpanded, setRepliesExpanded] = useState(expandReplies);
  const replies = comment.replies ?? [];
  const hiddenReplyCount = Math.max(replies.length - INITIAL_VISIBLE_REPLIES, 0);
  const visibleReplies = repliesExpanded
    ? replies
    : replies.slice(0, INITIAL_VISIBLE_REPLIES);

  useEffect(() => {
    if (expandReplies) {
      setRepliesExpanded(true);
    }
  }, [expandReplies]);

  const handleReplyToComment = onReply
    ? () =>
        onReply({
          parentCommentId: comment.id,
          replyToAuthor: comment.author,
        })
    : undefined;

  const handleReplyToReply = (reply: PdpReviewReply) =>
    onReply?.({
      parentCommentId: comment.id,
      replyToAuthor: reply.author,
    });

  return (
    <article>
      {isFormalReview(comment) ? (
        <FormalReviewCard comment={comment} variant={variant} />
      ) : (
        <CommentRow
          author={comment.author}
          quote={comment.quote}
          date={comment.date}
          verified={comment.verified}
          likes={comment.likes}
          photos={comment.photos}
          variant={variant}
          onReply={handleReplyToComment}
        />
      )}

      {!isFormalReview(comment) && replies.length > 0 ? (
        <ReplyThread
          footer={
            <>
              {hiddenReplyCount > 0 && !repliesExpanded ? (
                <ReplyThreadAction onClick={() => setRepliesExpanded(true)}>
                  View {hiddenReplyCount} more replies
                </ReplyThreadAction>
              ) : null}

              {repliesExpanded && replies.length > INITIAL_VISIBLE_REPLIES ? (
                <ReplyThreadAction
                  collapsed={false}
                  onClick={() => setRepliesExpanded(false)}
                >
                  Hide replies
                </ReplyThreadAction>
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
                onReply={() => handleReplyToReply(reply)}
              />
            </div>
          ))}
        </ReplyThread>
      ) : null}
    </article>
  );
}

export function mapReviewToComment(
  review: PdpFeaturedReview,
): PdpReviewCommentData {
  return {
    id: review.id,
    quote: review.quote,
    author: review.author,
    date: review.date,
    verified: review.verified,
    photos: review.photos,
    likes: review.likes,
    rating: review.rating,
    title: review.title,
    body: review.body,
    recommendTags: review.recommendTags,
  };
}

export function mapCustomerCommentToData(
  comment: PdpCustomerComment,
  commentReplies: Record<string, PdpReviewReply[]>,
): PdpReviewCommentData {
  return {
    id: comment.id,
    quote: comment.quote,
    author: comment.author,
    date: comment.date,
    verified: comment.verified,
    photos: comment.photos,
    likes: comment.likes,
    replies: commentReplies[comment.id],
  };
}

export function mergeCommentReplies(
  comment: PdpReviewCommentData,
  userReplies: Record<string, PdpReviewReply[]>,
): PdpReviewCommentData {
  const extra = userReplies[comment.id];

  if (!extra?.length) {
    return comment;
  }

  return {
    ...comment,
    replies: [...(comment.replies ?? []), ...extra],
  };
}

export function sortCommentsByLikes(
  comments: PdpReviewCommentData[],
): PdpReviewCommentData[] {
  return [...comments].sort((a, b) => b.likes - a.likes);
}

/** Inline PDP preview — top helpful formal reviews only */
export function curateReviewsPreview(
  reviews: PdpReviewCommentData[],
  limit: number,
): PdpReviewCommentData[] {
  if (limit <= 0) {
    return [];
  }

  const picked: PdpReviewCommentData[] = [];
  const pickedIds = new Set<string>();

  const pick = (review: PdpReviewCommentData | undefined) => {
    if (!review || pickedIds.has(review.id)) {
      return;
    }

    picked.push(review);
    pickedIds.add(review.id);
  };

  pick(
    [...reviews]
      .filter(
        (review) =>
          review.verified &&
          review.photos?.some((photo) => isProductReviewPhoto(photo.src)),
      )
      .sort((a, b) => b.likes - a.likes)[0],
  );

  pick([...reviews].sort((a, b) => b.likes - a.likes)[0]);

  for (const review of sortCommentsByLikes(reviews)) {
    if (picked.length >= limit) {
      break;
    }
    pick(review);
  }

  return picked.slice(0, limit);
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
  onPost?: (text: string, replyTarget?: PdpReplyTarget | null) => void;
  replyTarget?: PdpReplyTarget | null;
  onCancelReply?: () => void;
  className?: string;
  /** Root composer intent — review vs casual comment */
  composerIntent?: "comment" | "review";
  /** Pinned to bottom of a sheet — border-top + safe area padding */
  pinned?: boolean;
  /** iOS keyboard visible — tighten bottom padding */
  keyboardOpen?: boolean;
  /** Keep focus in the field after posting — off when the sheet closes */
  refocusAfterPost?: boolean;
  /** Optional ref for focusing the composer from outside */
  inputRef?: React.RefObject<HTMLInputElement | null>;
};

/** Instagram-style comment composer */
export function PdpReviewCommentBox({
  onPost,
  replyTarget = null,
  onCancelReply,
  className,
  composerIntent = "comment",
  pinned = false,
  keyboardOpen = false,
  refocusAfterPost = true,
  inputRef: externalInputRef,
}: PdpReviewCommentBoxProps) {
  const inputId = useId();
  const localInputRef = useRef<HTMLInputElement>(null);
  const inputRef = externalInputRef ?? localInputRef;
  const [text, setText] = useState("");

  const trimmed = text.trim();
  const canPost = trimmed.length > 0;
  const composerPlaceholder = replyTarget
    ? "Add a reply..."
    : composerIntent === "review"
      ? "Share your review..."
      : "Add a comment...";
  const composerLabel = replyTarget
    ? "Add a reply"
    : composerIntent === "review"
      ? "Write a review"
      : "Add a comment";

  useEffect(() => {
    if (!replyTarget) {
      return;
    }

    setText(`@${replyTarget.replyToAuthor} `);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.scrollIntoView({ block: "nearest", inline: "nearest" });
    });
  }, [replyTarget]);

  const handlePost = () => {
    if (!canPost) {
      return;
    }

    onPost?.(trimmed, replyTarget);
    setText("");
    if (refocusAfterPost) {
      inputRef.current?.focus();
    } else {
      inputRef.current?.blur();
    }
  };

  const handleCancelReply = () => {
    onCancelReply?.();
    setText("");
    inputRef.current?.blur();
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
      {replyTarget ? (
        <div className="mb-2 flex items-center justify-between gap-2 px-1">
          <p className={cn("text-neutral-600", pdpType.micro)}>
            Replying to{" "}
            <span className="font-medium text-black">{replyTarget.replyToAuthor}</span>
          </p>
          <button
            type="button"
            onClick={handleCancelReply}
            aria-label="Cancel reply"
            className={cn(
              "flex size-6 shrink-0 items-center justify-center text-neutral-500 active:text-black",
              pdpPressableClass,
            )}
          >
            <MaterialIcon name="close" size={18} />
          </button>
        </div>
      ) : null}

      <div className="flex items-center gap-2">
        <label htmlFor={inputId} className="sr-only">
          {composerLabel}
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
          placeholder={composerPlaceholder}
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

export function createUserReply(quote: string): PdpReviewReply {
  return {
    id: `user-reply-${Date.now()}`,
    author: "You",
    quote,
    date: "now",
    likes: 0,
  };
}
