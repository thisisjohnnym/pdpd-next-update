---
name: pdp-grid-system
description: >-
  Applies the PDP Next Figma layout grid (Mobile 12/12/4, Desktop 24/20/8) when
  building or editing pages, components, spacing, or responsive layout in
  pdp-next. Use for any layout, grid, margin, gutter, column span, or
  mobile-first breakpoint work.
---

# PDP Next Grid System

**Always use this grid.** Do not invent page margins or column counts.

## Spec

| Breakpoint | Frame | Columns | Margin | Gutter | Label |
|------------|-------|---------|--------|--------|-------|
| Mobile | 375px | 12 | 12px | 4px | `12/12/4` |
| Desktop | 1440px | 24 | 20px | 8px | `24/20/8` |

Columns are **stretch** (fluid within the frame).

## Implementation

```tsx
import { PageGrid, GridItem, PageShell } from "@/components/grid/page-grid";
```

| Component | Use for |
|-----------|---------|
| `PageShell` | Page wrapper, max-width 1440px |
| `PageGrid` | 12-col mobile / 24-col desktop grid with correct margin + gutter |
| `GridItem` | Column spans via `mobile` (1–12) and `desktop` (1–24) |

## Rules

1. **Mobile-first** — default spans are mobile; add `desktop` for lg+.
2. **Full-bleed** — hero/media that edge-to-edge sits outside `PageGrid`.
3. **No ad-hoc margins** — replace `px-4`, `max-w-lg`, etc. with grid components.
4. **Reference** — see [docs/design-system/grid.md](../../../docs/design-system/grid.md) for tokens.

## Typography

All UI text uses **Helvetica Neue LT Pro** (Roman 400, Bold 700). See [docs/design-system/typography.md](../../../docs/design-system/typography.md). Do not use Google Fonts or Inter.

## Example — product info row

Title spans 8 cols, price spans 4 cols on mobile; same ratio on desktop:

```tsx
<PageGrid as="section">
  <GridItem mobile={8} desktop={18}>
    <h1>Brown Bomber Jacket</h1>
  </GridItem>
  <GridItem mobile={4} desktop={6} className="text-right">
    <p>$399</p>
  </GridItem>
  <GridItem mobile={12} desktop={24}>
    <p>Wrinkle-Free 4-Ply Wool by Rogna, Italy</p>
  </GridItem>
</PageGrid>
```
