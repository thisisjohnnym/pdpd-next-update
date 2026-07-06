"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * v3 floating buy bar handoff (Paper r4 `F5Z-0`).
 *
 * Watches a sentinel at the bottom of the hero block. The docked buy bar lives
 * inside the hero and scrolls away with it; once the sentinel passes above the
 * viewport top, the floating bar should appear. While the hero is still on
 * screen (or below the fold on first paint) the floating bar stays hidden.
 *
 * Returns `false` unless `enabled` — v1/v2 keep their always-on floating bar.
 */
export function useHeroBuyBarVisibility(
  sentinelRef: RefObject<HTMLDivElement | null>,
  enabled: boolean,
): boolean {
  const [heroScrolledAway, setHeroScrolledAway] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!enabled || !sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only "scrolled away" when the sentinel exits past the top — not while
        // it sits below the fold on first paint.
        setHeroScrolledAway(
          !entry.isIntersecting && entry.boundingClientRect.top < 0,
        );
      },
      { threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [enabled, sentinelRef]);

  return enabled && heroScrolledAway;
}
