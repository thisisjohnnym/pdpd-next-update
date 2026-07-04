"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

import { useReducedMotion } from "./use-reduced-motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Finish every reveal once the element top crosses this viewport line. */
const REVEAL_END = "top 30%";
/** Begin slightly before the element fully enters — longer, calmer runway. */
const REVEAL_START = "top bottom-=12%";
const REVEAL_BLUR_PX = 8;
const REVEAL_LIFT_PX = 12;
/** Scroll-runway offset between staggered siblings (px). */
export const REVEAL_STAGGER_PX = 64;

export function revealStaggerDelay(index: number): number {
  return index * REVEAL_STAGGER_PX;
}

type UsePdpElementRevealOptions = {
  blur?: boolean;
  delay?: number;
  enabled: boolean;
};

export function usePdpElementReveal<T extends HTMLElement>({
  blur = false,
  delay = 0,
  enabled,
}: UsePdpElementRevealOptions) {
  const ref = useRef<T>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const node = ref.current;
      if (!node || !enabled || reducedMotion) {
        return;
      }

      gsap.fromTo(
        node,
        {
          opacity: 0,
          y: REVEAL_LIFT_PX,
          ...(blur ? { filter: `blur(${REVEAL_BLUR_PX}px)` } : {}),
        },
        {
          opacity: 1,
          y: 0,
          ...(blur ? { filter: "blur(0px)" } : {}),
          ease: "power2.out",
          scrollTrigger: {
            trigger: node,
            start:
              delay > 0 ? `${REVEAL_START}+=${delay}` : REVEAL_START,
            end: REVEAL_END,
            scrub: 0.45,
            invalidateOnRefresh: true,
          },
        },
      );
    },
    {
      scope: ref,
      dependencies: [enabled, reducedMotion, blur, delay],
      revertOnUpdate: true,
    },
  );

  return ref;
}
