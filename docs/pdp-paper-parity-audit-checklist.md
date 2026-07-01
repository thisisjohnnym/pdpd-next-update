# PDP Paper Parity Audit Checklist

Use this checklist for every PDP implementation pass.

If any item fails, the module is not done.

---

## Module Audit Fields (Complete For Every Module)

- Paper page/frame/node:
- Code file:
- Layout path: `full` / `stripped` / `both`
- Status: `match` / `fixed` / `deferred`
- Notes:

---

## Required Checks Per Module

- Structure parity (same hierarchy and ordering as Paper)
- Spacing parity (margins, paddings, gaps, section rhythm)
- Typography parity (font, size, weight, leading, tracking)
- Visual parity (color, border, radius, shadows, surfaces)
- Interaction parity (tap states, sheet behavior, transitions)
- Responsive parity (mobile and desktop behavior)

---

## P0 Priority Modules (Audit First)

- [ ] **Hero chrome shell** — `PdpHeroShell`, `PdpBrandBarReveal` (`pdp-hero-shell.tsx`, `pdp-brand-bar-reveal.tsx`) — Paper [`6AJ-0`](https://app.paper.design/file/01KVTV0K48C5PNSC96MPDBVQBM/3-0/6AJ-0) / [`64P-0`](https://app.paper.design/file/01KVTV0K48C5PNSC96MPDBVQBM/3-0/64P-0); subtle shrunk peek (brand bar + 52px top + 16px top radius only); spec: `docs/pdp-hero-chrome.md`
- [ ] **Hero gallery + overlays** — `PdpHeroGallery`, `PdpGalleryProductHud`, `PdpHeroActionRail` — side-scrolling 16-slide gallery; gradients, 80% UI fade; per-slide nav contrast (white on video, dark on stills); shot-type framing
- [ ] **Hero slide indicator** — `PdpHeroGalleryIndicator` — Paper [`6JV-0`](https://app.paper.design/file/01KVTV0K48C5PNSC96MPDBVQBM/3-0/6JV-0); 2px ticks, active bar, max 8 visible with auto-scrolling rail
- [ ] **Floating CTA bar** — `PdpBottomActions`, `PdpBuyBarRow` — fixed sibling of Phone; 50px pills; hides only for sheets
- [ ] `PdpCoachAiModule` (`src/components/pdp/pdp-shopping-discovery-module.tsx`)
- [ ] `PdpCoachAiSheet` (`src/components/pdp/pdp-coach-ai-sheet.tsx`)
- [ ] `PdpCoachPremiumModule` (`src/components/pdp/pdp-coach-premium-module.tsx`)
- [ ] `PdpSiteFooter` (`src/components/pdp/pdp-site-footer.tsx`)

---

## Full Layout Audit Order (`PdpGalleryView`)

- [ ] `PdpReviewsModule`
- [ ] `PdpCoachAiModule`
- [ ] `PdpBundleModule`
- [ ] `PdpCompareModuleGate`
- [ ] `PdpMoreLikeThisModule`
- [ ] `PdpRecentlyViewedCarousel`
- [ ] `PdpCoachPremiumModule`
- [ ] `PdpSiteFooter`

File: `src/components/pdp/pdp-gallery-view.tsx`

---

## Stripped Layout Audit Order (`PdpStrippedView`)

- [ ] `PdpReviewsModule`
- [ ] `PdpCoachAiModule`
- [ ] `PdpMoreLikeThisModule`
- [ ] `PdpRecentlyViewedCarousel`
- [ ] `PdpCoachPremiumModule`
- [ ] `PdpSiteFooter`

File: `src/components/pdp/pdp-stripped-view.tsx`

---

## Verification Evidence (Required)

- [ ] Screenshot captured for each changed module state
- [ ] Mobile and desktop screenshots captured
- [ ] Fixed/sticky/sheet behavior validated during scroll
- [ ] Any remaining mismatch logged as `deferred` with reason

---

## Release Gate

Do not mark PDP work complete until:

- [ ] All P0 modules are `match` or approved `deferred`
- [ ] No unapproved deviation from Paper remains
- [ ] This checklist is updated with final status notes
