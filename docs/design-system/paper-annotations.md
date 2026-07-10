# Paper annotations (agent note)

**Load when** labeling Paper artboards, explaining variants, or adding stakeholder captions in a Paper file.

**Do not** put captions, eyebrows, or agent commentary inside the design artboard.

---

## Canonical pattern

Reference: layer name **`note`** — a **sibling frame on the page**, aligned above the artboard it describes (not a child of the artboard).

Example structure (Jul 9 feedback page):

```text
Frame "note"          ← page-level sibling, same width as artboard
  Text eyebrow        ← source / version (muted)
  Text instruction   ← one-line ask (ink)
Artboard "B — …"      ← clean design only
```

### Layout

| Property | Value |
|----------|--------|
| Layer name | `note` |
| Parent | Page root (same level as the artboard) |
| Width | Match the artboard (e.g. `375px` mobile) |
| Height | `fit-content` |
| Placement | Directly **above** the artboard; same `left` / `worldX` |
| Gap to artboard | ~40–80px clear space (do not overlap) |
| Display | `flex` · `flexDirection: column` |
| Gap | `var(--space-card-gap)` (`8px`) |
| Padding | `var(--space-module-x)` (`16px`) |
| Background | `var(--color-bg)` |

### Typography (two lines)

| Line | Role | Style |
|------|------|--------|
| 1 | Eyebrow / source | `var(--text-label)` · `var(--color-muted)` · Extended · optional capitalize |
| 2 | Instruction | `var(--text-lead)` · `var(--color-black)` · Extended · one short sentence |

Copy shape:

1. **Eyebrow** — who / which ask · e.g. `Solange · Version #1`
2. **Instruction** — what to look for · e.g. `Compare icon left + Add to bag`

Keep both lines scannable. No paragraphs inside the note.

### Coach Extended

Prefer `duplicate_nodes` from an existing `note` (or known-good Ex text), then `set_text_content`. See [`paper-helvetica-extended.md`](paper-helvetica-extended.md) if new text falls back to Roman.

---

## Rules

1. **Outside the artboard** — notes are page siblings, never children of the design frame.
2. **One note per artboard** (or per clear variant group) — do not stack captions inside the UI.
3. **Name the layer `note`** so humans and agents can find annotations quickly.
4. **Design artboards stay clean** — product UI only; no “Phase 0”, “must match r5”, or feedback paraphrases inside the frame.
5. When cloning an artboard, **clone or recreate its `note` above the new frame** with updated copy.

## Do not

- Insert label strips as the first child of the artboard.
- Use sticky notes, callout cards, or multi-paragraph commentary on the canvas.
- Put raw node IDs or agent process text in the note.
- Overlap the note with the artboard or neighboring frames.

## Quick build (MCP)

1. `create_artboard` for the design (or duplicate an existing one).
2. Create a page-level Frame named `note` with the layout above — or `duplicate_nodes` from an existing `note`.
3. Place it at the same `left` as the artboard, `top` above the artboard with clear gap.
4. Two text children: eyebrow + instruction (`set_text_content` if duplicated).
5. `get_screenshot` of note + artboard together to confirm alignment.
6. `finish_working_on_nodes`.
