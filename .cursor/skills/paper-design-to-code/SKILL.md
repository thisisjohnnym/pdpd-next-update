---
name: paper-design-to-code
description: >-
  Turn a Paper design into production code using the project's existing conventions.
  Load for "implement from Paper", "design-to-code", or building components from
  a selected Paper artboard/frame.
---

# Design to Code (Paper MCP)

Read a Paper design and implement it in the project's framework and coding style.

Load `.cursor/skills/paper-mcp/SKILL.md` first for shared preflight.

## Read the design (use export tools, not screenshots alone)

For the target frame or artboard, gather **exact** values from Paper:

| Need | Tool |
|------|------|
| User focus / scope | `get_selection`, `get_node_info` |
| Hierarchy | `get_tree_summary`, `get_children` |
| Layout + CSS | `get_computed_styles` (batch when possible) |
| Structure as code | `get_jsx` (Tailwind or inline-styles format) |
| Images / fills | `get_fill_image` |
| Visual reference only | `get_screenshot` (supplement, not sole source) |
| Find a layer | `find_nodes` |

**Critical:** Do not infer sizes, colors, or spacing from screenshots alone. Use `get_computed_styles`, `get_jsx`, and `get_fill_image` for implementation values.

## Read the codebase second

Before writing code:

- Identify the project's stack, styling approach, and component patterns.
- Find existing tokens, typography, grid system, and icon components to reuse.
- Match **project conventions** (e.g. Tailwind, CSS modules, design tokens, styled-components) — do not paste Paper JSX verbatim unless the project already works that way.

If the project has a Paper parity policy (e.g. `docs/pdp-paper-source-of-truth.md`), treat the approved Paper node as authoritative for structure, spacing, typography, and interaction behavior.

## Implementation rules

### Structure fidelity

- Preserve **DOM hierarchy** and **sibling order** from Paper unless a framework constraint forces a documented tradeoff.
- Do not flatten wrappers or reorder nodes for convenience if it changes the visual structure.
- Map flex layouts and containers from Paper into equivalent code layout primitives.

### Styling fidelity

- Map Paper computed styles to project tokens/classes where possible.
- Use real text content from Paper (`get_node_info` / `get_jsx`), not placeholder lorem, unless the design still has placeholders.
- Pull image assets via `get_fill_image` when needed.

### Responsive behavior

When multiple Paper artboards represent breakpoints (Desktop / Tablet / Phone):

- Implement responsive rules from those frames.
- Keep content parity across breakpoints unless the design intentionally differs.

### Deviations

If exact parity is blocked by a technical constraint:

1. Name the blocked module and Paper node.
2. State what cannot match and why.
3. Propose the smallest fallback.
4. Get explicit approval before shipping the deviation.

## Suggested workflow

1. Confirm target artboard(s) and scope (single section vs full page).
2. `get_tree_summary` for structure overview.
3. `get_computed_styles` + `get_jsx` on the root and major children.
4. `get_fill_image` for any image fills.
5. `get_screenshot` for visual cross-check while coding.
6. Implement in the project using existing components and tokens.
7. Compare implementation to Paper module-by-module, not just a full-page glance.
8. For UI work, validate in browser with screenshots of changed states.

## Cross-tool context

- **Figma → Paper → code:** Paper may already reflect imported tokens; `get_tokens` can clarify what's on the canvas.
- **Real content:** If content should come from Notion or another MCP source, sync content in Paper first, then read it back for code.

## Finish

Handoff should state which Paper artboard(s) were implemented and any approved deferrals.
