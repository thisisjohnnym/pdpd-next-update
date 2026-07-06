"use client";

import { useEffect, useRef, useState } from "react";

/** Prefetch band below the viewport — mirrors the observer rootMargin. */
const LAZY_PREFETCH_VP_RATIO = 1.5;

function shouldMountLazySection(node: HTMLElement): boolean {
  const rect = node.getBoundingClientRect();
  const vh = window.innerHeight;
  const prefetchBelow = vh * LAZY_PREFETCH_VP_RATIO;

  // Any pixel visible, fully scrolled past, or inside the prefetch band.
  return (
    (rect.top < vh && rect.bottom > 0) ||
    rect.bottom <= 0 ||
    rect.top < vh + prefetchBelow
  );
}

/** Mount children one viewport before they enter the scrollport */
export function useLazyNearView(
  node: HTMLElement | null,
  enabled: boolean,
): boolean {
  const [nearView, setNearView] = useState(() => !enabled);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!enabled || nearView || !node) {
      return;
    }

    const mountNow = () => {
      if (mountedRef.current) {
        return;
      }
      mountedRef.current = true;
      setNearView(true);
    };

    if (shouldMountLazySection(node)) {
      mountNow();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          mountNow();
          observer.disconnect();
        }
      },
      {
        threshold: 0,
        rootMargin: `0px 0px ${LAZY_PREFETCH_VP_RATIO * 100}% 0px`,
      },
    );

    observer.observe(node);

    // IntersectionObserver only calls back when the ratio crosses a
    // threshold. Fast scrolls and layout shifts can skip the trigger
    // zone in a single frame — poll on scroll/resize as a safety net.
    let rafId = 0;
    const checkShouldMount = () => {
      rafId = 0;
      if (shouldMountLazySection(node)) {
        mountNow();
        observer.disconnect();
      }
    };
    const onScrollOrResize = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(checkShouldMount);
      }
    };

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    document.documentElement.addEventListener("scroll", onScrollOrResize, {
      passive: true,
    });
    window.addEventListener("resize", onScrollOrResize);
    checkShouldMount();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScrollOrResize);
      document.documentElement.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [enabled, nearView, node]);

  return nearView;
}
