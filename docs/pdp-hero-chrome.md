# PDP Hero Chrome

Canonical spec for the Tabby video hero land experience. If this doc and Paper disagree, Paper wins.

## Paper authority

- [Hero shrinked `6AJ-0`](https://app.paper.design/file/01KVTV0K48C5PNSC96MPDBVQBM/3-0/6AJ-0) — brand bar visible, subtle hug (52px top offset + 16px top radius; edge-to-edge horizontally)
- [Hero full bleed `64P-0`](https://app.paper.design/file/01KVTV0K48C5PNSC96MPDBVQBM/3-0/64P-0) — brand bar hidden, edge-to-edge hero
- [Slide indicator `6JV-0` / `6KK-0`](https://app.paper.design/file/01KVTV0K48C5PNSC96MPDBVQBM/3-0/6JV-0) — tick row inside Hero Middle (`6CU-0`), above the product name

Same DOM in both states; only CSS values change.

## DOM tree

```
PdpHeroShell
├── Phone (in context)
│   ├── PdpBrandBarReveal
│   └── Hero
│       └── MediaFrame (overflow clip, animated radius)
│           └── PdpHeroGallery (section, data-header-surface = active slide)
│               ├── Track (horizontal snap scroller, 16 slides)
│               │   ├── Slide 0 — lifestyle video (white nav)
│               │   └── Slide 1..15 — studio stills + spin/grain videos (dark nav)
│               ├── Scrim wrapper (filter gradient + top scrim; fades out on light slides)
│               ├── HeroMiddle (bottom gradient — always on)
│               ├── PdpHeroActionRail
│               └── PdpGalleryProductHud
│                   └── PdpHeroGalleryIndicator (above product name)
└── floating cta bar (PdpBottomActions — fixed portal)
    └── PdpBuyBarRow (Color + Add to bag)
```

`PdpOverlayHeader` is fixed above the hero, publishes `--hero-inset` (currently `0` at all reveal values), and participates in hero UI scroll fade/blur.

## CSS variables

| Variable | Driver | Purpose |
|----------|--------|---------|
| `--hero-reveal` | Intro + pull-to-reveal (`0` = full bleed, `1` = shrunk) | Lerp radius, brand bar, hero top padding |
| `--hero-inset` | `reveal × 0px` | Reserved for horizontal chrome alignment (edge-to-edge per Paper `6AJ-0`) |
| `--cta-bar-height` | `ResizeObserver` on floating CTA | Product HUD lift at full bleed |
| `--hero-ui-opacity` | Scroll through hero | Fade hero overlays (not video/CTA) |
| `--hero-ui-blur` | Scroll through hero | Blur hero overlays |

## Reveal value table

| Property | `reveal = 1` (shrunk) | `reveal = 0` (full bleed) |
|----------|------------------------|---------------------------|
| Hero side padding | 0 | 0 |
| Hero top padding | 52px | 0 |
| Radius top | 16px | 0 |
| Radius bottom | 0 | 0 |
| Brand bar offset | `top: 0` | `top: -64px` |

Shrunk vs full bleed is intentionally subtle — brand switcher, top offset, and top corner radius only — so the land transition feels calm even without `prefers-reduced-motion`.

## Intro timing

- Load: start shrunk (`reveal = 1`); collapse is **blocked** until the hold timer finishes (`introCollapseAllowed` on the controller)
- Hold: **2s**
- Collapse to full bleed: **1.0s** ease-out, then pull gestures unlock
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

## Hero gallery (side-scrolling)

The hero land is a horizontal snap gallery, not a single video (`PdpHeroGallery`). Slides come from `PDP_HERO_GALLERY_SLIDES` (`pdp-hero-gallery-data.ts`).

- **Slide order (16):** lifestyle video → `a0/a3/a5` product → `a6` detail → spin video → `a8/a10` detail → `a21` product → `a61/a62` on-model → grain-leather video → `a88` product → `a92` on-model → `a99` detail → `a101` spec sheet.
- **Active slide** is derived from `scrollLeft / clientWidth` (rounded) on a **tripled rail** (`loopCarouselItems`). Logical index is `loopedIndex % slideCount` for nav contrast, indicator, and scrim; only the centered DOM clone plays video. `useInfiniteFullBleedCarousel` teleports `scrollLeft` by one block at the edges after scroll settles so swiping past the last slide returns to the first (and vice versa) without a visible jump.
- **Touch:** the track uses `touch-action: pan-x pan-y` and `overscroll-x-contain` — horizontal swipes change slides while vertical swipes scroll the page. Videos render with `passThroughTouch` + `allowHorizontalPan` so a swipe over the video still pages the gallery.
- **Playback:** only the active slide's video plays; slide 0 keeps `priorityAutoplay` (blur reveal). Spin/grain videos autoplay when active, muted, no controls.

### Nav contrast per slide

Each slide declares `headerSurface`, applied to `data-header-surface` on the gallery section so `useHeaderContrast` overrides luminance sampling:

| Slide | `headerSurface` | Nav |
|-------|-----------------|-----|
| 0 — lifestyle video | `dark` | white icons |
| 1–15 — studio stills + spin/grain videos | `light` | dark icons |

On load the gallery starts at slide 0 → `dark` → **white nav immediately** (fixes the previous dark-on-load sampling bug).

### Shot framing

Slides declare a `shotType`; `resolveHeroFraming` (`pdp-hero-framing.ts`) maps it to `object-fit` / `object-position`. Studio stills sit on the `#f0f0f0` ground so `contain` letterboxing is seamless.

| `shotType` | `object-fit` | `object-position` | Use |
|------------|--------------|-------------------|-----|
| `lifestyle` | `cover` | `center 40%` | Slide 0 video |
| `product` | `contain` | `center` | Full bag — show straps |
| `detail` | `cover` | `center` | Macro / interior close-ups |
| `on-model` | `cover` | `center top` | Model shots — keep faces |
| `studio` | `contain` | `center` | Spin, spec sheet, flat lay |

`scripts/generate-hero-framing-manifest.mjs` is an opt-in (`sharp`) review aid for classifying new colorways; the slide data stays the source of truth.

### Slide indicator (Paper `6JV-0`)

`PdpHeroGalleryIndicator` mounts inside `PdpGalleryProductHud` above the product name.

- 2px tall ticks, 4px gap; active tick elongates to 16px, inactive ticks are 2px dots.
- Tone follows the active surface: white on the video slide, dark on stills.
- **Capped at 8 visible ticks** (58px viewport, `overflow-x: hidden`) over a full 16-tick rail (106px). The rail auto-scrolls (`scrollTo`, smooth) so the active tick stays visible — it starts moving before the active tick would reach the last visible slot, and reverses on swipe-back. `useReducedMotion` switches the scroll to instant.

## Gradients (Paper)

1. **Filter layer** (full frame): `linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.11) 100%)`
2. **HeroMiddle** (bottom band): `linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.30) 100%)`

Filter layer + top scrim are wrapped together and **fade to 0 on light slides** (300ms) so studio stills stay clean with dark nav; HeroMiddle stays on to anchor the white product HUD. Product name sits inside the frame on HeroMiddle, not on a white strip below.

## Floating CTA bar

- Fixed at bottom; `padding: 8px`; horizontal padding is `CTA_BAR_PADDING_PX` only (no side inset mirror)
- Row `gap: 10px`; pills always `border-radius: 999px`; ATB height **50px**
- Color pill: white fill, `1px` `#E5E5E5` border, `8px` / `16px` padding
- Height published to `--cta-bar-height` via `ResizeObserver`

## Bottom chrome swap

From **The Details** onward, the floating CTA (`PdpBottomActions`) swaps with the jump bar (`PdpSectionIndicator`). Logic lives in `use-pdp-chrome-mode.ts`.

| Step | Scroll action | Bottom chrome |
|------|---------------|---------------|
| Land | — | CTA |
| Down (hero) | — | CTA |
| Reach The Details | — | Jump bar (immediate) |
| Up (1st swipe) | — | Jump bar persists |
| Up (2nd swipe) | — | CTA |
| Down (1st swipe, still in Details) | — | Jump bar (immediate) |

- **Zone:** past hero (`scrollY > 0.85 × viewport`) and active chapter ≥ The Details.
- **Dismiss:** two upward swipes — first is buffered, second swaps to CTA immediately during scroll.
- **Restore:** one downward swipe while still in the zone — jump bar returns immediately during scroll (no second-scroll wait).
- **Above zone:** scrolling back before The Details always shows CTA and resets dismiss state.

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
| Hero gallery (carousel) | `src/components/pdp/pdp-hero-gallery.tsx` |
| Infinite loop hook | `src/components/pdp/use-infinite-centered-carousel.ts` (`useInfiniteFullBleedCarousel`) |
| Hero entry wrapper | `src/components/pdp/pdp-gallery-view.tsx` (`PdpGalleryHero`) |
| Slide data | `src/components/pdp/pdp-hero-gallery-data.ts` |
| Shot framing presets | `src/components/pdp/pdp-hero-framing.ts` |
| Gallery state context | `src/components/pdp/pdp-hero-gallery-context.ts` |
| Slide indicator | `src/components/pdp/pdp-hero-gallery-indicator.tsx` |
| Framing manifest (opt-in) | `scripts/generate-hero-framing-manifest.mjs` |
| Product HUD | `src/components/pdp/pdp-gallery-product-hud.tsx` |
| Floating CTA | `src/components/pdp/pdp-bottom-actions.tsx` |
| CTA height | `src/components/pdp/use-cta-bar-height.ts` |
| UI scroll chrome | `src/components/pdp/use-hero-ui-chrome.ts` |
| Bottom chrome swap | `src/components/pdp/use-pdp-chrome-mode.ts` |
| Video | `src/components/pdp/pdp-gallery-hero-video.tsx` |

## Out of scope

- Stripped layout / static hero variants (`pdp-stripped-view.tsx`)
- Workshop sticky notes for hero land (Paper frames above are authoritative)
