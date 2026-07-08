"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

import { useReducedMotion } from "./use-reduced-motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Matches ScrollTrigger end line — snap when the element top is at or above this. */
const REVEAL_END_VP_RATIO = 0.3;
/** Begin slightly before the element fully enters — longer, calmer runway. */
const REVEAL_START = "top bottom-=12%";
const REVEAL_BLUR_PX = 8;
const REVEAL_LIFT_PX = 12;
const REVEAL_DURATION = 0.7;
/** Scroll-runway offset between staggered siblings (px). */
const REVEAL_STAGGER_PX = 64;

export function revealStaggerDelay(index: number): number {
  return index * REVEAL_STAGGER_PX;
}

function isPastRevealEnd(node: HTMLElement): boolean {
  const { top, bottom } = node.getBoundingClientRect();
  const endLine = window.innerHeight * REVEAL_END_VP_RATIO;
  // Past the reveal end line, or jumped clean over the section (anchor / End key).
  return top <= endLine || bottom <= 0;
}

function snapToRevealed(
  node: HTMLElement,
  blur: boolean,
  scaleFrom: number | undefined,
  tween: gsap.core.Tween | null,
) {
  gsap.killTweensOf(node);
  gsap.set(node, {
    opacity: 1,
    y: 0,
    ...(scaleFrom !== undefined ? { scale: 1 } : {}),
    ...(blur ? { filter: "blur(0px)" } : {}),
  });
  tween?.scrollTrigger?.kill();
  tween?.kill();
}

type UsePdpElementRevealOptions = {
  blur?: boolean;
  delay?: number;
  /** Initial scale — card grows into place when set (e.g. 0.88). */
  scaleFrom?: number;
  enabled: boolean;
};

export function usePdpElementReveal<T extends HTMLElement>({
  blur = false,
  delay = 0,
  scaleFrom,
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

      const hiddenState = {
        opacity: 0,
        y: REVEAL_LIFT_PX,
        ...(scaleFrom !== undefined ? { scale: scaleFrom } : {}),
        ...(blur ? { filter: `blur(${REVEAL_BLUR_PX}px)` } : {}),
      };
      const revealedState = {
        opacity: 1,
        y: 0,
        ...(scaleFrom !== undefined ? { scale: 1 } : {}),
        ...(blur ? { filter: "blur(0px)" } : {}),
      };

      gsap.set(node, hiddenState);

      let tween: gsap.core.Tween | null = null;
      let settled = false;
      let rafId = 0;

      const markSettled = () => {
        settled = true;
      };

      const snapIfSkippedPast = () => {
        if (settled || !node) {
          return;
        }
        if (isPastRevealEnd(node)) {
          markSettled();
          snapToRevealed(node, blur, scaleFrom, tween);
          tween = null;
        }
      };

      const scheduleSkipPastCheck = () => {
        if (settled) {
          return;
        }
        if (rafId) {
          return;
        }
        rafId = requestAnimationFrame(() => {
          rafId = 0;
          snapIfSkippedPast();
        });
      };

      tween = gsap.fromTo(node, hiddenState, {
        ...revealedState,
        duration: REVEAL_DURATION,
        ease: "power2.out",
        onComplete: markSettled,
        scrollTrigger: {
          trigger: node,
          start: delay > 0 ? `${REVEAL_START}+=${delay}` : REVEAL_START,
          toggleActions: "play none none none",
          once: true,
          invalidateOnRefresh: true,
          onRefresh: scheduleSkipPastCheck,
        },
      });

      scheduleSkipPastCheck();

      window.addEventListener("scroll", scheduleSkipPastCheck, { passive: true });
      window.addEventListener("resize", scheduleSkipPastCheck);

      return () => {
        window.removeEventListener("scroll", scheduleSkipPastCheck);
        window.removeEventListener("resize", scheduleSkipPastCheck);
        if (rafId) {
          cancelAnimationFrame(rafId);
        }
      };
    },
    {
      scope: ref,
      dependencies: [enabled, reducedMotion, blur, delay, scaleFrom],
      revertOnUpdate: true,
    },
  );

  return ref;
}
