"use client";

import { cn } from "@/lib/cn";

import { useReducedMotion } from "./use-reduced-motion";

const TICK_HEIGHT_PX = 3;
const TICK_DOT_PX = 4;
const TICK_ACTIVE_PX = 24;
const TICK_GAP_PX = 4;

type PdpCarouselDotIndicatorProps = {
  activeIndex: number;
  count: number;
  /** Accessible name for the tablist (e.g. "Detail tile position"). */
  ariaLabel: string;
  /** Horizontal alignment of the tick row within its container. */
  align?: "start" | "center";
  className?: string;
};

/** Pill-to-bar dot pagination for finite snap-start carousel rails. */
export function PdpCarouselDotIndicator({
  activeIndex,
  count,
  ariaLabel,
  align = "center",
  className,
}: PdpCarouselDotIndicatorProps) {
  const reducedMotion = useReducedMotion();

  if (count <= 1) {
    return null;
  }

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "flex",
        align === "start" ? "justify-start" : "justify-center",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none flex"
        style={{
          height: TICK_HEIGHT_PX,
          columnGap: TICK_GAP_PX,
        }}
      >
        {Array.from({ length: count }, (_, index) => {
          const active = index === activeIndex;
          return (
            <span
              key={index}
              className={cn(
                "shrink-0 rounded-full",
                !reducedMotion &&
                  "transition-[width,background-color] duration-300 ease-out",
                active ? "bg-neutral-900" : "bg-neutral-900/30",
              )}
              style={{
                height: TICK_HEIGHT_PX,
                width: active ? TICK_ACTIVE_PX : TICK_DOT_PX,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
