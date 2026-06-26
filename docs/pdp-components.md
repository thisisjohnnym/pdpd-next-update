# PDP Components Reference

Comprehensive inventory of the Product Detail Page (PDP) implementation for **Tabby 26** in PDP-NEXT. All components live under `src/components/pdp/`. Mock product data is centralized in `pdp-data.ts`.

Implementation inventory only: this file is not the design authority.
For design fidelity and parity decisions, use:

- `docs/pdp-paper-source-of-truth.md`
- `docs/pdp-paper-parity-audit-checklist.md`

---

## Page architecture

The app entry point (`src/app/page.tsx`) renders **`PdpSocialView`**, which is the primary PDP shell. An alternate **`PdpCommunityView`** (TikTok-style media feed) exists but is not wired to the main route.

```
PdpSocialView (page shell — client)
├── PdpGalleryView (scrollable gallery + bottom modules)
│   ├── Hero + gallery slides (inline)
│   ├── PdpGalleryViewMorePhotos
│   ├── PdpSimilarItemsCarousel
│   ├── PdpCompareModule
│   ├── PdpBundleModule
│   ├── PdpBagSizeModule
│   ├── PdpReviewsModule
│   │   └── PdpReviewLikeButton (per review)
│   ├── PdpRecentlyViewedCarousel
│   ├── PdpProductSearchModule
│   ├── PdpGalleryPhotosSheet
│   └── PdpShopTheLookSheet
├── PdpOverlayHeader (fixed)
├── PdpBottomActions (fixed)
│   └── PdpColorSelector
├── PdpReviewsSheet
└── PdpAddToBagSheet
```

**Hero slide internals** (inside `PdpGalleryView`):

```
PdpHeroSlide
├── Image (full-viewport lifestyle)
├── PdpGalleryProductHud (name, subtitle, price — fades on scroll)
└── PdpHeroActionRail (like / save / comment — fades on scroll)
    └── PdpToast
```

**Portrait slide internals**:

```
PdpGalleryPortraitSlide
├── Image (4:5 immersive)
├── PdpProductHotspots? (optional detail markers)
└── "Shop the look" button → PdpShopTheLookSheet
```

---

## Component inventory

