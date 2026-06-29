/**
 * Shot-type framing presets for the hero gallery.
 *
 * Coach studio stills share a square-ish 2368×2160 frame on a #f0f0f0 ground,
 * while the lifestyle/on-model assets are full-bleed scenes. Rather than hand-tune
 * `object-position` per asset, each slide declares a `shotType` and this resolver
 * returns the crop strategy:
 *
 * - Full product shots (`product`) and spec/infographic frames (`studio`) use
 *   `contain` so the whole bag — straps included — is visible. Because the frame
 *   ground matches the asset ground (#f0f0f0), the letterbox is seamless.
 * - Close-ups (`detail`) and lifestyle/on-model scenes fill the frame with `cover`,
 *   biasing the focal point (faces up top, lifestyle slightly above center).
 *
 * New colorways can be classified once (see scripts/generate-hero-framing-manifest.mjs)
 * and then live in the slide data as the source of truth.
 */

export type PdpHeroShotType =
  | "lifestyle"
  | "product"
  | "detail"
  | "on-model"
  | "studio";

export type PdpHeroFraming = {
  objectFit: "cover" | "contain";
  objectPosition: string;
};

/** Seamless studio ground — matches the sampled #f0f0f0 backdrop baked into the stills */
const PDP_HERO_STUDIO_BG = "#f0f0f0";

const HERO_FRAMING: Record<PdpHeroShotType, PdpHeroFraming> = {
  // Slide 0 lifestyle video — fill the frame, hold the model + bag above bottom chrome
  lifestyle: { objectFit: "cover", objectPosition: "center 40%" },
  // Full bag on studio ground — show the entire silhouette and straps
  product: { objectFit: "contain", objectPosition: "center" },
  // Hardware / leather / interior close-ups — fill for an immersive macro
  detail: { objectFit: "cover", objectPosition: "center" },
  // Model wearing the bag — fill, keep heads in frame
  "on-model": { objectFit: "cover", objectPosition: "center top" },
  // Spec sheets, 360 spins, flat lays — show everything, never crop callouts
  studio: { objectFit: "contain", objectPosition: "center" },
};

export function resolveHeroFraming(shotType: PdpHeroShotType): PdpHeroFraming {
  return HERO_FRAMING[shotType];
}

/** Stills/spins/spec frames sit on the studio ground; lifestyle video draws on black */
export function heroSlideBackground(shotType: PdpHeroShotType): string {
  return shotType === "lifestyle" ? "#000" : PDP_HERO_STUDIO_BG;
}
