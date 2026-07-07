# PDP Versions (v1 / v2 / v3 / v4 / v5 / v6)

Single source of truth for the PDP designs that ship from this codebase. Read this before any PDP edit.

**Also read:** [deploy-and-links.md](deploy-and-links.md) (URLs & ship) · [prototype-versions.md](prototype-versions.md) (playbook) · [rounds/](rounds/) (per-round changelogs)

## In short

- **v1** is the frozen current design. **v2** is the first stakeholder pivot. **v3** is the Paper r4 pivot. **v4** is the Paper r5 feedback round. **v5** is Sean's r5 polish round (frozen). **v6** is the active feedback round.
- Brand team compares them at **`/v1`**, **`/v2`**, **`/v3`**, **`/v4`**, **`/v5`**, and **`/v6`** on the same deploy.
- v2, v3, and v4 differences live in `src/components/pdp/version/` and behind flags in `pdp-version-config.ts` — never by rewriting v1/v2/v3.
- v3 inherits the v2 module order and layers three r4 UX changes: a docked-buy-bar hero that scrolls with the page, a floating CTA that returns once the hero leaves view, and a progressive in-context color drawer. See section 8.
- v4 inherits the full v3 baseline and layers the r5 feedback refinements: no trench portrait slide, five-up Details specs, and the A0 product still leading the hero gallery. See section 8.5.

---

## 1. What v1 and v2 mean

| | v1 | v2 |
|---|----|----|
| Intent | Current PDP, frozen baseline | Sean's pivot: shorter page, UGC higher, less social/promo |
| Audience | Brand-team reference | Brand-team review of the proposed direction |
| Rule | Do not change after the branch is cut | Implement the pivot 1:1 — no extra polish |

**v2 pivot summary**

- Shorten the gallery by grouping similar full-height slides into horizontal carousels (e.g. hardware detail + 360 spin).
- Move the TikTok UGC carousel to immediately after the hero.
- Remove Coach AI, Coach Premium, "Make it Yours" strap simulation, and "View more media".
- Remove hero social actions (heart / comment / save) and review comments + likes.
- Add a compact mid-page review interstitial before the full reviews module.
- Keep Bundle, Compare, More like this, and Recently viewed.

---

## 2. Brand-team links

**Production (share with stakeholders):** https://pdp-next-sigma.vercel.app

| Route | URL | Round doc |
|-------|-----|-----------|
| v1 (frozen baseline) | https://pdp-next-sigma.vercel.app/v1 | — |
| v2 (first pivot) | https://pdp-next-sigma.vercel.app/v2 | [rounds/r3-v2.md](rounds/r3-v2.md) |
| v3 (r4 hero/CTA) | https://pdp-next-sigma.vercel.app/v3 | [rounds/r4-v3.md](rounds/r4-v3.md) |
| v4 (r5 feedback) | https://pdp-next-sigma.vercel.app/v4 | [rounds/r5-v4.md](rounds/r5-v4.md) |
| v5 (Sean polish — frozen) | https://pdp-next-sigma.vercel.app/v5 | [rounds/README.md](rounds/README.md) |
| v6 (feedback — active) | https://pdp-next-sigma.vercel.app/v6 | [rounds/r7-v6.md](rounds/r7-v6.md) |

Same slugs work under each, e.g. `/v1/products/tabby-shoulder-bag-26-black` vs `/v4/products/tabby-shoulder-bag-26-black`.

Legacy `/` and `/products/[slug]` continue to serve **v1**, so existing bookmarks do not break.

**Deploy process:** [deploy-and-links.md](deploy-and-links.md) · **Playbook:** [prototype-versions.md](prototype-versions.md) · **Round index:** [rounds/README.md](rounds/README.md)

---

## 3. Git workflow

**`main`** is the canonical branch. It ships all comparison routes (`/v1`–`/v6`) from one codebase.

1. All prototype work lands on **`main`**.
2. Route versions (`/v1`–`/v6`) are frozen comparison URLs — not separate git branches.
3. Optional: cut a **`v1`** git branch only if you need a frozen historical snapshot.

When a winner is chosen, either delete the v2 adapter layer (if v1 wins) or promote v2 to default (if v2 wins) — see Sunset plan.

---

## 4. Architecture map

