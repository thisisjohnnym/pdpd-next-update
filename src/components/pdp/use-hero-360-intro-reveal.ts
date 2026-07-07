"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

import { useHero360Intro } from "./pdp-hero-360-intro-context";
import { useReducedMotion } from "./use-reduced-motion";

gsap.registerPlugin(useGSAP);

const REVEAL_LIFT_PX = 10;
const REVEAL_STAGGER_S = 0.1;
const REVEAL_DURATION_S = 0.55;

/**
 * GSAP stagger for v6 hero chrome after the 360 intro settles on a0.
 * Targets `.pdp-hero-intro-chrome` inside the hero shell + overlay header.
 */
export function useHero360IntroReveal(rootRef: React.RefObject<HTMLElement | null>) {
  const { enabled, phase, onRevealComplete } = useHero360Intro();
  const reducedMotion = useReducedMotion();
  const completedRef = useRef(false);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !enabled || phase !== "revealing" || completedRef.current) {
        return;
      }

      const targets = [
        ...root.querySelectorAll<HTMLElement>(".pdp-hero-intro-chrome"),
        ...document.querySelectorAll<HTMLElement>(
          '[data-pdp-version="v6"] [data-header-chrome]',
        ),
      ];

      if (targets.length === 0) {
        completedRef.current = true;
        onRevealComplete();
        return;
      }

      if (reducedMotion) {
        gsap.set(targets, { opacity: 1, y: 0, filter: "blur(0px)" });
        completedRef.current = true;
        onRevealComplete();
        return;
      }

      gsap.set(targets, { opacity: 0, y: REVEAL_LIFT_PX, filter: "blur(4px)" });

      gsap.to(targets, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
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
