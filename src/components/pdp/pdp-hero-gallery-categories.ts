import type {
  PdpHeroGalleryCategory,
  PdpHeroGallerySlide,
} from "./pdp-hero-gallery-data";

export type PdpHeroGalleryCategoryId = PdpHeroGalleryCategory | "ar";

export type PdpHeroGalleryCategoryDef = {
  id: PdpHeroGalleryCategoryId;
  label: string;
  /** Scroll to the first matching slide, or invoke AR when `id === "ar"`. */
  action: "scroll" | "ar";
};

export const PDP_HERO_GALLERY_CATEGORIES: PdpHeroGalleryCategoryDef[] = [
  { id: "on-model", label: "On Model", action: "scroll" },
  { id: "360", label: "360°", action: "scroll" },
  { id: "video", label: "Video", action: "scroll" },
  { id: "product-photos", label: "Product Photos", action: "scroll" },
  { id: "fits-inside", label: "What's Inside", action: "scroll" },
];

export function formatHeroGalleryCategoryLabel(
  category: PdpHeroGalleryCategoryDef,
): string {
  return category.label;
}

/** First slide index for each scroll-based category, or -1 when absent. */
export function resolveHeroGalleryCategoryIndices(
  slides: readonly PdpHeroGallerySlide[],
): Partial<Record<PdpHeroGalleryCategory, number>> {
  const indices: Partial<Record<PdpHeroGalleryCategory, number>> = {};

  slides.forEach((slide, index) => {
    const category = slide.galleryCategory;
    if (category && indices[category] === undefined) {
      indices[category] = index;
    }
  });

  return indices;
}

function indicesForCategory(
  slides: readonly PdpHeroGallerySlide[],
  category: PdpHeroGalleryCategory,
): number[] {
  return slides.flatMap((slide, index) =>
    slide.galleryCategory === category ? [index] : [],
  );
}

function isActiveInCategoryBlock(
  slides: readonly PdpHeroGallerySlide[],
  activeIndex: number,
  category: PdpHeroGalleryCategory,
): boolean {
  const indices = indicesForCategory(slides, category);
  if (indices.length === 0) {
    return false;
  }

  if (indices.includes(activeIndex)) {
    return true;
  }

  const start = Math.min(...indices);
  const end = Math.max(...indices);
  return activeIndex >= start && activeIndex <= end;
}

/** Active category for the current slide. */
// fallow-ignore-next-line complexity
export function readHeroGalleryActiveCategory(
  slides: readonly PdpHeroGallerySlide[],
  activeIndex: number,
): PdpHeroGalleryCategoryId | null {
  const slide = slides[activeIndex];
  if (slide?.galleryCategory) {
    return slide.galleryCategory;
  }

  if (isActiveInCategoryBlock(slides, activeIndex, "ugc")) {
    return "ugc";
  }

  if (isActiveInCategoryBlock(slides, activeIndex, "video")) {
    return "video";
  }

  if (isActiveInCategoryBlock(slides, activeIndex, "on-model")) {
    return "on-model";
  }

  if (isActiveInCategoryBlock(slides, activeIndex, "product-photos")) {
    return "product-photos";
  }

  if (slide && slide.kind === "video" && slide.galleryCategory === "video") {
    return "video";
  }

  if (slide && (slide.shotType === "on-model" || slide.shotType === "lifestyle")) {
    return "on-model";
  }

  if (
    slide &&
    (slide.shotType === "product" ||
      slide.shotType === "detail" ||
      slide.shotType === "studio")
  ) {
    return "product-photos";
  }

  return null;
}
