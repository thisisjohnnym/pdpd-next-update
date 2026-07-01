"use client";

import { createContext, useContext } from "react";

import type { PdpHeroSurface } from "./pdp-hero-gallery-data";

export type PdpHeroGalleryState = {
  /** Index of the slide currently snapped into view */
  activeIndex: number;
  /** Total slide count — indicator hides itself when <= 1 */
  count: number;
  /** Active slide's nav surface — drives indicator tone (white on video, dark on stills) */
  surface: PdpHeroSurface;
};

const PdpHeroGalleryContext = createContext<PdpHeroGalleryState>({
  activeIndex: 0,
  count: 0,
  surface: "dark",
});

export const PdpHeroGalleryProvider = PdpHeroGalleryContext.Provider;

export function usePdpHeroGallery(): PdpHeroGalleryState {
  return useContext(PdpHeroGalleryContext);
}
