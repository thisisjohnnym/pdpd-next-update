"use client";

import { useState } from "react";

import { formatLikeCount } from "@/lib/format-like-count";
import { MaterialIcon } from "@/components/icons/material-icon";
import { pdpType, pdpPressableClass } from "./pdp-type";
import { cn } from "@/lib/cn";

type PdpReviewLikeButtonProps = {
  initialLikes: number;
  /** Instagram — heart stacked above like count on the right */
  layout?: "inline" | "stacked";
};

/** Toggle like on a customer review */
export function PdpReviewLikeButton({
  initialLikes,
  layout = "stacked",
}: PdpReviewLikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialLikes);

  const handleToggle = () => {
    setLiked((current) => {
      setCount((value) => (current ? value - 1 : value + 1));
      return !current;
    });
  };

  if (layout === "inline") {
    return (
      <button
        type="button"
        onClick={handleToggle}
        aria-pressed={liked}
        aria-label={
          liked
            ? `Remove like from review, ${count} likes`
            : `Like review, ${count} likes`
        }
        className={cn(
          "inline-flex shrink-0 items-center gap-1 py-1 pl-1 pr-2 transition-colors active:bg-neutral-100",
          pdpPressableClass,
        )}
      >
        <MaterialIcon
          name="favorite"
          size={18}
          filled={liked}
          className={cn(
            "transition-colors duration-200",
            liked ? "text-[#FE2C55]" : "text-neutral-400",
            liked && "animate-heart-pop",
          )}
        />
        <span className={`font-extended text-neutral-600 ${pdpType.micro}`}>
          {formatLikeCount(count)}
        </span>
      </button>
    );
  }

  return (
    <div className="flex w-8 shrink-0 flex-col items-center gap-0.5 pt-0.5">
      <button
        type="button"
        onClick={handleToggle}
        aria-pressed={liked}
        aria-label={
          liked
            ? `Remove like from review, ${count} likes`
            : `Like review, ${count} likes`
        }
        className={cn(
          "flex size-7 items-center justify-center transition-colors active:opacity-70",
          pdpPressableClass,
        )}
      >
        <MaterialIcon
          name="favorite"
          size={18}
          filled={liked}
          className={cn(
            "transition-colors duration-200",
            liked ? "text-[#FE2C55]" : "text-neutral-800",
            liked && "animate-heart-pop",
          )}
        />
      </button>
      {count > 0 ? (
        <span className={`font-extended text-center text-neutral-800 ${pdpType.micro}`}>
          {formatLikeCount(count)}
        </span>
      ) : null}
    </div>
  );
}
