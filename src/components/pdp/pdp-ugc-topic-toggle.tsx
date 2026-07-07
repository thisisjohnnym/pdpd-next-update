"use client";

import { cn } from "@/lib/cn";

import { pdpType } from "./pdp-type";
import {
  PDP_UGC_WILD_TOPICS,
  type PdpUgcWildTopicId,
} from "./version/pdp-data-v2";

/** Lifestyle topic switch — v5 Out in the wild strip + sheet. */
export function PdpUgcTopicToggle({
  value,
  onChange,
  className,
  tone = "light",
}: {
  value: PdpUgcWildTopicId;
  onChange: (topicId: PdpUgcWildTopicId) => void;
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <div
      role="tablist"
      aria-label="Community topics"
      className={cn("flex flex-wrap gap-x-4 gap-y-2", className)}
    >
      {PDP_UGC_WILD_TOPICS.map((topic) => {
        const active = value === topic.id;

        return (
          <button
            key={topic.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(topic.id)}
            className={cn(
              "font-extended m-0 border-0 bg-transparent p-0 transition-colors",
              pdpType.label,
              tone === "dark"
                ? active
                  ? "text-white underline decoration-white underline-offset-[3px]"
                  : "text-white/50 active:text-white/75"
                : active
                  ? "text-black underline decoration-black underline-offset-[3px]"
                  : "text-neutral-400 active:text-neutral-600",
            )}
          >
            {topic.label}
          </button>
        );
      })}
    </div>
  );
}
