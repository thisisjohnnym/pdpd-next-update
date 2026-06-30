import { PDP_GALLERY_SLIDES } from "../pdp-data";
import { PDP_CHAPTERS, type PdpChapter } from "../pdp-section-chapters";

import {
  PDP_GALLERY_SLIDES_V2,
  type PdpGallerySlideV2,
} from "./pdp-data-v2";
import { PDP_CHAPTERS_V2 } from "./pdp-section-chapters-v2";
import type { PdpVersion } from "./pdp-version-context";

/**
 * Single source of truth for what differs between v1 and v2.
 *
 * Shared components read these flags instead of embedding version logic inline.
 * Never branch on `version === "v2"` across the codebase — add a flag here instead.
 */
export type PdpVersionConfig = {
  /** Hero like/comment/save rail (heart, comment, save) */
  showHeroSocialRail: boolean;
  /** Comments tab + composer + replies inside reviews */
  showReviewComments: boolean;
  /** Per-review/per-comment like button */
  showReviewLikes: boolean;
  /** Coach AI on-page assistant module */
  showCoachAi: boolean;
  /** Coach Premium membership module */
  showCoachPremium: boolean;
  /** "Make it Yours" strap + charm configurator slide */
  showStrapSimulation: boolean;
  /** "View more media" gallery slide */
  showViewMoreMedia: boolean;
  /**
   * Lightweight mid-page ratings interstitial (v1 only).
   * v2 uses `useSimplifiedReviews` instead — one unified reviews block.
   */
  showReviewInterstitial: boolean;
  /** Bundle upsell module below reviews */
  showBundle: boolean;
  /** Compare / family module below reviews */
  showCompare: boolean;
  /** Leather care product upsell inside the aging module */
  showLeatherCareUpsell: boolean;
  /**
   * Render the v2 simplified reviews block (AI summary + 2 cards + CTAs)
   * instead of the full tabbed v1 reviews module.
   */
  useSimplifiedReviews: boolean;
  /**
   * Full-viewport image injected between reviews and More like this (Paper B39-0).
   * Undefined in v1 (slot not rendered).
   */
  trenchPortraitSlide?: { src: string; alt: string; objectPosition?: string };
  /** Default gallery slide list (non-Tabby fallback) */
  gallerySlides: PdpGallerySlideV2[];
  /** Wayfinding chapters for the jump bar */
  sectionChapters: PdpChapter[];
  /** Insert "The Details" module after this slide index */
  detailsAfterSlideIndex: number;
  /** Show "A closer look" heading above the 2×2 detail tile grid */
  showDetailsHeading: boolean;
  /** Use the v2 More like this layout (158px fixed-width cards) */
  useSimplifiedMoreLikeThis: boolean;
  /** Use the v2 leather aging card layout (warm header/image/controls — Paper AP5-0) */
  useSimplifiedLeatherAging: boolean;
  /** Use the v2 recently viewed vertical list (white bg — Paper BC6-0) */
  useSimplifiedRecentlyViewed: boolean;
  /** @deprecated Overlay header now follows hero slide surface; kept for API compat */
  fixedHeaderSurface: "dark" | "auto";
  /**
   * Hero infinite carousel — preserve slide on resize, settle active index on
   * scrollend, and block loop teleport while pointer is down (mouse + touch).
   */
  useStableInfiniteCarousel: boolean;
  /**
   * Pull-to-reveal — do not capture touches/wheel on the hero gallery track or
   * when the gesture is predominantly horizontal.
   */
  heroRevealDeferToHorizontalGallery: boolean;
  /**
   * Use the v2 reshaped gallery slide list (UGC after hero, grouped craft
   * carousel, removed modules). True for v2 and v3 — v3 inherits v2 modules.
   */
  galleryUsesV2Slides: boolean;
  /**
   * Hero land scrolls with the page (Paper r4 `F9R-0`) instead of sitting as a
   * fixed 100svh chrome island above the scroll document.
   */
  heroScrollsWithPage: boolean;
  /**
   * Color + Add to bag dock inside the hero footer (Paper r4 `FGQ-0`) rather
   * than only as the floating bar.
   */
  heroDockedBuyBar: boolean;
  /**
   * Floating buy bar appears only after the hero scrolls out of view (Paper r4
   * `F5Z-0`). When false, the floating bar is always mounted (v1/v2).
   */
  floatingBuyBarWhenHeroHidden: boolean;
  /**
   * Render the progressive in-context color drawer (Paper r4 `EU5-0` / `EIE-0`)
   * instead of the flat `PdpColorSheet`.
   */
  useV3ColorSheet: boolean;
  /**
   * Show the section jump bar (replaces the CTA past "The Details"). r4 keeps the
   * floating buy bar instead, so v3 disables the jump bar entirely.
   */
  showSectionJumpBar: boolean;
};

