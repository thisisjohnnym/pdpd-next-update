"use client";

import { useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { pdpType } from "./pdp-type";
import { cn } from "@/lib/cn";

type PdpReviewLikeButtonProps = {
  initialLikes: number;
};

/** Toggle like on a customer review */
export function PdpReviewLikeButton({ initialLikes }: PdpReviewLikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialLikes);

  const handleToggle = () => {
    setLiked((current) => {
      setCount((value) => (current ? value - 1 : value + 1));
      return !current;
    });
  };

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
      className="inline-flex shrink-0 items-center gap-1 rounded-full py-1 pl-1 pr-2 transition-colors active:bg-neutral-100"
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
        {count}
      </span>
    </button>
  );
}
