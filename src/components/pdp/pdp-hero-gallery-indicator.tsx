"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/cn";

import { usePdpHeroGallery } from "./pdp-hero-gallery-context";
import { useReducedMotion } from "./use-reduced-motion";

/** Paper `6JV-0` — 2px tall ticks, 4px gap; active tick elongates into a bar */
const TICK_HEIGHT_PX = 2;
const TICK_DOT_PX = 2;
const TICK_ACTIVE_PX = 16;
const TICK_GAP_PX = 4;

/** Cap the visible window — the rail scrolls so the active tick stays in view */
const MAX_VISIBLE = 8;

const CAPPED_WIDTH_PX =
  MAX_VISIBLE * TICK_DOT_PX +
  (MAX_VISIBLE - 1) * TICK_GAP_PX +
  (TICK_ACTIVE_PX - TICK_DOT_PX);

/**
 * Hero gallery slide indicator (docs/pdp-hero-chrome.md).
 *
 * Shows at most {@link MAX_VISIBLE} ticks inside a clipped viewport; the inner
 * rail holds every slide and scrolls so the active tick is always visible — it
 * starts moving before the active tick would reach the last visible slot.
 */
export function PdpHeroGalleryIndicator() {
  const { activeIndex, count, surface } = usePdpHeroGallery();
  const viewportRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const viewport = viewportRef.current;
    const active = activeRef.current;
    if (!viewport || !active || count <= MAX_VISIBLE) {
      return;
    }

    const behavior: ScrollBehavior = reducedMotion ? "auto" : "smooth";
    const left = active.offsetLeft;
    const right = left + active.offsetWidth;

    if (right > viewport.scrollLeft + viewport.clientWidth) {
      viewport.scrollTo({ left: right - viewport.clientWidth, behavior });
    } else if (left < viewport.scrollLeft) {
      viewport.scrollTo({ left, behavior });
    }
  }, [activeIndex, count, reducedMotion]);

  if (count <= 1) {
    return null;
  }

  const isDark = surface === "dark";
  const capped = count > MAX_VISIBLE;

  return (
    <div
      ref={viewportRef}
      aria-hidden
      className="pointer-events-none flex overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      style={{
        height: TICK_HEIGHT_PX,
        columnGap: TICK_GAP_PX,
        width: capped ? CAPPED_WIDTH_PX : undefined,
        maxWidth: "100%",
      }}
    >
      {Array.from({ length: count }, (_, index) => {
        const active = index === activeIndex;
        return (
          <span
            key={index}
            ref={active ? activeRef : undefined}
            className={cn(
              "shrink-0 rounded-full",
              !reducedMotion && "transition-[width,background-color] duration-300 ease-out",
              isDark
                ? active
                  ? "bg-white"
                  : "bg-white/40"
                : active
                  ? "bg-neutral-900"
                  : "bg-neutral-900/30",
            )}
            style={{
              height: TICK_HEIGHT_PX,
              width: active ? TICK_ACTIVE_PX : TICK_DOT_PX,
            }}
          />
        );
      })}
    </div>
  );
}
