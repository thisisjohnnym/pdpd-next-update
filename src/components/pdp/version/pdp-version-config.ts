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
  /**
   * Render the trench portrait slide when `trenchPortraitSlide` is set. v4 (Paper
   * r5) drops the slide, so it reads the object but gates on this flag.
   */
  showTrenchPortraitSlide: boolean;
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
  /**
   * Render the v4 five-up spec chips (Height / Width / Depth / Weight / Strap
   * drop) in the Details module instead of the frozen three-up spec row (Paper
   * r5 `LD6-0`). Reads `pdp-v4-specs.ts`, never mutates the frozen v1 specs.
   */
  useV4Specs: boolean;
  /**
   * Lead the Tabby hero gallery with the A0 product still instead of the
   * lifestyle land video (Paper r5). v4 only — v1/v2/v3 keep the video first.
   */
  leadGalleryWithProductStill: boolean;
  /**
   * Pin demo stock states (Sold out + Notify me) onto distinct Popular Colors in
   * the progressive color drawer so it always demos the sold-out affordance
   * (Paper r5 `J2K-0`). v4 only — mirrors the existing Explore Materials demo.
   */
  demoPopularColorStates: boolean;
  /**
   * Drop the color-derived glow/shadow on the Add to bag pill (Paper r5 feedback
   * "remove the shadow on the ATB"). v4 only — v1/v2/v3 keep the glow that lifts
   * the pill off the r4 hero scrim.
   */
  flattenBuyBarCta: boolean;
  /**
   * Left-align the Reviews, More like this, and Recently viewed section
   * headings (Paper r5 `MAE-0` / `MD6-0` / `ME6-0`) instead of the centered
   * v2/v3 layout. v4 only.
   */
  leftAlignModuleHeadings: boolean;
  /**
   * Square the product-card corners in More like this and Recently viewed
   * (Paper r5 `MD6-0` "no rounded corners" / `ME6-0`). v4 only — v1/v2/v3 keep
   * the rounded cards.
   */
  squareProductCardCorners: boolean;
  /**
   * Hide the trailing arrow icon on the "Write a review" and "View again" text
   * links (Paper r5 `MAE-0` / `ME6-0` show plain underlined text). v4 only.
   */
  hideTextLinkArrows: boolean;
  /**
   * Use the larger r5 UGC section heading type (24px / 120% line-height /
   * -0.02em tracking) instead of the v2/v3 20px heading (Paper r5 `L5X-0`
   * "UGC after hero (updated type)"). v4 only.
   */
  useV4UgcHeadingType: boolean;
  /**
   * Apply the grouped r5 padding/spacing refresh across the shared modules —
   * Reviews (`MAE-0`), More like this (`MD6-0`), Recently viewed (`ME6-0`),
   * Details (`LD6-0`), Editorial carousel (`L2X-0`), Hero (`IMP-0`), and UGC
   * (`L5X-0`). Grouped because they all flip together for v4 (precedent:
   * `leftAlignModuleHeadings` spans two modules). v4 only — v1/v2/v3 keep the
   * r3/r4 spacing. Exact per-module values live in the components.
   */
  useV4ModuleSpacing: boolean;
  /**
   * Show the Coach / Coach Outlet brand switcher strip above the video hero
   * (`PdpBrandBarReveal`). v4 (Paper r5) hides it; v1/v2/v3 keep it. When false
   * the overlay header also stops hugging the (absent) brand bar.
   */
  showBrandSwitcher: boolean;
  /**
   * Run the hero shrink/reveal choreography (intro peek + pull-to-reveal) that
   * exposes the brand switcher. v4 hides the switcher, so the reveal has nothing
   * to show — disable it and keep the hero full-bleed. v1/v2/v3 keep it.
   */
  enableHeroReveal: boolean;
  /**
   * Rebuild the leather-aging module to the r5 `JFT-0` / `LM2-0` structure:
   * image on top (no warm header band above it), then a single warm `#EFEAE7`
   * block holding a centered title, per-stage description, and the stage
   * slider. v4 only — v1/v2/v3 keep the r3/r4 `AP5-0` layout.
   */
  useV4LeatherAgingLayout: boolean;
  /**
   * Per-element GSAP scroll-scrubbed reveals on headlines (opacity + blur) and
   * content blocks (opacity + lift). v4 only — v1/v2/v3 keep pass-through
   * wrappers and the ambient section-level fade.
   */
  useV4GranularScrollReveal: boolean;
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
  showTrenchPortraitSlide: false,
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
  useV4Specs: false,
  leadGalleryWithProductStill: false,
  demoPopularColorStates: false,
  flattenBuyBarCta: false,
  leftAlignModuleHeadings: false,
  squareProductCardCorners: false,
  hideTextLinkArrows: false,
  useV4UgcHeadingType: false,
  showBrandSwitcher: true,
  enableHeroReveal: true,
  useV4ModuleSpacing: false,
  useV4LeatherAgingLayout: false,
  useV4GranularScrollReveal: false,
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
  showTrenchPortraitSlide: true,
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
  useV4Specs: false,
  leadGalleryWithProductStill: false,
  demoPopularColorStates: false,
  flattenBuyBarCta: false,
  leftAlignModuleHeadings: false,
  squareProductCardCorners: false,
  hideTextLinkArrows: false,
  useV4UgcHeadingType: false,
  showBrandSwitcher: true,
  enableHeroReveal: true,
  useV4ModuleSpacing: false,
  useV4LeatherAgingLayout: false,
  useV4GranularScrollReveal: false,
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

