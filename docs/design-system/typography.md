# Coach Typography

All UI copy uses **Helvetica Neue LT Pro** — no Inter, Arial, or system sans fallbacks in components.

## Headline / H1 (PDP display)

Primary module titles, sheet headings, and other headline setups use **Helvetica Neue Extended**.

**coach.com reference** (Fontanello / production PDP):

| Property | Value |
|----------|-------|
| Family | Helvetica Neue Extended 53 |
| Weight | `400` (normal) |
| Size | `32px` |
| Line height | `36.8px` (`1.15`) |
| Letter spacing | `0.2px` |
| Color | `#000000` |
| Font features | `kern` |

**PDP Next implementation** (current code — smaller mobile scale):

| Property | Value |
|----------|-------|
| Size | `text-xl` (`20px`) |
| Letter spacing | `0.4px` |
| Weight | `400` · color `#000` |

Code: `pdpType.headline` in `src/components/pdp/pdp-type.ts` · consumed by `pdpModuleHeadingClass` / `pdpSheetHeadingClass` in `pdp-module-section.ts`.

## Body copy rhythm

Paragraph and UI copy use **Helvetica Neue Extended** with coach.com PDP rhythm. Sizes stay mobile-first and tiered (`pdpType.body`, `.caption`, `.label`) — not locked to 16px everywhere.

| Property | Value |
|----------|-------|
| Family | Helvetica Neue Extended (`font-extended`) |
| Weight | `400` (normal) |
| Reference size | `16px` / `21.6px` line height on coach.com |
| Line height | `1.35` at every size tier |
| Letter spacing | `0.2px` |
| Color | `#000000` (contextual tints allowed on dark media) |
| Font features | `kern` |

Code: `pdpBodyRhythm` and `pdpType.body` / `.caption` / `.label` in `src/components/pdp/pdp-type.ts`.

## Weights in use

| Weight | File | CSS | Use |
|--------|------|-----|-----|
| Roman | `helvetica-neue-lt-pro-roman.woff2` | `400` | Body, labels, nav |
| Bold | `helvetica-neue-lt-pro-bold.woff2` | `700` | Emphasis, buttons |
| Extended | `helvetica-neue-lt-pro-extended.woff2` | `400` | Display / wordmarks |
| Extended Bold | `helvetica-neue-lt-pro-extended-bold.woff2` | `700` | Display headlines |

Source: Coach 2026 Font Set → `Helvetica LT Pro (Coach & CO)/WOFF/`

## Code

Loaded via `next/font/local` in `src/app/layout.tsx` as `--font-coach`.

Tailwind: `font-sans` maps to Helvetica Neue LT Pro globally.

Extended variants: `font-extended` utility class.

## Rules

1. Do not import Google Fonts for UI text.
2. Use semantic weights (`font-normal`, `font-bold`) — not arbitrary font-family.
3. Garamond / Helvetica Now are separate Coachtopia fonts — not used on standard Coach Outlet PDP unless specified.
