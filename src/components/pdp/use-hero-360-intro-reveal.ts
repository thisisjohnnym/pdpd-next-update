"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";

import { useHero360Intro } from "./pdp-hero-360-intro-context";
import { useReducedMotion } from "./use-reduced-motion";

gsap.registerPlugin(useGSAP);

/** Softer than the old post-spin land — ad-vibe fade while the fall continues. */
const REVEAL_LIFT_PX = 8;
/** Scaled with intro `playbackRate` 1.5 so chrome keeps pace with the faster fall. */
const REVEAL_STAGGER_S = 0.08;
const REVEAL_DURATION_S = 0.5;

function collectIntroChrome(root: HTMLElement): HTMLElement[] {
  const seen = new Set<HTMLElement>();
  const add = (nodes: NodeListOf<HTMLElement>) => {
    for (const node of nodes) {
      seen.add(node);
    }
  };

  add(root.querySelectorAll<HTMLElement>(".pdp-hero-intro-chrome"));
  add(
    document.querySelectorAll<HTMLElement>(
      "[data-header-chrome], [data-floating-cta-bar]",
    ),
  );

  return [...seen];
}

function isFloatingCtaBar(el: HTMLElement): boolean {
  return el.hasAttribute("data-floating-cta-bar");
}

/**
 * Fixed bottom CTA must not keep a GSAP `transform` — on iOS Safari a
 * transformed `position: fixed` layer jitters with the URL/toolbar chrome.
 */
function clearFixedChromeTransforms(targets: HTMLElement[]) {
  const fixed = targets.filter(isFloatingCtaBar);
  if (fixed.length > 0) {
    gsap.set(fixed, { clearProps: "transform" });
  }
}

/**
 * GSAP stagger for v6 hero chrome — soft mid-clip cue (media ~1.2s), not end-of-video.
 * Opacity + translateY only — no `filter: blur` (that forces paint layers over the
 * playing video and tanks decode FPS on mobile).
 * Floating CTA: opacity only (no Y) so the fixed dock stays transform-free.
 */
export function useHero360IntroReveal(rootRef: React.RefObject<HTMLElement | null>) {
  const { enabled, phase, onRevealComplete } = useHero360Intro();
  const reducedMotion = useReducedMotion();
  const completedRef = useRef(false);

  // Keep chrome at opacity 0 through `playing` and the first paint of `revealing`
  // so lifting the CSS hide rule never flashes full UI for a frame.
  // If intro is skipped (v5 desktop / reduced motion) phase jumps to `ready`
  // without a reveal — restore any GSAP opacity:0 from the brief playing frame.
  // fallow-ignore-next-line complexity
  useLayoutEffect(() => {
    if (!enabled || completedRef.current) {
      return;
    }
    const root = rootRef.current;
    if (!root) {
      return;
    }
    const targets = collectIntroChrome(root);
    const floating = targets.filter(isFloatingCtaBar);
    const lifted = targets.filter((el) => !isFloatingCtaBar(el));

    if (phase === "ready" || reducedMotion) {
      gsap.set(targets, { opacity: 1, y: 0 });
      clearFixedChromeTransforms(targets);
      completedRef.current = true;
      return;
    }
    if (phase !== "playing" && phase !== "revealing") {
      return;
    }
    gsap.set(lifted, { opacity: 0, y: REVEAL_LIFT_PX });
    // Opacity only on the fixed ATB — never park a translate on it.
    gsap.set(floating, { opacity: 0, y: 0, clearProps: "transform" });
  }, [enabled, phase, reducedMotion, rootRef]);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !enabled || phase !== "revealing" || completedRef.current) {
        return;
      }

      const targets = collectIntroChrome(root);
      const floating = targets.filter(isFloatingCtaBar);
      const lifted = targets.filter((el) => !isFloatingCtaBar(el));

      if (targets.length === 0) {
        completedRef.current = true;
        onRevealComplete();
        return;
      }

      if (reducedMotion) {
        gsap.set(targets, { opacity: 1, y: 0 });
        clearFixedChromeTransforms(targets);
        completedRef.current = true;
        onRevealComplete();
        return;
      }

      gsap.set(lifted, { opacity: 0, y: REVEAL_LIFT_PX });
      gsap.set(floating, { opacity: 0, clearProps: "transform" });

      const tl = gsap.timeline({
        onComplete: () => {
          clearFixedChromeTransforms(targets);
          completedRef.current = true;
          onRevealComplete();
        },
      });

      if (lifted.length > 0) {
        tl.to(
          lifted,
          {
            opacity: 1,
            y: 0,
            duration: REVEAL_DURATION_S,
            stagger: REVEAL_STAGGER_S,
            ease: "power2.out",
          },
          0,
        );
      }

      if (floating.length > 0) {
        tl.to(
          floating,
          {
            opacity: 1,
            duration: REVEAL_DURATION_S,
            stagger: REVEAL_STAGGER_S,
            ease: "power2.out",
          },
          0,
        );
      }
    },
    { dependencies: [enabled, phase, reducedMotion, onRevealComplete], scope: rootRef },
  );
}
