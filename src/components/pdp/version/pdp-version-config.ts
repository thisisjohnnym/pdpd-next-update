import { PDP_GALLERY_SLIDES } from "../pdp-data";
import { HERO_360_INTRO_VIDEO_SRC } from "../pdp-video-sources";
import {
  HERO_GALLERY_V5_LEAD_SRC,
  type PdpHeroGallerySlide,
} from "../pdp-hero-gallery-data";
import { PDP_CHAPTERS, type PdpChapter } from "../pdp-section-chapters";

import {
  PDP_GALLERY_SLIDES_V2,
  PDP_GALLERY_SLIDES_V4,
  buildHeroGallerySlidesFromUgcTestimonials,
  HERO_GALLERY_V5_UGC_TESTIMONIAL_IDS,
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
  /**
   * v5 More like this — viewport-based ~1.5-card peek rail (vs 158px fixed baseline).
   */
  moreLikeThisLargeCards: boolean;
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
   * Mount the fixed floating Color + Add to bag bar. Disable when the docked
   * hero footer ATB is sufficient (temporary v5 polish — easy to restore).
   */
  showFloatingBuyBar: boolean;
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
   * Superseded when `heroGalleryStudioDragZoom` is true.
   */
  leadGalleryWithProductStill: boolean;
  /**
   * Lead the Tabby hero gallery with the studio drag-zoom product still (916)
   * and drop the duplicate from the vertical scroll gallery. v4 only.
   */
  heroGalleryStudioDragZoom: boolean;
  /**
   * Promote a specific hero still to slide 0 after the v4 reorder (v5 back-view
   * land). Empty string = disabled. v5 only.
   */
  heroGalleryLeadSlideSrc: string;
  /**
   * Prepend an extra hero land slide ahead of the base slides (deduped by src),
   * applied after `heroGalleryLeadSlideSrc`. Used to lead the gallery with a
   * version-specific video. Undefined = disabled. v5 only.
   */
  heroGalleryPrependLeadSlide?: PdpHeroGallerySlide;
  /**
   * UGC testimonial slides woven into the hero carousel after the lead pair.
   * Built from `PDP_UGC_TESTIMONIALS` via `buildHeroGallerySlidesFromUgcTestimonials`.
   * v5 only.
   */
  heroGalleryUgcSlides?: PdpHeroGallerySlide[];
  /**
   * Index after which `heroGalleryUgcSlides` are inserted. v5 defaults to 1
   * (after the unboxing + lifestyle lead videos).
   */
  heroGalleryUgcInsertAfterIndex?: number;
  /**
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
   * Hide the grey "Color" caption above the shade name in the docked hero buy-bar
   * pill — keep swatch + shade + chevron only (Paper r5). v4 only — v3 keeps the
   * two-line pill.
   */
  hideBuyBarColorLabel: boolean;
  /**
   * Hide the "Color: {shade}" caption above the below-fold swatch row. v5 only.
   */
  hideHeroColorSwatchLabel: boolean;
  /**
   * Drop the shopping_bag icon on the docked + floating buy-bar Add to bag pill.
   * v4+ — v1/v2/v3 keep the icon beside the label.
   */
  hideBuyBarAtbIcon: boolean;
  /**
   * Hide the color pill on the docked hero footer — land shows Add to bag only.
   * Hide the color dropdown pill on docked hero land — inline swatch carousel still
   * shows when inlineBuyBarColorSwatches is on. v5 only.
   */
  hideDockedBuyBarColor: boolean;
  /**
   * Show all color swatches inline below the hero shell (below the fold).
   * Docked hero + floating sticky bar show Add to bag only. v5 only.
   */
  inlineBuyBarColorSwatches: boolean;
  /**
   * Replace the below-fold swatch grid with compact color dots below Add to bag.
   * v5 only.
   */
  useCompactBuyBarColorDots: boolean;
  /**
   * Solid color dots shown before the +N label in the compact buy-bar row.
   * v5 only.
   */
  compactBuyBarColorDotCount: number;
  /**
   * Hide the grey "Size {n} · {price}" caption in the progressive color
   * drawer header (Paper r5). v4 only — v3 keeps the size/price meta line.
   */
  hideColorSheetSizePrice: boolean;
  /**
   * Flat color drawer — one list under "Choose color" for the current bag only
   * (no Popular Colors / Explore Materials sections, no bag size rail). v5 only.
   */
  flatColorSheet: boolean;
  /**
   * Hide the "In stock" subtitle on color rows — only show callouts for low
   * stock or sold out. v5 only.
   */
  hideInStockColorLabel: boolean;
  /**
   * Keep the side-scrolling hero gallery when the shopper picks another colorway
   * — do not swap to a color-specific static hero image. v5 only.
   */
  lockHeroGalleryTemplate: boolean;
  /**
   * Hero footer material line — show "Quilted Leather" on its own gray line
   * instead of "in Quilted Leather". v5 only.
   */
  heroMaterialSubtitleLine: boolean;
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
   * Square pill CTAs — Add to bag, color selector, reviews, sheets. v4+.
   */
  squareButtonCorners: boolean;
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
   * Details closer-look tiles — horizontal snap-start peek rail with dot
   * pagination instead of the 2×2 column grid. v4 only (Paper r5 `LDS-0`).
   */
  useV4DetailsTileCarousel: boolean;
  /**
   * Editorial two-column Details sheet (Paper node 407:399) — 28px heading,
   * 16px label/value pairs, one hairline under every fact, no hint lines, no
   * vertical column rule. Replaces the compact v4 spec list. v5 only.
   */
  useV5DetailsSheet: boolean;
  /** Show the closer-look image tile gallery beneath the Details specs. */
  showDetailsCloserLook: boolean;
  /**
   * Replace the horizontal editorial carousel with a craftsmanship carousel
   * editorial stack (Paper r5). v4 only.
   */
  useV4CraftsmanshipLayout: boolean;
  /**
   * Compact UGC strip before The Details — "Out in the wild" header row,
   * small rounded portrait tiles, and a +N more card. v4 only; removes the
   * standalone `ugc-community` gallery slide.
   */
  useV4CompactUgcStrip: boolean;
  /**
   * Group Out in the wild by lifestyle topic (Weekend / Commute / …) instead of
   * Videos / Photos. v5 compact strip + sheet only.
   */
  useUgcTopicThemes: boolean;
  /**
   * INEZ-style testimonial carousel — one portrait, pull quote, social link,
   * and Full review CTA on a dark editorial band. v5 only; replaces the compact
   * portrait strip when true.
   */
  useV5UgcTestimonialCarousel: boolean;
  /**
   * 9:16 blush editorial quote card after What customers are saying. v5 only.
   */
  showEditorialQuoteCard: boolean;
  /**
   * Fixed "+N more" label on the compact UGC strip — when > 0, replaces the
   * data-driven count. v5 uses 6 to match the Coach community grid. 0 = auto.
   */
  compactUgcMoreCountOverride: number;
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
   * Checkmark tags under the reviews UGC rail ("Premium leather", etc.).
   * v5 drops them — photos + AI summary carry the story.
   */
  showReviewHighlightTags: boolean;
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
   * Leather aging — left-aligned title + caption above the image on white
   * Leather aging — title + evergreen intro above the image; slider below with
   * no per-stage caption (no warm `#EFEAE7` block). v5 only.
   */
  leatherAgingHeaderAboveImage: boolean;
  /**
   * Replace the leather-aging dot-and-connector stepper with a continuous
   * Apple-style rail slider (rounded track, near-black progress fill, subtle
   * stage ticks, white circular knob with layered shadow that scales on press).
   * v5 only — v1-v4 keep the dot track + morphing black pill thumb.
   */
  useRailLeatherAgingSlider: boolean;
  /**
   * Drop the "· {count} reviews" tail from the reviews summary line — keep the
   * stars + average only. v5 only; v4 keeps the full aggregate line.
   */
  hideReviewCountRecommend: boolean;
  /**
   * Hide the aggregate star rating row under the reviews module headline.
   * v5 only — v4 keeps stars + summary line.
   */
  hideReviewSummaryRating: boolean;
  /**
   * Bump the reviews AI-summary tray text up one step (compact 14px body vs the
   * xs 11px). v5 only; v4 keeps the extra-small tray.
   */
  enlargeReviewAiSummary: boolean;
  /**
   * Hide the topic caption ("Saturday coffee run", etc.) above each quote in the
   * reviews UGC moments rail — keep the quote + handle only. v5 only; v4 keeps
   * the caption.
   */
  hideReviewUgcMomentCaption: boolean;
  /**
   * Bump quote + handle type one step in the reviews UGC moments rail. v5 only.
   */
  enlargeReviewUgcMomentText: boolean;
  /**
   * Unify module H1s to `pdpType.headline` (20px) — matches The Details and
   * Out in the wild instead of the legacy 24px r5 override. v5 only.
   */
  useConsistentModuleHeadings: boolean;
  /**
   * Per-element GSAP scroll-triggered reveals on headlines (opacity + blur) and
   * content blocks (opacity + lift). v4 only — v1/v2/v3 keep pass-through
   * wrappers and the ambient section-level fade.
   */
  useV4GranularScrollReveal: boolean;
  /**
   * Horizontal "Ways to wear it" styling module after Up close. v5 only.
   */
  showWaysToWearModule: boolean;
  /**
   * Full-bleed "Crafted to last" video after leather aging, before reviews. v5 only.
   */
  showCraftedToLastVideo: boolean;
  /**
   * Pad below-fold hero color rows with visual-only swatch placeholders for
   * sparse size tabs. v5 prototype only.
   */
  demoHeroColorSwatchRow: boolean;
  /**
   * Collapse the below-fold hero color row — short preview plus a +N more tile
   * that opens the full color sheet. v5 only.
   */
  collapseHeroColorSwatches: boolean;
  /**
   * Swatches shown before the +N more tile (selected color is always included).
   */
  heroColorSwatchPreviewCount: number;
  /**
   * Fixed +N more label — when > 0, replaces the data-driven hidden count.
   * 0 = auto.
   */
  heroColorSwatchMoreCountOverride: number;
  /**
   * Hide Tabby size cards in the buy-box selector and show editorial
   * "Explore Other Tabby Silhouettes" product navigation below color. v5 only.
   */
  showTabbyAlsoAvailableAs: boolean;
  /**
   * Responsive desktop layout — at lg+ the hero + product gallery becomes a
   * two-column split (scrolling media left, sticky buy panel right) and the
   * below-fold modules center to a max-width container. v5 only; mobile is
   * untouched. v1-v4 keep the full-bleed mobile-stretch layout.
   */
  desktopSplitLayout: boolean;
  /**
   * Drop the "No impact to credit." sentence from the Afterpay pay-over-time
   * card so the copy fits one line. v5 only — v1-v4 keep the full sentence.
   */
  hidePayOverTimeCreditNote: boolean;
  /**
   * Show a contextual "What fits" overlay action beside Try On in the hero
   * gallery when the open-interior slide is active. Taps jump to the "what fits
   * inside" capacity card. v5 only — requires the docked buy-bar gallery overlay.
   */
  showHeroFitsInsideCta: boolean;
  /**
   * Replace the bottom-left tick slide indicator with a full-bleed progress bar
   * pinned to the gallery's bottom edge (reads as attached to the top of the
   * white product footer). v5 only — v1-v4 keep the tick indicator.
   */
  useHeroGalleryProgressBar: boolean;
  /**
   * Show the AR "Try On" affordance (hero action rail / gallery overlay button
   * that opens the UI-only try-on preview). Disabled on v5 for now — easy to
   * restore. v1-v4 keep it.
   */
  showArTryOn: boolean;
  /**
   * Compact category rail over the hero gallery — UGC · 360 · AR · Fits inside.
   * Replaces the standalone AR button when active. v5 only.
   */
  showHeroGalleryCategoryRail: boolean;
  /**
   * Mobile hero gallery scrolls vertically (snap stack) instead of horizontal
   * carousel. v6 UXR variant only.
   */
  heroVerticalGallery: boolean;
  /**
   * Play a one-shot 360° intro clip before the hero gallery (UI hidden until
   * settle + stagger reveal). v6 mobile only.
   */
  hero360IntroEnabled: boolean;
  /** Source for `hero360IntroEnabled` — empty when disabled. v6 only. */
  hero360IntroVideoSrc: string;
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
  moreLikeThisLargeCards: false,
  useSimplifiedLeatherAging: false,
  useSimplifiedRecentlyViewed: false,
  fixedHeaderSurface: "auto",
  useStableInfiniteCarousel: false,
  heroRevealDeferToHorizontalGallery: false,
  galleryUsesV2Slides: false,
  heroScrollsWithPage: false,
  heroDockedBuyBar: false,
  floatingBuyBarWhenHeroHidden: false,
  showFloatingBuyBar: true,
  useV3ColorSheet: false,
  showSectionJumpBar: true,
  useV4Specs: false,
  leadGalleryWithProductStill: false,
  heroGalleryStudioDragZoom: false,
  heroGalleryLeadSlideSrc: "",
  demoPopularColorStates: false,
  flattenBuyBarCta: false,
  hideBuyBarColorLabel: false,
  hideHeroColorSwatchLabel: false,
  hideBuyBarAtbIcon: false,
  hideDockedBuyBarColor: false,
  inlineBuyBarColorSwatches: false,
  useCompactBuyBarColorDots: false,
  compactBuyBarColorDotCount: 0,
  hideColorSheetSizePrice: false,
  flatColorSheet: false,
  hideInStockColorLabel: false,
  lockHeroGalleryTemplate: false,
  heroMaterialSubtitleLine: false,
  leftAlignModuleHeadings: false,
  squareProductCardCorners: false,
  squareButtonCorners: false,
  hideTextLinkArrows: false,
  useV4UgcHeadingType: false,
  useV4DetailsTileCarousel: false,
  useV5DetailsSheet: false,
  showDetailsCloserLook: true,
  useV4CraftsmanshipLayout: false,
  showBrandSwitcher: true,
  enableHeroReveal: true,
  useV4ModuleSpacing: false,
  showReviewHighlightTags: true,
  useV4LeatherAgingLayout: false,
  leatherAgingHeaderAboveImage: false,
  useRailLeatherAgingSlider: false,
  hideReviewCountRecommend: false,
  hideReviewSummaryRating: false,
  enlargeReviewAiSummary: false,
  hideReviewUgcMomentCaption: false,
  enlargeReviewUgcMomentText: false,
  useConsistentModuleHeadings: false,
  useV4GranularScrollReveal: false,
  useV4CompactUgcStrip: false,
  useUgcTopicThemes: false,
  useV5UgcTestimonialCarousel: false,
  showEditorialQuoteCard: false,
  compactUgcMoreCountOverride: 0,
  showWaysToWearModule: false,
  showCraftedToLastVideo: false,
  demoHeroColorSwatchRow: false,
  collapseHeroColorSwatches: false,
  heroColorSwatchPreviewCount: 0,
  heroColorSwatchMoreCountOverride: 0,
  showTabbyAlsoAvailableAs: false,
  desktopSplitLayout: false,
  hidePayOverTimeCreditNote: false,
  showHeroFitsInsideCta: false,
  useHeroGalleryProgressBar: false,
  showArTryOn: true,
  showHeroGalleryCategoryRail: false,
  heroVerticalGallery: false,
  hero360IntroEnabled: false,
  hero360IntroVideoSrc: "",
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
  // The Details injects before slide[0] (studio product); ugc-community follows.
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
  showFloatingBuyBar: true,
  useV3ColorSheet: false,
  showSectionJumpBar: true,
  useV4Specs: false,
  leadGalleryWithProductStill: false,
  heroGalleryStudioDragZoom: false,
  heroGalleryLeadSlideSrc: "",
  demoPopularColorStates: false,
  flattenBuyBarCta: false,
  hideBuyBarColorLabel: false,
  hideHeroColorSwatchLabel: false,
  hideBuyBarAtbIcon: false,
  hideDockedBuyBarColor: false,
  inlineBuyBarColorSwatches: false,
  useCompactBuyBarColorDots: false,
  compactBuyBarColorDotCount: 0,
  hideColorSheetSizePrice: false,
  flatColorSheet: false,
  hideInStockColorLabel: false,
  lockHeroGalleryTemplate: false,
  heroMaterialSubtitleLine: false,
  leftAlignModuleHeadings: false,
  squareProductCardCorners: false,
  squareButtonCorners: false,
  hideTextLinkArrows: false,
  useV4UgcHeadingType: false,
  useV4DetailsTileCarousel: false,
  useV5DetailsSheet: false,
  showDetailsCloserLook: true,
  useV4CraftsmanshipLayout: false,
  showBrandSwitcher: true,
  enableHeroReveal: true,
  useV4ModuleSpacing: false,
  showReviewHighlightTags: true,
  useV4LeatherAgingLayout: false,
  leatherAgingHeaderAboveImage: false,
  useRailLeatherAgingSlider: false,
  hideReviewCountRecommend: false,
  hideReviewSummaryRating: false,
  enlargeReviewAiSummary: false,
  hideReviewUgcMomentCaption: false,
  enlargeReviewUgcMomentText: false,
  useConsistentModuleHeadings: false,
  useV4GranularScrollReveal: false,
  useV4CompactUgcStrip: false,
  useUgcTopicThemes: false,
  useV5UgcTestimonialCarousel: false,
  compactUgcMoreCountOverride: 0,
  moreLikeThisLargeCards: false,
  showWaysToWearModule: false,
  showCraftedToLastVideo: false,
  demoHeroColorSwatchRow: false,
  collapseHeroColorSwatches: false,
  heroColorSwatchPreviewCount: 0,
  heroColorSwatchMoreCountOverride: 0,
  showTabbyAlsoAvailableAs: false,
  desktopSplitLayout: false,
  hidePayOverTimeCreditNote: false,
  showHeroFitsInsideCta: false,
  useHeroGalleryProgressBar: false,
  showArTryOn: true,
  showHeroGalleryCategoryRail: false,
  heroVerticalGallery: false,
  hero360IntroEnabled: false,
  hero360IntroVideoSrc: "",
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
 * v4 — Paper r5 pivot (frozen at Johnny's Jul 2026 production baseline).
 * Inherits the full v3 baseline and layers the first r5 refinements shipped
 * to pdp-next-sigma.vercel.app/v4. See docs/pdp-versions.md.
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
  // r5 scroll-triggered per-element reveals (headlines blur, blocks lift).
  useV4GranularScrollReveal: true,
  // r5 feedback: square Add to bag + drop the shopping_bag icon.
  hideBuyBarAtbIcon: true,
  squareButtonCorners: true,
};

/**
 * v5 — Sean r5 polish round (Jul 2026). Inherits the frozen v4 baseline and
 * layers compact UGC, craftsmanship carousel, reviews preview, details rail,
 * buy-bar/color-sheet tweaks, and gallery slide reshuffle. Share as
 * `/v5` while `/v4` stays comparable to Johnny's last prod deploy.
 */
const V5_CONFIG: PdpVersionConfig = {
  ...V4_CONFIG,
  // v5 polish — docked hero ATB only; no sticky floating bar for now.
  showFloatingBuyBar: false,
  gallerySlides: PDP_GALLERY_SLIDES_V4,
  // v5 story: Feel the leather → Details → What customers are saying → Up close → Aging.
  detailsAfterSlideIndex: 1,
  hideBuyBarColorLabel: true,
  hideHeroColorSwatchLabel: false,
  hideBuyBarAtbIcon: true,
  hideDockedBuyBarColor: true,
  useCompactBuyBarColorDots: true,
  compactBuyBarColorDotCount: 3,
  inlineBuyBarColorSwatches: false,
  hideColorSheetSizePrice: true,
  useV4DetailsTileCarousel: true,
  // v5 Details switches to the editorial two-column sheet (Paper node 407:399).
  useV5DetailsSheet: true,
  showDetailsCloserLook: false,
  useV4CraftsmanshipLayout: true,
  useV4CompactUgcStrip: true,
  useUgcTopicThemes: true,
  useV5UgcTestimonialCarousel: true,
  showEditorialQuoteCard: true,
  showLeatherCareUpsell: true,
  flatColorSheet: true,
  hideInStockColorLabel: true,
  lockHeroGalleryTemplate: true,
  heroGalleryLeadSlideSrc: HERO_GALLERY_V5_LEAD_SRC,
  // v5 weaves Out in the wild UGC into the hero carousel after the lead pair.
  heroGalleryUgcSlides: buildHeroGallerySlidesFromUgcTestimonials(
    HERO_GALLERY_V5_UGC_TESTIMONIAL_IDS,
  ),
  heroGalleryUgcInsertAfterIndex: 1,
  heroMaterialSubtitleLine: true,
  leatherAgingHeaderAboveImage: true,
  // v5 leather-aging gets the continuous Apple-style rail slider.
  useRailLeatherAgingSlider: true,
  // v5 reviews summary drops the aggregate star row (photos + AI summary carry trust).
  hideReviewSummaryRating: true,
  // v5 reviews summary shows stars + average only (no review count tail).
  hideReviewCountRecommend: true,
  // v5 bumps the reviews AI-summary tray text up a step.
  enlargeReviewAiSummary: true,
  // v5 drops the topic caption above each reviews UGC quote.
  hideReviewUgcMomentCaption: true,
  // v5 bumps quote + handle type in the reviews UGC moments rail.
  enlargeReviewUgcMomentText: true,
  compactUgcMoreCountOverride: 6,
  useConsistentModuleHeadings: true,
  moreLikeThisLargeCards: true,
  squareButtonCorners: true,
  showWaysToWearModule: true,
  showCraftedToLastVideo: true,
  demoHeroColorSwatchRow: false,
  collapseHeroColorSwatches: false,
  heroColorSwatchPreviewCount: 0,
  heroColorSwatchMoreCountOverride: 6,
  showTabbyAlsoAvailableAs: false,
  showReviewHighlightTags: false,
  // v5 desktop responsive split — media left, sticky buy panel right at lg+.
  desktopSplitLayout: true,
  // v5 trims the Afterpay card to one line (drops "No impact to credit.").
  hidePayOverTimeCreditNote: true,
  // v5 surfaces a "What fits" overlay action on the open-interior hero slide.
  showHeroFitsInsideCta: true,
  // v5 swaps the tick indicator for a full-bleed progress bar at the gallery seam.
  useHeroGalleryProgressBar: true,
  // Hide the standalone AR button — category rail carries AR instead.
  showArTryOn: false,
  showHeroGalleryCategoryRail: true,
};

/**
 * v6 — feedback round (Jul 2026). Inherits the frozen v5 baseline. Add new
 * flags here as stakeholder feedback lands — never edit V5_CONFIG in place.
 */
const V6_CONFIG: PdpVersionConfig = {
  ...V5_CONFIG,
  // v6 UXR — vertical mobile gallery + tick indicator (not full-bleed progress bar).
  useHeroGalleryProgressBar: false,
  heroVerticalGallery: true,
  // v6 hero land — one-shot 360° intro, then settle on a0 product still.
  hero360IntroEnabled: true,
  hero360IntroVideoSrc: HERO_360_INTRO_VIDEO_SRC,
  heroGalleryPrependLeadSlide: undefined,
  heroGalleryLeadSlideSrc: "",
  leadGalleryWithProductStill: true,
};

const CONFIG_BY_VERSION: Record<PdpVersion, PdpVersionConfig> = {
  v1: V1_CONFIG,
  v2: V2_CONFIG,
  v3: V3_CONFIG,
  v4: V4_CONFIG,
  v5: V5_CONFIG,
  v6: V6_CONFIG,
};

export function getPdpVersionConfig(version: PdpVersion): PdpVersionConfig {
  return CONFIG_BY_VERSION[version];
}
