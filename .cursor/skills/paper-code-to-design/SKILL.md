---
name: paper-code-to-design
description: >-
  Generate a Paper design from the project's codebase — using its tokens, styles,
  and components as context. Load for "design this in Paper", "code-to-design",
  or building Paper artboards from repo styles.
---

# Code to Design (Paper MCP)

Generate Paper artboards that match the project's real design language — not generic defaults.

Load `.cursor/skills/paper-mcp/SKILL.md` first for shared preflight.

## Read the codebase first

Before creating anything on the canvas:

- Read project stylesheets, design tokens, theme files, and relevant components.
- Note colors, typography, spacing, radii, breakpoints, and layout patterns already in use.
- Prefer mapping to **existing tokens** over inventing new values.

If the project has a design-system doc or Paper parity policy, follow it.

## Default output bar

Unless the user says otherwise, deliver **three responsive breakpoints**:

| Breakpoint | Typical frame |
|------------|---------------|
| Desktop | Project desktop frame (e.g. 1440px) |
| Tablet | Mid-width frame |
| Phone | Mobile frame (e.g. 375px) |

- Maintain **content parity** across breakpoints unless the user wants breakpoint-specific differences.
- Name frames predictably: `{Surface}_{Breakpoint}_v{N}` — e.g. `Hero_Desktop_v2`.
- For mobile artboards, `get_guide({ topic: "mobile-status-bar" })` when status chrome is needed.

## Non-destructive editing

- **Never** overwrite or repurpose an existing artboard as the primary deliverable.
- Always `create_artboard` on the indicated page for new work.
- For revisions, create a **new version frame** instead of replacing the prior one.

## Sync tokens into Paper (when useful)

If the codebase has tokens worth reusing on the canvas:

1. `get_tokens` — see what already exists in the Paper file.
2. `create_tokens` — add missing tokens from the codebase.
   - Reuse before creating duplicates.
   - For colors: neutrals first, then primary, secondary, accent.
   - Use `var(--other-token)` to alias related tokens.
3. Prefer token references in HTML/styles over hard-coded hex values.

Cross-tool token sync from Figma: `get_guide({ topic: "figma-import" })` when both Figma and Paper MCP are available.

## Build on the canvas

Before first `write_html`, write a short brief unless the user already provided a design system:

- Palette and token usage
- Type scale and roles
- Spacing rhythm
- Layout direction (flex, sections, hierarchy)

Then build incrementally:

| Step | Tool | Notes |
|------|------|-------|
| Create frame | `create_artboard` | Set width/height for breakpoint |
| Add structure | `write_html` | ~one visual group per call |
| Tweak layout | `update_styles` | Prefer over rewriting large HTML blocks |
| Copy patterns | `duplicate_nodes` | Faster than rebuilding similar sections |
| Edit copy | `set_text_content` | Batch when possible |
| Find layers | `find_nodes` | When targeting existing nodes |
| Reposition | `move_nodes` | Preserve IDs when rearranging |

### Typography

Before first typographic styling in a session:

- `get_font_family_info` for each family you plan to use.
- Prefer families already listed in `get_basic_info`.
- Use **px** for font size and line-height; **em** for letter-spacing.

### Layout quality

- Use flex layouts and containers so designs translate cleanly to code later.
- For lists, nav, and repeated rows: fixed-width slots for icons and trailing actions (`flexShrink: 0`); do not rely on gap alone to align columns across rows.
- If content clips, set artboard `height: "fit-content"` via `update_styles` — do not guess fixed heights.

## Review and finish

After meaningful changes:

1. `get_screenshot` on each new/changed artboard — visual QA.
2. `finish_working_on_nodes` when done editing.

## Handoff-ready output

Each breakpoint frame should be ready for design-to-code:

- Clear layout constraints and spacing behavior
- Typographic roles tied to real font families
- Token-aligned colors and styles
- Stable DOM hierarchy (wrappers and sibling order matter)
