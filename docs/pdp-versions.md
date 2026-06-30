# PDP Versions (v1 / v2)

Single source of truth for the two PDP designs that ship from this codebase. Read this before any PDP edit.

## In short

- **v1** is the frozen current design. **v2** is the stakeholder pivot.
- Brand team compares them at **`/v1`** and **`/v2`** on the same deploy.
- `main` is untouched. Pivot work lives on the **`v2`** git branch.
- v2 differences live in `src/components/pdp/version/` and behind flags in `pdp-version-config.ts` — never by rewriting v1.

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

On the **`v2`** deploy both versions are reachable:

- `https://{preview-host}/v1` → current design
- `https://{preview-host}/v2` → pivot design

Same slugs work under each, e.g. `/v1/products/tabby-shoulder-bag-26-black` vs `/v2/products/tabby-shoulder-bag-26-black`.

Legacy `/` and `/products/[slug]` continue to serve **v1**, so existing bookmarks do not break. There is no redirect on `/` — the named routes are the canonical brand links.

> Fill in the live preview host once the `v2` branch is deployed.

---

## 3. Git workflow

1. Cut **`v1`** from `main` — frozen baseline, no pivot edits.
2. Branch **`v2`** from `v1` — all pivot work happens here.
3. Leave **`main`** as-is until stakeholders pick a winner.

`v1` is frozen: never commit to it after it is cut. When a winner is chosen, either delete the v2 adapter layer (if v1 wins) or promote v2 to default (if v2 wins) — see Sunset plan.

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

## 7. Sunset plan

When stakeholders pick a winner:

- **v1 wins** — delete `src/components/pdp/version/`, the `/v2` route, `pdp-v2.css`, and the version props/flags; restore plain component calls.
- **v2 wins** — promote v2 to default: fold the v2 flags into the shared components as the new baseline, then remove the `/v1` route and the adapter layer.

Either way, remove the boundary script and Cursor rule once a single version remains.
