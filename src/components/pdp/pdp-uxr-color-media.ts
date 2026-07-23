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
): PdpHeroGallerySlide {
  return {
    kind: "image",
    src: `/images/uxr/hero/${pack}/${file}`,
    alt,
    // on-model defaults to cover; framing lock stops contain fallbacks.
    shotType: "on-model",
    framing: UXR_FILL_FRAME,
    headerSurface: "light",
    galleryCategory: "on-model",
  };
}

function heroSpin(pack: UxrColorPack): PdpHeroGallerySlide {
  const label = pack === "beige" ? "beige" : "black";
  return {
    kind: "video",
    src: `/videos/uxr/hero/${pack}/02-360.mp4`,
    poster: `/images/uxr/hero/${pack}/01.png`,
    alt: `Tabby Shoulder Bag 26 360° spin in ${label} leather`,
    shotType: "on-model",
    framing: UXR_FILL_FRAME,
    headerSurface: "light",
    galleryCategory: "360",
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
  const stillExt = pack === "beige"
    ? (["01.png", "03.webp", "04.webp", "05.webp", "06.webp", "07.webp"] as const)
    : (["01.png", "03.png", "04.png", "05.webp", "06.png", "07.webp"] as const);

  return [
    heroImage(pack, stillExt[0], `Tabby Shoulder Bag 26 in ${tone} — hero still 1`),
    heroSpin(pack),
    heroImage(pack, stillExt[1], `Tabby Shoulder Bag 26 in ${tone} — hero still 3`),
    heroImage(pack, stillExt[2], `Tabby Shoulder Bag 26 in ${tone} — hero still 4`),
    heroImage(pack, stillExt[3], `Tabby Shoulder Bag 26 in ${tone} — hero still 5`),
    heroImage(pack, stillExt[4], `Tabby Shoulder Bag 26 in ${tone} — hero still 6`),
    heroImage(pack, stillExt[5], `Tabby Shoulder Bag 26 in ${tone} — hero still 7`),
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
