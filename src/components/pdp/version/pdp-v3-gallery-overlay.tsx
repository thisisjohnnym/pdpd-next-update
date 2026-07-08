"use client";

import { cn } from "@/lib/cn";

import { PdpHeroGalleryIndicator } from "../pdp-hero-gallery-indicator";
import { usePdpHeroGallery } from "../pdp-hero-gallery-context";
import { PdpHeroGalleryProgressBar } from "../pdp-hero-gallery-progress-bar";
import { useHeroEnterOnce } from "../use-hero-enter-once";
import { useMountTransition } from "../use-mount-transition";
import { isHeroUiChromeVisible, useHeroUiChrome } from "../use-hero-ui-chrome";
import { getPdpVersionConfig } from "./pdp-version-config";
import { usePdpVersion } from "./pdp-version-context";
import { getHeroGalleryOverlayInsetClass } from "../pdp-hero-gallery-control-shell";
import { PdpHeroFitsInsideButton } from "./pdp-hero-fits-inside-button";
import { PdpHeroGalleryCategoryRail } from "./pdp-hero-gallery-category-rail";
import { PdpV3ArButton } from "./pdp-v3-ar-button";

/**
 * v3 gallery overlay — Paper r4 `F3D-0`. Slide indicator pinned bottom-left and
 * the AR button bottom-right, over the gallery media. Replaces the legacy
 * right-edge action rail + product HUD (name/price moves to the hero footer).
 *
 * v5 (`useHeroGalleryProgressBar`) swaps the bottom-left tick indicator for a
 * full-bleed progress bar at the gallery's bottom edge — and pins a "What fits"
 * pill bottom-right on the open-interior slide only.
 *
 * Lives inside `PdpHeroGallery` so it shares the slide-gallery context and the
 * `pdp-hero-ui-chrome` scroll fade.
 */
// fallow-ignore-next-line complexity
export function PdpV3GalleryOverlay({
  onOpenArTryOn,
}: {
  onOpenArTryOn?: () => void;
}) {
  const { opacity } = useHeroUiChrome();
  const visible = isHeroUiChromeVisible(opacity);
  const { overlayCta } = usePdpHeroGallery();
  const { useV4ModuleSpacing, showHeroFitsInsideCta, useHeroGalleryProgressBar, showHeroGalleryCategoryRail, showArTryOn, playHeroLandIntro } =
    getPdpVersionConfig(usePdpVersion());
  const heroEnterOnce = useHeroEnterOnce();
  const playLandIntro = playHeroLandIntro && heroEnterOnce;
  const showFitsInside =
    showHeroFitsInsideCta &&
    !showHeroGalleryCategoryRail &&
    overlayCta === "fits-inside";
  const fitsInsideTransition = useMountTransition(showFitsInside, 220);

  const bottomInsetClass = getHeroGalleryOverlayInsetClass({
    useV4ModuleSpacing,
    useHeroGalleryProgressBar,
    showHeroGalleryCategoryRail,
  });

  return (
    <>
      {showHeroGalleryCategoryRail ? (
        <div
          className={cn(
            "pointer-events-none absolute bottom-0 left-0 z-[38] pt-10",
            bottomInsetClass,
            !useV4ModuleSpacing && "pl-4",
          )}
          style={{
            opacity: "var(--hero-ui-opacity, 1)",
            visibility: visible ? "visible" : "hidden",
          }}
        >
          <div className={cn(playLandIntro && "pdp-v5-hero-overlay-enter")}>
            <PdpHeroGalleryCategoryRail
              onOpenArTryOn={onOpenArTryOn}
              chromeVisible={visible}
            />
          </div>
        </div>
      ) : null}
      <div
        className={cn(
          "pdp-hero-ui-chrome pointer-events-none absolute inset-x-0 bottom-0 z-[38]",
          "flex items-end justify-between pt-10",
          bottomInsetClass,
          showHeroGalleryCategoryRail && "justify-end",
        )}
        style={{ visibility: visible ? "visible" : "hidden" }}
      >
        {!showHeroGalleryCategoryRail ? (
          <div
            className={cn(
              "pointer-events-none flex flex-col items-start gap-3",
              !useV4ModuleSpacing && "pl-2",
            )}
          >
            {useHeroGalleryProgressBar ? null : <PdpHeroGalleryIndicator />}
          </div>
        ) : null}
        <div className="pointer-events-none flex shrink-0 flex-col items-end gap-3">
          {fitsInsideTransition.mounted ? (
            <div
              className="pdp-pop-up pointer-events-none"
              data-state={fitsInsideTransition.state}
            >
              <PdpHeroFitsInsideButton />
            </div>
          ) : null}
          {showArTryOn && !showHeroGalleryCategoryRail ? (
            <PdpV3ArButton onOpenArTryOn={onOpenArTryOn} />
          ) : null}
        </div>
      </div>
      {useHeroGalleryProgressBar ? (
        <PdpHeroGalleryProgressBar visible={visible} />
      ) : null}
    </>
  );
}
