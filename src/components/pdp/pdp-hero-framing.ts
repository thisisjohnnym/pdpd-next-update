/**
 * Shot-type framing presets for the hero gallery.
 *
 * Coach product stills are either warm beige (#f0eae7, r7 Tabby) or cool studio
 * grey (#f0f0f0). Lifestyle/on-model assets are full-bleed scenes. Rather than
 * hand-tune `object-position` per asset, each slide declares a `shotType` and
 * this resolver returns the crop strategy:
 *
 * - Full product shots (`product`) and spec/infographic frames (`studio`) use
 *   `contain` so the whole bag — straps included — is visible. Letterbox color
 *   must match that asset’s ground (beige vs grey) or sides look wrong.
 * - Close-ups (`detail`) and lifestyle/on-model scenes fill the frame with `cover`,
 *   biasing the focal point (faces up top, lifestyle slightly above center).
 * - Letterboxed videos (360 spin, packing) stay on cool grey — never warm beige.
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

/** Letterbox / slide-cell fill behind contain media */
export type PdpHeroLetterboxGround = "black" | "grey" | "beige";

export type PdpHeroFraming = {
  objectFit: "cover" | "contain";
  objectPosition: string;
  /** Optical zoom inside the slide cell — e.g. 1.2 for a 20% enlarge on contain media */
  scale?: number;
};

/** Cool studio grey — spins, packing clips, legacy square stills */
export const PDP_HERO_STUDIO_BG = "#f0f0f0";

/** Warm beige — r7 Tabby product / detail stills (sampled #f0eae7) */
export const PDP_HERO_BEIGE_BG = "#f0eae7";

export const PDP_HERO_GROUND: Record<PdpHeroLetterboxGround, string> = {
  black: "#000000",
  grey: PDP_HERO_STUDIO_BG,
  beige: PDP_HERO_BEIGE_BG,
};

/** Tailwind classes for letterbox fills */
export const PDP_HERO_GROUND_CLASS: Record<PdpHeroLetterboxGround, string> = {
  black: "bg-black",
  grey: "bg-[#f0f0f0]",
  beige: "bg-[#f0eae7]",
};

/** @deprecated Prefer `PDP_HERO_GROUND_CLASS.grey` — cool studio letterbox */
export const PDP_HERO_STUDIO_BG_CLASS = PDP_HERO_GROUND_CLASS.grey;

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

function resolveHeroFraming(shotType: PdpHeroShotType): PdpHeroFraming {
  return HERO_FRAMING[shotType];
}

/** Merge shot-type defaults with optional per-slide overrides. */
export function resolveHeroSlideFraming(
  shotType: PdpHeroShotType,
  override?: Partial<PdpHeroFraming>,
): PdpHeroFraming {
  return { ...resolveHeroFraming(shotType), ...override };
}

/**
 * Letterbox color behind contain media.
 * Explicit `ground` wins; otherwise videos → grey, lifestyle → black,
 * product/detail stills → beige, studio/on-model → grey.
 */
export function resolveHeroLetterboxGround(
  shotType: PdpHeroShotType,
  kind: "image" | "video",
  ground?: PdpHeroLetterboxGround,
): PdpHeroLetterboxGround {
  if (ground) {
    return ground;
  }
  if (shotType === "lifestyle") {
    return "black";
  }
  // Spins / packing clips letterbox on cool grey — not warm product beige
  if (kind === "video") {
    return "grey";
  }
  if (shotType === "product" || shotType === "detail") {
    return "beige";
  }
  return "grey";
}

/** Hex fill for a slide cell — selective so videos are not warm-beige letterboxed */
export function heroSlideBackground(
  shotType: PdpHeroShotType,
  kind: "image" | "video" = "image",
  ground?: PdpHeroLetterboxGround,
): string {
  return PDP_HERO_GROUND[resolveHeroLetterboxGround(shotType, kind, ground)];
}
