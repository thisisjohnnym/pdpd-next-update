import {
  PDP_GALLERY_IMMERSIVE_HERO_POSTER,
  PDP_GALLERY_IMMERSIVE_HERO_VIDEO,
} from "./pdp-data";
import type {
  PdpHeroFraming,
  PdpHeroLetterboxGround,
  PdpHeroShotType,
} from "./pdp-hero-framing";

/**
 * Header chrome contrast per slide.
 * - `dark` surface → white nav (the cinematic lifestyle video)
 * - `light` surface → dark nav (studio stills + spins on grey / beige ground)
 *
 * Mirrors the `data-header-surface` convention sampled by `useHeaderContrast`.
 */
export type PdpHeroSurface = "dark" | "light";

/** Contextual CTA pinned to the hero gallery overlay on specific slides */
export type PdpHeroOverlayCta = "fits-inside";

/** Gallery wayfinding category — drives the compact category rail (v5). */
export type PdpHeroGalleryCategory =
  | "ugc"
  | "fits-inside"
  | "360"
  | "product-photos"
  | "video"
  | "on-model";

type PdpHeroGalleryBaseSlide = {
  alt: string;
  shotType: PdpHeroShotType;
  headerSurface: PdpHeroSurface;
  /** When set, the gallery overlay shows a CTA while this slide is active */
  overlayCta?: PdpHeroOverlayCta;
  /** Jump-to category for the hero gallery category rail */
  galleryCategory?: PdpHeroGalleryCategory;
  /** Per-slide crop override — e.g. contain on-model on the studio grey ground */
  framing?: Partial<PdpHeroFraming>;
  /**
   * Letterbox fill behind `contain` media. Omit to use shotType/kind defaults
   * (product/detail stills → beige; videos → grey; lifestyle → black).
   */
  ground?: PdpHeroLetterboxGround;
};

export type PdpHeroGalleryVideoSlide = PdpHeroGalleryBaseSlide & {
  kind: "video";
  src: string;
  poster?: string;
  /** Above-the-fold land slide — aggressive autoplay + blur reveal */
  priority?: boolean;
};

export type PdpHeroGalleryImageSlide = PdpHeroGalleryBaseSlide & {
  kind: "image";
  src: string;
  /** Press-and-hold magnifier lens — studio product front (916) */
  dragZoom?: boolean;
};

export type PdpHeroGallerySlide =
  | PdpHeroGalleryVideoSlide
  | PdpHeroGalleryImageSlide;

const HERO_STILL_BASE = "/images/hero/tabby26";

/** The A0 product still promoted to slide 0 in v4 (Paper r5). */
const HERO_LEAD_PRODUCT_STILL_SRC = `${HERO_STILL_BASE}/ccx04_b4bk_a0.webp`;

/**
 * Legacy grey-ground three-quarter back view — superseded by the r7 beige
 * back-view still (a5), so v5/v6 drop it via `heroGalleryExcludeSlideSrcs`.
 */
export const HERO_THREE_QUARTER_STILL_SRC = `${HERO_STILL_BASE}/ccx04_b4bk_a3.webp`;

/** Stable key for deduping and React keys. */
export function getHeroGallerySlideKey(slide: PdpHeroGallerySlide): string {
  return slide.src;
}

/** Native 9:16 studio product — drag-zoom lead in v4 hero gallery. */
const HERO_STUDIO_DRAG_ZOOM_SRC =
  "/images/gallery/tabby-product-front-916.jpg";

const HERO_STUDIO_DRAG_ZOOM_SLIDE: PdpHeroGalleryImageSlide = {
  kind: "image",
  src: HERO_STUDIO_DRAG_ZOOM_SRC,
  alt: "Tabby Shoulder Bag 26 in black full-grain leather, front view with gold C turnlock clasp and detachable straps",
  shotType: "product",
  headerSurface: "light",
  dragZoom: true,
};

/** The broken/too-small feature-callout still and its r5 replacement (Paper r5). */
const HERO_FEATURE_CALLOUT_SRC = `${HERO_STILL_BASE}/en_US-ToroImg_ccx04_b4bk_a101.webp`;
const HERO_FEATURE_CALLOUT_R5_SRC = `${HERO_STILL_BASE}/en_US-ToroImg_ccx04_b4bk_a101-r5.png`;