```
/v1 route ─┐
           ├─> PdpVersionProvider(version) ─> getPdpVersionConfig(version) ─┬─> shared components (read flags)
/v2 route ─┘                                                                └─> v2-only components
```

| File | Role |
|------|------|
| `src/app/v1/`, `src/app/v2/` | Route folders. Each `layout.tsx` sets `data-pdp-version` and the page passes `version` |
| `src/components/pdp/version/pdp-version-context.tsx` | `PdpVersionProvider`, `usePdpVersion()`, `PdpVersion` type |
| `src/components/pdp/version/pdp-version-config.ts` | `getPdpVersionConfig(version)` — flags, slides, chapters, details anchor |
| `src/components/pdp/version/pdp-data-v2.ts` | v2 slide order, removed-slide set, editorial carousel cards (does not mutate `pdp-data.ts`) |
| `src/components/pdp/version/pdp-section-chapters-v2.ts` | v2 jump-bar chapters |
| `src/components/pdp/version/pdp-v2-editorial-carousel.tsx` | v2-only 4-card editorial carousel (Paper AN3-0) |
| `src/components/pdp/version/pdp-v2-leather-aging.tsx` | v2-only leather aging card (Paper AP5-0) |
| `src/components/pdp/version/pdp-v2-recently-viewed.tsx` | v2-only recently viewed list (Paper BC6-0) |
| `src/components/pdp/version/pdp-review-interstitial.tsx` | v2-only mid-page ratings teaser |

### Feature flags (`pdp-version-config.ts`)

| Flag | v1 | v2 | Notes |
|------|----|----|-------|
| `showHeroSocialRail` | true | false | |
| `showReviewComments` | true | false | |
| `showReviewLikes` | true | false | |
| `showCoachAi` | true | false | |
| `showCoachPremium` | true | false | |
| `showStrapSimulation` | true | false | slide excluded from v2 data |
| `showViewMoreMedia` | true | false | slide excluded from v2 data |
| `showReviewInterstitial` | false | false | not used in v2 |
| `showBundle` | true | false | Bundle not in Paper v2 |
| `showCompare` | true | false | Compare not in Paper v2 |
| `showLeatherCareUpsell` | true | false | hides care rows in aging module |
| `useSimplifiedReviews` | false | true | renders `PdpV2Reviews` |
| `showDetailsHeading` | true | false | hides "A closer look" sub-heading (Paper AHD-0) |
| `useSimplifiedMoreLikeThis` | false | true | renders `PdpV2MoreLikeThis` (158px cards) |
| `useSimplifiedLeatherAging` | false | true | renders `PdpV2LeatherAging` card layout (Paper AP5-0) |
| `useSimplifiedRecentlyViewed` | false | true | renders `PdpV2RecentlyViewed` list (Paper BC6-0) |
| `trenchPortraitSlide` | undefined | `{src,alt}` | full-slide between reviews + more-like-this |
| `gallerySlides` | `PDP_GALLERY_SLIDES` | `PDP_GALLERY_SLIDES_V2` | |
| `sectionChapters` | `PDP_CHAPTERS` | `PDP_CHAPTERS_V2` | |
| `detailsAfterSlideIndex` | 1 | 0 | Details after ugc-community (slide[0]) |

`showStrapSimulation` and `showViewMoreMedia` are enforced by leaving those slides out of `PDP_GALLERY_SLIDES_V2` (see `buildV2Slides`). The same `V2_REMOVED_SLIDE_TYPES` set also drops `ugc-videos`, `signature-sounds` ("Sounds of Tabby"), and `weight-feel` — none appear in the ADB-0 full scroll, so they never mount in v2.

### v2 page order (Tabby)

Defined by Paper artboard `ADB-0` — this is the canonical module order for v2:

