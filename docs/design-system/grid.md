# PDP Next — Layout Grid

All layout work in this project uses the Figma grid system below. Do not use ad-hoc padding or arbitrary column counts.

## Spec

| Breakpoint | Frame | Columns | Margin | Gutter | Label |
|------------|-------|---------|--------|--------|-------|
| **Mobile** | 375px | **12** | **12px** | **4px** | `12/12/4` |
| **Desktop** | 1440px | **24** | **20px** | **8px** | `24/20/8` |

Column type: **Stretch** (fluid columns within the frame).

## Code

Use the shared grid components — never raw `px-4` for page margins:

```tsx
import { PageGrid, GridItem, PageShell } from "@/components/grid/page-grid";

<PageShell>
  <PageGrid>
    <GridItem mobile={8} desktop={16}>Content</GridItem>
  </PageGrid>
</PageShell>
```

- **Full-bleed** sections (e.g. hero imagery at `reveal = 0`) sit outside `PageGrid`.
- **In-grid** sections (bottom modules, editorial blocks) use `PageGrid` + `GridItem`.
- **Hero fixed chrome** (overlay header, floating CTA) is edge-to-edge per Paper `6AJ-0` (`--hero-inset` is `0`); uses `CTA_BAR_PADDING_PX` for the floating bar — see `docs/pdp-hero-chrome.md`.

## CSS tokens

Defined in `src/app/globals.css`:

- `--grid-columns-mobile`: 12
- `--grid-margin-mobile`: 12px
- `--grid-gutter-mobile`: 4px
- `--grid-columns-desktop`: 24
- `--grid-margin-desktop`: 20px
- `--grid-gutter-desktop`: 8px
- `--grid-max-width-desktop`: 1440px
