"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

/** Mount children one viewport before they enter the scrollport */
export function useLazyNearView(
  ref: RefObject<HTMLElement | null>,
  enabled: boolean,
): boolean {
  const [nearView, setNearView] = useState(() => !enabled);

  useLayoutEffect(() => {
    if (!enabled || nearView) {
      return;
    }

    const node = ref.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearView(true);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px 150% 0px" },
    );

    observer.observe(node);

    // IntersectionObserver only calls back when the ratio crosses a
    // threshold. An instant/jump scroll (End key, anchor links,
    // viewport-resize scroll snaps) can skip a section clean over its
    // trigger zone in a single frame, so the ratio stays at 0 the whole
    // time and the observer never fires again — the section is stranded
    // as an empty placeholder forever. Catch that directly: if it's
    // already fully above the viewport, mount it now.
    let rafId = 0;
    const checkSkippedPast = () => {
      rafId = 0;
      if (node.getBoundingClientRect().bottom <= 0) {
        setNearView(true);
      }
    };
    const onScrollOrResize = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(checkSkippedPast);
      }
    };
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [enabled, nearView, ref]);

  return nearView;
}
