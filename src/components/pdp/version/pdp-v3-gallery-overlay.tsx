"use client";

import { cn } from "@/lib/cn";

import { PdpHeroGalleryIndicator } from "../pdp-hero-gallery-indicator";
import { isHeroUiChromeVisible, useHeroUiChrome } from "../use-hero-ui-chrome";
import { getPdpVersionConfig } from "./pdp-version-config";
import { usePdpVersion } from "./pdp-version-context";
import { PdpV3ArButton } from "./pdp-v3-ar-button";

/**
 * v3 gallery overlay — Paper r4 `F3D-0`. Slide indicator pinned bottom-left and
 * the AR button bottom-right, over the gallery media. Replaces the legacy
 * right-edge action rail + product HUD (name/price moves to the hero footer).
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
  const { useV4ModuleSpacing } = getPdpVersionConfig(usePdpVersion());

  return (
    <div
      className={cn(
        "pdp-hero-ui-chrome pointer-events-none absolute inset-x-0 bottom-0 z-[38]",
        "flex items-end justify-between pt-10",
        useV4ModuleSpacing ? "px-4 pb-4" : "px-2 pb-2",
      )}
      style={{ visibility: visible ? "visible" : "hidden" }}
    >
      <div className={cn("pointer-events-none", !useV4ModuleSpacing && "pl-2")}>
        <PdpHeroGalleryIndicator />
      </div>
      <div className="pointer-events-none flex shrink-0 flex-col items-center">
        <PdpV3ArButton onOpenArTryOn={onOpenArTryOn} />
      </div>
    </div>
  );
}
