"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/cn";

import { usePdpHeroGallery } from "./pdp-hero-gallery-context";

/**
 * Full-bleed hero gallery progress bar — pinned to the gallery's bottom edge so
 * it reads as attached to the top of the white product footer below. A single
 * segment (one slide's width fraction) slides across the full container width as
 * the gallery scrolls. Replaces the bottom-left tick indicator on v5.
 *
 * Transform is driven imperatively from the track's scrollLeft so the fill
 * rides with the finger (and iOS momentum) — no settle-wait, no CSS ease lag.
 *
 * Always visible while the hero chrome is in view (does not idle-fade with the
 * category rail / video controls).
 */
export function PdpHeroGalleryProgressBar({
  visible = true,
}: {
  /** Follows the hero UI chrome scroll fade. */
  visible?: boolean;
}) {
  const { activeIndex, count, surface } = usePdpHeroGallery();
  const rootRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const fill = fillRef.current;
    if (!root || !fill || count <= 1) {
      return;
    }

    const track = root
      .closest("[data-hero-section]")
      ?.querySelector<HTMLElement>("[data-hero-gallery-track]");
    if (!track) {
      return;
    }

    const apply = () => {
      const width = track.clientWidth;
      if (width <= 0) {
        return;
      }
      const raw = track.scrollLeft / width;
      const logical = ((raw % count) + count) % count;
      fill.style.transform = `translateX(${logical * 100}%)`;
    };

    // iOS fires `scroll` sparsely during momentum — keep a short rAF loop so
    // the bar stays glued to scrollLeft until the rail rests.
    const IDLE_FRAMES_BEFORE_STOP = 4;
    let frame = 0;
    let running = false;
    let lastScrollLeft = Number.NaN;
    let idleFrames = 0;

    const tick = () => {
      apply();

      if (track.scrollLeft === lastScrollLeft) {
        idleFrames += 1;
      } else {
        idleFrames = 0;
        lastScrollLeft = track.scrollLeft;
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
    track.addEventListener("scroll", startLoop, { passive: true });
    track.addEventListener("touchstart", startLoop, { passive: true });

    const ro = new ResizeObserver(() => {
      apply();
    });
    ro.observe(track);

    return () => {
      track.removeEventListener("scroll", startLoop);
      track.removeEventListener("touchstart", startLoop);
      ro.disconnect();
      if (frame) {
        cancelAnimationFrame(frame);
      }
    };
  }, [count, activeIndex]);

  if (count <= 1) {
    return null;
  }

  const isDark = surface === "dark";
  const segmentWidthPct = 100 / count;

  return (
    <div
      ref={rootRef}
      aria-hidden
      className={cn(
        "pdp-hero-ui-chrome pointer-events-none absolute inset-x-0 bottom-0 z-[39] h-[3px] overflow-hidden",
        isDark ? "bg-white/25" : "bg-neutral-900/15",
      )}
      style={{ visibility: visible ? "visible" : "hidden" }}
    >
      <span
        ref={fillRef}
        className={cn(
          "absolute left-0 top-0 h-full will-change-transform",
          isDark ? "bg-white" : "bg-neutral-900",
        )}
        style={{
          width: `${segmentWidthPct}%`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />
    </div>
  );
}
