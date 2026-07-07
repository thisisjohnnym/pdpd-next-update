"use client";

import { createContext, useContext } from "react";

import type {
  PdpHeroGallerySlide,
  PdpHeroOverlayCta,
  PdpHeroSurface,
} from "./pdp-hero-gallery-data";

export type PdpHeroGalleryState = {
  /** Index of the slide currently snapped into view */
  activeIndex: number;
  /** Total slide count — indicator hides itself when <= 1 */
  count: number;
  /** Active slide's nav surface — drives indicator tone (white on video, dark on stills) */
  surface: PdpHeroSurface;
  /** Optional overlay CTA for the active slide (e.g. interior open → What fits inside) */
  overlayCta?: PdpHeroOverlayCta;
  /** Ordered slides — category rail resolves jump targets from this list */
  slides: readonly PdpHeroGallerySlide[];
  /** Smooth-scroll the carousel to a logical slide index */
  scrollToIndex: (index: number) => void;
};

const noopScroll = () => {};

const PdpHeroGalleryContext = createContext<PdpHeroGalleryState>({
  activeIndex: 0,
  count: 0,
  surface: "dark",
  slides: [],
  scrollToIndex: noopScroll,
});

export const PdpHeroGalleryProvider = PdpHeroGalleryContext.Provider;

export function usePdpHeroGallery(): PdpHeroGalleryState {
  return useContext(PdpHeroGalleryContext);
}
