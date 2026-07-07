"use client";

import { MaterialIcon } from "@/components/icons/material-icon";

import { PDP_CHROME_HEADER_OFFSET } from "../use-pdp-chrome-mode";
import { PdpV3GalleryOverlayAction } from "./pdp-v3-gallery-overlay-action";

/** Scroll target — matches the editorial carousel capacity card anchor */
export const PDP_HERO_FITS_INSIDE_TARGET_ID = "faq-what-fits";

const FITS_ICON_SIZE = 24;

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
 * Gallery-overlay "What fits" button — contextual sibling to Try On. Appears
 * beside the AR action when the open-interior slide is active and jumps to the
 * "what fits inside" capacity card deeper in the page. v5 only.
 */
export function PdpHeroFitsInsideButton() {
  const handleClick = () => {
    scrollToFitsInside("smooth");
    // Lazy sections between the hero and the target can mount mid-scroll and
    // shift layout — re-resolve once it settles so we land precisely.
    window.setTimeout(() => scrollToFitsInside("smooth"), 420);
  };

  return (
    <PdpV3GalleryOverlayAction
      ariaLabel="See what fits inside"
      label="What Fits"
      onClick={handleClick}
      renderIcon={(iconClassName) => (
        <MaterialIcon
          name="inventory_2"
          size={FITS_ICON_SIZE}
          className={iconClassName}
        />
      )}
    />
  );
}
