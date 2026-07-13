# Helvetica + icon optical align (agent note)

**Load only when** placing **one-line** Helvetica (Roman or Extended) next to an icon in a button, chip, or compact CTA — and the label looks optically high or low vs the icon.

Not needed for paragraphs, multi-line copy, or text-only rows without icons.

---

## Symptom

- Flex `align-items: center` is correct in the box model, but the **label still looks higher or lower** than the Material icon.
- Most obvious in pill CTAs (e.g. shopping bag + “Add to bag”).
- Worse with Helvetica Neue LT Pro / Extended: the face’s vertical metrics do not sit on the same optical midline as Material Symbols glyphs.

## Scope

| Use this pattern | Do not use this pattern |
|------------------|-------------------------|
| One-line button / chip label beside an icon | Paragraphs or wrapped body copy |
| Compact CTAs where icon + label share one row | Multi-line titles next to icons |
| Paper **and** code (same optical problem) | “Fixing” by changing the icon size alone |

## Root cause

Geometric vertical centering (`align-items: center`) centers the **text box**, not the **ink**. Helvetica’s ink sits slightly off the Material Symbol optical center. Next to a glyph, that offset reads as misalignment.

## Fix pattern (Paper)

Reference structure (Recs V1 “Add to bag” CTA):

```text
Button row (flex, alignItems: center, gap: 4px)
  ├── Icon text (Material Symbols, fixed size, lineHeight 100%, flexShrink: 0)
  └── Label shell (fixed height ≈ label line box, paddingTop: 2px)
        └── Label text (one line, tight lineHeight e.g. 110%)
```

Verified styles on that CTA:

| Node role | Key styles |
|-----------|------------|
| Button | `display: flex`, `alignItems: center`, `justifyContent: center`, `gap: 4px` |
| Icon | Material Symbols, `fontSize: 15px`, `lineHeight: 100%`, `flexShrink: 0` |
| Label shell | `height: 14px`, `paddingTop: 2px`, column flex |
| Label | Helvetica Ex, label size, `lineHeight: 110%`, single line |

Rules:

1. Wrap **only** the one-line label — not the icon.
2. Shell height should match the label’s line box (here `14px` for the label size in use).
3. Start with **`paddingTop: 2px`**; nudge ±1px only after a screenshot if the face/size differs.
4. Keep the button’s own padding for hit area; do not “fix” alignment by stretching the icon.

## Fix pattern (code / Tailwind)

Same idea: nudge the **label**, not the icon.

Existing PDP example (`pdp-v2-more-like-this.tsx`):

```tsx
<span className="translate-y-0.5">Add to bag</span>
```

Equivalents:

- `translate-y-0.5` (2px at default scale) on the label span
- or a fixed-height wrapper with `pt-0.5` / `padding-top: 2px` matching Paper

Prefer the smallest nudge that passes visual QA next to the icon.

## Anti-patterns

- Applying top padding / translate to **paragraphs** or multi-line blocks.
- Nudging the **icon** instead of the label (icons stay on the flex optical center).
- Relying on larger `line-height` alone to “center” Helvetica vs icons.
- Changing font size or weight just to hide the offset.

## QA

1. Screenshot the button at 1× (and 2× if available).
2. Check icon glyph midline vs capital-letter midline of the label.
3. Confirm older routes / other CTAs still match if you change a shared component.

## Related

- Face / Extended in Paper: [`paper-helvetica-extended.md`](paper-helvetica-extended.md)
- Icon component: [`icons.md`](icons.md)
- Type roles: [`typography.md`](typography.md)
