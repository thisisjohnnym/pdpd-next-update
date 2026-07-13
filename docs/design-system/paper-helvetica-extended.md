# Paper + Helvetica Neue LT Pro Extended (agent note)

**Load only when** designing or editing Coach UI text in Paper (MCP), or when Paper text looks like regular-width Helvetica instead of Extended.

Not needed for normal Next.js/code typography work — the app already loads Extended via `next/font/local` (`src/app/layout.tsx` → `--font-coach-extended` / `.font-extended`).

---

## Symptom

- New Paper text looks **narrower** than r5 / approved Coach frames.
- Computed styles show `HelveticaNeueLTPro-Roman`, plain `"Helvetica Neue LT Pro"`, or `system-ui` instead of Extended.
- Headings and product names do not match the wide 53 Extended face used on coach.com / existing Paper artboards.

## Root cause

In Paper, **53 Extended is a style of the family `Helvetica Neue LT Pro`**, not a separate family name agents can always set by PostScript alone.

| What agents try | What Paper often does |
|-----------------|------------------------|
| `fontFamily: "Helvetica Neue LT Pro"` (+ optional `fontStretch: expanded`) | Resolves to **Roman** (`HelveticaNeueLTPro-Roman`) |
| `fontFamily: "HelveticaNeueLTPro-Ex"` via `write_html` or `update_styles` | Often **drops** the Ex face → `system-ui` / generic sans |
| `var(--font-extended)` if the token is only the family name | Same Roman / non-Ex path |
| `duplicate_nodes` from text that already has the Ex stack | **Keeps** `"HelveticaNeueLTPro-Ex", "Helvetica Neue LT Pro", …` |

Locally and in the repo, Ex **is** available (`HelveticaNeueLTPro-Ex.otf` / `src/app/fonts/helvetica-neue-lt-pro-extended.woff2`). The failure mode is Paper MCP write paths, not a missing font install.

Verified Ex stack on known-good r5 text (example: More like this heading):

```text
"HelveticaNeueLTPro-Ex", "Helvetica Neue LT Pro", system-ui, sans-serif
fontWeight: 400
fontStretch: expanded
```

## Fix pattern (Paper MCP)

1. Prefer **`duplicate_nodes`** from an existing Coach text node that already uses the Ex stack (r5 More like this / color sheet labels are safe sources).
2. Change words with **`set_text_content` only** — do not rewrite `fontFamily` afterward.
3. After edits, **`get_computed_styles`** and assert `HelveticaNeueLTPro-Ex` is first in `fontFamily`.
4. Screenshot against an r5 baseline if width still looks wrong.

### Do not

- Author new Coach UI copy with `write_html` font stacks and assume Extended will stick.
- “Fix” width by only setting `fontStretch: expanded` on the family name.
- Point `--font-extended` at PostScript `HelveticaNeueLTPro-Ex` alone and expect `write_html` to honor it (token + write path still remaps).
- Treat `find_nodes` matches on `system-ui` as definitive — Ex stacks often include `system-ui` as a **fallback**; use `get_computed_styles` and look for `HelveticaNeueLTPro-Ex` first.

## Applies when

- Building or revising Paper artboards for this PDP (Coach 2026 Font Set).
- Code-to-design / Paper MCP sessions that create text nodes.
- Stakeholder feedback that Paper “isn’t using Extended.”

## Repo vs Paper

| Surface | Correct Extended usage |
|---------|-------------------------|
| Next app | `.font-extended` / `var(--font-extended)` → `--font-coach-extended` from `layout.tsx` |
| Paper canvas | Duplicate Ex text nodes; verify `HelveticaNeueLTPro-Ex` in computed styles |

See also: [`typography.md`](typography.md) (product type rules), [`.cursor/rules/paper.mdc`](../../.cursor/rules/paper.mdc) (Paper workflow).
