# PDP v2 Components

Source of truth: [Paper — updates - r3, artboard `ADB-0`](https://app.paper.design/file/01KVTV0K48C5PNSC96MPDBVQBM/4-0/ADB-0)

If code and Paper disagree, Paper wins. Every module listed here must be verified against its Paper node before being marked `match`.

---

## Module order (Paper artboard ADB-0, top to bottom)

| # | Paper node | Paper layer name | Code path | Status |
|---|-----------|-----------------|-----------|--------|
| 1 | `9SN-0` | Hero full bleed | shared — `PdpGalleryHero` + `PdpHeroShell` | match |
| 2 | `AFC-0` | v2 — UGC after hero | `version/pdp-v2-ugc-community.tsx` | new |
| 3 | `AHD-0` | v2 — The Details module | shared — `PdpProductDetailsModule` | match |
| 4 | `AJ2-0` | v2 — Slide studio product | `version/pdp-v2-full-slide.tsx` (via gallery slide data) | new |
| 5 | `AN3-0` | v2 — Grouped editorial carousel | shared — `PdpGroupedMediaCarousel` | match |
| 6 | `AP5-0` | v2 — Leather aging | shared — `PdpLeatherAgingModule` (showCareUpsell=false) | patch applied |
| 7 | `AYJ-0` | v2 — Reviews (reviews only) | `version/pdp-v2-reviews.tsx` | new |
| 8 | `B39-0` | v2 — Slide trench portrait | `version/pdp-v2-full-slide.tsx` (via trenchPortraitSlide config) | new |
| 9 | `B6C-0` | v2 — More like this | shared — `PdpMoreLikeThisModule` | match |
| 10 | `BC6-0` | v2 — Recently viewed | shared — `PdpRecentlyViewedCarousel` | match |
| 11 | `BN3-0` | v2 — Footer | shared — `PdpSiteFooter` | match |

---

## Component reference

### `PdpV2UgcCommunity` (Paper `AFC-0`)

File: `src/components/pdp/version/pdp-v2-ugc-community.tsx`

- Heading: "Carried by the community" (centered, `text-[1.625rem]`)
- Link: "Follow us on TikTok ↗" with `north_east` icon
- Coverflow: one card ~92vw wide (`w-[calc(100vw-2.5rem)]`), adjacent cards peek
- Cards: `aspect-[9/16]` poster image + gradient overlay + caption + `@handle` + verified badge
- Data source: `PDP_UGC_VIDEO_CAROUSEL` from `pdp-data.ts`
- Slide type: `ugc-community` in `PdpGallerySlideV2`

### `PdpV2FullSlide` (Paper `AJ2-0`, `B39-0`)

File: `src/components/pdp/version/pdp-v2-full-slide.tsx`

- Height: `100svh` — no fixed pixel value
- Width: `100%`
- Image: `object-fit: cover`, configurable `objectPosition`
- No overlays, no captions
- Props: `src`, `alt`, `objectPosition?`

**Usage in gallery flow:** The studio product slide (AJ2-0) appears as a gallery slide entry. The trench portrait (B39-0) is injected via `versionConfig.trenchPortraitSlide` between Reviews and More like this in `PdpGalleryView`.

### `PdpV2Reviews` (Paper `AYJ-0`)

File: `src/components/pdp/version/pdp-v2-reviews.tsx`

- Heading: "Reviews" (centered, `text-[1.75rem]`)
- Aggregate: `PdpStarRating` + `4.8 (128 reviews)`
- AI summary card: light gray (`bg-neutral-100`), body text from `PDP_REVIEWS_AI_SUMMARY.body`, label "AI-generated summary"
- Card 1: first review from `PDP_CUSTOMER_REVIEWS` (full — stars + body + tag chips)
- Card 2: second review clipped with fade (`max-h-24`, gradient fade-out)
- CTAs: "Read all reviews" pill button + "Write a review →" text link
- No tabs, no comment composer, no like buttons

---

## Slide type: `ugc-community`

Defined in `src/components/pdp/version/pdp-data-v2.ts`:

```ts
export type PdpGalleryUgcCommunitySlide = { type: "ugc-community" };
```

Prepended by `buildV2Slides()` in place of the v1 `ugc-videos` slide. Rendered by the `ugc-community` case in `PdpGalleryView`.

---

## Version config flags (v2-specific)

All in `src/components/pdp/version/pdp-version-config.ts`:

| Flag | v1 | v2 | Effect |
|------|----|----|--------|
| `showHeroSocialRail` | true | false | Hides hero like/comment/save rail |
| `showReviewComments` | true | false | Hides comments tab + composer |
| `showReviewLikes` | true | false | Hides per-review like button |
| `showCoachAi` | true | false | Hides Coach AI module |
| `showCoachPremium` | true | false | Hides Coach Premium module |
| `showStrapSimulation` | true | false | Removes slide from gallery data |
| `showViewMoreMedia` | true | false | Removes slide from gallery data |
| `showReviewInterstitial` | false | false | Not used in v2 (was a mid-page teaser) |
| `showBundle` | true | false | Hides Bundle module below reviews |
| `showCompare` | true | false | Hides Compare / family module |
| `showLeatherCareUpsell` | true | false | Hides care product rows in leather aging |
| `useSimplifiedReviews` | false | true | Swaps to `PdpV2Reviews` |
| `detailsAfterSlideIndex` | 1 | 0 | Injects Details after slide 0 (ugc-community) |
| `trenchPortraitSlide` | undefined | `{src,alt,objectPosition}` | Full-viewport image between reviews and More like this |

---

## CSS rules for v2 modules

- No fixed `px` heights on module wrappers — use `100svh` only for `PdpV2FullSlide`
- v2-only selectors go in `src/app/v2/pdp-v2.css`, scoped under `[data-pdp-version="v2"]`
- Token variables: `--color-ink`, `--color-muted`, `--text-body`, etc. from design tokens
- Typography: Helvetica Neue LT Pro via `font-extended` class on all text

---

## Layer naming (Paper artboard ADB-0)

Renamed layers on the artboard:

| Node | Before | After |
|------|--------|-------|
| `AN3-0` | Frame | v2 — Grouped editorial carousel |
| `AFD-0` | Frame | v2 — UGC section header |
