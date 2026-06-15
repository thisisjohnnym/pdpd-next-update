"use client";

import { useLayoutEffect, type RefObject } from "react";

import { ensureGsapPlugins, gsap, prefersReducedMotion } from "./pdp-gsap";

type UseAtbShimmerOptions = {
  enabled?: boolean;
};

const SHIMMER_SWEEP_S = 0.88;
const SHIMMER_GAP_MIN_S = 6;
const SHIMMER_GAP_RANGE_S = 7;
const SHIMMER_INITIAL_DELAY_S = 2.2;

/** Occasional animated light sweep across the Add to bag CTA */
export function useAtbShimmer(
  buttonRef: RefObject<HTMLButtonElement | null>,
  shimmerRef: RefObject<HTMLSpanElement | null>,
  { enabled = true }: UseAtbShimmerOptions = {},
) {
  useLayoutEffect(() => {
    if (!enabled || prefersReducedMotion()) {
      return;
    }

    const button = buttonRef.current;
    const shimmer = shimmerRef.current;
    if (!button || !shimmer) {
      return;
    }

    ensureGsapPlugins();

    let gapCall: gsap.core.Tween | null = null;
    let sweepTween: gsap.core.Tween | null = null;

    const hideShimmer = () => {
      gsap.set(shimmer, { x: 0, opacity: 0, force3D: true });
    };

    const runShimmer = () => {
      const buttonWidth = button.offsetWidth;
      const shimmerWidth = shimmer.offsetWidth;
      const startX = -shimmerWidth * 1.1;
      const endX = buttonWidth + shimmerWidth * 0.15;

      sweepTween?.kill();
      hideShimmer();

      sweepTween = gsap.fromTo(
        shimmer,
        { x: startX, opacity: 0 },
        {
          x: endX,
          opacity: 0.75,
          duration: SHIMMER_SWEEP_S,
          ease: "power2.inOut",
          force3D: true,
          onComplete: () => {
            gsap.to(shimmer, {
              opacity: 0,
              duration: 0.14,
              ease: "power1.out",
              onComplete: hideShimmer,
            });
            scheduleNext();
          },
        },
      );
    };

    const scheduleNext = () => {
      gapCall?.kill();
      const gap = SHIMMER_GAP_MIN_S + Math.random() * SHIMMER_GAP_RANGE_S;
      gapCall = gsap.delayedCall(gap, runShimmer);
    };

    hideShimmer();
    gapCall = gsap.delayedCall(SHIMMER_INITIAL_DELAY_S, runShimmer);

    return () => {
      gapCall?.kill();
      sweepTween?.kill();
      gsap.killTweensOf(shimmer);
      hideShimmer();
    };
  }, [buttonRef, shimmerRef, enabled]);
}