| Component | File | Type | Purpose |
|-----------|------|------|---------|
| **Views & shells** |
| `PdpSocialView` | `pdp-social-view.tsx` | Client | Main PDP page shell — state for color, bag count, reviews sheet, add-to-bag sheet |
| `PdpGalleryView` | `pdp-gallery-view.tsx` | Client | Scrollable gallery feed + ordered bottom modules; owns sheet state for photos & shop-the-look |
| `PdpCommunityView` | `pdp-community-view.tsx` | Server | Full-viewport wrapper for community media feed (alternate tab/view) |
| `PdpMediaFeed` | `pdp-media-feed.tsx` | Client | Vertical snap-scroll media feed from `PDP_MEDIA_SLIDES` |
| **Fixed chrome** |
| `PdpOverlayHeader` | `pdp-overlay-header.tsx` | Client | Fixed top nav — menu, Coach logo, search, bag badge; auto light/dark contrast |
| `PdpBottomActions` | `pdp-bottom-actions.tsx` | Client | Fixed bottom bar — inline color picker + Add to Bag CTA; gradient scrim when scrolled |
| **Gallery slides** |
| `PdpGalleryProductHud` | `pdp-gallery-product-hud.tsx` | Client | Hero product name, subtitle, price overlay; fades with scroll |
| `PdpHeroActionRail` | `pdp-hero-action-rail.tsx` | Client | Hero social actions (like burst, save, comments); opens reviews |
| `PdpGalleryEditorialSlide` | `pdp-gallery-editorial-slide.tsx` | Server* | Inset 4:5 editorial break with caption and optional second image |
| `PdpGalleryHeroVideo` | `pdp-gallery-hero-video.tsx` | Client | Looping 360° product video with play/pause controls |
| `PdpGalleryViewMorePhotos` | `pdp-gallery-view-more-photos.tsx` | Client | First bottom module — stacked thumbnail preview + "View more photos" CTA |
| `PdpProductHotspots` | `pdp-product-hotspots.tsx` | Client | Tappable detail markers on product photography with floating info card |
| **Bottom modules** |
| `PdpSimilarItemsCarousel` | `pdp-similar-items-carousel.tsx` | Client | Horizontal recommendation rail with quick Add to Bag |
| `PdpCompareModule` | `pdp-compare-module.tsx` | Client | Horizontal compare carousel — current item + alternatives across 4 spec categories |
| `PdpBundleModule` | `pdp-bundle-module.tsx` | Client | Multi-select bundle builder with 10% discount when 2+ items selected |
| `PdpBagSizeModule` | `pdp-bag-size-module.tsx` | Client | Interactive "What fits inside" capacity explorer with animated hotspots |
| `PdpReviewsModule` | `pdp-reviews-module.tsx` | Client | Inline reviews — AI summary, rating breakdown, UGC photos, featured quotes |
| `PdpRecentlyViewedCarousel` | `pdp-recently-viewed-carousel.tsx` | Client | Timeline-style browsing history rail with relative time chips |
| `PdpProductSearchModule` | `pdp-product-search-module.tsx` | Client | Bottom search prompt, input field, and suggestion chips |
| **Story modules (built, not yet in gallery flow)** |
| `PdpHowToWearModule` | `pdp-how-to-wear-module.tsx` | Server* | Moment #3 — styling validation with wear option thumbnails |
| `PdpMaterialStoryModule` | `pdp-material-story-module.tsx` | Server* | Moment #4 — material & construction detail carousel |
| `PdpHeritageStoryModule` | `pdp-heritage-story-module.tsx` | Server* | Moment #5 — brand heritage editorial |
| `PdpCommunityValidationModule` | `pdp-community-validation-module.tsx` | Client | Moment #6 — UGC photo/video grid replacing star-rating reviews |
| **Sheets & overlays** |
| `PdpAddToBagSheet` | `pdp-add-to-bag-sheet.tsx` | Client | Bottom tray — add-to-bag confirmation, checkout CTAs, upsells or bundle recap |
| `PdpReviewsSheet` | `pdp-reviews-sheet.tsx` | Client | Full-screen reviews drawer — all reviews, filters, write review |
| `PdpGalleryPhotosSheet` | `pdp-gallery-photos-sheet.tsx` | Client | Bottom sheet — full product photo grid |
| `PdpShopTheLookSheet` | `pdp-shop-the-look-sheet.tsx` | Client | Bottom sheet — outfit pieces from an on-model gallery photo |
| **Shared UI** |
| `PdpColorSelector` | `pdp-color-selector.tsx` | Client | Color swatch picker — overlay, compact, or inline drop-up variants |
| `PdpReviewLikeButton` | `pdp-review-like-button.tsx` | Client | Toggle like on a customer review with heart animation |
| `PdpToast` | `pdp-toast.tsx` | Client | Ephemeral status toast above bottom chrome |
| **Utilities & hooks** |
| `pdpModuleSectionClass` / `pdpModuleHeadingClass` | `pdp-module-section.ts` | Shared | Vertical rhythm tiers and heading styles for bottom modules |
| `pdp-data.ts` | `pdp-data.ts` | Shared | All mock product data, types, and constants |
| `useHeaderContrast` | `use-header-contrast.ts` | Client | Samples backdrop luminance to flip header foreground light/dark |
| `useScrollNavVisibility` | `use-scroll-nav-visibility.ts` | Client | Hide header on scroll down, reveal on scroll up |
| `useHeroScrollOpacity` | `use-hero-scroll-opacity.ts` | Client | Hero overlay fade curve based on scroll position |

\*No `"use client"` directive but only imported by client components — effectively client-rendered.

---

## Key props & types

### View-level

| Component | Props |
|-----------|-------|
| `PdpSocialView` | _(none — owns internal state)_ |
| `PdpGalleryView` | `onOpenReviews?`, `onAddSimilarToBag?`, `onAddBundle?(payload: PdpBundleAddPayload)`, `selectedColorId: string` |
| `PdpOverlayHeader` | `bagCount?: number` |
| `PdpBottomActions` | `selectedColorId`, `onColorSelect(id)`, `onAddToBag()` |

