"use client";

import { useLayoutEffect } from "react";

import { getPdpVersionConfig } from "./version/pdp-version-config";
import { usePdpVersion } from "./version/pdp-version-context";

/**
 * Clears a stuck `data-hero-intro-phase="playing"` when the fall-in / 360
 * intro provider is not enabled — otherwise gallery navigator chrome stays
 * at opacity:0 via the boot critical CSS.
 */
export function PdpHeroIntroPhaseFailsafe() {
  const { hero360IntroEnabled } = getPdpVersionConfig(usePdpVersion());

  useLayoutEffect(() => {
    if (hero360IntroEnabled) {
      return;
    }

    const root = document.documentElement;
    if (root.getAttribute("data-hero-intro-phase") === "playing") {
      root.setAttribute("data-hero-intro-phase", "ready");
      root.style.removeProperty("--hero-intro-ui-opacity");
      root.style.removeProperty("background-color");
    }
  }, [hero360IntroEnabled]);

  return null;
}
