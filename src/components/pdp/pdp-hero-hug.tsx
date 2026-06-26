"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { useHeroRevealApplier } from "./use-pdp-hero-reveal";

/** Side / top inset of the hugged hero when fully revealed (px) */
const MAX_INSET = 8;
/** Top corner radius of the hugged hero when fully revealed (px) */
const MAX_RADIUS = 16;

/**
 * Hero "hug" — when the brand switcher is revealed the hero sits inset with
 * rounded top corners; at rest it is full-bleed. Driven off the shared hero
 * reveal value (no React re-render of the hero subtree) so it stays smooth.
 */
export function PdpHeroHug({ children }: { children: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  // Reset the shared inset when the hugged hero unmounts (e.g. product swap).
  useEffect(
    () => () => {
      document.documentElement.style.removeProperty("--hero-inset");
    },
    [],
  );

  useHeroRevealApplier((reveal) => {
    const wrap = wrapRef.current;
    if (!wrap) {
      return;
    }

    const inset = reveal * MAX_INSET;
    const radius = reveal * MAX_RADIUS;

    // Publish the live inset so viewport-fixed and in-hero chrome can mirror it
    // and keep consistent breathing room from the hugged hero frame.
    document.documentElement.style.setProperty("--hero-inset", `${inset}px`);

    wrap.style.paddingLeft = `${inset}px`;
    wrap.style.paddingRight = `${inset}px`;
    wrap.style.paddingTop = `${inset}px`;

    const hero = wrap.firstElementChild as HTMLElement | null;
    if (hero) {
      hero.style.borderTopLeftRadius = `${radius}px`;
      hero.style.borderTopRightRadius = `${radius}px`;
      // The hero media fills an absolutely-positioned child, so the radius only
      // clips visibly when the hero itself hides overflow. Skip at rest so the
      // full-bleed hero never clips its chrome.
      hero.style.overflow = reveal > 0 ? "hidden" : "";
    }
  });

  return (
    <div ref={wrapRef} className="bg-white">
      {children}
    </div>
  );
}
