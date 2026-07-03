# PDP r5 (v4) Parity — Source of Truth

Paper page: **updates - r5** (`6-0`) — https://app.paper.design/file/01KVTV0K48C5PNSC96MPDBVQBM/6-0

If code and Paper r5 disagree, **Paper r5 wins**. A module is only marked `match`
once its live `/v4` render has been diffed against its r5 node via the Paper MCP —
not by eye.

This doc supersedes the r3 mapping in [pdp-v2-components.md](pdp-v2-components.md)
for anything v4/r5.

---

## Rule 0 — Use the r5 nodes, do not re-derive them

The r5 refinements ("new padding", "new spacing", "updated type", "no rounded
corners") live in the artboard **layer names**, not in any feedback list. The
shared `PdpV2*` components default to their r3 styling, so any untracked
refinement silently stays r3. To avoid drift, for every module:

1. `get_tree_summary` on the artboard node to orient.
2. `get_node_info` on the target node for position/size.
3. `get_jsx` and/or `get_computed_styles` for exact padding, gap, margin, type.
4. Port those exact values into the component behind a v4 flag. No eyeballing,
   no "close enough".

---

## Module map (r5 full scroll `KFO-0`, top to bottom)

The layer name IS the spec — read it literally.

| # | r5 node | r5 layer name | Code component | Parity |
|---|---------|---------------|----------------|--------|
| 1 | `IMP-0` / `J86-0` | Hero full bleed — padding updated | `PdpV3HeroLayout` + hero shell | match (`useV4ModuleSpacing`) |
| 2 | `L5X-0` | UGC after hero — updated type | `PdpV2UgcCommunity` | match (heading + caption/handle type, square cards) |
| 3 | `LD6-0` | The Details module — new padding and info layout | `PdpProductDetailsModule` (`useV4Specs` + `useV4Spacing`) | match |
| 4 | `KJY-0` | Slide studio product — unchanged | gallery slide | match |
| 5 | `L2X-0` | Grouped editorial carousel — new padding | `PdpV2EditorialCarousel` | match (`useV4ModuleSpacing`) |
| 6 | `JFT-0` / `LFF-0` / `JGM-0` / `JF0-0` / `JHF-0` | Leather aging (restructured) | `PdpV2LeatherAging` | match (`useV4LeatherAgingLayout`) |
| 7 | `MAE-0` | Reviews — updated cta and alignment | `PdpV2Reviews` | match (alignment, arrow, CTA + spacing) |
| 8 | `MD6-0` | More like this — no rounded corners, new spacing | `PdpV2MoreLikeThis` | match (corners + spacing) |
| 9 | `ME6-0` | Recently viewed — spacing updated, links, rounded | `PdpV2RecentlyViewed` | match (corners, arrow, spacing) |
| 10 | `KQS-0` | Footer — unchanged | `PdpSiteFooter` | match |

Note: the Reviews AI-summary card keeps its rounded corner (the `MAE-0` node
renders it square). Left as a deliberate, low-risk deviation since it falls
outside the "CTA + padding/spacing" scope of this pass — revisit if design flags it.

Naming note: the components are called `PdpV2*` but render v2, v3, and v4. r5
changes are gated behind v4-only flags in
[../src/components/pdp/version/pdp-version-config.ts](../src/components/pdp/version/pdp-version-config.ts);
v2/v3 keep their existing layout.

---

## Verified r5 specs (captured via Paper MCP)

- **More like this `MD6-0`**: `padding-top:56 / padding-inline:16 / gap:8`; card
  row `MD8-0` `gap:16`; card `MD9-0` `gap:8`; card image `MDA-0` no border-radius.
- **Recently viewed `ME6-0`**: `padding-top:56 / padding-inline:16 /
  padding-bottom:16`; list `ME8-0` `gap:14`; row `ME9-0` `gap:8`; thumbnail
  `MEA-0` no border-radius. Heading `ME7-0` is **left-aligned** (updated r5
  feedback — previously centered).
- **Editorial carousel `L2X-0`**: `padding-top:16 / gap:8`.
- **Details `LD6-0`**: `padding-top:56`, white bg (per-child padding captured at task time).
- **Hero `IMP-0` / `J86-0`**: `812` tall, `justify-between`. Nav Header `M15-0`
  `padding-inline:16 / padding-top:18`; bag icon frame `M1F-0` `28×28`. Gallery
  overlay row `LYZ-0` `padding-inline:16 / padding-bottom:16 / padding-top:40`.
  Slide indicator `LZ0-0` `gap:4`, tick height `3`, inactive dot `4`, active bar
  `24` — all 7 ticks shown uncapped (code shows every slide). Gated behind
  `useV4ModuleSpacing` in `pdp-overlay-header.tsx`, `pdp-v3-gallery-overlay.tsx`,
  and `pdp-hero-gallery-indicator.tsx`.
- **Leather aging `JFT-0` → `LM2-0`**: image on top (`343×430`), then a **single
  warm `#EFEAE7` block** (`padding:24 8`, `gap:32`) holding a centered title +
  per-stage description (`gap:8`) and the slider (`gap:18`, `w:294`), dot-selected
  pill `#C3897F`. It is NOT plain white — the header band above the image is gone
  and the title moves below the image.

---

## Definition of done (per module)

1. The r5 node's `get_jsx` / computed styles were captured (not a screenshot guess).
2. Padding, gap, margin, font-size, line-height, tracking all match the node.
3. Live `/v4` screenshot placed next to the r5 artboard screenshot — no drift.
4. `/v1`, `/v2`, `/v3` render unchanged (v4 flags default false).
5. `pnpm check:versions` passes.

Update the Parity column above to `match` only when all five hold.
