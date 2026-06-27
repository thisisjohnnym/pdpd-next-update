import { CTA_BAR_PADDING_PX, CTA_PILL_HEIGHT_PX } from "./pdp-hero-tokens";

/** Fixed bottom chrome sits above Safari toolbars + home indicator */
export const BOTTOM_CHROME_OFFSET = "var(--pdp-fixed-bottom-offset)";

/** Floating CTA bar content height — Paper pill row */
const CTA_ROW_HEIGHT_PX = CTA_PILL_HEIGHT_PX;

const CTA_BAR_FALLBACK_PX = CTA_ROW_HEIGHT_PX + CTA_BAR_PADDING_PX * 2;

/** Space for fixed bottom CTAs (pills + container padding + browser chrome) */
export const BOTTOM_CTA_OFFSET = `calc(${CTA_ROW_HEIGHT_PX}px + ${CTA_BAR_PADDING_PX * 2}px + var(--pdp-fixed-bottom-offset))`;

/**
 * Hero product HUD bottom — reveal-aware (Paper `6CU-0` / `670-0`):
 * shrunk: flush to media frame bottom; inner `pb-2` matches row paddingBottom 8px
 * full bleed: HeroMiddle paddingBottom = cta-bar-height + safe-area (Paper `66F-0` 64px)
 */
const HERO_PRODUCT_HUD_OFFSET = `calc((1 - var(--hero-reveal, 0)) * (var(--cta-bar-height, ${CTA_BAR_FALLBACK_PX}px) + var(--pdp-fixed-bottom-offset)))`;

/** Hero action rail — stacked above product name block */
const HERO_ACTION_RAIL_OFFSET = `calc(${HERO_PRODUCT_HUD_OFFSET} + 4.5rem)`;

export function heroProductHudOffset(): string {
  return HERO_PRODUCT_HUD_OFFSET;
}

export function heroActionRailOffset(): string {
  return HERO_ACTION_RAIL_OFFSET;
}

/** Full layout viewport — immersive panels fill visible screen on mobile Safari */
export const SCREEN_HEIGHT_STYLE = {
  width: "100%",
  minHeight: "var(--pdp-immersive-height, 100svh)",
  height: "var(--pdp-immersive-height, 100svh)",
} as const;

/** Immersive hero — edge-to-edge under notch / Dynamic Island (opt-out of SafeAreaMain) */
export const HERO_IMMERSIVE_CLASS = "pdp-hero-immersive";
export const HERO_IMMERSIVE_MEDIA_CLASS = "pdp-hero-immersive__media";

export const PANEL_MEDIA_FRAME_CLASS = "pdp-gallery-panel__frame";
export const PANEL_MEDIA_FILL_CLASS = "relative size-full";
export const PANEL_MEDIA_COVER_CLASS = "pdp-gallery-panel__cover";