/**
 * v4 (Paper r5) hero gallery treatment. Returns a new array (never mutates the
 * frozen source) so v1/v2/v3 are unaffected:
 *   - Optionally lead with the studio drag-zoom product still (916) instead of
 *     the lifestyle land video — `heroGalleryStudioDragZoom`.
 *   - Otherwise lead with the A0 product still — `leadGalleryWithProductStill`.
 *   - Swap the broken/too-small feature-callout still for the crisp r5 diagram.
 */
function applyV4HeroGallery(
  slides: PdpHeroGallerySlide[],
  options: {
    leadGalleryWithProductStill?: boolean;
    heroGalleryStudioDragZoom?: boolean;
  } = {},
): PdpHeroGallerySlide[] {
  const swapped = slides
    .map((slide) =>
      slide.src === HERO_FEATURE_CALLOUT_SRC
        ? { ...slide, src: HERO_FEATURE_CALLOUT_R5_SRC }
        : slide,
    )
    .filter(
      (slide) =>
        options.heroGalleryStudioDragZoom ||
        options.leadGalleryWithProductStill ||
        slide.src !== HERO_LEAD_PRODUCT_STILL_SRC,
    );

  if (options.heroGalleryStudioDragZoom) {
    return [HERO_STUDIO_DRAG_ZOOM_SLIDE, ...swapped];
  }

  if (!options.leadGalleryWithProductStill) {
    return swapped;
  }

  const leadIndex = swapped.findIndex(
    (slide) => slide.src === HERO_LEAD_PRODUCT_STILL_SRC,
  );

  if (leadIndex <= 0) {
    return swapped;
  }

  return [
    swapped[leadIndex]!,
    ...swapped.slice(0, leadIndex),
    ...swapped.slice(leadIndex + 1),
  ];
}

/** On-model still (black slip dress) — promoted to lead in v5 on the studio ground. */
export const HERO_ON_MODEL_BLACK_DRESS_SRC =
  "/images/gallery/tabby-on-model-black-dress.png";

/** On-model still — utility jacket, plaid skirt, crossbody carry. */
const HERO_ON_MODEL_BOMBER_PLAID_SRC =
  "/images/gallery/tabby-on-model-bomber-plaid.jpg";

/** Move a slide to index 0 without mutating the frozen source array. */
function promoteHeroGallerySlideToLead(
  slides: PdpHeroGallerySlide[],
  leadSrc: string,
): PdpHeroGallerySlide[] {
  const leadIndex = slides.findIndex((slide) => slide.src === leadSrc);

  if (leadIndex <= 0) {
    return slides;
  }

  const leadSlide = slides[leadIndex]!;

  return [
    leadSlide,
    ...slides.slice(0, leadIndex),
    ...slides.slice(leadIndex + 1),
  ];
}

/**
 * Prepend an extra lead slide (deduped by `src`) without mutating the source
 * array. Used to inject a version-specific hero land video ahead of the frozen
 * base slides.
 */
function prependHeroGalleryLeadSlide(
  slides: PdpHeroGallerySlide[],
  leadSlide: PdpHeroGallerySlide,
): PdpHeroGallerySlide[] {
  const leadKey = getHeroGallerySlideKey(leadSlide);
  return [
    leadSlide,
    ...slides.filter((slide) => getHeroGallerySlideKey(slide) !== leadKey),
  ];
}

/** Insert extra slides after a given index (deduped by `src`). */
function insertHeroGallerySlidesAfter(
  slides: PdpHeroGallerySlide[],
  insertSlides: PdpHeroGallerySlide[],
  afterIndex: number,
): PdpHeroGallerySlide[] {
  if (insertSlides.length === 0) {
    return slides;
  }

  const existingKeys = new Set(slides.map(getHeroGallerySlideKey));
  const uniqueInserts = insertSlides.filter(
    (slide) => !existingKeys.has(getHeroGallerySlideKey(slide)),
  );

  if (uniqueInserts.length === 0) {
    return slides;
  }

  const index = Math.max(0, Math.min(afterIndex, slides.length - 1));

  return [
    ...slides.slice(0, index + 1),
    ...uniqueInserts,
    ...slides.slice(index + 1),
  ];
}

