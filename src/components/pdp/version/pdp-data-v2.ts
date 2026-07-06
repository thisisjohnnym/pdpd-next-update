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

/** v4 craftsmanship card — title + short body beneath a large image */
export type PdpCraftsmanshipV4Card = {
  id: string;
  title: string;
  body: string;
  src: string;
  alt: string;
};

export const PDP_CRAFTSMANSHIP_V4_SECTION = {
  headline: "Up close",
  intro:
    "A closer look at the materials, hardware, and construction that define the Tabby.",
} as const;

/**
 * v4 craftsmanship editorial — distinct imagery from the Details closer-look
 * tiles and the studio drag-zoom slide (no product-front-916 repeat).
 */
export const PDP_CRAFTSMANSHIP_V4_CARDS = [
  {
    id: "leather",
    title: "Glove-tanned leather",
    body: "Soft, full-grain leather designed to develop character over time.",
    src: "/images/hero/tabby26/ccx04_b4bk_a99.webp",
    alt: "Macro detail of full-grain glovetanned leather and gold hardware on Tabby Shoulder Bag 26",
  },
  {
    id: "hardware",
    title: "Signature hardware",
    body: "The iconic C clasp brings Coach heritage into focus.",
    src: "/images/gallery/tabby-c-clasp-closeup.png",
    alt: "Close-up of the polished gold C turn-lock clasp with COACH engraving on black glovetanned leather",
  },
  {
    id: "interior",
    title: "Interior function",
    body: "Room for daily essentials with thoughtful organization.",
    src: "/images/gallery/tabby-leather-interior-open.png",
    alt: "Open interior of Tabby Shoulder Bag 26 showing accordion compartments and slip pocket",
  },
  {
    id: "carry",
    title: "Carry options",
    body: "Designed to be worn shoulder or crossbody.",
    src: "/images/hero/tabby26/ccx04_b4bk_a21.webp",
    alt: "Tabby Shoulder Bag 26 in black leather with the long crossbody strap extended",
  },
] satisfies PdpCraftsmanshipV4Card[];

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

/** v4 section intro — headline + subtext above the editorial carousel (Paper L2X-0). */
export const PDP_EDITORIAL_V2_SECTION = {
  headline: "The craft, up close",
  subtext:
    "On model, in the studio, and packed for the day — full-grain leather from every angle.",
} as const;

/** v4 compact UGC strip — follows The Details (Paper r5). */
export const PDP_UGC_COMMUNITY_COMPACT_SECTION = {
  headline: "Out in the wild",
  socialHandle: {
    label: "@coach.ny",
    href: "https://www.instagram.com/coach/",
  },
  /** Portrait tiles shown before the +N more card. */
  previewCount: 3,
} as const;

/** v4 section intro — subtext between headline and TikTok CTA (Paper L5X-0). */
export const PDP_UGC_COMMUNITY_SECTION = {
  subtext: "Real people, real context — not random snaps.",
} as const;

/** Customer photo in the UGC community carousel — portrait stills with context. */
export type PdpUgcCommunityPhoto = {
  id: string;
  src: string;
  alt: string;
  handle?: string;
  caption?: string;
  /** Short pull quote from the customer */
  quote?: string;
  verified?: boolean;
};

