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