### Sheets

| Component | Props |
|-----------|-------|
| `PdpAddToBagSheet` | `open`, `onClose`, `selectedColorId`, `onQuickAdd?`, `confirmation?: BagConfirmation` |
| `PdpReviewsSheet` | `open`, `onClose` |
| `PdpGalleryPhotosSheet` | `open`, `onClose` |
| `PdpShopTheLookSheet` | `look: PdpShopTheLookLook \| null`, `open`, `onClose` |

`BagConfirmation` union:

```ts
type BagConfirmation =
  | { type: "product" }
  | { type: "bundle"; payload: PdpBundleAddPayload };
```

### Modules

| Component | Props |
|-----------|-------|
| `PdpSimilarItemsCarousel` | `onAddToBag()` |
| `PdpCompareModule` | `selectedColorId: string` |
| `PdpBundleModule` | `onAddBundle(payload: PdpBundleAddPayload)` |
| `PdpReviewsModule` | `onReadAll?`, `onWriteReview?` |
| `PdpReviewLikeButton` | `initialLikes: number` |
| `PdpProductHotspots` | `hotspots: PdpProductHotspot[]` |
| `PdpColorSelector` | `colors`, `selectedId`, `onSelect(id)`, `variant?`, `compact?`, `inline?` |
| `PdpGalleryViewMorePhotos` | `onOpen()` |
| `PdpToast` | `message`, `open`, `onClose`, `durationMs?` |

### Module section rhythm options

```ts
type PdpModuleSectionOptions = {
  variant?: "white" | "muted";
  first?: boolean;           // no top border, pt-12
  rhythm?: "compact" | "default" | "roomy" | "break";
};
```

---

## Data types inventory (`pdp-data.ts`)

### Product core

| Export | Type | Description |
|--------|------|-------------|
| `PDP_PRODUCT` | const | Name, subtitle, price, hero image |
| `PDP_COLORS` | `PdpColor[]` | Color swatches with id, name, swatch asset, hero image |
| `DEFAULT_COLOR_ID` | const | `"black"` |

### Commerce & upsells

| Export | Type | Description |
|--------|------|-------------|
| `PDP_BAG_UPSELLS` | `PdpBagUpsell[]` | 6 accessory upsells for add-to-bag confirmation tray |
| `PDP_BUNDLE_ITEMS` | `PdpBundleItem[]` | Tabby 26 (locked) + 4 selectable accessories |
| `PDP_BUNDLE_DISCOUNT` | const | `0.1` (10% when 2+ items) |
| `PdpBundleAddPayload` | type | `{ items, subtotal, total }` emitted on bundle add |

### Recommendations & compare

| Export | Type | Description |
|--------|------|-------------|
| `PDP_SIMILAR_ITEMS` | `PdpSimilarItem[]` | 6 similar bags for recommendation carousel |
| `PDP_COMPARE_SELECTED` | `PdpCompareItem` | Current PDP item pinned in compare |
| `PDP_COMPARE_OPTIONS` | `PdpCompareItem[]` | 4 alternative bags |
| `PDP_COMPARE_CATEGORIES` | const | 4 categories: Size, Strap, Material, Closure |
| `PDP_RECENTLY_VIEWED` | `PdpRecentlyViewedItem[]` | 5 history items with `viewedLabel` |
| `PDP_PRODUCT_SEARCH` | const | Title, placeholder, 5 suggestion chips |

### Gallery & media

