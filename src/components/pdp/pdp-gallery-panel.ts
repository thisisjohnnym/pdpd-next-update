import type { PdpGallerySlide } from "./pdp-data";
import {
  GALLERY_PANEL_CLASS,
  GALLERY_PANEL_SNAP_CLASS,
  PDP_PANEL_SCROLL,
} from "./pdp-panel-scroll";
import { cn } from "@/lib/cn";

/** Every gallery frame is a full-height snap panel when panel scroll is on */
function isGalleryPanelSlide(_slide: PdpGallerySlide): boolean {
  return true;
}

export function getLastGalleryPanelSlideIndex(
  slides: PdpGallerySlide[],
): number {
  if (!PDP_PANEL_SCROLL) {
    return -1;
  }
  return slides.length - 1;
}

export function galleryPanelClassName(isLastPanel = false) {
  if (!PDP_PANEL_SCROLL) {
    return undefined;
  }

  return cn(
    GALLERY_PANEL_CLASS,
    GALLERY_PANEL_SNAP_CLASS,
    isLastPanel && "pdp-gallery-panel--last",
  );
}

/** @deprecated Use galleryPanelClassName — all modules are full snap panels */
function galleryPassThroughPanelClassName(isLastPanel = false) {
  return galleryPanelClassName(isLastPanel);
}
