"use client";

import { useEffect, useRef, useState } from "react";

/** Tracks which slide is most visible in a vertical snap hero gallery. */
export function useVerticalHeroGallery(
  trackRef: React.RefObject<HTMLDivElement | null>,
  slideCount: number,
) {
  const [activeIndex, setActiveIndex] = useState(0);
  const ratiosRef = useRef<Map<number, number>>(new Map());

  useEffect(() => {
    const track = trackRef.current;
    if (!track || slideCount <= 0) {
      return;
    }

    const slides = track.querySelectorAll<HTMLElement>("[data-hero-vertical-slide]");
    if (slides.length === 0) {
      return;
    }

    ratiosRef.current = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const index = Number(
            (entry.target as HTMLElement).dataset.heroVerticalSlideIndex,
          );
          if (Number.isNaN(index)) {
            continue;
          }
          ratiosRef.current.set(index, entry.intersectionRatio);
        }

        let bestIndex = 0;
        let bestRatio = -1;
        for (const [index, ratio] of ratiosRef.current) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestIndex = index;
          }
        }

        setActiveIndex(bestIndex);
      },
      {
        root: track,
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    for (const slide of slides) {
      observer.observe(slide);
    }

    return () => {
      observer.disconnect();
    };
  }, [trackRef, slideCount]);

  return { activeIndex: Math.min(activeIndex, Math.max(slideCount - 1, 0)) };
}