/** Story order for v5 category blocks — on-model land → hero video → product → … */
const HERO_GALLERY_CATEGORY_BLOCK_ORDER: PdpHeroGalleryCategory[] = [
  "on-model",
  "video",
  "product-photos",
  "fits-inside",
  "360",
  "ugc",
];

function resolveSlideGalleryCategory(
  slide: PdpHeroGallerySlide,
): PdpHeroGalleryCategory {
  if (slide.galleryCategory) {
    return slide.galleryCategory;
  }

  if (slide.overlayCta === "fits-inside") {
    return "fits-inside";
  }

  if (slide.kind === "video") {
    return slide.src.includes("spin") ? "360" : "video";
  }

  if (slide.shotType === "on-model" || slide.shotType === "lifestyle") {
    return "on-model";
  }

  return "product-photos";
}

/** Stable category-block sort — model still land, hero video, product, UGC last. */
function sortHeroGallerySlidesByCategoryBlocks(
  slides: PdpHeroGallerySlide[],
  leadSlideSrc?: string,
): PdpHeroGallerySlide[] {
  const blockRank = new Map(
    HERO_GALLERY_CATEGORY_BLOCK_ORDER.map((category, index) => [
      category,
      index,
    ]),
  );
  const onModelRank = blockRank.get("on-model") ?? 0;
  const videoRank = blockRank.get("video") ?? 1;

  const indexed = slides.map((slide, index) => ({ slide, index }));

  indexed.sort((a, b) => {
    const rankA = blockRank.get(resolveSlideGalleryCategory(a.slide)) ?? 99;
    const rankB = blockRank.get(resolveSlideGalleryCategory(b.slide)) ?? 99;

    if (rankA !== rankB) {
      return rankA - rankB;
    }

    if (rankA === onModelRank && leadSlideSrc) {
      if (a.slide.src === leadSlideSrc) {
        return -1;
      }
      if (b.slide.src === leadSlideSrc) {
        return 1;
      }
    }

    if (rankA === videoRank) {
      if (a.slide.src === PDP_GALLERY_IMMERSIVE_HERO_VIDEO) {
        return -1;
      }
      if (b.slide.src === PDP_GALLERY_IMMERSIVE_HERO_VIDEO) {
        return 1;
      }
    }

    return a.index - b.index;
  });

  return indexed.map(({ slide }) => slide);
}

export type HeroGalleryOrderingOptions = {
  leadGalleryWithProductStill?: boolean;
  heroGalleryStudioDragZoom?: boolean;
  heroGalleryLeadSlideSrc?: string;
  heroGalleryPrependLeadSlide?: PdpHeroGallerySlide;
  heroGalleryUgcSlides?: PdpHeroGallerySlide[];
  /** Index after which UGC slides are inserted — defaults to 1 (after lead pair). */
  heroGalleryUgcInsertAfterIndex?: number;
  /**
   * v5 story order — on-model land, hero video, product stills, fits inside,
   * 360°, then community UGC appended last.
   */
  heroGalleryLogicalBlockOrder?: boolean;
  /** Slide srcs dropped from the gallery — e.g. stills superseded by a reshoot. */
  heroGalleryExcludeSlideSrcs?: string[];
  /** Extra slides merged before ordering (v7 mirror selfie, etc.). */
  heroGalleryExtraSlides?: PdpHeroGallerySlide[];
  /**
   * Fill product stills (`shotType: "product"`) with `object-fit: cover` so
   * tall mobile frames do not letterbox. Studio spins / callouts stay contain.
   */
  heroProductSlidesFillFrame?: boolean;
};

