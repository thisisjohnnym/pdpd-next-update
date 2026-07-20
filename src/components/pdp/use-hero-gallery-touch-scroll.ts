"use client";

import { useEffect, type RefObject } from "react";

/** Movement before locking to an axis — matches pull-to-reveal dominance. */
const AXIS_LOCK_PX = 8;

function resolvePanAxis(
  startX: number,
  startY: number,
  x: number,
  y: number,
): "x" | "y" | null {
  const dx = Math.abs(x - startX);
  const dy = Math.abs(y - startY);
  if (dx < AXIS_LOCK_PX && dy < AXIS_LOCK_PX) {
    return null;
  }
  return dx > dy ? "x" : "y";
}

/**
 * iOS/WebKit: a full-bleed `overflow-x: auto` + `overflow-y: hidden` track can
 * claim vertical pans and do nothing with them, so the page won't scroll until
 * the user has paged the carousel horizontally once. Once the gesture locks
 * vertical, scroll the document ourselves and prevent the track from eating it.
 * Horizontal locks leave native snap scrolling alone.
 */
export function useHeroGalleryTouchScrollPassthrough(
  trackRef: RefObject<HTMLDivElement | null>,
) {
  useEffect(() => {
    const el = trackRef.current;
    if (!el) {
      return;
    }

    let startX = 0;
    let startY = 0;
    let lastY = 0;
    let axis: "x" | "y" | null = null;

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) {
        axis = null;
        return;
      }
      const touch = event.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      lastY = touch.clientY;
      axis = null;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length !== 1) {
        return;
      }
      const { clientX: x, clientY: y } = event.touches[0];
      axis ??= resolvePanAxis(startX, startY, x, y);
      if (axis !== "y") {
        return;
      }
      window.scrollBy(0, -(y - lastY));
      lastY = y;
      event.preventDefault();
    };

    const onTouchEnd = () => {
      axis = null;
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("touchcancel", onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [trackRef]);
}
