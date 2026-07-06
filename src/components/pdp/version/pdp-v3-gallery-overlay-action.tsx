"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

import {
  heroUsesLightChrome,
  HERO_CHROME_COLOR_TRANSITION_CLASS,
} from "../pdp-hero-chrome-surface";
import { usePdpHeroGallery } from "../pdp-hero-gallery-context";
import { pdpPressableIconClass } from "../pdp-type";
import { useReducedMotion } from "../use-reduced-motion";

/** Tight halo so glyphs read on bright or busy media (matches Try On). */
const GLYPH_LIGHT_SHADOW =
  "[filter:drop-shadow(0_0_1px_rgba(0,0,0,0.55))_drop-shadow(0_1px_3px_rgba(0,0,0,0.45))]";
const GLYPH_DARK_SHADOW =
  "[filter:drop-shadow(0_0_1px_rgba(255,255,255,0.45))_drop-shadow(0_1px_3px_rgba(255,255,255,0.25))]";

/** Vertical icon + label — v3 gallery overlay actions (Try On, What fits). */
export function PdpV3GalleryOverlayAction({
  ariaLabel,
  label,
  onClick,
  renderIcon,
}: {
  ariaLabel: string;
  label: string;
  onClick: () => void;
  renderIcon: (iconClassName: string) => ReactNode;
}) {
  const { surface } = usePdpHeroGallery();
  const lightChrome = heroUsesLightChrome(surface);
  const reducedMotion = useReducedMotion();
  const chromeTransitionClass = reducedMotion
    ? undefined
    : HERO_CHROME_COLOR_TRANSITION_CLASS;
  const iconClassName = cn(
    chromeTransitionClass,
    lightChrome ? "text-white" : "text-neutral-900",
  );

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        "pointer-events-auto flex shrink-0 flex-col items-center justify-center gap-[3px]",
        lightChrome ? GLYPH_LIGHT_SHADOW : GLYPH_DARK_SHADOW,
        chromeTransitionClass,
        pdpPressableIconClass,
      )}
    >
      {renderIcon(iconClassName)}
      <span
        className={cn(
          "font-extended text-center text-[11px] leading-none tracking-[0.2px]",
          chromeTransitionClass,
          lightChrome ? "text-white" : "text-neutral-900",
        )}
      >
        {label}
      </span>
    </button>
  );
}