| # | Paper node | Module | Notes |
|---|-----------|--------|-------|
| 1 | `9SN-0` | Hero full bleed | 100svh, shared |
| 2 | `AFC-0` | UGC — Carried by the community | `PdpV2UgcCommunity`, new |
| 3 | `AHD-0` | The Details | shared, injected after slide[0] |
| 4 | `AJ2-0` | Slide studio product | 100svh, gallery slide |
| 5 | `AN3-0` | Editorial carousel (4 cards) | `PdpV2EditorialCarousel`, new |
| 6 | `AP5-0` | Leather aging | `PdpV2LeatherAging`, new (card layout) |
| 7 | `AYJ-0` | Reviews (reviews only) | `PdpV2Reviews`, new |
| 8 | `B39-0` | Slide trench portrait | 100svh, `PdpV2FullSlide` |
| 9 | `B6C-0` | More like this | `PdpV2MoreLikeThis`, new |
| 10 | `BC6-0` | Recently viewed | `PdpV2RecentlyViewed`, new |
| 11 | `BN3-0` | Footer | shared |

Bundle and Compare are not in the v2 Paper design — they are hidden via `showBundle: false` and `showCompare: false`.

### Paper page mapping

| Paper page | Purpose | Code route |
|---|---|---|
| `updates - r2` (page `3-0`) | v1 frozen baseline — parity target for `/v1` | `/v1` |
| `updates - r3` (page `4-0`) | v2 pivot baseline — visual tweak surface | `/v2` |
| `updates - r4` (page `5-0`) | v3 pivot baseline — r4 hero/CTA/color drawer | `/v3` |
| `updates - r5` (page `6-0`) | v4 pivot baseline — r5 feedback refinements | `/v4` |

**R3 export rules**

- Do **not** bulk-duplicate r2 into r3. r2 is v1; r3 is v2-only.
- R3 full scroll = v2 module order only — no removed modules, no “REMOVED reference” artboards.
- Shared modules unchanged in v2 (Details, More like this, Recently viewed, Footer) may reuse r2 individual module frames if layer structure matches — but hero, UGC community, reviews, full-viewport slides, and the full scroll must be v2-native.
- Source of truth for R3 content: Paper `ADB-0` + `pdp-version-config.ts` — not r2 hero or r2 full scroll.

