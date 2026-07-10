"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";

import { useHero360Intro } from "./pdp-hero-360-intro-context";
import { useReducedMotion } from "./use-reduced-motion";

gsap.registerPlugin(useGSAP);

/** Softer than the old post-spin land — ad-vibe fade while the fall continues. */
const REVEAL_LIFT_PX = 8;
const REVEAL_STAGGER_S = 0.12;
const REVEAL_DURATION_S = 0.7;

function collectIntroChrome(root: HTMLElement): HTMLElement[] {
  return [
    ...root.querySelectorAll<HTMLElement>(".pdp-hero-intro-chrome"),
    // Header can stream outside the layout version wrapper.
    ...document.querySelectorAll<HTMLElement>("[data-header-chrome]"),
  ];
}

/**
 * GSAP stagger for v6 hero chrome — soft mid-clip cue (~1.2s), not end-of-video.
 * Opacity + translateY only — no `filter: blur` (that forces paint layers over the
 * playing video and tanks decode FPS on mobile).
 */
export function useHero360IntroReveal(rootRef: React.RefObject<HTMLElement | null>) {
  const { enabled, phase, onRevealComplete } = useHero360Intro();
  const reducedMotion = useReducedMotion();
  const completedRef = useRef(false);

  // Keep chrome at opacity 0 through `playing` and the first paint of `revealing`
  // so lifting the CSS hide rule never flashes full UI for a frame.
  // If intro is skipped (v5 desktop / reduced motion) phase jumps to `ready`
  // without a reveal — restore any GSAP opacity:0 from the brief playing frame.
  useLayoutEffect(() => {
    if (!enabled || completedRef.current) {
      return;
    }
    const root = rootRef.current;
    if (!root) {
      return;
    }
    if (phase === "ready" || reducedMotion) {
      gsap.set(collectIntroChrome(root), { opacity: 1, y: 0 });
      completedRef.current = true;
      return;
    }
    if (phase !== "playing" && phase !== "revealing") {
      return;
    }
    gsap.set(collectIntroChrome(root), { opacity: 0, y: REVEAL_LIFT_PX });
  }, [enabled, phase, reducedMotion, rootRef]);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !enabled || phase !== "revealing" || completedRef.current) {
        return;
      }

      const targets = collectIntroChrome(root);

      if (targets.length === 0) {
        completedRef.current = true;
        onRevealComplete();
        return;
      }

      if (reducedMotion) {
        gsap.set(targets, { opacity: 1, y: 0 });
        completedRef.current = true;
        onRevealComplete();
        return;
      }

      gsap.set(targets, { opacity: 0, y: REVEAL_LIFT_PX });

      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: REVEAL_DURATION_S,
        stagger: REVEAL_STAGGER_S,
        ease: "power2.out",
        onComplete: () => {
          completedRef.current = true;
          onRevealComplete();
        },
      });
    },
    { dependencies: [enabled, phase, reducedMotion, onRevealComplete], scope: rootRef },
  );
}
