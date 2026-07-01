"use client";

import { useRef } from "react";

import { PdpBrandBar } from "./pdp-brand-bar";
import { BRAND_BAR_HIDE_OFFSET_PX } from "./pdp-hero-tokens";
import {
  useHeroRevealApplier,
  useHeroRevealController,
} from "./use-pdp-hero-reveal";

/**
 * Brand switcher inside Phone shell — slides off-screen at full bleed (Paper `64R-0`).
 * See docs/pdp-hero-chrome.md.
 */
export function PdpBrandBarReveal() {
  const outerRef = useRef<HTMLDivElement>(null);
  const controller = useHeroRevealController();

  useHeroRevealApplier((reveal) => {
    const outer = outerRef.current;
    if (!outer) {
      return;
    }
      outer.style.transform = `translateY(${(1 - reveal) * -BRAND_BAR_HIDE_OFFSET_PX}px)`;
      outer.style.opacity = String(reveal);
      outer.style.pointerEvents = reveal > 0.35 ? "auto" : "none";
      outer.style.willChange =
        reveal > 0 && reveal < 1 ? "transform, opacity" : "";
  });

  return (
    <div
      ref={outerRef}
      aria-hidden={false}
      className="absolute inset-x-0 top-0 z-50 overflow-hidden bg-white"
      style={{ opacity: 0, pointerEvents: "none" }}
    >
      <PdpBrandBar onSelect={() => controller?.animateTo(0)} />
    </div>
  );
}
