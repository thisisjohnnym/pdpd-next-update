# PDP v3 — Progressive color drawer

The in-context color drawer for the `/v3` PDP pivot (Paper r4). Read alongside `docs/pdp-versions.md` (section 8) and the v3 hero appendix in `docs/pdp-hero-chrome.md`.

## In short

- Opened from the docked or floating Color pill on `/v3` (Tabby only).
- A full-height bottom sheet over the dimmed hero with three sections: **Popular colors**, **Explore materials**, **Bag size**.
- Colors and materials are revealed **progressively** — a short list first, with a "see more" toggle that expands to the full set.
- Reuses the shared bottom-sheet chrome, swatch, notify sheet, and availability helpers. It does **not** reuse the size-grouped `getTabbyColorSheetGroups` (that taxonomy is bag-size, not r4's popular/materials).

Paper source: `updates - r4` (`5-0`) — collapsed `EU5-0`, expanded `EIE-0`.

## Sections

| Section | Source data | Behavior |
|---------|-------------|----------|
| Header | `tabby.size`, `tabby.summary.price` | "Choose color" + "Size {n} · {price}" |
| Popular colors | `tabby.colorOptions` (every colorway of the current material) | 3 rows shown; toggle "See N+ colors" reveals all, "See fewer colors" collapses. Rows show availability and a check on the current color. |
| Explore materials | other Tabby styles | 4 rows shown; toggle "View N+ materials". Status per material vs the current size + selected color. |
| Bag size | `tabby.sizeOptions` | Horizontal scroll of size cards (image + size + price); current size outlined, unavailable sizes dimmed. |

### Progressive counts

- `POPULAR_COLLAPSED = 3`, `MATERIALS_COLLAPSED = 4` (in `pdp-v3-color-sheet.tsx`).
- The toggle only renders when there are more rows than the collapsed count.

### Material status (`pdp-v3-color-sheet-sections.ts`)

For each material (style) other than the current one, against the current `size` + `selectedColorId`:

| Status | Condition | Row treatment |
|--------|-----------|---------------|
| `current` | the active material | check, no action |
| `in-stock` | size offered **and** current color available | selectable → `navigateToStyle` |
| `unavailable-in-color` | size offered, current color not available | dimmed, non-selectable ("Not available in selected color") |
| `out-of-stock` | size not offered in this material | dimmed + "Notify me" button → notify sheet |

The representative swatch for a material is the current color's swatch in that material when offered, else the first color at the material's first available size.

## Interactions

- **Color row** → `tabby.setSelectedColorId(id)`, then close.
- **Material row (in-stock)** → `tabby.navigateToStyle(styleId)`, then close (size + color cascade-resolve via the catalog).
- **Material row (out-of-stock)** → opens the shared `PdpNotifySheet` with the material label.
- **Size card** → `tabby.navigateToSize(size)`, then close.
- **Escape / backdrop / close button** → close (shared `useOverlayDismiss`).

## Integration

`PdpColorDropup` (in `pdp-color-selector.tsx`) reads `useV3ColorSheet` from the version config and mounts `PdpV3ColorSheet` instead of `PdpColorSheet` when it is true and the product is Tabby. Because both the docked hero buy bar and the floating buy bar render through `PdpBuyBarRow → PdpColorSelector`, they share the same drawer and the same Tabby variant state. v1/v2 keep the flat `PdpColorSheet`.

## Code map

| Piece | File |
|-------|------|
| Drawer component | `src/components/pdp/version/pdp-v3-color-sheet.tsx` |
| Section data mapping | `src/components/pdp/version/pdp-v3-color-sheet-sections.ts` |
| Integration point | `src/components/pdp/pdp-color-selector.tsx` (`PdpColorDropup`) |
| Catalog source | `pdp-tabby-catalog.ts`, `pdp-tabby-colors.ts`, `pdp-tabby-variants.ts` (frozen — not edited for v3) |
