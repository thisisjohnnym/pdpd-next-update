"use client";

import { useEffect } from "react";

import {
  HERO_UI_FADE_END_VIEWPORT,
  HERO_UI_FADE_START_VIEWPORT,
  HERO_UI_MAX_BLUR_PX,
} from "./pdp-hero-tokens";
import { useScrollSnapshot } from "./use-coalesced-scroll";

function smoothstep(value: number) {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
}

/** Hero overlay chrome — hold until 80% viewport, fade+blur through 100%. */
function getHeroUiChrome(scrollY: number, viewportHeight: number) {
  if (viewportHeight <= 0) {
    return { opacity: 1, blur: 0 };
  }

  const fadeStart = viewportHeight * HERO_UI_FADE_START_VIEWPORT;
  const fadeEnd = viewportHeight * HERO_UI_FADE_END_VIEWPORT;

  if (scrollY <= fadeStart) {
    return { opacity: 1, blur: 0 };
  }
  if (scrollY >= fadeEnd) {
    return { opacity: 0, blur: HERO_UI_MAX_BLUR_PX };
  }

  const t = smoothstep((scrollY - fadeStart) / (fadeEnd - fadeStart));
  return {
    opacity: 1 - t,
    blur: t * HERO_UI_MAX_BLUR_PX,
  };
}

export function useHeroUiChrome() {
  const { scrollY, viewportHeight } = useScrollSnapshot();
  return getHeroUiChrome(scrollY, viewportHeight);
}

/** Publish --hero-ui-opacity and --hero-ui-blur for CSS-driven hero overlays. */
export function useHeroUiChromeVars(enabled = true) {
  const { scrollY, viewportHeight } = useScrollSnapshot();

  useEffect(() => {
    if (!enabled) {
      return;
    }
    const { opacity, blur } = getHeroUiChrome(scrollY, viewportHeight);
    document.documentElement.style.setProperty("--hero-ui-opacity", String(opacity));
    document.documentElement.style.setProperty("--hero-ui-blur", `${blur}px`);
  }, [enabled, scrollY, viewportHeight]);

  useEffect(
    () => () => {
      if (!enabled) {
        return;
      }
      document.documentElement.style.removeProperty("--hero-ui-opacity");
      document.documentElement.style.removeProperty("--hero-ui-blur");
    },
    [enabled],
  );
}

export function isHeroUiChromeVisible(opacity: number) {
  return opacity > 0.02;
}
