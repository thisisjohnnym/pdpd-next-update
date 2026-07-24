import type { PdpHeroGallerySlide } from "./pdp-hero-gallery-data";
import {
  resolveUxrColorPack,
  type UxrColorPack,
} from "./pdp-uxr-study";
import {
  PDP_GET_THE_HIGHLIGHTS_CARDS,
  type PdpGetTheHighlightsCard,
} from "./version/pdp-data-v2";

/** UXR packs are full-bleed art — always cover the cell (no letterbox gaps). */
const UXR_FILL_FRAME = {
  objectFit: "cover" as const,
  objectPosition: "center center",
};

function heroImage(
  pack: UxrColorPack,
  file: string,
  alt: string,
  galleryCategory: PdpHeroGallerySlide["galleryCategory"] = "on-model",
): PdpHeroGallerySlide {
  return {
    kind: "image",
    src: `/images/uxr/hero/${pack}/${file}`,
    alt,
    // Keep cover framing for every UXR still; category only drives the navigator.
    shotType: "on-model",
    framing: UXR_FILL_FRAME,
    headerSurface: "light",
    galleryCategory,
  };
}

function heroSpin(pack: UxrColorPack): PdpHeroGallerySlide {
  const label = pack === "beige" ? "beige" : "black";
  return {
    kind: "video",
    src: `/videos/uxr/hero/${pack}/02-360.mp4`,
    // First decoded frame of the spin — never the a0 / hero still.
    poster: `/images/uxr/hero/${pack}/02-360-poster.jpg`,
    alt: `Tabby Shoulder Bag 26 360° spin in ${label} leather`,
    shotType: "on-model",
    framing: UXR_FILL_FRAME,
    headerSurface: "light",
    galleryCategory: "360",
    // Autoplay when this slide is active (same policy as land hero video).
    priority: true,
  };
}

/**
 * Ordered UXR hero pack (Desktop assets, labeled 1–7).
 * Slide 2 is the 360 spin; the rest are stills.
 */
export function getUxrHeroGallerySlides(
  colorId: string | undefined,
): PdpHeroGallerySlide[] {
  const pack = resolveUxrColorPack(colorId);
  const tone = pack === "beige" ? "beige" : "black";
  // `01-a0` = high-res land still (cache-busted filename vs old 01.png).
  const stillExt = pack === "beige"
    ? (["01-a0.png", "03.webp", "04.webp", "05.webp", "06.webp", "07.webp"] as const)
    : (["01-a0.png", "03.png", "04.png", "05.webp", "06.png", "07.webp"] as const);

  // Categories feed the bottom-left gallery navigator (needs >1 section).
  return [
    heroImage(
      pack,
      stillExt[0],
      `Tabby Shoulder Bag 26 in ${tone} — hero still 1`,
      "on-model",
    ),
    heroSpin(pack),
    heroImage(
      pack,
      stillExt[1],
      `Tabby Shoulder Bag 26 in ${tone} — hero still 3`,
      "product-photos",
    ),
    heroImage(
      pack,
      stillExt[2],
      `Tabby Shoulder Bag 26 in ${tone} — hero still 4`,
      "product-photos",
    ),
    heroImage(
      pack,
      stillExt[3],
      `Tabby Shoulder Bag 26 in ${tone} — hero still 5`,
      "product-photos",
    ),
    heroImage(
      pack,
      stillExt[4],
      `Tabby Shoulder Bag 26 in ${tone} — hero still 6`,
      "product-photos",
    ),
    heroImage(
      pack,
      stillExt[5],
      `Tabby Shoulder Bag 26 in ${tone} — hero still 7`,
      "product-photos",
    ),
  ];
}

/**
 * Get the highlights cards with color-matched stills.
 * Keeps the “An Icon, Reimagined” film card; swaps the four still cards.
 */
export function getUxrGetTheHighlightsCards(
  colorId: string | undefined,
): PdpGetTheHighlightsCard[] {
  const pack = resolveUxrColorPack(colorId);
  const tone = pack === "beige" ? "beige" : "black";
  const stills = [
    `/images/uxr/gth/${pack}/01.png`,
    `/images/uxr/gth/${pack}/02.png`,
    `/images/uxr/gth/${pack}/03.png`,
    `/images/uxr/gth/${pack}/04.png`,
  ] as const;

  let stillIndex = 0;

  return PDP_GET_THE_HIGHLIGHTS_CARDS.map((card) => {
    // Keep the film / video card; only still cards use the UXR pack.
    if (card.videoSrc) {
      return card;
    }

    const src = stills[stillIndex] ?? stills[0];
    stillIndex += 1;

    return {
      ...card,
      src,
      alt: `${card.title} — Tabby Shoulder Bag 26 in ${tone}`,
      objectPosition: "center",
    };
  });
}
