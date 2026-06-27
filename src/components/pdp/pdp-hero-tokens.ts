import { PDP_BRAND_BAR_HEIGHT } from "./pdp-brand-bar";

/** Side inset of the hugged hero when fully revealed (px) — Paper `--space-margin` adjacent */
export const HERO_INSET_PX = 8;

/** Top corner radius when shrunk — Paper `--radius-card` */
export const HERO_RADIUS_TOP_PX = 16;

/** Bottom corner radius when shrunk — Paper `59D-0` / `6BA-0` */
export const HERO_RADIUS_BOTTOM_PX = 8;

/** Room for brand bar above inset hero — matches `PDP_BRAND_BAR_HEIGHT` */
export const HERO_TOP_PADDING_PX = PDP_BRAND_BAR_HEIGHT;

/** Brand bar slides off-screen at full bleed — Paper `64R-0` */
export const BRAND_BAR_HIDE_OFFSET_PX = 64;

/** Intro peek duration before collapse to full bleed */
export const HERO_INTRO_HOLD_MS = 3000;

/** Shrunk → full-bleed collapse duration */
export const HERO_SHRINK_TO_FULL_MS = 1800;

/** Floating CTA pill height — Paper `5BB-0` / `676-0` */
export const CTA_PILL_HEIGHT_PX = 50;

/** Gap between color pill and ATB — Paper bottom bar */
export const CTA_BAR_GAP_PX = 10;

/** Outer padding on floating cta bar container */
export const CTA_BAR_PADDING_PX = 8;

/** Product HUD row padding from media frame bottom — Paper `6CU-0` / `670-0` paddingBottom */
export const HERO_FRAME_BOTTOM_PAD_PX = 8;

/** Hero UI stays fully visible until this fraction of viewport scrolled */
export const HERO_UI_FADE_START_VIEWPORT = 0.8;

/** Hero UI fully hidden at this fraction of viewport scrolled */
export const HERO_UI_FADE_END_VIEWPORT = 1;

/** Max backdrop blur (px) applied to hero UI overlays at end of fade */
export const HERO_UI_MAX_BLUR_PX = 12;

/** Paper filter gradient over full hero frame */
export const HERO_FILTER_GRADIENT =
  "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.11) 100%)";

/** Paper HeroMiddle bottom gradient behind product name */
export const HERO_MIDDLE_GRADIENT =
  "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.30) 100%)";

/** Paper HeroMiddle band height — ~50% of media frame (66F-0 400/812, 6C9-0 337/696) */
export const HERO_MIDDLE_HEIGHT_FRACTION = 0.5;

/** Lerp a shrunk↔full-bleed token by reveal (1 = shrunk, 0 = full bleed) */
export function lerpHeroReveal(reveal: number, shrunk: number, fullBleed = 0): number {
  return fullBleed + (shrunk - fullBleed) * reveal;
}
