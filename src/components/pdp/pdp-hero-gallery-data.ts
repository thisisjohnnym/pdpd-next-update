import {
  PDP_GALLERY_IMMERSIVE_HERO_POSTER,
  PDP_GALLERY_IMMERSIVE_HERO_VIDEO,
} from "./pdp-data";
import type { PdpHeroShotType } from "./pdp-hero-framing";

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

type PdpHeroGalleryBaseSlide = {
  alt: string;
  shotType: PdpHeroShotType;
  headerSurface: PdpHeroSurface;
  /** When set, the gallery overlay shows a CTA while this slide is active */
  overlayCta?: PdpHeroOverlayCta;
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
export function applyV4HeroGallery(
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

/** v5 hero land — 360° product spin. */
export const HERO_GALLERY_V5_LEAD_SRC = "/videos/tabby26-spin.mp4";

/** Move a slide to index 0 without mutating the frozen source array. */
export function promoteHeroGallerySlideToLead(
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
  },
  {
    kind: "image",
    src: `${HERO_STILL_BASE}/ccx04_b4bk_a0.webp`,
    alt: "Tabby Shoulder Bag 26 in black leather, front view with gold C turnlock and shoulder strap raised",
    shotType: "product",
    headerSurface: "light",
  },
  {
    kind: "image",
    src: `${HERO_STILL_BASE}/ccx04_b4bk_a3.webp`,
    alt: "Tabby Shoulder Bag 26 in black leather, three-quarter angle showing the side zip pocket",
    shotType: "product",
    headerSurface: "light",
  },
  {
    kind: "image",
    src: `${HERO_STILL_BASE}/ccx04_b4bk_a5.webp`,
    alt: "Tabby Shoulder Bag 26 in black leather, back view with the exterior zip pocket",
    shotType: "product",
    headerSurface: "light",
  },
  {
    kind: "image",
    src: `${HERO_STILL_BASE}/ccx04_b4bk_a6.webp`,
    alt: "Overhead view inside Tabby Shoulder Bag 26 showing the accordion compartments and zip pocket",
    shotType: "detail",
    headerSurface: "light",
  },
  {
    kind: "video",
    src: "/videos/tabby26-spin.mp4",
    poster: "/images/posters/tabby26-spin.jpg",
    alt: "360-degree spin of Tabby Shoulder Bag 26 in black leather with both straps",
    shotType: "studio",
    headerSurface: "light",
  },
  {
    kind: "image",
    src: `${HERO_STILL_BASE}/ccx04_b4bk_a8.webp`,
    alt: "Tabby Shoulder Bag 26 open from above showing the empty leather-lined interior",
    shotType: "detail",
    headerSurface: "light",
    overlayCta: "fits-inside",
  },
  {
    kind: "image",
    src: `${HERO_STILL_BASE}/ccx04_b4bk_a10.webp`,
    alt: "Close-up of the gusseted base and structured panels of Tabby Shoulder Bag 26",
    shotType: "detail",
    headerSurface: "light",
  },
  {
    kind: "image",
    src: `${HERO_STILL_BASE}/ccx04_b4bk_a21.webp`,
    alt: "Tabby Shoulder Bag 26 in black leather with the long crossbody strap extended",
    shotType: "product",
    headerSurface: "light",
  },
  {
    kind: "image",
    src: `${HERO_STILL_BASE}/ccx04_b4bk_a61.webp`,
    alt: "Model in a tan trench coat wearing Tabby Shoulder Bag 26 crossbody",
    shotType: "on-model",
    headerSurface: "light",
  },
  {
    kind: "image",
    src: `${HERO_STILL_BASE}/ccx04_b4bk_a62.webp`,
    alt: "Model in a Coach tee and suede skirt wearing Tabby Shoulder Bag 26 crossbody",
    shotType: "on-model",
    headerSurface: "light",
  },
  {
    kind: "video",
    src: "/videos/tabby26-grain-leather.mp4",
    poster: "/images/posters/tabby26-grain-leather.jpg",
    alt: "Everyday essentials being packed into Tabby Shoulder Bag 26 in full-grain leather",
    shotType: "studio",
    headerSurface: "light",
  },
  {
    kind: "image",
    src: `${HERO_STILL_BASE}/ccx04_b4bk_a88.webp`,
    alt: "Tabby Shoulder Bag 26 in black leather styled with a cherry bag charm",
    shotType: "product",
    headerSurface: "light",
  },
  {
    kind: "image",
    src: `${HERO_STILL_BASE}/ccx04_b4bk_a92.webp`,
    alt: "Model leaning back in a tan trench coat with Tabby Shoulder Bag 26 at the hip",
    shotType: "on-model",
    headerSurface: "light",
  },
  {
    kind: "image",
    src: `${HERO_STILL_BASE}/ccx04_b4bk_a99.webp`,
    alt: "Macro detail of the full-grain leather and gold snap on Tabby Shoulder Bag 26",
    shotType: "detail",
    headerSurface: "light",
  },
  {
    kind: "image",
    src: `${HERO_STILL_BASE}/en_US-ToroImg_ccx04_b4bk_a101.webp`,
    alt: "Feature callouts for Tabby Shoulder Bag 26: detachable straps, snap closure, zip pocket, and leather lining",
    shotType: "studio",
    headerSurface: "light",
  },
];
