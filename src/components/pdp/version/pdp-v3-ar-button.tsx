"use client";

import { PdpHeroArGlyph } from "@/components/icons/pdp-hero-glyphs";
import { cn } from "@/lib/cn";

import {
  heroUsesLightChrome,
  HERO_CHROME_COLOR_TRANSITION_CLASS,
  useHeroChromeSurface,
} from "../pdp-hero-chrome-surface";
import { pdpPressableIconClass } from "../pdp-type";
import { useReducedMotion } from "../use-reduced-motion";

/** Tight halo so the glyph reads on bright or busy media (matches the rail). */
const AR_GLYPH_LIGHT_SHADOW =
  "[filter:drop-shadow(0_0_1px_rgba(0,0,0,0.55))_drop-shadow(0_1px_3px_rgba(0,0,0,0.45))]";
const AR_GLYPH_DARK_SHADOW =
  "[filter:drop-shadow(0_0_1px_rgba(255,255,255,0.45))_drop-shadow(0_1px_3px_rgba(255,255,255,0.25))]";

const AR_ICON_SIZE = 24;

/**
 * Gallery-overlay AR button — Paper r4 `F3M-0`. Vertical icon + "Try On" label
 * pinned to the gallery bottom-right (v3 only). Surface contrast follows the
 * active slide like the legacy rail.
 */
export function PdpV3ArButton({ onOpenArTryOn }: { onOpenArTryOn?: () => void }) {
  const heroSurface = useHeroChromeSurface();
  const lightChrome = heroUsesLightChrome(heroSurface);
  const reducedMotion = useReducedMotion();
  const chromeTransitionClass = reducedMotion
    ? undefined
    : HERO_CHROME_COLOR_TRANSITION_CLASS;

  if (!onOpenArTryOn) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={onOpenArTryOn}
      aria-label="Try on with AI"
      className={cn(
        "pointer-events-auto flex shrink-0 flex-col items-center justify-center gap-[3px]",
        lightChrome ? AR_GLYPH_LIGHT_SHADOW : AR_GLYPH_DARK_SHADOW,
        chromeTransitionClass,
        pdpPressableIconClass,
      )}
    >
      <PdpHeroArGlyph
        size={AR_ICON_SIZE}
        className={lightChrome ? "text-white" : "text-neutral-900"}
      />
      <span
        className={cn(
          "font-extended text-[11px] leading-none tracking-[0.2px]",
          chromeTransitionClass,
          lightChrome ? "text-white" : "text-neutral-900",
        )}
      >
        Try On
      </span>
    </button>
  );
}
