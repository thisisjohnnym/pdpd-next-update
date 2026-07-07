// fallow-ignore-file unused-file
// fallow-ignore-file unused-export
import { cn } from "@/lib/cn";

import { BOTTOM_CTA_OFFSET } from "./pdp-viewport-chrome";

/** Chapter rhythm — viewport-scale pacing */
export const CHAPTER_HERO_STYLE = {
  minHeight: "var(--pdp-immersive-height, 100svh)",
} as const;

export const CHAPTER_IMMERSIVE_STYLE = {
  minHeight: "var(--pdp-immersive-height, 100svh)",
} as const;

export const CHAPTER_FEATURE_STYLE = {
  minHeight: "min(72dvh, 720px)",
} as const;

export const CHAPTER_UTILITY_STYLE = {
  minHeight: "min(56dvh, 520px)",
} as const;

export const CHAPTER_SOCIAL_STYLE = {
  minHeight: "min(70dvh, 640px)",
} as const;

/** Full-bleed media that dominates the chapter */
export function immersiveMediaBlockStyle(headerReserve = "7.5rem") {
  return {
    minHeight: `calc(var(--pdp-immersive-height, 100svh) - ${headerReserve})`,
    height: `calc(var(--pdp-immersive-height, 100svh) - ${headerReserve})`,
  } as const;
}

/** Cinematic utility media — most of the chapter, not a card */
export function cinematicMediaBlockStyle() {
  return {
    minHeight: "min(62dvh, 560px)",
    height: "min(62dvh, 560px)",
  } as const;
}

/** Mobile grid margin for compressed copy only — media ignores this */
export const CHAPTER_COPY_GUTTER_CLASS = "px-3";

export const IMMERSIVE_MEDIA_CLASS = "relative w-full overflow-hidden bg-black";

export const CHAPTER_SCRIM_TOP_CLASS = cn(
  "pointer-events-none absolute inset-x-0 top-0 z-20",
  "bg-gradient-to-b from-black/60 via-black/30 to-transparent",
  "pt-[calc(var(--pdp-safe-area-top)+0.5rem)] pb-10",
);

export const CHAPTER_SCRIM_BOTTOM_CLASS = cn(
  "absolute inset-x-0 bottom-0 z-20",
  "bg-gradient-to-t from-black/75 via-black/40 to-transparent",
  "px-3 pt-12",
);

export function chapterBottomPadWithCta() {
  return {
    paddingBottom: `calc(1rem + ${BOTTOM_CTA_OFFSET})`,
  } as const;
}
