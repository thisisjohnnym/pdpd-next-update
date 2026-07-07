"use client";

import { cn } from "@/lib/cn";

import { usePdpHeroGallery } from "./pdp-hero-gallery-context";
import { useReducedMotion } from "./use-reduced-motion";
import { getPdpVersionConfig } from "./version/pdp-version-config";
import { usePdpVersion } from "./version/pdp-version-context";

/** Paper `6JV-0` — 2px cross-axis, 4px gap; active tick elongates into a bar */
const TICK_CROSS_PX = 2;
const TICK_DOT_PX = 2;
const TICK_ACTIVE_PX = 16;
const TICK_GAP_PX = 4;

/** v4 (Paper r5 `LZ0-0`) — 3px cross-axis, 4px dot, 24px active bar */
const TICK_CROSS_V4_PX = 3;
const TICK_DOT_V4_PX = 4;
const TICK_ACTIVE_V4_PX = 24;

/** Switch to the compact rail once the per-tick row would feel too long */
const MAX_TICKS = 8;
const COMPACT_TRACK_LENGTH_PX = 56;
const COMPACT_TRACK_LENGTH_V4_PX = 64;
const COMPACT_PILL_LENGTH_PX = 14;
const COMPACT_PILL_LENGTH_V4_PX = 20;

type IndicatorTone = {
  isDark: boolean;
  reducedMotion: boolean;
  tickCross: number;
  tickDot: number;
  tickActive: number;
};

type RailProps = {
  activeIndex: number;
  count: number;
  tone: IndicatorTone;
  vertical: boolean;
  useV4ModuleSpacing: boolean;
};

/**
 * Compact progress rail — fixed-length track with a sliding active pill.
 * Horizontal for carousel; vertical for the v6 snap gallery.
 */
function CompactGalleryRail({
  activeIndex,
  count,
  tone,
  vertical,
  useV4ModuleSpacing,
}: RailProps) {
  const trackLength = useV4ModuleSpacing
    ? COMPACT_TRACK_LENGTH_V4_PX
    : COMPACT_TRACK_LENGTH_PX;
  const pillLength = useV4ModuleSpacing
    ? COMPACT_PILL_LENGTH_V4_PX
    : COMPACT_PILL_LENGTH_PX;
  const maxOffset = trackLength - pillLength;
  const offset = count <= 1 ? 0 : (activeIndex / (count - 1)) * maxOffset;

  if (vertical) {
    return (
      <div
        aria-hidden
        className="pointer-events-none relative shrink-0"
        style={{ width: tone.tickCross, height: trackLength }}
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            tone.isDark ? "bg-white/30" : "bg-neutral-900/20",
          )}
        />
        <span
          className={cn(
            "absolute left-0 rounded-full",
            !tone.reducedMotion &&
              "transition-[bottom,background-color] duration-300 ease-out",
            tone.isDark ? "bg-white" : "bg-neutral-900",
          )}
          style={{
            bottom: offset,
            width: tone.tickCross,
            height: pillLength,
          }}
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className="pointer-events-none relative shrink-0"
      style={{ width: trackLength, height: tone.tickCross }}
    >
      <div
        className={cn(
          "absolute inset-0 rounded-full",
          tone.isDark ? "bg-white/30" : "bg-neutral-900/20",
        )}
      />
      <span
        className={cn(
          "absolute top-0 rounded-full",
          !tone.reducedMotion &&
            "transition-[left,background-color] duration-300 ease-out",
          tone.isDark ? "bg-white" : "bg-neutral-900",
        )}
        style={{
          left: offset,
          width: pillLength,
          height: tone.tickCross,
        }}
      />
    </div>
  );
}

/**
 * Per-tick rail (Paper `6JV-0`) — every slide gets a tick; active tick elongates.
 */
function TickGalleryRail({ activeIndex, count, tone, vertical }: Omit<RailProps, "useV4ModuleSpacing">) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none flex", vertical && "flex-col-reverse items-center")}
      style={
        vertical
          ? {
              width: tone.tickCross,
              rowGap: TICK_GAP_PX,
              maxHeight: "100%",
            }
          : {
              height: tone.tickCross,
              columnGap: TICK_GAP_PX,
              maxWidth: "100%",
            }
      }
    >
      {Array.from({ length: count }, (_, index) => {
        const active = index === activeIndex;
        return (
          <span
            key={index}
            className={cn(
              "shrink-0 rounded-full",
              !tone.reducedMotion &&
                (vertical
                  ? "transition-[height,background-color] duration-300 ease-out"
                  : "transition-[width,background-color] duration-300 ease-out"),
              tone.isDark
                ? active
                  ? "bg-white"
                  : "bg-white/40"
                : active
                  ? "bg-neutral-900"
                  : "bg-neutral-900/30",
            )}
            style={
              vertical
                ? {
                    width: tone.tickCross,
                    height: active ? tone.tickActive : tone.tickDot,
                  }
                : {
                    height: tone.tickCross,
                    width: active ? tone.tickActive : tone.tickDot,
                  }
            }
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
 * length progress rail so 15+ slides do not sprawl. v6 vertical gallery uses
 * the same tokens on a bottom-left column rail.
 */
export function PdpHeroGalleryIndicator() {
  const { activeIndex, count, surface } = usePdpHeroGallery();
  const reducedMotion = useReducedMotion();
  const { useV4ModuleSpacing, heroVerticalGallery } =
    getPdpVersionConfig(usePdpVersion());

  if (count <= 1) {
    return null;
  }

  const tone: IndicatorTone = {
    isDark: surface === "dark",
    reducedMotion,
    tickCross: useV4ModuleSpacing ? TICK_CROSS_V4_PX : TICK_CROSS_PX,
    tickDot: useV4ModuleSpacing ? TICK_DOT_V4_PX : TICK_DOT_PX,
    tickActive: useV4ModuleSpacing ? TICK_ACTIVE_V4_PX : TICK_ACTIVE_PX,
  };

  const railProps: RailProps = {
    activeIndex,
    count,
    tone,
    vertical: heroVerticalGallery,
    useV4ModuleSpacing,
  };

  if (count > MAX_TICKS && useV4ModuleSpacing) {
    return <CompactGalleryRail {...railProps} />;
  }

  return <TickGalleryRail {...railProps} />;
}
