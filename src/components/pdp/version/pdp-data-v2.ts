import { PDP_GALLERY_SLIDES, type PdpGallerySlide } from "../pdp-data";

/**
 * v2-only editorial carousel marker (Paper AN3-0 / BV4-0).
 * A standalone 4-card horizontal rail with its own image + caption data
 * (`PDP_EDITORIAL_V2_CARDS`) — it does NOT wrap v1 gallery slide renderers.
 */
export type PdpGalleryEditorialCarouselSlide = {
  type: "editorial-carousel-v2";
};

/**
 * v2-only "Carried by the community" section — replaces the v1 ugc-videos slide.
 * Rendered as a coverflow carousel of portrait TikTok creator cards (Paper AFC-0).
 */
export type PdpGalleryUgcCommunitySlide = {
  type: "ugc-community";
};

/** v2 slide union — every v1 slide plus v2-only slide types */
export type PdpGallerySlideV2 =
  | PdpGallerySlide
  | PdpGalleryEditorialCarouselSlide
  | PdpGalleryUgcCommunitySlide;

/** One editorial card in the AN3-0 carousel — image + caption, optional CTA on the last card */
export type PdpEditorialV2Card = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  cta?: { label: string; href: string };
};

/**
 * v2 editorial carousel cards (Paper AN3-0). Standalone content — lives here, not in the
 * frozen pdp-data.ts. Images verified against public/images/gallery/ alt text.
 */
export const PDP_EDITORIAL_V2_CARDS: PdpEditorialV2Card[] = [
  {
    id: "model-tee",
    src: "/images/gallery/tabby-leather-on-model-tee.png",
    alt: "Model wearing Tabby Shoulder Bag 26 with a Coach tee and suede mini skirt",
    caption:
      "Full-grain glovetanned leather with signature hardware — shoulder or crossbody, your call.",
  },
  {
    id: "hardware",
    src: "/images/gallery/tabby-leather-detail-hardware.png",
    alt: "Close-up of Tabby Shoulder Bag 26 full-grain leather and gold C clasp hardware",
    caption:
      "Glovetanned full-grain leather with signature hardware — soft, rich, and made to last.",
  },
  {
    id: "front",
    src: "/images/gallery/tabby-product-front-916.jpg",
    alt: "Tabby Shoulder Bag 26 in black full-grain leather, front studio view",
    caption:
      "See it from every angle — signature C clasp, detachable straps, and glovetanned leather throughout.",
  },
  {
    id: "capacity",
    src: "/images/gallery/tabby-leather-interior-packed.png",
    alt: "Tabby Shoulder Bag 26 interior packed with phone, wallet, and everyday essentials",
    caption: "Three compartments — room for the whole day, never overstuffed.",
    cta: { label: "See what fits inside", href: "#faq-what-fits" },
  },
];

/**
 * Slide types dropped from the v2 page flow (kept in v1).
 * Source of truth = Paper ADB-0 full scroll. Anything not in that frame is removed here.
 * signature-sounds ("Sounds of Tabby") and weight-feel are v1-only — absent from ADB-0.
 */
const V2_REMOVED_SLIDE_TYPES = new Set<PdpGallerySlide["type"]>([
  "strap-simulation",
  "view-more-photos",
  "ugc-videos",
  "signature-sounds",
  "weight-feel",
]);

/** Studio product slide — AJ2-0; editorial carousel inserts immediately after it */
const STUDIO_PRODUCT_SRC = "/images/gallery/tabby-product-front-916.jpg";

function isStudioProductSlide(slide: PdpGallerySlide): boolean {
  return slide.type === "immersive" && slide.src === STUDIO_PRODUCT_SRC;
}

function isTrenchPortraitSlide(slide: PdpGallerySlide): boolean {
  if (slide.type !== "immersive") {
    return false;
  }
  if (slide.shopTheLookId === "trench-daytime") {
    return true;
  }
  // Color-swapped Tabby lists use a different src but the same on-model trench beat.
  return (
    slide.src.includes("tabby-on-model-trench") ||
    slide.src.includes("silver-soft-purple-on-model-full")
  );
}

function isHardwareDetailSlide(slide: PdpGallerySlide): boolean {
  return slide.type === "immersive" && (slide.hotspots?.length ?? 0) > 0;
}

/**
 * Reshape a v1 slide list into the v2 flow (Paper ADB-0):
 *  1. Drop removed slide types and every standalone `editorial` — all editorial
 *     frames live in `PdpV2EditorialCarousel` (`PDP_EDITORIAL_V2_CARDS`).
 *  2. Drop trench portrait + hardware detail immersives (carousel / ecomm handle them).
 *  3. Prepend ugc-community after hero (Paper AFC-0).
 *  4. Insert `editorial-carousel-v2` right after the studio product slide (Paper AN3-0).
 *
 * Resulting gallery scroll: ugc-community → studio product → editorial carousel → leather aging.
 */
export function buildV2Slides(v1Slides: PdpGallerySlide[]): PdpGallerySlideV2[] {
  const trimmed = v1Slides.filter((slide) => {
    if (V2_REMOVED_SLIDE_TYPES.has(slide.type)) {
      return false;
    }
    // Every v1 editorial inset is merged into the 4-card carousel — no standalone renders.
    if (slide.type === "editorial") {
      return false;
    }
    if (isTrenchPortraitSlide(slide) || isHardwareDetailSlide(slide)) {
      return false;
    }
    return true;
  });

  const result: PdpGallerySlideV2[] = [{ type: "ugc-community" }];

  for (const slide of trimmed) {
    result.push(slide);
    if (isStudioProductSlide(slide)) {
      result.push({ type: "editorial-carousel-v2" });
    }
  }

  return result;
}

/** Tabby v2 gallery — ugc-community after hero, grouped craft carousel; strap/view-more removed */
export const PDP_GALLERY_SLIDES_V2: PdpGallerySlideV2[] = buildV2Slides(PDP_GALLERY_SLIDES);
