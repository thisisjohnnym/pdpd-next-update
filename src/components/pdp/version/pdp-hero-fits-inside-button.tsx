"use client";

import { useEffect, useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { HERO_CHROME_COLOR_TRANSITION_CLASS } from "../pdp-hero-chrome-surface";
import { usePdpHeroGallery } from "../pdp-hero-gallery-context";
import { pdpPressableClass, pdpType } from "../pdp-type";
import { useReducedMotion } from "../use-reduced-motion";
import { PDP_CHROME_HEADER_OFFSET } from "../use-pdp-chrome-mode";

/** Scroll target — matches the editorial carousel capacity card anchor */
export const PDP_HERO_FITS_INSIDE_TARGET_ID = "faq-what-fits";

const FITS_ICON_SIZE = 18;

/** How long the user must dwell on a frame before the pill collapses to its icon */
const FITS_COLLAPSE_DELAY_MS = 2200;

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
 * Gallery-overlay "See what fits inside" pill — floats bottom-right over the
 * hero gallery as a solid white button that stays legible over busy media.
 * Jumps to the "what fits inside" capacity card deeper in the page. v5 only.
 *
 * The pill starts expanded, then collapses to just its icon once the user
 * dwells on a frame — swiping to a new frame re-expands it to re-announce the
 * label. Respects reduced-motion by staying expanded.
 */
export function PdpHeroFitsInsideButton() {
  const reducedMotion = useReducedMotion();
  const chromeTransitionClass = reducedMotion
    ? undefined
    : HERO_CHROME_COLOR_TRANSITION_CLASS;

  const { activeIndex } = usePdpHeroGallery();
  const [expanded, setExpanded] = useState(true);

  // Re-expand on every frame change, then collapse to the icon after a dwell.
  useEffect(() => {
    if (reducedMotion) {
      setExpanded(true);
      return;
    }
    setExpanded(true);
    const timer = window.setTimeout(
      () => setExpanded(false),
      FITS_COLLAPSE_DELAY_MS,
    );
    return () => window.clearTimeout(timer);
  }, [activeIndex, reducedMotion]);

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
        "pointer-events-auto flex items-center rounded-full py-2",
        "border border-black/5 bg-white text-neutral-900",
        "transition-[padding,background-color] duration-300 ease-out active:bg-neutral-100",
        expanded ? "gap-1.5 pl-3 pr-4" : "gap-0 px-2.5",
        chromeTransitionClass,
        pdpPressableClass,
        pdpType.label,
      )}
    >
      <MaterialIcon name="shopping_bag" size={FITS_ICON_SIZE} />
      <span
        aria-hidden={!expanded}
        className={cn(
          "font-extended translate-y-px overflow-hidden whitespace-nowrap",
          "transition-[max-width,opacity] duration-300 ease-out",
          expanded ? "max-w-[16ch] opacity-100" : "max-w-0 opacity-0",
        )}
      >
        See what fits inside
      </span>
    </button>
  );
}
