/** Fixed bottom chrome sits above Safari toolbars + home indicator */
export const BOTTOM_CHROME_OFFSET = "var(--pdp-fixed-bottom-offset)";

/** Floating pill height (gallery scroll) */
const BOTTOM_PILL_HEIGHT_PX = 48;

/** Docked hero bar — single row (color + ATB) */
const BOTTOM_DOCKED_HEIGHT_PX = 54;

/** Space for fixed bottom CTAs (buttons + spacing + browser chrome) */
export const BOTTOM_CTA_OFFSET = `calc(${BOTTOM_PILL_HEIGHT_PX}px + 0.625rem + var(--pdp-fixed-bottom-offset))`;

/** Hero product HUD — clears docked bar with room for title + subtitle */
const HERO_PRODUCT_HUD_OFFSET = `calc(${BOTTOM_DOCKED_HEIGHT_PX}px + 1rem + var(--pdp-fixed-bottom-offset))`;

/** Hero action rail — clears title/price row on the right (save label + icon) */
const HERO_ACTION_RAIL_OFFSET = `calc(${HERO_PRODUCT_HUD_OFFSET} + 6.5rem)`;

/** Hero action rail when bottom bar floats — clears pill + product HUD */
const HERO_ACTION_RAIL_FLOATING_OFFSET = `calc(${BOTTOM_CTA_OFFSET} + 9rem)`;

export function heroProductHudOffset(): string {
  return HERO_PRODUCT_HUD_OFFSET;
}

export function heroActionRailOffset(docked = true): string {
  return docked ? HERO_ACTION_RAIL_OFFSET : HERO_ACTION_RAIL_FLOATING_OFFSET;
}

export function bottomCtaOffset(): string {
  return BOTTOM_CTA_OFFSET;
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

/** Generic edge-to-edge section (galleries, fullscreen experiences) */
const EDGE_TO_EDGE_CLASS = "pdp-edge-to-edge";
const EDGE_TO_EDGE_MEDIA_CLASS = "pdp-edge-to-edge__media";

export const PANEL_MEDIA_FRAME_CLASS = "pdp-gallery-panel__frame";
export const PANEL_MEDIA_FILL_CLASS = "relative size-full";
export const PANEL_MEDIA_COVER_CLASS = "pdp-gallery-panel__cover";
