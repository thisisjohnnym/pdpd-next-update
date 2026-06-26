# PDP Paper Parity Audit — Findings

One-time audit record for the ecommerce-tail parity pass. Governance lives in
`pdp-paper-source-of-truth.md` and `pdp-paper-parity-audit-checklist.md`.

## Locked Paper baseline

- File: `01KVTV0K48C5PNSC96MPDBVQBM`
- Artboard: `3X7-0` — "PDP — Tabby Shoulder Bag 26 (Mobile)"
- Tail module nodes:
  - Reviews `45P-0`
  - Coach AI `48O-0`
  - Bundle `49Q-0`
  - Compare Family `4AX-0`
  - More Like This `4BK-0`
  - Recently Viewed `4CK-0`
  - Coach Premium `4E6-0` (mislabeled "Coach AI" in Paper; content is Premium)
  - Footer `4EZ-0`

## Routes / viewports audited

- Full flow: `/products/tabby-shoulder-bag-26-quilted` (`PdpGalleryView`)
- Stripped flow: `/products/kira-crossbody` (`PdpStrippedView`)
- Viewport: mobile 375 (iPhone-14 emulation)

Module order in both code flows matches Paper. No reordering needed.

## Module status

| Module | Node | File | Status |
|---|---|---|---|
| Coach AI | `48O-0` | `pdp-shopping-discovery-module.tsx` | fixed |
| Coach Premium | `4E6-0` | `pdp-coach-premium-module.tsx` | fixed |
| Recently Viewed | `4CK-0` | `pdp-recently-viewed-carousel.tsx` | fixed |
| Footer | `4EZ-0` | `pdp-site-footer.tsx` | fixed |
| Reviews | `45P-0` | `pdp-reviews-module.tsx` | match (no change this pass) |
| Bundle | `49Q-0` | `pdp-bundle-module.tsx` | match (no change this pass) |
| Compare Family | `4AX-0` | `pdp-compare-module-gate.tsx` | match (no change this pass) |
| More Like This | `4BK-0` | `pdp-shopping-discovery-module.tsx` | match (no change this pass) |

## Fixes applied

### Coach AI (`48O-0`)
- Rebuilt the on-page card from a light flat form to Paper's dark card
  (`#1C1C1C`, rounded, centered sparkle + "Coach AI" heading).
- Added the "Ask the AI Concierge" pill (white/13% fill, white round
  arrow button) that opens the chat sheet.
- Replaced chip row with divider-separated prompt rows (text + search icon),
  driven by `getPdpCoachAiContent`. Tapping a row hands off to the sheet.

### Coach Premium (`4E6-0`)
- Card surface `#1C1C1C` + `rounded-2xl` (was `neutral-900` / `rounded-3xl`).
- Title to 28px / 34px leading; body to full-opacity white.
- Perk icon circles to 34px on white/12%; button height to 50px / 16px label;
  footnote to white/50 micro.

### Recently Viewed (`4CK-0`)
- Converted horizontal portrait carousel to Paper's vertical list rows:
  56×70 thumbnail, time label, name, price, and a right-aligned
  "View again" + forward arrow. Heading centered.

### Footer (`4EZ-0`)
- Swapped the C-mark + "Coach Outlet" text for the serif `CoachWordmark`.
- Newsletter is now a bordered input box with an inline white "Sign Up".
- Link groups stack vertically; titles full-white, links white/50.
- Social row centered; legal links stacked; copyright white/50.

## Remaining deltas (deferred)

- **Footer social glyphs** — Paper uses brand-accurate outline marks
  (Instagram, TikTok, YouTube, Facebook, Pinterest). Implementation keeps
  Material Symbols proxies to honor the project icon standard. Revisit if
  brand marks are approved for the footer.
- **Page inset** — Paper cards use an 8px artboard inset; implementation uses
  the project grid margin (12px mobile) per the grid system rule.

## Verification

- TypeScript: `tsc --noEmit` clean.
- Routes: full + stripped return HTTP 200 after edits.
- Visual: verified in Chrome (DevTools MCP) at 390px mobile. Safari screenshots
  were unavailable (Screen Recording permission revoked), so Chrome was used.
  Confirmed dark Coach AI card, dark Coach Premium card, serif-wordmark footer,
  and vertical Recently Viewed list all render per Paper.

### Bug found + fixed during verification

- Footer rendered white instead of dark: `cn()` is a plain class join (no
  tailwind-merge), so `pdpModuleSectionClass`'s hard-coded `bg-white` won over
  the appended `bg-[#171717]`. Fixed by setting the footer background via inline
  `style` so it cannot be overridden by the shared section class.
