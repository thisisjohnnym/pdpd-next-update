---
name: paper-mcp
description: >-
  Shared Paper MCP preflight and tool conventions. Load before any Paper task,
  then load paper-code-to-design or paper-design-to-code for the specific
  workflow.
---

# Paper MCP (shared)

Load this skill before any Paper MCP work, then load the workflow-specific skill.

## Preflight

1. **Paper Desktop** must be running with a file open.
2. If MCP connection fails, ask the user to open or restart Paper Desktop, then retry.
3. **Once per session**, load the live workflow guide:
   - `get_guide({ topic: "paper-mcp-instructions" })`
   - Call again if a long thread may have dropped that context.
4. Read MCP tool schemas/descriptors before calling tools.
5. Call `get_basic_info` to confirm file, page, artboards, and font families.
6. Confirm target **page** and **output location** when unclear.

## Conventions

- MCP tool descriptors are the source of truth for parameters.
- Call `finish_working_on_nodes` after creating or editing.
- Do **not** expose raw node IDs in user-facing messages.
- Use `get_screenshot` for visual QA; use `get_computed_styles`, `get_jsx`, and `get_fill_image` for exact implementation values — not screenshots alone.

## Workflow skills

| Task | Skill |
|------|-------|
| Repo → Paper artboards | `.cursor/skills/paper-code-to-design/SKILL.md` |
| Paper artboards → repo code | `.cursor/skills/paper-design-to-code/SKILL.md` |

## Troubleshooting

- Connection errors: restart Paper Desktop and the agent session.
- Tool parameter errors: re-read the tool schema; start a fresh session if tools are hallucinated.
- Long sessions: reload `get_guide` and re-run `get_basic_info`.