Paper file: [Xanthic koala — updates - r3](https://app.paper.design/file/01KVTV0K48C5PNSC96MPDBVQBM/4-0)

---

## 5. Change rules — where v2 edits are allowed

**Allowed**

- New files under `src/components/pdp/version/`.
- New flags in `pdp-version-config.ts`, read by shared components.
- v2-only CSS in `src/app/v2/pdp-v2.css`, scoped under `[data-pdp-version="v2"]`.

**Forbidden**

- Editing `pdp-data.ts` or `pdp-section-chapters.ts` for v2 needs (v1 data is frozen).
- Adding v2-only selectors to `globals.css`.
- Scattering `version === "v2"` checks across files — add a flag instead.
- Forking the shared design system (grid, typography, icons, motion tokens).
- Importing any `*-v2` module from `src/app/v1/**`.

These are enforced by `scripts/check-pdp-version-boundaries.mjs` (`pnpm check:versions`).

---

## 6. Verification

Run on the `v2` branch:

```bash
pnpm typecheck
pnpm lint
pnpm check:versions
pnpm build
```

Then in Safari (via the `user-safari` MCP): screenshot `/v1` and `/v2` for the Tabby slug and a stripped (Kira) slug at mobile and desktop. `/v1` must match the pre-pivot baseline.

### PR checklist (every v2 PR)

- [ ] `/v1` renders unchanged (screenshot diff or manual sign-off)
- [ ] `/v2` renders the pivot changes
- [ ] No v1 slide/chapter data mutated
- [ ] No unscoped CSS added to `globals.css`
- [ ] `pnpm check:versions` passes

---

## 8. v3 — Paper r4 pivot

v3 is the stakeholder pivot from Paper page `updates - r4` (`5-0`). It **inherits the v2 module order** below the hero (it spreads `V2_CONFIG`) and adds three r4 UX changes. Nothing in v1 or v2 changes.

### What v3 changes

1. **Restructured hero** (`F39-0` / `CPE-0`) — the gallery sits in the scroll document with a white footer carrying the product name/price and a **docked** Color + Add to bag row (`FGQ-0`). The slide indicator and AR button move into the gallery overlay (`F3D-0`); the right-edge social rail is gone.
2. **CTA scroll model** (`F9R-0` / `F5Z-0`) — the docked buy bar scrolls away with the hero. A sentinel at the bottom of the hero block drives a floating buy bar (`PdpBottomActions`) that returns once the hero passes the viewport top. The chapter jump bar is disabled in v3 so it never replaces the floating CTA.
3. **Progressive color drawer** (`EU5-0` / `EIE-0`) — a full-height in-context sheet with **Popular colors** (3 shown, expands to all), **Explore materials** (4 shown, expands), and a horizontal **Bag size** row. Replaces the flat `PdpColorSheet` for Tabby.

### v3-only files

| File | Role |
|------|------|
| `src/app/v3/` | Route folder — `layout.tsx` sets `data-pdp-version="v3"` and imports `pdp-v3.css`; pages pass `version="v3"` |
| `src/app/v3/pdp-v3.css` | v3-scoped CSS (animation suppressions inherited from v2 calm land) |
| `src/app/v3/pdp-v3-root-marker.tsx` | Marks `<html>` so portaled chrome (floating CTA) gets v3 CSS |
| `src/components/pdp/version/pdp-v3-hero-layout.tsx` | r4 hero: gallery + white footer (name/price + docked `PdpBuyBarRow`) + scroll sentinel |
| `src/components/pdp/version/pdp-v3-gallery-overlay.tsx` | Gallery-overlay slide indicator + AR button (replaces HUD + rail) |
| `src/components/pdp/version/pdp-v3-ar-button.tsx` | r4 AR "Try On" button in the gallery overlay |
| `src/components/pdp/version/use-hero-buy-bar-visibility.ts` | `IntersectionObserver` sentinel → floating bar handoff |
| `src/components/pdp/version/pdp-v3-color-sheet.tsx` | Progressive color drawer |
| `src/components/pdp/version/pdp-v3-color-sheet-sections.ts` | Maps the frozen Tabby catalog into Popular / Materials / Sizes |

### v3 feature flags (`pdp-version-config.ts`)

`V3_CONFIG` spreads `V2_CONFIG` then sets:

| Flag | v1 | v2 | v3 | Purpose |
|------|----|----|----|---------|
| `galleryUsesV2Slides` | false | true | true | Use the v2 reshaped gallery slide list (replaces the old `version === "v2"` check in `pdp-tabby-color-media.ts`) |
| `heroScrollsWithPage` | false | false | true | Hero land is in the scroll document, not a fixed 100svh island |
| `heroDockedBuyBar` | false | false | true | Color + Add to bag dock in the hero footer; gallery uses the v3 overlay |
| `floatingBuyBarWhenHeroHidden` | false | false | true | Floating bar mounts only after the hero scrolls past |
| `useV3ColorSheet` | false | false | true | Render the progressive drawer instead of `PdpColorSheet` |
| `showSectionJumpBar` | true | true | **false** | r4 keeps the floating buy bar instead of the chapter jump bar |

Shared components read these flags; v1/v2 paths are untouched. The flags only take effect on the Tabby video hero land (`showBrandBar && hero.kind === "video"`). On a stripped PDP (e.g. Kira) `/v3` falls back to the same stripped behavior as v1/v2.

### v3 change rules

- Same Allowed / Forbidden rules as section 5, extended: v1/v2 routes must not import any `*-v3` module, and `pdp-v3.css` selectors must be scoped under `[data-pdp-version="v3"]`. Enforced by `pnpm check:versions`.
- Never branch on `version === "v3"`. Add a flag to `PdpVersionConfig`.
- Detailed specs: hero/CTA in `docs/pdp-hero-chrome.md` (v3 appendix); color drawer in `docs/pdp-v3-color-sheet.md`.

---

## 8.5. v4 — Paper r5 pivot

v4 is the stakeholder feedback round from Paper page `updates - r5` (`6-0`). It **inherits the full v3 baseline** (it spreads `V3_CONFIG`) — the r4 hero/CTA scroll model and progressive color drawer carry over unchanged — and layers the r5 feedback refinements. Nothing in v1, v2, or v3 changes.

### What v4 changes

1. **No trench portrait slide** — the full-viewport trench portrait between reviews and More like this (Paper `B39-0`, present in v2/v3) is dropped. Gated by `showTrenchPortraitSlide: false`; the shared gallery reads the flag before rendering `trenchPortraitSlide`.
2. **Five-up Details specs** (Paper r5 `LD6-0`) — the Details module renders **Height / Width / Depth / Weight / Strap drop** (3-up row + 2-up row) instead of the frozen three-up spec row. Values live in a new v4-only `pdp-v4-specs.ts`; the frozen `PDP_PRODUCT_DETAILS.specs` in `pdp-data.ts` is never touched.
3. **A0 product still leads the hero gallery** — the Tabby hero gallery leads with `ccx04_b4bk_a0.webp` (the A0 product still) instead of the lifestyle land video. v4-only reorder; the frozen `PDP_HERO_GALLERY_SLIDES` array is not mutated.
4. **r5 style parity** — brings the shared v2 modules in line with the r5 artboards: **left-aligned Reviews and More like this headings** (Paper `MAE-0` / `MD6-0`); **square product-card corners** in More like this and Recently viewed (Paper `MD6-0` "no rounded corners" / `ME6-0`); **arrow-free text links** on "Write a review" and "View again" (Paper `MAE-0` / `ME6-0`); and the **larger 24px UGC heading type** (Paper `L5X-0` "updated type"). The Recently viewed heading stays centered by design (Paper `ME6-0`).

### v4-only files

| File | Role |
|------|------|
| `src/app/v4/` | Route folder — `layout.tsx` sets `data-pdp-version="v4"` and imports `pdp-v4.css`; pages pass `version="v4"` |
| `src/app/v4/pdp-v4.css` | v4-scoped CSS (animation suppressions inherited from v2/v3 calm land) |
| `src/app/v4/pdp-v4-root-marker.tsx` | Marks `<html>` so portaled chrome (floating CTA) gets v4 CSS |
| `src/components/pdp/version/pdp-v4-specs.ts` | v4 five-up Details spec list (Height/Width/Depth/Weight/Strap drop) |

### v4 feature flags (`pdp-version-config.ts`)

`V4_CONFIG` spreads `V3_CONFIG` then sets:

| Flag | v3 | v4 | Purpose |
|------|----|----|---------|
| `showTrenchPortraitSlide` | true | **false** | Drop the full-viewport trench portrait slide |
| `useV4Specs` | false | **true** | Render the five-up Details spec chips |
| `leadGalleryWithProductStill` | false | **true** | Lead the Tabby hero gallery with the A0 product still |
| `demoPopularColorStates` | false | **true** | Pin demo Sold out / Notify me states onto distinct Popular Colors |
| `flattenBuyBarCta` | false | **true** | Drop the color glow/shadow on the Add to bag pill |
| `leftAlignModuleHeadings` | false | **true** | Left-align the Reviews + More like this headings (Recently viewed stays centered) |
| `squareProductCardCorners` | false | **true** | Square the More like this cards + Recently viewed thumbnails |
| `hideTextLinkArrows` | false | **true** | Hide the arrow on "Write a review" / "View again" links |
| `useV4UgcHeadingType` | false | **true** | Use the larger 24px UGC section heading |
| `useV4ModuleSpacing` | false | **true** | r5 padding/spacing refresh across Reviews, More like this, Recently viewed, Details, Editorial, Hero, UGC |
| `useV4LeatherAgingLayout` | false | **true** | Rebuild leather aging (image on top, single warm block) |
| `showBrandSwitcher` | true | **false** | Hide the Coach / Coach Outlet brand switcher above the hero |
| `enableHeroReveal` | true | **false** | Disable the hero shrink/peek choreography (nothing to reveal without the switcher) |

Shared components read these flags; v1/v2/v3 paths are untouched.

### v4 change rules

- Same Allowed / Forbidden rules as section 5, extended: v1/v2/v3 routes must not import any `*-v4` module, and `pdp-v4.css` selectors must be scoped under `[data-pdp-version="v4"]`. Enforced by `pnpm check:versions`.
- Never branch on `version === "v4"`. Add a flag to `PdpVersionConfig`.

Some r5 feedback items are cross-version bug fixes (reviews-tray height stability, leather-aging interaction) that are fixed in the shared components rather than gated to v4 — they improve every version.

### r5 parity process note

r5 was originally scoped from a verbal feedback checklist, which missed several detail-level refinements that only the renamed artboards captured ("no rounded corners", "updated type", "updated cta and alignment"). The style-parity flags above closed that gap by node-verifying each updated r5 artboard directly through the Paper MCP (`get_node_info` / `get_jsx` / `get_computed_styles`) rather than eyeballing screenshots. Future version rounds should do the same before signing off "no gap found."

**Leather aging restructure (v4):** the r5 Leather aging artboards (`JFT-0` / `LM2-0` / …) restructure the module — image on top (no warm header band above it), then a single warm `#EFEAE7` block holding a centered title, per-stage description, and the stage slider. The block is **not** plain white (an earlier draft of this note wrongly said white). The shared `PdpV2LeatherAging` renders this v4 layout behind the `useV4LeatherAgingLayout` flag; v2/v3 keep the r3/r4 `AP5-0` layout (warm header band above the image, caption below the slider).

For the full r5 (v4) module map, node-verify workflow, and Definition of Done, see [pdp-r5-parity.md](pdp-r5-parity.md) and the round changelog [rounds/r5-v4.md](rounds/r5-v4.md).

---

## 8.6. v5 — Sean r5 polish (skelly import)

v5 is Sean's polish round, developed in [skelly363/pdp-next](https://github.com/skelly363/pdp-next) and integrated here as `/v5`. It **inherits the frozen v4 baseline** (`V5_CONFIG` spreads `V4_CONFIG`) and layers buy-box merchandising, gallery story reshuffle, flat color sheet, desktop split layout, UGC testimonials, and module spacing polish. **v1–v4 are unchanged.** **`/v5` is frozen** — new work goes to **`/v6`**.

### v5-only files

| File | Role |
|------|------|
| `src/app/v5/` | Route folder — `layout.tsx`, `pdp-v5.css`, `pdp-v5-root-marker.tsx` |
| `src/components/pdp/version/pdp-v5-desktop-*.tsx` | Desktop media column + sticky buy panel |
| `src/components/pdp/version/pdp-v5-ugc-testimonials.tsx` | UGC testimonial carousel |
| `src/components/pdp/version/pdp-v5-ways-to-wear*.tsx` | Ways to wear styling module |

### Key v5 flags (`V5_CONFIG` in `pdp-version-config.ts`)

| Flag | Purpose |
|------|---------|
| `desktopSplitLayout` | lg+ split — media left, sticky buy panel right |
| `flatColorSheet` | Single flat color list (no materials/sizes sections) |
| `useV5DetailsSheet` | Editorial two-column Details sheet |
| `useV5UgcTestimonialCarousel` | UGC quote carousel in reviews |
| `showWaysToWearModule` | Styling compare slider module |
| `showFloatingBuyBar: false` | Docked hero ATB only (no sticky floating bar) |
| `lockHeroGalleryTemplate` | Preserve gallery slide order on colorway switch |

Full flag list: `V5_CONFIG` in `pdp-version-config.ts`. Deploy links: [deploy-and-links.md](deploy-and-links.md).

---

## 8.7. v6 — post-v5 feedback round

v6 is the active feedback round after freezing `/v5`. It **inherits the frozen v5 baseline** (`V6_CONFIG` spreads `V5_CONFIG`). Add new flags to `V6_CONFIG` — never edit `V5_CONFIG` in place. **v1–v5 are unchanged.**

### v6-only files

| File | Role |
|------|------|
| `src/app/v6/` | Route folder — `layout.tsx`, `pdp-v6.css`, `pdp-v6-root-marker.tsx` |
| `docs/rounds/r7-v6.md` | Round changelog |

### Key v6 flags (`V6_CONFIG` in `pdp-version-config.ts`)

Currently mirrors `V5_CONFIG` with no overrides. Add flags here as feedback lands.

Full changelog: [rounds/r7-v6.md](rounds/r7-v6.md). Deploy links: [deploy-and-links.md](deploy-and-links.md).

---

## 9. Sunset plan

When stakeholders pick a winner:

- **v1 wins** — delete `src/components/pdp/version/`, the `/v2`, `/v3`, and `/v4` routes, `pdp-v2.css` / `pdp-v3.css` / `pdp-v4.css`, and the version props/flags; restore plain component calls.
- **a pivot wins** — promote it to default: fold its flags into the shared components as the new baseline, then remove the other routes and the adapter layer.

Either way, remove the boundary script and Cursor rule once a single version remains.