| Export | Type | Description |
|--------|------|-------------|
| `PDP_GALLERY_HERO_IMAGE` | const | City street lifestyle hero |
| `PDP_GALLERY_HERO_IMAGE_FOCUS` | const | Crop/scale/translate for hero framing |
| `PDP_GALLERY_SLIDES` | `PdpGallerySlide[]` | 5 slides: video, 2 immersive, editorial, product immersive |
| `PDP_GALLERY_MORE_PHOTOS` | `PdpGalleryPhoto[]` | 15 extended gallery photos |
| `PDP_PRODUCT_IMMERSIVE_HOTSPOTS` | `PdpProductHotspot[]` | 3 detail hotspots on product shot |
| `PDP_SHOP_THE_LOOK` | `Record<string, PdpShopTheLookLook>` | Outfit looks keyed by id (e.g. `"denim-daytime"`) |
| `PDP_MEDIA_SLIDES` | const | 5 slides for community media feed |

### Interactive modules

| Export | Type | Description |
|--------|------|-------------|
| `PDP_BAG_SIZE` | const | Title, image, 3 hotspots (main compartment, dimensions, slip pocket) |
| `PdpBagSizeHotspot` | type | Position (x/y %), label, title, body, fits[] |

### Editorial moments (story modules)

| Export | Type | Description |
|--------|------|-------------|
| `PDP_HOW_TO_WEAR` | const | Moment #3 — 5 wear styles |
| `PDP_MATERIAL_STORY` | const | Moment #4 — quilting, leather, hardware details |
| `PDP_HERITAGE_STORY` | const | Moment #5 — brand heritage caption |
| `PDP_EVERYDAY_CARRY` | const | Capacity editorial image + caption |
| `PDP_COMMUNITY_VALIDATION` | const | Moment #6 — UGC photos and creator videos |

### Reviews & social

| Export | Type | Description |
|--------|------|-------------|
| `PDP_CUSTOMER_REVIEWS` | `PdpFeaturedReview[]` | 12 full reviews with optional photos and `likes` count |
| `PDP_FEATURED_REVIEWS` | const | First 2 reviews (legacy subset) |
| `PDP_REVIEWS_SUMMARY` | const | `{ average: 4.8, count: 128, recommendPercent: 94 }` |
| `PDP_REVIEWS_AI_SUMMARY` | const | AI-generated buyer highlights |
| `PDP_REVIEWS_RATING_BREAKDOWN` | const | Star distribution percentages |
| `PDP_REVIEW_PHOTOS` | `PdpReviewPhoto[]` | 4 UGC photos for editorial strip |
| `PDP_LIKE_SUMMARY` | const | Hero like count (`100k`) |
| `PDP_SAVE_SUMMARY` | const | Save count (`3.4k`) |
| `PDP_COMMENTS_SUMMARY` | const | Comment count (`128`) |

### Gallery slide types

```ts
type PdpGalleryImmersiveSlide = { type: "immersive"; src; alt; shopTheLookId?; insetMargins?; objectPosition?; scale?; hotspots? };
type PdpGalleryEditorialSlide  = { type: "editorial"; src; alt; caption; secondarySrc?; secondaryAlt? };
type PdpGalleryVideoSlide      = { type: "video"; src; poster?; alt; label? };
type PdpGallerySlide = PdpGalleryImmersiveSlide | PdpGalleryEditorialSlide | PdpGalleryVideoSlide;
```

---

## Page composition & module order

### Full scroll order (`PdpGalleryView`)

| # | Section | Rhythm tier | Notes |
|---|---------|-------------|-------|
| 1 | **Hero slide** (`100dvh`) | — | City street lifestyle; HUD + action rail |
| 2 | **360° video slide** | — | IntersectionObserver-gated autoplay |
| 3 | **Patio lifestyle** (immersive) | — | `insetMargins: true` — 12px white inset |
| 4 | **Denim daytime** (immersive) | — | Shop the look CTA → sheet |
| 5 | **Craftsmanship editorial** | — | Caption + product detail image |
| 6 | **Product immersive** | — | 3 product hotspots (C clasp, quilting, strap) |
| 7 | **View more photos** | `first: true` | Stacked thumbnail preview |
| 8 | **Similar items** | `default` | Horizontal carousel, quick add |
| 9 | **Compare** | `compact` | 4-category spec comparison |
| 10 | **Build your bundle** | `roomy` | Multi-select + 10% discount |
| 11 | **What fits inside** | `compact` | Interactive bag size hotspots |
| 12 | **Reviews** | `break` | AI summary, UGC, 4 featured reviews |
| 13 | **Recently viewed** | `break`, `muted` | Timeline rail on neutral-100 |
| 14 | **Product search** | `compact`, `muted` | Footer search + chips; reserves bottom CTA offset |

