"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { PdpBrandBarReveal } from "./pdp-brand-bar-reveal";
import {
  HERO_INSET_PX,
  HERO_RADIUS_BOTTOM_PX,
  HERO_RADIUS_TOP_PX,
  HERO_TOP_PADDING_PX,
  lerpHeroReveal,
} from "./pdp-hero-tokens";
import { useHeroRevealApplier } from "./use-pdp-hero-reveal";

function applyHeroShellLayout(
  reveal: number,
  phoneRef: React.RefObject<HTMLDivElement | null>,
  heroRef: React.RefObject<HTMLDivElement | null>,
  mediaFrameRef: React.RefObject<HTMLDivElement | null>,
) {
  const phone = phoneRef.current;
  const hero = heroRef.current;
  const mediaFrame = mediaFrameRef.current;
  if (!phone || !hero || !mediaFrame) {
    return;
  }

  const inset = lerpHeroReveal(reveal, HERO_INSET_PX);
  const radiusTop = lerpHeroReveal(reveal, HERO_RADIUS_TOP_PX);
  const radiusBottom = lerpHeroReveal(reveal, HERO_RADIUS_BOTTOM_PX);
  const paddingTop = lerpHeroReveal(reveal, HERO_TOP_PADDING_PX);

  document.documentElement.style.setProperty("--hero-inset", `${inset}px`);
  document.documentElement.style.setProperty("--hero-radius-top", `${radiusTop}px`);
  document.documentElement.style.setProperty("--hero-radius-bottom", `${radiusBottom}px`);
  document.documentElement.style.setProperty("--hero-padding-top", `${paddingTop}px`);

  hero.style.paddingLeft = `${inset}px`;
  hero.style.paddingRight = `${inset}px`;
  hero.style.paddingTop = `${paddingTop}px`;

  mediaFrame.style.borderTopLeftRadius = `${radiusTop}px`;
  mediaFrame.style.borderTopRightRadius = `${radiusTop}px`;
  mediaFrame.style.borderBottomLeftRadius = `${radiusBottom}px`;
  mediaFrame.style.borderBottomRightRadius = `${radiusBottom}px`;
  mediaFrame.style.overflow =
    reveal > 0 || radiusTop > 0 || radiusBottom > 0 ? "hidden" : "";
}

/**
 * Hero land shell — Phone wrapper + animated hero frame per Paper `6AJ-0` / `64P-0`.
 * See docs/pdp-hero-chrome.md.
 */
export function PdpHeroShell({ children }: { children: ReactNode }) {
  const phoneRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const mediaFrameRef = useRef<HTMLDivElement>(null);

  useEffect(
    () => () => {
      document.documentElement.style.removeProperty("--hero-inset");
      document.documentElement.style.removeProperty("--hero-radius-top");
      document.documentElement.style.removeProperty("--hero-radius-bottom");
      document.documentElement.style.removeProperty("--hero-padding-top");
    },
    [],
  );

  useHeroRevealApplier((reveal) => {
    applyHeroShellLayout(reveal, phoneRef, heroRef, mediaFrameRef);
  });

  return (
    <div
      ref={phoneRef}
      className="relative flex min-h-[var(--pdp-immersive-height,100svh)] flex-1 flex-col overflow-clip bg-white"
    >
      <PdpBrandBarReveal />
      <div ref={heroRef} className="flex min-h-0 flex-1 flex-col">
        <div ref={mediaFrameRef} className="relative flex min-h-0 flex-1 flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}
