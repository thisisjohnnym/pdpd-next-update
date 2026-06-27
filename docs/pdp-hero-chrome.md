# PDP Hero Chrome

Canonical spec for the Tabby video hero land experience. If this doc and Paper disagree, Paper wins.

## Paper authority

- [Hero shrinked `6AJ-0`](https://app.paper.design/file/01KVTV0K48C5PNSC96MPDBVQBM/3-0/6AJ-0) — brand bar visible, inset hero, rounded media frame
- [Hero full bleed `64P-0`](https://app.paper.design/file/01KVTV0K48C5PNSC96MPDBVQBM/3-0/64P-0) — brand bar hidden, edge-to-edge hero

Same DOM in both states; only CSS values change.

## DOM tree

```
PdpHeroShell
├── Phone (in context)
│   ├── PdpBrandBarReveal
│   └── Hero
│       └── MediaFrame (overflow clip, animated radius)
│           ├── Video
│           ├── Filter gradient
│           ├── HeroMiddle (bottom gradient)
│           │   ├── PdpHeroActionRail
│           │   └── PdpGalleryProductHud
│           └── Top scrim
└── floating cta bar (PdpBottomActions — fixed portal)
    └── PdpBuyBarRow (Color + Add to bag)
```

`PdpOverlayHeader` is fixed above the hero but mirrors `--hero-inset` and participates in hero UI scroll fade/blur.

## CSS variables

| Variable | Driver | Purpose |
|----------|--------|---------|
| `--hero-reveal` | Intro + pull-to-reveal (`0` = full bleed, `1` = shrunk) | Lerp inset, radius, brand bar, phone padding |
| `--hero-inset` | `reveal × 8px` | Horizontal breathing room for fixed chrome |
| `--cta-bar-height` | `ResizeObserver` on floating CTA | Phone `padding-bottom` when shrunk |
| `--hero-ui-opacity` | Scroll through hero | Fade hero overlays (not video/CTA) |
| `--hero-ui-blur` | Scroll through hero | Blur hero overlays |

## Reveal value table

| Property | `reveal = 1` (shrunk) | `reveal = 0` (full bleed) |
|----------|------------------------|---------------------------|
| Hero side padding | 8px | 0 |
| Hero top padding | 52px | 0 |
| Radius top | 16px | 0 |
| Radius bottom | 8px | 0 |
| Brand bar offset | `top: 0` | `top: -64px` |
| Phone padding-bottom | `reveal × --cta-bar-height` | 0 |

## Intro timing

- Load: start shrunk (`reveal = 1`); collapse is **blocked** until the hold timer finishes (`introCollapseAllowed` on the controller)
- Hold: **3s**
- Collapse to full bleed: **1.8s** ease-out, then pull gestures unlock
- Pull-to-reveal at scroll top restores shrunk state (existing gesture)

Docs describe behavior only — they do not affect runtime. If land behavior disagrees with this file, fix `use-pdp-hero-reveal.tsx`.

## Scroll behavior

- **Hero reveal** (`--hero-reveal`): **not** tied to `scrollY === 0`. Shrunk state is only from (1) the one-time intro peek, or (2) intentional pull-down overscroll at the top after intro completes.
- **Scroll back to top** from any section: always rests at **full bleed** (`reveal = 0`). Scroll arrival suppresses pull gestures for ~800ms to ignore iOS momentum / rubber-band.
- **Hero UI** (header, rail, product name, gradients): full opacity until `scrollY > 0.8 × viewportHeight`, then fade + blur through `1.0 × viewportHeight`
- **Video**: autoplays and loops normally; not faded or blurred while scrolling
- **Floating CTA**: always fixed and visible; hides only when sheets/modals open
- **No scroll snap** on hero (`PDP_PANEL_SCROLL = false`)
- **Overlay header** (`useScrollNavVisibility`): hides on scroll down, shows on scroll up near top — independent of hero reveal / brand switcher

## Gradients (Paper)

1. **Filter layer** (full frame): `linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.11) 100%)`
2. **HeroMiddle** (bottom band): `linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.30) 100%)`

Product name sits inside the video frame on HeroMiddle, not on a white strip below.

## Floating CTA bar

- Fixed at bottom; `padding: 8px`; mirrors `--hero-inset` horizontally
- Row `gap: 10px`; pills always `border-radius: 999px`; ATB height **50px**
- Color pill: white fill, `1px` `#E5E5E5` border, `8px` / `16px` padding
- Height published to `--cta-bar-height` via `ResizeObserver`

## Chrome suppression

Hide floating CTA when: nav menu, reviews sheet, add-to-bag sheet, strap options, compare picker, AR try-on, or inline color sheet is open.

Do **not** hide CTA for `jumpBarActive` (section indicator swap).

## Code map

| Piece | File |
|-------|------|
| Reveal controller | `src/components/pdp/use-pdp-hero-reveal.tsx` |
| Layout tokens | `src/components/pdp/pdp-hero-tokens.ts` |
| Phone shell | `src/components/pdp/pdp-hero-shell.tsx` |
| Brand bar | `src/components/pdp/pdp-brand-bar-reveal.tsx` |
| Hero slide | `src/components/pdp/pdp-gallery-view.tsx` (`PdpGalleryHero`) |
| Product HUD | `src/components/pdp/pdp-gallery-product-hud.tsx` |
| Floating CTA | `src/components/pdp/pdp-bottom-actions.tsx` |
| CTA height | `src/components/pdp/use-cta-bar-height.ts` |
| UI scroll chrome | `src/components/pdp/use-hero-ui-chrome.ts` |
| Video | `src/components/pdp/pdp-gallery-hero-video.tsx` |

## Out of scope

- Stripped layout / static hero variants (`pdp-stripped-view.tsx`)
- Workshop sticky notes for hero land (Paper frames above are authoritative)
