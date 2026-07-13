"use client";

import { cn } from "@/lib/cn";

import { usePdpHeroGallery } from "./pdp-hero-gallery-context";
import { useHeroGalleryIdleVisible } from "./use-hero-gallery-idle-visible";
import { useReducedMotion } from "./use-reduced-motion";

/**
 * Full-bleed hero gallery progress bar — pinned to the gallery's bottom edge so
 * it reads as attached to the top of the white product footer below. A single
 * segment (one slide's width fraction) slides across the full container width as
 * the active slide changes. Replaces the bottom-left tick indicator on v5.
 */
export function PdpHeroGalleryProgressBar({
  visible = true,
}: {
  /** Follows the hero UI chrome scroll fade. */
  visible?: boolean;
}) {
  const { activeIndex, count, surface } = usePdpHeroGallery();
  const reducedMotion = useReducedMotion();
  const idleVisible = useHeroGalleryIdleVisible();
  const chromeAwake = visible && idleVisible;

  if (count <= 1) {
    return null;
  }

  const isDark = surface === "dark";
  const segmentWidthPct = 100 / count;
  const offsetPct = activeIndex * 100;

  return (
    <div
      aria-hidden
      className={cn(
        // `pdp-hero-intro-chrome` — include in fall-in soft UI reveal (v5).
        "pdp-hero-ui-chrome pdp-hero-intro-chrome pdp-video-controls-pop pointer-events-none absolute inset-x-0 bottom-0 z-[39] h-[3px] overflow-hidden",
        "data-[state=closed]:translate-y-0 data-[state=open]:translate-y-0",
        isDark ? "bg-white/25" : "bg-neutral-900/15",
      )}
      data-state={chromeAwake ? "open" : "closed"}
      style={{ visibility: visible ? "visible" : "hidden" }}
    >
      <span
        className={cn(
          "absolute left-0 top-0 h-full",
          !reducedMotion && "transition-transform duration-300 ease-out",
          isDark ? "bg-white" : "bg-neutral-900",
        )}
        style={{
          width: `${segmentWidthPct}%`,
          transform: `translateX(${offsetPct}%)`,
        }}
      />
    </div>
  );
}
