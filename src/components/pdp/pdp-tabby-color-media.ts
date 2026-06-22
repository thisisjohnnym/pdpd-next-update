import {
  PDP_GALLERY_MORE_PHOTOS,
  PDP_GALLERY_SLIDES,
  type PdpGalleryPhoto,
  type PdpGallerySlide,
} from "./pdp-data";

const TABBY_SILVER_SOFT_PURPLE_ID = "silver-soft-purple";

const PURPLE_ON_MODEL_BOMBER =
  "/images/colors/tabby/silver-soft-purple-on-model-bomber.png";

const PURPLE_ON_MODEL_FULL =
  "/images/colors/tabby/silver-soft-purple-on-model-full.png";

const PURPLE_BOMBER_ALT =
  "Model wearing Tabby Shoulder Bag 26 in Soft Purple with a cream bomber jacket";

const PURPLE_FULL_ALT =
  "Model wearing Tabby Shoulder Bag 26 in Soft Purple with a varsity jacket and black skirt";

function isPurpleColor(colorId: string): boolean {
  return colorId === TABBY_SILVER_SOFT_PURPLE_ID;
}

function swapPurpleModelSlides(slides: PdpGallerySlide[]): PdpGallerySlide[] {
  return slides.map((slide) => {
    if (slide.type === "editorial" && slide.src.endsWith("mode22.png")) {
      return {
        ...slide,
        src: PURPLE_ON_MODEL_BOMBER,
        alt: PURPLE_BOMBER_ALT,
        objectPosition: "center top",
        caption:
          "Soft Purple glovetanned leather with signature hardware — shoulder or crossbody, your call.",
      };
    }

    if (
      slide.type === "immersive" &&
      slide.src.endsWith("tabby-on-model-trench.jpg")
    ) {
      return {
        ...slide,
        src: PURPLE_ON_MODEL_FULL,
        alt: PURPLE_FULL_ALT,
        objectPosition: "center top",
        aspect: "9/16",
        shopTheLookId: undefined,
      };
    }

    return slide;
  });
}

function swapPurpleMorePhotos(photos: PdpGalleryPhoto[]): PdpGalleryPhoto[] {
  return photos.map((photo) => {
    if (photo.id === "on-model-tee" || photo.id === "on-model-laugh") {
      return {
        ...photo,
        src: PURPLE_ON_MODEL_BOMBER,
        alt: PURPLE_BOMBER_ALT,
      };
    }

    if (photo.id === "on-model-trench") {
      return {
        ...photo,
        src: PURPLE_ON_MODEL_FULL,
        alt: PURPLE_FULL_ALT,
      };
    }

    return photo;
  });
}

/** Gallery scroll — swap on-model frames when a colorway has dedicated lifestyle assets */
export function getTabbyGallerySlidesForColor(
  colorId: string,
): PdpGallerySlide[] {
  if (!isPurpleColor(colorId)) {
    return PDP_GALLERY_SLIDES;
  }

  return swapPurpleModelSlides(PDP_GALLERY_SLIDES);
}

/** View more photos sheet — keep extended gallery in sync with color selection */
export function getTabbyGalleryMorePhotosForColor(
  colorId: string,
): PdpGalleryPhoto[] {
  if (!isPurpleColor(colorId)) {
    return PDP_GALLERY_MORE_PHOTOS;
  }

  return swapPurpleMorePhotos(PDP_GALLERY_MORE_PHOTOS);
}

/** Static hero framing for color-specific lifestyle heroes */
export function getTabbyColorHeroObjectPosition(colorId: string): string {
  return isPurpleColor(colorId) ? "center top" : "center 72%";
}