/** v4 UGC community photo rail — contextual customer stills (not studio product shots). */
export const PDP_UGC_COMMUNITY_PHOTOS = [
  {
    id: "coffee-run",
    src: "/images/reviews/ugc-coffee-run.png",
    alt: "Customer in a brown track jacket and plaid skirt with Tabby Shoulder Bag 26 outside a coffee shop",
    handle: "Jordan L.",
    caption: "Saturday coffee run",
    quote: "My go-to for slow weekend mornings.",
    verified: true,
  },
  {
    id: "city-commute",
    src: "/images/reviews/ugc-on-street.png",
    alt: "Customer at Spring St subway station with Tabby Shoulder Bag 26 and coffee in hand",
    handle: "Alex R.",
    caption: "City commute",
    quote: "Reads polished without feeling precious.",
    verified: true,
  },
  {
    id: "mirror-selfie",
    src: "/images/reviews/ugc-mirror-selfie.png",
    alt: "Customer mirror selfie with Tabby Shoulder Bag 26",
    handle: "Mia T.",
    caption: "Getting ready",
    quote: "Higher on the hip — exactly where I want it for going out.",
    verified: true,
  },
  {
    id: "outfit-flat",
    src: "/images/reviews/ugc-outfit-flat.png",
    alt: "Customer outfit flat lay with Tabby Shoulder Bag 26",
    handle: "Sam K.",
    caption: "OOTD flat lay",
    quote: "Anchors the whole look without trying too hard.",
  },
] satisfies PdpUgcCommunityPhoto[];

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
 *  3. Insert ugc-community after the studio product slide (Paper AFC-0) — below
 *     product specs and the studio drag-zoom frame, before the editorial carousel.
 *  4. Insert `editorial-carousel-v2` right after ugc-community (Paper AN3-0).
 *
 * When `omitStudioProduct` is true (v4 hero gallery owns the drag-zoom frame),
 * the studio immersive is dropped but the ugc + editorial block still inserts at
 * the top of the scroll gallery.
 *
 * Resulting gallery scroll: The Details → studio product → ugc-community →
 * editorial carousel → leather aging.
 */
export function buildV2Slides(
  v1Slides: PdpGallerySlide[],
  options?: { omitStudioProduct?: boolean },
): PdpGallerySlideV2[] {
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
    if (options?.omitStudioProduct && isStudioProductSlide(slide)) {
      return false;
    }
    return true;
  });

  const result: PdpGallerySlideV2[] = [];
  let insertedUgcBlock = false;

  const pushUgcBlock = () => {
    if (insertedUgcBlock) {
      return;
    }
    result.push({ type: "ugc-community" });
    result.push({ type: "editorial-carousel-v2" });
    insertedUgcBlock = true;
  };

  if (options?.omitStudioProduct) {
    pushUgcBlock();
  }

  for (const slide of trimmed) {
    result.push(slide);
    if (isStudioProductSlide(slide)) {
      pushUgcBlock();
    }
  }

  return result;
}

/** Tabby v2 gallery — Details, studio product, ugc-community, then editorial carousel */
export const PDP_GALLERY_SLIDES_V2: PdpGallerySlideV2[] = buildV2Slides(PDP_GALLERY_SLIDES);

/** v4 studio drag-zoom slide — 4:5 frame with copy above the image (Paper KJY-0). */
const PDP_STUDIO_PRODUCT_SLIDE_V4 = {
  headline: "Feel the leather",
  subtext:
    "Crafted to be seen—and examined. Press and hold to explore the leather grain, signature hardware, and the details that make every Tabby unique.",
  aspect: "4/5" as const,
  objectPosition: "center 62%",
} as const;

function patchStudioProductSlideForV4(
  slides: PdpGallerySlideV2[],
): PdpGallerySlideV2[] {
  return slides.map((slide) => {
    if (slide.type !== "immersive" || slide.src !== STUDIO_PRODUCT_SRC) {
      return slide;
    }
    return {
      ...slide,
      aspect: PDP_STUDIO_PRODUCT_SLIDE_V4.aspect,
      objectPosition: PDP_STUDIO_PRODUCT_SLIDE_V4.objectPosition,
      headline: PDP_STUDIO_PRODUCT_SLIDE_V4.headline,
      subtext: PDP_STUDIO_PRODUCT_SLIDE_V4.subtext,
    };
  });
}

/** Apply v4-only gallery slide patches (studio product reframing, etc.). */
export function applyV4GallerySlidePatches(
  slides: PdpGallerySlideV2[],
): PdpGallerySlideV2[] {
  return patchStudioProductSlideForV4(slides).filter(
    (slide) => slide.type !== "ugc-community",
  );
}

/** Tabby v4 gallery — same flow as v2 with the studio product slide reframed for r5. */
export const PDP_GALLERY_SLIDES_V4: PdpGallerySlideV2[] = applyV4GallerySlidePatches(
  buildV2Slides(PDP_GALLERY_SLIDES),
);
