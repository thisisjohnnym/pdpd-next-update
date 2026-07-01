"use client";

import { useState } from "react";

import { formatLikeCount } from "@/lib/format-like-count";
import { MaterialIcon } from "@/components/icons/material-icon";
import { pdpType, pdpPressableClass } from "./pdp-type";
import { PdpIconSwap } from "./pdp-icon-swap";
import { cn } from "@/lib/cn";
import { usePdpVersion } from "./version/pdp-version-context";
import { getPdpVersionConfig } from "./version/pdp-version-config";

type PdpReviewLikeButtonProps = {
  initialLikes: number;
  /** Instagram — heart stacked above like count on the right */
  layout?: "inline" | "stacked";
  className?: string;
};

/** Toggle like on a customer review — hidden when the version disables review likes */
export function PdpReviewLikeButton({
  initialLikes,
  layout = "stacked",
  className,
}: PdpReviewLikeButtonProps) {
  const { showReviewLikes } = getPdpVersionConfig(usePdpVersion());
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialLikes);

  if (!showReviewLikes) {
    return null;
  }

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
            ? `Remove like from comment, ${count} likes`
            : `Like comment, ${count} likes`
        }
        className={cn(
          "inline-flex shrink-0 items-center gap-1 py-1 pl-1 pr-2 transition-colors active:bg-neutral-100",
          pdpPressableClass,
          className,
        )}
      >
        <PdpIconSwap
          active={liked}
          activeIcon={
            <MaterialIcon
              name="favorite"
              size={18}
              filled
              className="text-[#FE2C55] motion-safe:animate-heart-pop"
            />
          }
          inactiveIcon={
            <MaterialIcon
              name="favorite"
              size={18}
              className="text-neutral-400"
            />
          }
        />
        <span className={`font-extended text-neutral-600 ${pdpType.micro}`}>
          {formatLikeCount(count)}
        </span>
      </button>
    );
  }

  return (
    <div
      className={cn(
        "flex w-8 shrink-0 flex-col items-center gap-0.5 pt-0.5",
        className,
      )}
    >
      <button
        type="button"
        onClick={handleToggle}
        aria-pressed={liked}
        aria-label={
          liked
            ? `Remove like from comment, ${count} likes`
            : `Like comment, ${count} likes`
        }
        className={cn(
          "flex size-7 items-center justify-center transition-colors active:opacity-70",
          pdpPressableClass,
        )}
      >
        <PdpIconSwap
          active={liked}
          activeIcon={
            <MaterialIcon
              name="favorite"
              size={18}
              filled
              className="text-[#FE2C55] motion-safe:animate-heart-pop"
            />
          }
          inactiveIcon={
            <MaterialIcon
              name="favorite"
              size={18}
              className="text-neutral-800"
            />
          }
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