### Rhythm tier spacing

Defined in `pdp-module-section.ts`:

| Tier | Top padding | Bottom padding | Use case |
|------|-------------|----------------|----------|
| `first` | `pt-12` | — | First module after gallery (no top border) |
| `compact` | `pt-9` | `pb-4` | Paired with module above (Compare, Bag size, Search) |
| `default` | `pt-16` | `pb-6` | Standard section (Similar items) |
| `roomy` | `pt-20` | `pb-8` | New content chapter (Bundle) |
| `break` | `pt-24` | `pb-10` | Major narrative shift (Reviews, Recently viewed) |

All non-first modules get `border-t border-neutral-100`.

---

## Patterns & conventions

### Grid system

All in-content layout uses `@/components/grid/page-grid`:

- **`PageShell`** — page wrapper, max-width 1440px
- **`PageGrid`** — 12-col mobile / 24-col desktop with Figma margins & gutters
- **`GridItem`** — column spans via `mobile={1–12}` and `desktop={1–24}`

Grid spec: **Mobile `12/12/4`** (375px frame) · **Desktop `24/20/8`** (1440px frame).

Full-bleed media (hero, portrait slides) sits **outside** `PageGrid`. Module content uses `PageGrid fullWidth` with `GridItem mobile={12} desktop={24}`.

See also: `docs/design-system/grid.md`, `.cursor/skills/pdp-grid-system/SKILL.md`.

### Typography & icons

- All UI text: **Helvetica Neue LT Pro** (`font-extended` utility)
- All icons: **Google Material Symbols** via `@/components/icons/material-icon`

### Fixed bottom chrome

- `BOTTOM_CTA_OFFSET` — CSS calc for fixed Add to Bag bar height + safe area
- Bottom modules that need clearance (Product search) apply `paddingBottom: BOTTOM_CTA_OFFSET`
- `PdpBottomActions` shows gradient scrim when scrolled past hero (`scrollY > 32`)

### Header contrast

- `data-header-surface="light"` on light-background sections signals header to use dark foreground
- `useHeaderContrast` samples backdrop luminance under the fixed header via `@/lib/header-contrast`
- `useScrollNavVisibility` hides header on scroll down, reveals on scroll up (always visible within 32px of top)

### Hero overlay fade

- `useHeroScrollOpacity` drives opacity of `PdpGalleryProductHud` and `PdpHeroActionRail`
- `isHeroOverlayVisible(opacity)` gates visibility to avoid interaction on invisible elements

### Sheets pattern

All bottom sheets share:

- Fixed overlay with `bg-black/45` scrim
- Slide-up panel (`translate-y-full` → `translate-y-0`)
- Body scroll lock + Escape key dismiss
- Drag handle bar at top
- `z-50` stacking

### Carousels pattern

Horizontal rails use:

- `overflow-x-auto overscroll-x-contain`
- Hidden scrollbars (`[-ms-overflow-style:none] [scrollbar-width:none]`)
- `snap-x snap-mandatory` + `snap-start snap-always` on items
- Fixed item widths (Compare: 132px, Similar: 148px, Recently viewed: 124px)

### Hotspots pattern

Two hotspot systems:

1. **Gallery product hotspots** (`PdpProductHotspots`) — toggle info card overlay on immersive slides; data from `PdpProductHotspot` (title + body)
2. **Bag size hotspots** (`PdpBagSizeModule`) — animated ripple rings; updates detail panel below image; data from `PdpBagSizeHotspot` (title, body, fits[])

Both use percentage-based `x`/`y` positioning within the image frame.

### Module headings

`pdpModuleHeadingClass({ lead?: boolean })` — `font-extended text-base`, optional `mb-5` lead spacing.

### Color selector variants

