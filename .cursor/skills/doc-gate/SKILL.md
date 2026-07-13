---
name: doc-gate
description: >-
  Soft documentation gate for this PDP repo. Resolves active vs frozen rounds,
  applies Paper authority order, demotes superseded docs, and asks clarifying
  questions on conflicts before coding. Use when starting PDP or design-doc
  work, when docs disagree, when a round target is unclear, or when the user
  cites an old/superseded source of truth.
---

# Doc Gate

Soft gate — not a blocker for clear, aligned work. Stops silent mixups.

Companion always-on rule: `.cursor/rules/doc-gate.mdc`.

## When to load

- Starting PDP UI, version, or Paper-parity work
- Editing or writing under `docs/`
- User points at a “source of truth” that may be stale
- Two instructions conflict (chat vs doc vs Paper vs frozen route)

Skip for unrelated non-PDP chores (e.g. pure tooling with no design/doc claim).

## Checklist (run in order)

### 1. Active target

1. Open `docs/rounds/README.md`.
2. Note which round/route is **Active** and which are **Frozen**.
3. Map the user request to a route (`/v1`…`/v6`, experiments like `/fc01` only if docs/index cover them).
4. If the request would change a Frozen baseline and the user did not name that route → **ask**.

### 2. Authority

Use this ladder (from `docs/pdp-paper-source-of-truth.md`):

1. Approved Paper (page + frame + node)
2. Explicit designer direction in this thread
3. Existing production code
4. Internal docs / workshop notes

Conflict rule: highest wins. Never silently prefer a lower source.

### 3. Doc freshness

Before treating a doc as binding:

- Prefer the **Active** round changelog under `docs/rounds/`.
- Demote pages marked **Superseded**, **one-time audit**, or clearly older than the Active round (e.g. r3 module maps when work is on v6).
- Workshop notes and sticky-note dumps are lowest authority unless the user elevates them.

Known high-risk stale traps:

| Doc | Risk |
|-----|------|
| `docs/pdp-v2-components.md` | r3 map; superseded for later rounds |
| `docs/pdp-r5-parity.md` | v4/r5 parity — not the Active target unless asked |
| `docs/pdp-paper-parity-audit-findings.md` | One-time audit record, not live policy |
| `docs/design-workshop/*` | Ideas / notes, not shipping truth |

### 4. Canonical first opens

| Task | Open first |
|------|------------|
| Any PDP edit | `docs/pdp-versions.md` + Active round doc |
| Round / stakeholder links | `docs/rounds/README.md` |
| Paper vs code | `docs/pdp-paper-source-of-truth.md` |
| Ship / URLs | `docs/deploy-and-links.md` |
| Hero chrome | `docs/pdp-hero-chrome.md` (Paper still wins on conflict) |
| Grid / type / icons / motion | matching file under `docs/design-system/` |

### 5. Ask or proceed

**Ask (≤ 2 questions)** when:

- Frozen route would change without an explicit ask
- Doc A and Doc B disagree on the same module
- User treats a superseded doc as current
- Work would violate version boundaries (rewrite `pdp-data.ts`, version-only `globals.css`, hardcode `version === "vN"`)

Question format:

```
Conflict: <one line>

1. <option> — <tradeoff>
2. <option> — <tradeoff>
3. <option> — <tradeoff>   # optional

Which should we follow?
```

**Proceed** when Active target is clear, cited docs match that round, and nothing fights Paper or version rules. State the chosen source in one line if useful (“Following Active r7/`/v6` + Paper …”).

## After the gate

Continue with normal PDP rules:

- Flags in `pdp-version-config.ts`; no frozen-default rewrites
- Scoped `pdp-vN.css` under `[data-pdp-version="vN"]`
- `pnpm check:versions` after version-sensitive edits

## Examples

### Conflict — superseded doc

User: “Use `pdp-v2-components.md` as the source of truth for the leather module on the latest PDP.”

Gate: Active is `/v6`; that doc is superseded for post-r3 work.

Ask whether to (1) implement against Active round + Paper, (2) intentionally match the frozen `/v2` map, or (3) update the doc first.

### Clear — no ask

User: “On `/v6`, tighten UGC spacing per `docs/rounds/r7-v6.md`.”

Gate: Active matches; round doc is current; proceed.