/**
 * v4 — Paper r5 pivot. Inherits the full v3 baseline (r4 hero/CTA scroll model,
 * progressive color drawer) and layers the r5 refinements: no trench portrait
 * slide, five-up Details specs, and the A0 product still leading the hero
 * gallery. See docs/pdp-versions.md.
 */
const V4_CONFIG: PdpVersionConfig = {
  ...V3_CONFIG,
  // r5 drops the full-viewport trench portrait slide.
  showTrenchPortraitSlide: false,
  // r5 Details module: Height / Width / Depth / Weight / Strap drop.
  useV4Specs: true,
  // r5 hero gallery leads with the A0 product still.
  leadGalleryWithProductStill: true,
  // r5 color drawer demos the sold-out + Notify me affordance on Popular Colors.
  demoPopularColorStates: true,
  // r5 feedback: flatten the Add to bag pill (no color glow/shadow).
  flattenBuyBarCta: true,
  // r5 left-aligns the Reviews + More like this headings (Recently viewed stays centered).
  leftAlignModuleHeadings: true,
  // r5 squares the product-card corners in More like this + Recently viewed.
  squareProductCardCorners: true,
  // r5 drops the arrow icon on the "Write a review" / "View again" text links.
  hideTextLinkArrows: true,
  // r5 bumps the UGC section heading to the larger 24px type.
  useV4UgcHeadingType: true,
  // r5 grouped padding/spacing refresh across the shared modules.
  useV4ModuleSpacing: true,
  // r5 restructures the leather-aging module (image on top, single warm block).
  useV4LeatherAgingLayout: true,
  // r5 hides the Coach / Coach Outlet brand switcher above the hero.
  showBrandSwitcher: false,
  // No switcher to reveal — keep the hero full-bleed (no shrink/peek).
  enableHeroReveal: false,
  // r5 scroll-scrubbed per-element reveals (headlines blur, blocks lift).
  useV4GranularScrollReveal: true,
};

const CONFIG_BY_VERSION: Record<PdpVersion, PdpVersionConfig> = {
  v1: V1_CONFIG,
  v2: V2_CONFIG,
  v3: V3_CONFIG,
  v4: V4_CONFIG,
};

export function getPdpVersionConfig(version: PdpVersion): PdpVersionConfig {
  return CONFIG_BY_VERSION[version];
}
