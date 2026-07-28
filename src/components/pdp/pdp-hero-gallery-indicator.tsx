"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/cn";

import { usePdpHeroGallery } from "./pdp-hero-gallery-context";
import { useReducedMotion } from "./use-reduced-motion";
import { getPdpVersionConfig } from "./version/pdp-version-config";
import { usePdpVersion } from "./version/pdp-version-context";

/** Paper `6JV-0` — 2px tall ticks, 4px gap; active tick elongates into a bar */
const TICK_HEIGHT_PX = 2;
const TICK_DOT_PX = 2;
const TICK_ACTIVE_PX = 16;
const TICK_GAP_PX = 4;

/** v4 (Paper r5 `LZ0-0`) — taller 3px ticks, 4px dot, 24px active bar */
const TICK_HEIGHT_V4_PX = 3;
const TICK_DOT_V4_PX = 4;
const TICK_ACTIVE_V4_PX = 24;

/** Switch to the compact rail once the per-tick row would feel too wide */
const MAX_TICKS = 8;
const COMPACT_TRACK_WIDTH_PX = 56;
const COMPACT_TRACK_WIDTH_V4_PX = 64;
const COMPACT_PILL_WIDTH_PX = 14;
const COMPACT_PILL_WIDTH_V4_PX = 20;

type IndicatorTone = {
  isDark: boolean;
  reducedMotion: boolean;
  tickHeight: number;
  tickDot: number;
  tickActive: number;
};

/**
 * Compact progress rail — one fixed-width track with a sliding active pill.
 * Used when the gallery has more slides than we want to render as individual ticks.
 */
function CompactGalleryRail({
  activeIndex,
  count,
  tone,
  useV4ModuleSpacing,
}: {
  activeIndex: number;
  count: number;
  tone: IndicatorTone;
  useV4ModuleSpacing: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const trackWidth = useV4ModuleSpacing
    ? COMPACT_TRACK_WIDTH_V4_PX
    : COMPACT_TRACK_WIDTH_PX;
  const pillWidth = useV4ModuleSpacing
    ? COMPACT_PILL_WIDTH_V4_PX
    : COMPACT_PILL_WIDTH_PX;
  const maxOffset = trackWidth - pillWidth;
  const offset =
    count <= 1 ? 0 : (activeIndex / (count - 1)) * maxOffset;

  // Scrub the pill with gallery scrollLeft so it doesn't wait for snap settle.
  useEffect(() => {
    const root = rootRef.current;
    const pill = pillRef.current;
    if (!root || !pill || count <= 1 || tone.reducedMotion) {
      return;
    }

    const galleryTrack = root
      .closest("[data-hero-section]")
      ?.querySelector<HTMLElement>("[data-hero-gallery-track]");
    if (!galleryTrack) {
      return;
    }

    const apply = () => {
      const width = galleryTrack.clientWidth;
      if (width <= 0) {
        return;
      }
      const raw = galleryTrack.scrollLeft / width;
      const logical = ((raw % count) + count) % count;
      const nextLeft = (logical / (count - 1)) * maxOffset;
      pill.style.left = `${nextLeft}px`;
    };

    const IDLE_FRAMES_BEFORE_STOP = 4;
    let frame = 0;
    let running = false;
    let lastScrollLeft = Number.NaN;
    let idleFrames = 0;

    const tick = () => {
      apply();

      if (galleryTrack.scrollLeft === lastScrollLeft) {
        idleFrames += 1;
      } else {
        idleFrames = 0;
        lastScrollLeft = galleryTrack.scrollLeft;
      }

      if (idleFrames >= IDLE_FRAMES_BEFORE_STOP) {
        running = false;
        frame = 0;
        return;
      }

      frame = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (running) {
        return;
      }
      running = true;
      idleFrames = 0;
      lastScrollLeft = Number.NaN;
      frame = requestAnimationFrame(tick);
    };

    apply();
    galleryTrack.addEventListener("scroll", startLoop, { passive: true });
    galleryTrack.addEventListener("touchstart", startLoop, { passive: true });

    return () => {
      galleryTrack.removeEventListener("scroll", startLoop);
      galleryTrack.removeEventListener("touchstart", startLoop);
      if (frame) {
        cancelAnimationFrame(frame);
      }
    };
  }, [count, maxOffset, tone.reducedMotion, activeIndex]);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none relative shrink-0"
      style={{ width: trackWidth, height: tone.tickHeight }}
    >
      <div
        className={cn(
          "absolute inset-0 rounded-full",
          tone.isDark ? "bg-white/30" : "bg-neutral-900/20",
        )}
      />
      <span
        ref={pillRef}
        className={cn(
          "absolute top-0 rounded-full will-change-[left]",
          tone.isDark ? "bg-white" : "bg-neutral-900",
        )}
        style={{
          left: offset,
          width: pillWidth,
          height: tone.tickHeight,
        }}
      />
    </div>
  );
}

/**
 * Per-tick row (Paper `6JV-0`) — used for shorter galleries where every tick fits.
 */
function TickGalleryRail({
  activeIndex,
  count,
  tone,
}: {
  activeIndex: number;
  count: number;
  tone: IndicatorTone;
}) {
  return (
    <div
      aria-hidden
      className="pointer-events-none flex"
      style={{
        height: tone.tickHeight,
        columnGap: TICK_GAP_PX,
        maxWidth: "100%",
      }}
    >
      {Array.from({ length: count }, (_, index) => {
        const active = index === activeIndex;
        return (
          <span
            key={index}
            className={cn(
              "shrink-0 rounded-full",
              !tone.reducedMotion &&
                "transition-[width,background-color] duration-150 ease-out",
              tone.isDark
                ? active
                  ? "bg-white"
                  : "bg-white/40"
                : active
                  ? "bg-neutral-900"
                  : "bg-neutral-900/30",
            )}
            style={{
              height: tone.tickHeight,
              width: active ? tone.tickActive : tone.tickDot,
            }}
          />
        );
      })}
    </div>
  );
}

/**
 * Hero gallery slide indicator (docs/pdp-hero-chrome.md).
 *
 * Short galleries render Paper `6JV-0` ticks. Long galleries switch to a fixed-
 * width progress rail so 15+ slides do not sprawl across the hero chrome.
 */
export function PdpHeroGalleryIndicator() {
  const { activeIndex, count, surface } = usePdpHeroGallery();
  const reducedMotion = useReducedMotion();
  const { useV4ModuleSpacing } = getPdpVersionConfig(usePdpVersion());

  if (count <= 1) {
    return null;
  }

  const tone: IndicatorTone = {
    isDark: surface === "dark",
    reducedMotion,
    tickHeight: useV4ModuleSpacing ? TICK_HEIGHT_V4_PX : TICK_HEIGHT_PX,
    tickDot: useV4ModuleSpacing ? TICK_DOT_V4_PX : TICK_DOT_PX,
    tickActive: useV4ModuleSpacing ? TICK_ACTIVE_V4_PX : TICK_ACTIVE_PX,
  };

  if (count > MAX_TICKS && useV4ModuleSpacing) {
    return (
      <CompactGalleryRail
        activeIndex={activeIndex}
        count={count}
        tone={tone}
        useV4ModuleSpacing={useV4ModuleSpacing}
      />
    );
  }

  return (
    <TickGalleryRail
      activeIndex={activeIndex}
      count={count}
      tone={tone}
    />
  );
}