| Variant | Context |
|---------|---------|
| `inline` | Drop-up picker inside bottom action bar pill |
| `compact` | Smaller swatches for gallery HUD |
| `overlay` | On hero image (white text context) |
| `default` | Standalone on dark background |

---

## Feature changelog — current session

Based on git status and component implementation, the following features were built or significantly updated in this work session:

### Review likes
- **`PdpReviewLikeButton`** — toggle like with heart pop animation and live count
- Used in **`PdpReviewsModule`** (inline) and **`PdpReviewsSheet`** (full drawer)
- Reviews data includes per-review `likes` count in `PdpFeaturedReview`

### Bundle confirmation tray
- **`PdpBundleModule`** — multi-select bundle builder with locked current PDP item
- 10% discount (`PDP_BUNDLE_DISCOUNT`) when 2+ items selected
- **`PdpAddToBagSheet`** — dual confirmation mode: single product vs. bundle recap with item list, strikethrough subtotal, savings line
- Bag count increments by bundle item count on add

### Compare carousel (4 categories)
- **`PdpCompareModule`** — horizontal scroll of current item + 4 alternatives
- Categories: Size, Strap, Material, Closure (`PDP_COMPARE_CATEGORIES`)
- Current item pinned with "This item" label and ring highlight; reflects selected color name

### Bag size interactive module
- **`PdpBagSizeModule`** — "What fits inside" with 3 animated hotspots
- Tap hotspot → updates detail card with title, body, and "fits" chips
- Staggered ripple/pulse CSS animations

### Product search footer
- **`PdpProductSearchModule`** — "Something else on your mind?" prompt
- Search input + 5 suggestion chips that populate the query
- Muted background variant; reserves bottom CTA offset

### Spacing rhythm system
- **`pdp-module-section.ts`** — centralized rhythm tiers (`compact` / `default` / `roomy` / `break`)
- Applied consistently across all bottom modules with documented intent per tier
- `pdpModuleHeadingClass` for shared title spacing

### Gallery enhancements
- **`PdpGalleryViewMorePhotos`** + **`PdpGalleryPhotosSheet`** — peek thumbnails + full 15-photo grid
- **`PdpGalleryHeroVideo`** — intersection-observer gated 360° video
- **`PdpProductHotspots`** on product immersive slide
- Hero image updated to city street lifestyle (`hero-city-street.png`)
- **`PdpShopTheLookSheet`** — outfit pieces from on-model photos

### Header contrast & nav visibility
- **`useHeaderContrast`** + **`@/lib/header-contrast`** — adaptive light/dark header chrome
- **`useScrollNavVisibility`** — scroll-direction-aware header hide/show
- `data-header-surface="light"` markers on light sections

### Similar items & recently viewed
- **`PdpSimilarItemsCarousel`** — quick add with "Added" state
- **`PdpRecentlyViewedCarousel`** — timeline dots, relative time chips, portrait cards

### Story modules (built, pending integration)
- **`PdpHowToWearModule`**, **`PdpMaterialStoryModule`**, **`PdpHeritageStoryModule`**, **`PdpCommunityValidationModule`** — editorial "Moment" modules with data in `pdp-data.ts` but not yet inserted into `PdpGalleryView` scroll order

### Other updates
- **`PdpColorSelector`** — inline drop-up variant for bottom bar
- **`PdpHeroActionRail`** — heart burst particle animation, like/save/comment counts from data
- **`PdpReviewsModule`** — expanded inline reviews with AI summary, collapsible rating breakdown, UGC photo strip
- **`PdpAddToBagSheet`** — "Complete the look" upsell list from `PDP_BAG_UPSELLS`

---

## Related documentation

- [Grid system](design-system/grid.md)
- [Typography](design-system/typography.md)
- [Icons](design-system/icons.md)
- [Coach PDP sticky notes](design-workshop/coach-pdp-sticky-notes.md)
- [PDP Paper Source Of Truth](pdp-paper-source-of-truth.md)
- [PDP Paper Parity Audit Checklist](pdp-paper-parity-audit-checklist.md)