/** Version-aware hero slide ordering — shared by mobile carousel + desktop rail. */
export function orderHeroGallerySlides(
  slides: PdpHeroGallerySlide[],
  options: HeroGalleryOrderingOptions = {},
): PdpHeroGallerySlide[] {
  const useLogicalBlocks = options.heroGalleryLogicalBlockOrder === true;

  const excludeSrcs = options.heroGalleryExcludeSlideSrcs;
  if (excludeSrcs?.length) {
    slides = slides.filter((slide) => !excludeSrcs.includes(slide.src));
  }

  if (options.heroGalleryExtraSlides?.length) {
    const existing = new Set(slides.map((slide) => slide.src));
    const extras = options.heroGalleryExtraSlides.filter(
      (slide) => !existing.has(slide.src),
    );
    slides = [...slides, ...extras];
  }

  let result =
    options.leadGalleryWithProductStill ||
    options.heroGalleryStudioDragZoom ||
    useLogicalBlocks
      ? applyV4HeroGallery(slides, {
          leadGalleryWithProductStill: useLogicalBlocks
            ? false
            : options.leadGalleryWithProductStill,
          heroGalleryStudioDragZoom: options.heroGalleryStudioDragZoom,
        })
      : slides;

  if (!useLogicalBlocks && options.heroGalleryLeadSlideSrc) {
    result = promoteHeroGallerySlideToLead(
      result,
      options.heroGalleryLeadSlideSrc,
    );
  }

  if (options.heroGalleryPrependLeadSlide) {
    result = prependHeroGalleryLeadSlide(
      result,
      options.heroGalleryPrependLeadSlide,
    );
  }

  if (useLogicalBlocks) {
    result = sortHeroGallerySlidesByCategoryBlocks(
      result,
      options.heroGalleryLeadSlideSrc,
    );
  }

  if (options.heroGalleryUgcSlides?.length) {
    if (useLogicalBlocks) {
      result = insertHeroGallerySlidesAfter(
        result,
        options.heroGalleryUgcSlides,
        result.length - 1,
      );
    } else {
      result = insertHeroGallerySlidesAfter(
        result,
        options.heroGalleryUgcSlides,
        options.heroGalleryUgcInsertAfterIndex ?? 1,
      );
    }
  }

  if (options.heroProductSlidesFillFrame) {
    result = result.map((slide) =>
      slide.shotType === "product"
        ? {
            ...slide,
            framing: {
              ...slide.framing,
              objectFit: "cover" as const,
              objectPosition: slide.framing?.objectPosition ?? "center",
            },
          }
        : slide,
    );
  }

  return result;
}

/**
 * Side-scrolling hero gallery for Tabby Shoulder Bag 26.
 *
 * Slide 0 is the lifestyle land video (white nav). Every following slide is a
 * studio still or product video — letterbox ground is selective (beige stills vs
 * grey spins). Shot types drive cropping — see `pdp-hero-framing.ts`.
 */
