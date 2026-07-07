"use client";

import { PdpHeroArGlyph } from "@/components/icons/pdp-hero-glyphs";

import { PdpV3GalleryOverlayAction } from "./pdp-v3-gallery-overlay-action";

const AR_ICON_SIZE = 24;

/**
 * Gallery-overlay AR button — Paper r4 `F3M-0`. Vertical icon + "Try On" label
 * pinned to the gallery bottom-right (v3 only). Surface contrast follows the
 * active slide like the legacy rail.
 */
export function PdpV3ArButton({ onOpenArTryOn }: { onOpenArTryOn?: () => void }) {
  if (!onOpenArTryOn) {
    return null;
  }

  return (
    <PdpV3GalleryOverlayAction
      ariaLabel="Try on with AI"
      label="Try On"
      onClick={onOpenArTryOn}
      renderIcon={(iconClassName) => (
        <PdpHeroArGlyph size={AR_ICON_SIZE} className={iconClassName} />
      )}
    />
  );
}
