import {
  PDP_GALLERY_IMMERSIVE_HERO_POSTER,
  PDP_GALLERY_IMMERSIVE_HERO_VIDEO,
} from "./pdp-data";
import type { PdpHeroFraming, PdpHeroShotType } from "./pdp-hero-framing";

/**
 * Header chrome contrast per slide.
 * - `dark` surface → white nav (the cinematic lifestyle video)
 * - `light` surface → dark nav (studio stills + spins on the #f0f0f0 ground)
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

/** The campaign product still promoted to slide 0 in v4 (Paper r5). */
const HERO_LEAD_PRODUCT_STILL_SRC =
  "/images/gallery/tabby-product-still-red-gradient.avif";

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

/** Official Coach.com A0 head-on product still — v5 product-photos block. */
const HERO_PRODUCT_FRONT_A0_SRC = `${HERO_STILL_BASE}/ccx04_b4bk_a0.webp`;

const HERO_PRODUCT_FRONT_A0_SLIDE: PdpHeroGalleryImageSlide = {
  kind: "image",
  src: HERO_PRODUCT_FRONT_A0_SRC,
  alt: "Tabby Shoulder Bag 26 in black leather, front view with gold C turnlock clasp and dual straps",
  shotType: "product",
  headerSurface: "light",
  galleryCategory: "product-photos",
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
 *   - Keep A0 in the product block without promoting — `includeProductFrontStill`
 *     (v5 logical category order).
 *   - Swap the broken/too-small feature-callout still for the crisp r5 diagram.
 */
// fallow-ignore-next-line complexity
function applyV4HeroGallery(
  slides: PdpHeroGallerySlide[],
  options: {
    leadGalleryWithProductStill?: boolean;
    heroGalleryStudioDragZoom?: boolean;
    /** Keep the A0 front product still without promoting it to lead (v5). */
    includeProductFrontStill?: boolean;
  } = {},
): PdpHeroGallerySlide[] {
  const keepProductFront =
    options.heroGalleryStudioDragZoom ||
    options.leadGalleryWithProductStill ||
    options.includeProductFrontStill;
  const swapped = slides
    .map((slide) =>
      slide.src === HERO_FEATURE_CALLOUT_SRC
        ? { ...slide, src: HERO_FEATURE_CALLOUT_R5_SRC }
        : slide,
    )
    .filter(
      (slide) => keepProductFront || slide.src !== HERO_LEAD_PRODUCT_STILL_SRC,
    );

  if (options.heroGalleryStudioDragZoom) {
    return [HERO_STUDIO_DRAG_ZOOM_SLIDE, ...swapped];
  }

  if (!options.leadGalleryWithProductStill) {
    if (options.includeProductFrontStill) {
      const withoutA0 = swapped.filter(
        (slide) => slide.src !== HERO_PRODUCT_FRONT_A0_SRC,
      );
      // Lead the product-photos block with the official head-on A0 still.
      return [HERO_PRODUCT_FRONT_A0_SLIDE, ...withoutA0];
    }
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

/** On-model still — lifestyle mirror selfie, crossbody carry. */
const HERO_ON_MODEL_MIRROR_SELFIE_SRC =
  "/images/gallery/tabby-on-model-mirror-selfie.jpg";

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

// fallow-ignore-next-line complexity
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

  // fallow-ignore-next-line complexity
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
  heroGalleryLastSlideSrc?: string;
  heroGalleryExcludedSlideSrcs?: string[];
  /** Version-specific slides merged before category ordering (deduped by `src`). */
  heroGalleryAdditionalSlides?: PdpHeroGallerySlide[];
  heroGalleryPrependLeadSlide?: PdpHeroGallerySlide;
  heroGalleryUgcSlides?: PdpHeroGallerySlide[];
  /** Index after which UGC slides are inserted — defaults to 1 (after lead pair). */
  heroGalleryUgcInsertAfterIndex?: number;
  /**
   * v5 story order — on-model land, hero video, product stills, fits inside,
   * 360°, then community UGC appended last.
   */
  heroGalleryLogicalBlockOrder?: boolean;
};

/** Version-aware hero slide ordering — shared by mobile carousel + desktop rail. */
// fallow-ignore-next-line complexity
export function orderHeroGallerySlides(
  slides: PdpHeroGallerySlide[],
  options: HeroGalleryOrderingOptions = {},
): PdpHeroGallerySlide[] {
  const useLogicalBlocks = options.heroGalleryLogicalBlockOrder === true;
  const baseKeys = new Set(slides.map(getHeroGallerySlideKey));
  const sourceSlides = options.heroGalleryAdditionalSlides?.length
    ? [
        ...slides,
        ...options.heroGalleryAdditionalSlides.filter(
          (slide) => !baseKeys.has(getHeroGallerySlideKey(slide)),
        ),
      ]
    : slides;
  const includedSlides = options.heroGalleryExcludedSlideSrcs?.length
    ? sourceSlides.filter(
        (slide) => !options.heroGalleryExcludedSlideSrcs!.includes(slide.src),
      )
    : sourceSlides;

  let result =
    options.leadGalleryWithProductStill ||
    options.heroGalleryStudioDragZoom ||
    useLogicalBlocks
      ? applyV4HeroGallery(includedSlides, {
          // Logical blocks own land order (on-model first) — keep A0 front
          // still in the product block, but do not promote it to slide 0.
          leadGalleryWithProductStill: useLogicalBlocks
            ? false
            : options.leadGalleryWithProductStill,
          heroGalleryStudioDragZoom: options.heroGalleryStudioDragZoom,
          includeProductFrontStill: useLogicalBlocks,
        })
      : includedSlides;

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

  if (options.heroGalleryLastSlideSrc) {
    const lastSlideIndex = result.findIndex(
      (slide) => slide.src === options.heroGalleryLastSlideSrc,
    );
    if (lastSlideIndex >= 0 && lastSlideIndex < result.length - 1) {
      const lastSlide = result[lastSlideIndex]!;
      result = [
        ...result.slice(0, lastSlideIndex),
        ...result.slice(lastSlideIndex + 1),
        lastSlide,
      ];
    }
  }

  return result;
}

/**
 * Side-scrolling hero gallery for Tabby Shoulder Bag 26.
 *
 * Slide 0 is the lifestyle land video (white nav). Every following slide is a
 * studio still or product video on the #f0f0f0 ground and uses the dark nav.
 * Shot types drive cropping — see `pdp-hero-framing.ts`.
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
    src: "/images/gallery/tabby-product-still-red-gradient.avif",
    alt: "Red Tabby Shoulder Bag centered on a warm gradient studio backdrop",
    shotType: "detail",
    headerSurface: "dark",
    galleryCategory: "product-photos",
  },
  {
    kind: "image",
    src: "/images/gallery/tabby-product-still-brown-cherry-crop.avif",
    alt: "Cropped dark brown Tabby Shoulder Bag styled with a cherry charm",
    shotType: "detail",
    headerSurface: "dark",
    galleryCategory: "product-photos",
  },
  {
    kind: "image",
    src: "/images/gallery/tabby-product-still-ivory-pedestal.avif",
    alt: "Ivory Tabby Shoulder Bag arranged across black studio pedestals",
    shotType: "detail",
    headerSurface: "light",
    galleryCategory: "product-photos",
  },
  {
    kind: "image",
    src: "/images/gallery/tabby-product-still-brown-studio.avif",
    alt: "Dark brown Tabby Shoulder Bag centered on a tonal brown studio backdrop",
    shotType: "detail",
    headerSurface: "dark",
    galleryCategory: "product-photos",
  },
  {
    kind: "image",
    src: "/images/gallery/tabby-product-still-black-cherry.avif",
    alt: "Black Tabby Shoulder Bag styled with a cherry charm",
    shotType: "detail",
    headerSurface: "light",
    galleryCategory: "product-photos",
  },
  {
    kind: "image",
    src: "/images/gallery/tabby-product-still-russet-cherry.avif",
    alt: "Russet brown Tabby Shoulder Bag styled with a sparkling cherry charm",
    shotType: "detail",
    headerSurface: "light",
    galleryCategory: "product-photos",
  },
  {
    kind: "image",
    src: "/images/gallery/tabby-product-still-ivory-books.avif",
    alt: "Ivory Tabby Shoulder Bag with a cherry charm displayed on a stack of books",
    shotType: "detail",
    headerSurface: "dark",
    galleryCategory: "product-photos",
  },
  {
    kind: "image",
    src: "/images/gallery/tabby-product-still-brown-stone.avif",
    alt: "Dark brown Tabby Shoulder Bag displayed on a stone architectural pedestal",
    shotType: "detail",
    headerSurface: "dark",
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
    // First frame of the spin clip (not the a0 product still).
    poster: "/images/posters/tabby26-spin.jpg",
    alt: "360-degree spin of Tabby Shoulder Bag 26 in black leather with both straps",
    shotType: "studio",
    headerSurface: "light",
    galleryCategory: "360",
    // Autoplay when this slide is active.
    priority: true,
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
    src: HERO_ON_MODEL_MIRROR_SELFIE_SRC,
    alt: "Model in a black ribbed sweater and beige trousers with Tabby Shoulder Bag 26 in black leather worn crossbody",
    shotType: "on-model",
    headerSurface: "light",
    galleryCategory: "on-model",
  },
  {
    kind: "image",
    src: "/images/gallery/tabby-on-model-ivory-black-blazer.avif",
    alt: "Model in a black blazer carrying an ivory Tabby Shoulder Bag crossbody",
    shotType: "on-model",
    headerSurface: "light",
    galleryCategory: "on-model",
  },
  {
    kind: "image",
    src: "/images/gallery/tabby-on-model-ivory-blue-tweed-books.avif",
    alt: "Model in a blue tweed suit carrying an ivory Tabby Shoulder Bag with a cherry charm",
    shotType: "on-model",
    headerSurface: "light",
    galleryCategory: "on-model",
  },
  {
    kind: "image",
    src: "/images/gallery/tabby-on-model-ivory-blue-tweed-closeup.avif",
    alt: "Close-up of an ivory Tabby Shoulder Bag with a cherry charm worn over a blue tweed suit",
    shotType: "on-model",
    headerSurface: "light",
    galleryCategory: "on-model",
  },
  {
    kind: "image",
    src: "/images/gallery/tabby-on-model-ivory-blue-tweed-dog.avif",
    alt: "Model in a blue tweed suit carrying an ivory Tabby Shoulder Bag while posing with a dog",
    shotType: "on-model",
    headerSurface: "light",
    galleryCategory: "on-model",
  },
  {
    kind: "image",
    src: "/images/gallery/tabby-on-model-ivory-blue-tweed-bench.avif",
    alt: "Model in a blue tweed suit wearing an ivory Tabby Shoulder Bag while seated with a dog",
    shotType: "on-model",
    headerSurface: "light",
    galleryCategory: "on-model",
    framing: { objectPosition: "58% center" },
  },
  {
    kind: "image",
    src: "/images/gallery/tabby-on-model-brown-signature-coat-detail.avif",
    alt: "Close-up of a dark brown Tabby Shoulder Bag with a bow charm worn over a Signature coat",
    shotType: "on-model",
    headerSurface: "light",
    galleryCategory: "on-model",
  },
  {
    kind: "image",
    src: "/images/gallery/tabby-on-model-brown-signature-coat-stairs.avif",
    alt: "Model in a Signature coat carrying a dark brown Tabby Shoulder Bag while seated on stone steps",
    shotType: "on-model",
    headerSurface: "light",
    galleryCategory: "on-model",
  },
];