export const PDP_HERO_GALLERY_SLIDES: PdpHeroGallerySlide[] = [
  {
    kind: "video",
    src: PDP_GALLERY_IMMERSIVE_HERO_VIDEO,
    poster: PDP_GALLERY_IMMERSIVE_HERO_POSTER,
    alt: "Model in a black tank and trousers carrying Tabby Shoulder Bag 26 on a city street",
    shotType: "lifestyle",
    headerSurface: "dark",
    priority: true,
    galleryCategory: "video",
  },
  {
    kind: "image",
    src: `${HERO_STILL_BASE}/ccx04_b4bk_a0.webp`,
    alt: "Tabby Shoulder Bag 26 in black leather, front view with gold C turnlock and shoulder strap raised",
    shotType: "product",
    headerSurface: "light",
    galleryCategory: "product-photos",
  },
  {
    kind: "image",
    src: `${HERO_STILL_BASE}/ccx04_b4bk_a3.webp`,
    alt: "Tabby Shoulder Bag 26 in black leather, three-quarter angle showing the side zip pocket",
    shotType: "product",
    headerSurface: "light",
    galleryCategory: "product-photos",
    // Legacy square still on cool #f0f0f0 — not the r7 warm beige ground
    ground: "grey",
  },
  {
    kind: "image",
    src: `${HERO_STILL_BASE}/ccx04_b4bk_a5.webp`,
    alt: "Tabby Shoulder Bag 26 in black leather, back view with the exterior zip pocket",
    shotType: "product",
    headerSurface: "light",
    galleryCategory: "product-photos",
  },
  {
    kind: "image",
    src: `${HERO_STILL_BASE}/ccx04_b4bk_a6.webp`,
    alt: "Overhead view inside Tabby Shoulder Bag 26 showing the accordion compartments and zip pocket",
    shotType: "detail",
    headerSurface: "light",
    overlayCta: "fits-inside",
    galleryCategory: "fits-inside",
  },
  {
    kind: "video",
    src: "/videos/tabby26-spin.mp4",
    poster: "/images/posters/tabby26-spin.jpg",
    alt: "360-degree spin of Tabby Shoulder Bag 26 in black leather with both straps",
    shotType: "studio",
    headerSurface: "light",
    galleryCategory: "360",
    // Square spin sits small in the land frame — nudge up 20% so the bag fills better.
    framing: { scale: 1.2 },
  },
  {
    kind: "image",
    src: `${HERO_STILL_BASE}/ccx04_b4bk_a8.webp`,
    alt: "Tabby Shoulder Bag 26 open from above showing the empty leather-lined interior",
    shotType: "detail",
    headerSurface: "light",
    galleryCategory: "product-photos",
  },
  {
    kind: "image",
    src: `${HERO_STILL_BASE}/ccx04_b4bk_a10.webp`,
    alt: "Close-up of the gusseted base and structured panels of Tabby Shoulder Bag 26",
    shotType: "detail",
    headerSurface: "light",
    galleryCategory: "product-photos",
  },
  {
    kind: "image",
    src: `${HERO_STILL_BASE}/ccx04_b4bk_a21.webp`,
    alt: "Tabby Shoulder Bag 26 in black leather with the long crossbody strap extended",
    shotType: "product",
    headerSurface: "light",
    galleryCategory: "product-photos",
  },
  {
    kind: "video",
    src: "/videos/tabby26-grain-leather.mp4",
    poster: "/images/posters/tabby26-grain-leather.jpg",
    alt: "Everyday essentials being packed into Tabby Shoulder Bag 26 in full-grain leather",
    shotType: "studio",
    headerSurface: "light",
    galleryCategory: "product-photos",
  },
  {
    kind: "image",
    src: `${HERO_STILL_BASE}/ccx04_b4bk_a88.webp`,
    alt: "Tabby Shoulder Bag 26 in black leather styled with a cherry bag charm",
    shotType: "product",
    headerSurface: "light",
    galleryCategory: "product-photos",
  },
  {
    kind: "image",
    src: "/images/gallery/tabby-hand-reach.png",
    alt: "Hand reaching for the strap of Tabby Shoulder Bag 26 in black full-grain leather with gold C turnlock clasp",
    shotType: "product",
    headerSurface: "light",
    galleryCategory: "product-photos",
  },
  {
    kind: "image",
    src: HERO_ON_MODEL_BLACK_DRESS_SRC,
    alt: "Model in a black slip dress and sunglasses carrying Tabby Shoulder Bag 26 in black leather on the shoulder",
    shotType: "on-model",
    headerSurface: "light",
    galleryCategory: "on-model",
    // Tall 430×840 still — cover crops the Tabby at the land gallery seam.
    // Contain keeps the full bag in frame on the warm studio ground.
    framing: { objectFit: "contain", objectPosition: "center" },
    ground: "beige",
  },
  {
    kind: "image",
    src: HERO_ON_MODEL_BOMBER_PLAID_SRC,
    alt: "Model in a tan utility jacket and brown plaid mini skirt with Tabby Shoulder Bag 26 in black leather worn crossbody",
    shotType: "on-model",
    headerSurface: "light",
    galleryCategory: "on-model",
    // Tall 430×840 still — cover + center-top crops the Tabby out of the land frame.
    framing: { objectFit: "contain", objectPosition: "center" },
    ground: "beige",
  },
  {
    kind: "image",
    src: `${HERO_STILL_BASE}/ccx04_b4bk_a99.webp`,
    alt: "Macro detail of the full-grain leather and gold snap on Tabby Shoulder Bag 26",
    shotType: "detail",
    headerSurface: "light",
    galleryCategory: "product-photos",
    ground: "grey",
  },
  {
    kind: "image",
    src: `${HERO_STILL_BASE}/en_US-ToroImg_ccx04_b4bk_a101.webp`,
    alt: "Feature callouts for Tabby Shoulder Bag 26: detachable straps, snap closure, zip pocket, and leather lining",
    shotType: "studio",
    headerSurface: "light",
    galleryCategory: "product-photos",
  },
];
