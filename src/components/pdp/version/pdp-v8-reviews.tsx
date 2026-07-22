"use client";

import { useId, useRef } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import {
  PDP_CUSTOMER_REVIEWS,
  PDP_REVIEWS_AI_SUMMARY,
  PDP_REVIEWS_SUMMARY,
} from "../pdp-data";
import {
  pdpCarouselScrollClass,
  pdpCarouselScrollWrapClass,
} from "../pdp-carousel";
import { PdpExpandableText } from "../pdp-expandable-text";
import {
  pdpPressableClass,
  pdpType,
} from "../pdp-type";
import { useDragToScroll } from "../use-infinite-centered-carousel";

/**
 * v8 land review teaser — DoorDash-style horizontal carousel
 * (rating gauge + AI highlights + review cards).
 * Gated by `useCarouselReviews`; earlier versions keep `PdpV5ReviewTeaser`.
 */

const REVIEW_CARDS = PDP_CUSTOMER_REVIEWS.slice(0, 5);

const AVATAR_PALETTE = [
  "#5B7A6A",
  "#6B5B73",
  "#7A6B52",
  "#4F6B7A",
  "#7A5B5B",
] as const;

function avatarColor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash + seed.charCodeAt(i) * (i + 1)) % AVATAR_PALETTE.length;
  }
  return AVATAR_PALETTE[hash] ?? AVATAR_PALETTE[0];
}

function formatLikeCount(likes: number) {
  if (likes >= 1_000_000) return `${(likes / 1_000_000).toFixed(1)}M`;
  if (likes >= 1_000) return `${Math.round(likes / 1_000)}K`;
  return String(likes);
}

function RatingGaugeCard({
  average,
  onOpen,
}: {
  average: number;
  onOpen?: () => void;
}) {
  const gradientId = useId();
  const size = 96;
  const stroke = 6;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(average / 5, 0), 1);
  const dashOffset = circumference * (1 - progress);

  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "pdp-v8-review-card pdp-v8-review-card--rating flex shrink-0 snap-start flex-col items-center justify-center gap-2",
        pdpPressableClass,
      )}
      aria-label={`${average.toFixed(1)} out of 5 stars`}
    >
      <div className="relative flex size-24 items-center justify-center">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
          aria-hidden
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5C84C" />
              <stop offset="100%" stopColor="#E89A2E" />
            </linearGradient>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#E8E8E8"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <span className="font-extended text-2xl font-normal leading-none tracking-tight text-black tabular-nums">
            {average.toFixed(1)}
          </span>
          <MaterialIcon
            name="star"
            size={14}
            filled
            className="text-[#E8A317]"
            aria-hidden
          />
        </div>
      </div>
      <p className={cn(pdpType.micro, "m-0 text-neutral-500")}>of 5 stars</p>
    </button>
  );
}

function HighlightsCard({
  body,
  onOpen,
}: {
  body: string;
  onOpen?: () => void;
}) {
  return (
    <div className="pdp-v8-review-card pdp-v8-review-card--highlights flex shrink-0 snap-start flex-col gap-2.5">
      <div className="flex items-center gap-1.5">
        <MaterialIcon
          name="auto_awesome"
          size={16}
          className="shrink-0 text-[#C45C26]"
          aria-hidden
        />
        <h3 className={cn(pdpType.body, "m-0 font-normal text-black")}>
          Review highlights
        </h3>
      </div>
      <div className="min-h-0 flex-1">
        <PdpExpandableText
          text={body}
          clampLines={4}
          moreLabel="see more"
          lessLabel="see less"
          className={cn(pdpType.label, "m-0 text-pretty text-neutral-700")}
        />
      </div>
      <button
        type="button"
        onClick={onOpen}
        className={cn(
          pdpType.micro,
          "m-0 self-start text-left text-neutral-400 italic",
          pdpPressableClass,
        )}
      >
        AI-generated based on reviews
      </button>
    </div>
  );
}

function ReviewSnippetCard({
  review,
  onOpen,
}: {
  review: (typeof PDP_CUSTOMER_REVIEWS)[number];
  onOpen?: () => void;
}) {
  const initial = review.author.trim().charAt(0).toUpperCase() || "?";
  const color = avatarColor(review.author);

  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "pdp-v8-review-card pdp-v8-review-card--snippet flex shrink-0 snap-start flex-col gap-2.5 text-left",
        pdpPressableClass,
      )}
      aria-label={`Review by ${review.author}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className="flex size-8 items-center justify-center rounded-full text-xs font-medium text-white"
          style={{ backgroundColor: color }}
          aria-hidden
        >
          {initial}
        </span>
        {typeof review.likes === "number" ? (
          <span className="flex items-center gap-1 text-neutral-500">
            <MaterialIcon
              name="favorite"
              size={16}
              className="text-neutral-400"
              aria-hidden
            />
            <span className={cn(pdpType.micro, "tabular-nums")}>
              {formatLikeCount(review.likes)}
            </span>
          </span>
        ) : (
          <MaterialIcon
            name="favorite"
            size={16}
            className="text-neutral-300"
            aria-hidden
          />
        )}
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-1">
        <p className={cn(pdpType.body, "m-0 line-clamp-1 text-black")}>
          {review.title}
        </p>
        <p
          className={cn(
            pdpType.label,
            "m-0 line-clamp-4 text-pretty text-neutral-600",
          )}
        >
          {review.body}
        </p>
      </div>
      <p className={cn(pdpType.micro, "m-0 text-neutral-400")}>
        {review.author}
        {review.verified ? " · Verified" : null}
      </p>
    </button>
  );
}

type PdpV8ReviewsProps = {
  className?: string;
  onReadAll?: () => void;
};

/** Land teaser carousel — replaces `PdpV5ReviewTeaser` on `/v8`. */
export function PdpV8Reviews({
  className,
  onReadAll,
}: PdpV8ReviewsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  useDragToScroll(scrollRef);

  const { average, count } = PDP_REVIEWS_SUMMARY;
  const { body: aiBody } = PDP_REVIEWS_AI_SUMMARY;

  return (
    <div className={cn("flex w-full flex-col gap-3 text-left", className)}>
      <div className="flex w-full items-start justify-between gap-3 px-0">
        <div className="flex min-w-0 flex-col gap-0.5">
          <h2 className={cn(pdpType.body, "m-0 text-black")}>Reviews</h2>
          <p className={cn(pdpType.micro, "m-0 text-neutral-500")}>
            {count} Ratings · {count} public reviews
          </p>
        </div>
      </div>

      <div className={cn(pdpCarouselScrollWrapClass, "pdp-v8-review-teaser-rail")}>
        <div
          ref={scrollRef}
          className={cn(
            pdpCarouselScrollClass,
            "pdp-carousel-draggable flex items-stretch gap-2.5 pb-0",
          )}
          aria-label={`${average.toFixed(1)} star reviews carousel`}
        >
          <RatingGaugeCard average={average} onOpen={onReadAll} />
          <HighlightsCard body={aiBody} onOpen={onReadAll} />
          {REVIEW_CARDS.map((review) => (
            <ReviewSnippetCard
              key={review.id}
              review={review}
              onOpen={onReadAll}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
