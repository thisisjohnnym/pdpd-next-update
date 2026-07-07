"use client";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { HERO_CHROME_COLOR_TRANSITION_CLASS } from "../pdp-hero-chrome-surface";
import { pdpPressableClass, pdpType } from "../pdp-type";
import { useReducedMotion } from "../use-reduced-motion";
import { PDP_CHROME_HEADER_OFFSET } from "../use-pdp-chrome-mode";

/** Scroll target — matches the editorial carousel capacity card anchor */
export const PDP_HERO_FITS_INSIDE_TARGET_ID = "faq-what-fits";

const FITS_ICON_SIZE = 18;

function scrollToFitsInside(behavior: ScrollBehavior) {
  const el = document.getElementById(PDP_HERO_FITS_INSIDE_TARGET_ID);
  if (!el) {
    return;
  }
  const top =
    el.getBoundingClientRect().top + window.scrollY - PDP_CHROME_HEADER_OFFSET;
  window.scrollTo({ top: Math.max(0, top), behavior });
}

/**
 * Gallery-overlay "See what fits inside" CTA — bottom-right on the open-interior hero
 * slide only (`overlayCta: "fits-inside"` in gallery data). v5 only.
 */
export function PdpHeroFitsInsideButton() {
  const reducedMotion = useReducedMotion();
  const chromeTransitionClass = reducedMotion
    ? undefined
    : HERO_CHROME_COLOR_TRANSITION_CLASS;

  const handleClick = () => {
    scrollToFitsInside("smooth");
    // Lazy sections between the hero and the target can mount mid-scroll and
    // shift layout — re-resolve once it settles so we land precisely.
    window.setTimeout(() => scrollToFitsInside("smooth"), 420);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="See what fits inside"
      className={cn(
        "pointer-events-auto flex items-center gap-1.5 rounded-none py-2.5 pl-3 pr-4",
        "pdp-v5-fits-inside-glass ring-1 ring-inset ring-white/45",
        "transition-[transform,background-color] duration-200 ease-out",
        "active:scale-[0.96]",
        chromeTransitionClass,
        pdpPressableClass,
        pdpType.label,
      )}
    >
      <MaterialIcon name="straighten" size={FITS_ICON_SIZE} />
      <span className="font-extended translate-y-px whitespace-nowrap">
        See what fits inside
      </span>
    </button>
  );
}
