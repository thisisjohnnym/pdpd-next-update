# Tabby family compare A/B experiment

**Flag:** `tabbyFamilyCompareExperiment`  
**Branch:** `experiment/tabby-family-compare-ab-test`

## Enable the variant

**Environment (persistent):**

```bash
NEXT_PUBLIC_TABBY_FAMILY_COMPARE_EXPERIMENT=true
```

**URL query (QA / local):**

```
?tabbyFamilyCompareExperiment=1
```

When the flag is off (default), the PDP renders the existing **Compare the family** control module unchanged.

When the flag is on, the PDP renders **Explore the Tabby family** — the family discovery compare experience.

## Architecture

| Path | Role |
|------|------|
| `pdp-compare-module.tsx` | **Control** — existing module (do not modify for experiment logic) |
| `pdp-compare-picker-sheet.tsx` | **Control** picker |
| `pdp-compare-module-gate.tsx` | A/B wrapper used by the gallery |
| `experiments/tabby-family-compare-experiment.tsx` | **Variant** UI |
| `experiments/tabby-family-compare-picker-sheet.tsx` | **Variant** style + size picker |
| `experiments/tabby-family-compare-data.ts` | Catalog helpers isolated for easy removal |
| `experiments/tabby-family-compare-flag.ts` | Flag resolution |

## Success metrics (suggested)

- PDP add-to-bag rate
- Color selection engagement
- Compare module engagement (`data-experiment="tabby-family-compare"`)
- Click-through to other Tabby PDPs (View product)
- Add-to-bag after comparison
- Bounce / exit rate
- Time to add-to-bag

## Removal

If the test does not ship, delete the `experiments/` folder, `pdp-compare-module-gate.tsx`, and revert the gallery import to `PdpCompareModule`.
