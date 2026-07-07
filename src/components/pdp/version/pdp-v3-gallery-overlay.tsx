"use client";

import { cn } from "@/lib/cn";

import { PdpHeroGalleryIndicator } from "../pdp-hero-gallery-indicator";
import { PdpHeroGalleryProgressBar } from "../pdp-hero-gallery-progress-bar";
import { isHeroUiChromeVisible, useHeroUiChrome } from "../use-hero-ui-chrome";
import { getPdpVersionConfig } from "./pdp-version-config";
import { usePdpVersion } from "./pdp-version-context";
import { PdpHeroFitsInsideButton } from "./pdp-hero-fits-inside-button";
import { PdpV3ArButton } from "./pdp-v3-ar-button";

/**
 * v3 gallery overlay — Paper r4 `F3D-0`. Slide indicator pinned bottom-left and
 * the AR button bottom-right, over the gallery media. Replaces the legacy
 * right-edge action rail + product HUD (name/price moves to the hero footer).
 *
 * v5 (`useHeroGalleryProgressBar`) swaps the bottom-left tick indicator for a
 * full-bleed progress bar at the gallery's bottom edge — reads as attached to
 * the top of the white product footer — and floats the "See what fits inside"
 * pill bottom-left on the open-interior slide.
 *
 * Lives inside `PdpHeroGallery` so it shares the slide-gallery context and the
 * `pdp-hero-ui-chrome` scroll fade.
 */
export function PdpV3GalleryOverlay({
  onOpenArTryOn,
}: {
  onOpenArTryOn?: () => void;
}) {
  const { opacity } = useHeroUiChrome();
  const visible = isHeroUiChromeVisible(opacity);
  const { useV4ModuleSpacing, showHeroFitsInsideCta, useHeroGalleryProgressBar, hero360IntroEnabled } =
    getPdpVersionConfig(usePdpVersion());
  const showFitsInside = showHeroFitsInsideCta;

  return (
    <>
      <div
        className={cn(
          "pdp-hero-ui-chrome pointer-events-none absolute inset-x-0 bottom-0 z-[38]",
          hero360IntroEnabled && "pdp-hero-intro-chrome",
          "flex items-end justify-between pt-10",
          useV4ModuleSpacing ? "px-4 pb-4" : "px-2 pb-2",
        )}
        style={{ visibility: visible ? "visible" : "hidden" }}
      >
        <div
          className={cn(
            "pointer-events-none flex flex-col items-start gap-3",
            !useV4ModuleSpacing && "pl-2",
          )}
        >
          {useHeroGalleryProgressBar ? null : <PdpHeroGalleryIndicator />}
        </div>
        <div className="pointer-events-none flex shrink-0 flex-col items-end gap-5">
          {showFitsInside ? <PdpHeroFitsInsideButton /> : null}
          <PdpV3ArButton onOpenArTryOn={onOpenArTryOn} />
        </div>
      </div>
      {useHeroGalleryProgressBar ? (
        <PdpHeroGalleryProgressBar visible={visible} />
      ) : null}
    </>
  );
}
