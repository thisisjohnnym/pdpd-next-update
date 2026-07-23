# UXR study — `/uxr1` · `/uxr2` · `/uxr3`

## Summary

| Field | Value |
|-------|-------|
| **Routes** | `/uxr1` → v5 · `/uxr2` → v6 · `/uxr3` → v7 |
| **Design SoT** | `skelly363/pdp-next` @ `9bf290b` (merged into this repo) |
| **Stakeholder goal** | Three Tabby 26 protos for UXR with black ↔ beige (chalk) media swap |
| **Status** | Active share set |
| **Prod base** | https://pdp-next-sigma.vercel.app |

---

## What to share

```
UXR — Tabby 26 protos (same deploy):

uxr1 (v5 baseline):              https://pdp-next-sigma.vercel.app/uxr1
uxr2 (v6 — inline See more):           https://pdp-next-sigma.vercel.app/uxr2
uxr3 (v7 — See more colorways below):  https://pdp-next-sigma.vercel.app/uxr3
```

Soft-hidden compare routes (`/v1`…`/v8`, `/fc01`, `/fc01v`) remain on the deploy for internal use — they are not the share set.

---

## Interactions (all three)

1. **Color switch** — Brass/Black ↔ Brass/Chalk (beige / “white” gallery pack).
2. **Hero gallery** — Desktop UXR packs under `public/images/uxr/hero/{black,beige}` + 360 spin videos.
3. **Get the highlights** — Still cards swap via `public/images/uxr/gth/{black,beige}` (film card kept).

---

## v6 / v7 swatches (overwhelming feedback)

Both `/uxr2` and `/uxr3` collapse to **6** chips with See more (`materialSwatchSeeMore: true`):

| Route | Control |
|-------|---------|
| `/uxr2` (v6) | **Inline** “See more” / “View less” after the last swatch (`materialSwatchSeeMoreInline: true`) |
| `/uxr3` (v7) | Classic **“See more colorways” below** the row (`materialSwatchSeeMoreInline: false`) |

---

## Implementation notes

| Area | Files |
|------|--------|
| Routes | `src/app/uxr1/`, `uxr2/`, `uxr3/` — thin aliases; `version="v5\|v6\|v7"` + matching `data-pdp-version` |
| Media | `pdp-uxr-color-media.ts`, `pdp-uxr-study.ts` |
| URL sync | `tabbyBrowserUrl` preserves `/uxrN` prefix on color change |
| Assets | `public/images/uxr/…`, `public/videos/uxr/…` |

---

## Verification

- [x] `/uxr1` `/uxr2` `/uxr3` load Tabby default (prod build on `:3010`)
- [x] Black ↔ chalk swaps hero packs (`/images/uxr/hero/{black,beige}`)
- [x] `/uxr2` shows 6 swatches + inline “See more”; `/uxr3` shows 6 + “See more colorways” below
- [x] Soft-hidden `/v5` still resolves
- [x] `pnpm build` passes · `ALLOW_V1_DATA_EDIT=1 pnpm check:versions` (Skelly touched `pdp-data.ts`)
- [x] No console errors on UXR routes during smoke
