# Icons

All icons use **Google Material Symbols** — no custom SVGs or other icon libraries.

## Package

`material-symbols` (official Material Design icon font)

## Usage

```tsx
import { MaterialIcon } from "@/components/icons/material-icon";

<MaterialIcon name="search" size={20} />
<MaterialIcon name="favorite" size={24} filled />
```

| Prop | Default | Description |
|------|---------|-------------|
| `name` | — | Icon name from [Google Fonts Icons](https://fonts.google.com/icons) |
| `size` | `24` | `20` or `24` (matches Material optical size) |
| `filled` | `false` | Use filled rounded variant |

## Style

- **Default:** Outlined (`material-symbols-outlined`)
- **Filled:** Rounded filled (`material-symbols-rounded` + `FILL 1`)

## Current PDP icons

| UI | Material name |
|----|---------------|
| Menu | `menu` |
| Search | `search` |
| Account | `person` |
| Saved | `bookmark` |
| Bag | `shopping_bag` |
| Shop the Look | `checkroom` |

## One-line label + icon (load only when needed)

Helvetica next to Material icons often looks optically off in compact CTAs even when flex-centered. For the one-line label nudge pattern (Paper + code), see [`helvetica-icon-optical-align.md`](helvetica-icon-optical-align.md).

## Rules

1. Never add inline SVG icons — use `MaterialIcon`.
2. Do not install `@mui/icons-material`, Lucide, Heroicons, etc.
3. Pick names from the official catalog only.