const V1_CONFIG: PdpVersionConfig = {
  showHeroSocialRail: true,
  showReviewComments: true,
  showReviewLikes: true,
  showCoachAi: true,
  showCoachPremium: true,
  showStrapSimulation: true,
  showViewMoreMedia: true,
  showReviewInterstitial: false,
  showBundle: true,
  showCompare: true,
  showLeatherCareUpsell: true,
  useSimplifiedReviews: false,
  gallerySlides: PDP_GALLERY_SLIDES,
  sectionChapters: PDP_CHAPTERS,
  detailsAfterSlideIndex: 1,
  showDetailsHeading: true,
  useSimplifiedMoreLikeThis: false,
  useSimplifiedLeatherAging: false,
  useSimplifiedRecentlyViewed: false,
  fixedHeaderSurface: "auto",
  useStableInfiniteCarousel: false,
  heroRevealDeferToHorizontalGallery: false,
  galleryUsesV2Slides: false,
  heroScrollsWithPage: false,
  heroDockedBuyBar: false,
  floatingBuyBarWhenHeroHidden: false,
  useV3ColorSheet: false,
  showSectionJumpBar: true,
};

const V2_CONFIG: PdpVersionConfig = {
  showHeroSocialRail: false,
  showReviewComments: false,
  showReviewLikes: false,
  showCoachAi: false,
  showCoachPremium: false,
  showStrapSimulation: false,
  showViewMoreMedia: false,
  // v2 has no standalone teaser — one unified simplified reviews block (useSimplifiedReviews).
  showReviewInterstitial: false,
  showBundle: false,
  showCompare: false,
  showLeatherCareUpsell: false,
  useSimplifiedReviews: true,
  // Paper B39-0 "Slide trench portrait" — full-viewport image between reviews and More like this.
  trenchPortraitSlide: {
    src: "/images/gallery/tabby-on-model-trench.jpg",
    alt: "Model wearing Tabby Shoulder Bag 26 with a tan trench coat over the shoulder",
    objectPosition: "center top",
  },
  gallerySlides: PDP_GALLERY_SLIDES_V2,
  sectionChapters: PDP_CHAPTERS_V2,
  // The Details injects after slide[0] (ugc-community), before the studio product slide.
  detailsAfterSlideIndex: 0,
  // v2 Paper AHD-0: no "A closer look" sub-heading — tiles flow directly from spec row.
  showDetailsHeading: false,
  useSimplifiedMoreLikeThis: true,
  useSimplifiedLeatherAging: true,
  useSimplifiedRecentlyViewed: true,
  fixedHeaderSurface: "auto",
  useStableInfiniteCarousel: true,
  heroRevealDeferToHorizontalGallery: true,
  // v2 reshapes the gallery (UGC after hero, grouped craft carousel, removals).
  galleryUsesV2Slides: true,
  heroScrollsWithPage: false,
  heroDockedBuyBar: false,
  floatingBuyBarWhenHeroHidden: false,
  useV3ColorSheet: false,
  showSectionJumpBar: true,
};

/**
 * v3 — Paper r4 pivot. Inherits the v2 module order, then layers the r4 hero
 * (docked buy bar in document flow), the floating-on-scroll CTA, and the
 * progressive in-context color drawer. See docs/pdp-versions.md.
 */
const V3_CONFIG: PdpVersionConfig = {
  ...V2_CONFIG,
  // r4 hero land: docked CTA in scroll flow, floating bar returns on scroll.
  heroScrollsWithPage: true,
  heroDockedBuyBar: true,
  floatingBuyBarWhenHeroHidden: true,
  useV3ColorSheet: true,
  // r4 surfaces the floating buy bar past the hero, not the chapter jump bar.
  showSectionJumpBar: false,
};

const CONFIG_BY_VERSION: Record<PdpVersion, PdpVersionConfig> = {
  v1: V1_CONFIG,
  v2: V2_CONFIG,
  v3: V3_CONFIG,
};

export function getPdpVersionConfig(version: PdpVersion): PdpVersionConfig {
  return CONFIG_BY_VERSION[version];
}
