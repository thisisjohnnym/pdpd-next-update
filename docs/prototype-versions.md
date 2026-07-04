# Prototype-first version playbook

Reusable workflow for shipping multiple design directions from one codebase — compare at `/v1`, `/v2`, `/v3`, … on a single deploy.

This doc is the **process** layer. PDP-specific architecture and flags live in [pdp-versions.md](pdp-versions.md). Deploy URLs live in [deploy-and-links.md](deploy-and-links.md). Per-round changelogs live in [rounds/](rounds/).

---

## In short

1. **Freeze** older routes — never rewrite their defaults.
2. **Build** the new round behind flags + a new `/vN` route.
3. **Document** what changed in `docs/rounds/rN-vN.md`.
4. **Verify** old routes unchanged, new route matches design.
5. **Ship** push + `vercel --prod`, update link doc.

---

## Why route versions (not git branches per round)

| Approach | Pros | Cons |
|----------|------|------|
| **Route versions** (`/v1`…`/v4` on one deploy) | One link host; easy A/B for stakeholders; shared components | Needs discipline (flags, boundary checks) |
| **Git branch per round** | Clean history per round | Hard to compare live; many preview URLs |

This repo uses **route versions on one production deploy**. Git branch `v2` is the active development line; `/v1`–`/v4` are comparison URLs.

---

## Architecture (this repo)

```
/vN route
  └─> PdpVersionProvider(version="vN")
        └─> getPdpVersionConfig(version)   ← feature flags
              ├─> shared components (read flags)
              └─> version/* components (v2+ only)
```

| Layer | Location | Rule |
|-------|----------|------|
| Routes | `src/app/v1/` … `src/app/v4/` | Each sets `data-pdp-version` + passes `version` |
| Flags | `pdp-version-config.ts` | New round spreads previous config, adds flags |
| Version-only UI | `src/components/pdp/version/` | Never imported from lower route folders |
| Version-only CSS | `src/app/vN/pdp-vN.css` | Scoped under `[data-pdp-version="vN"]` |
| Frozen v1 data | `pdp-data.ts`, `pdp-section-chapters.ts` | Never edit for new rounds |
| Guards | `pnpm check:versions` | Run before every ship |

Full flag tables and module maps: [pdp-versions.md](pdp-versions.md).

---

## Isolation rules (avoid leaking into older routes)

These are the most common ways older versions get touched by accident:

### 1. Feature flags, not version string checks

```ts
// Bad — spreads across codebase
if (version === "v4") { … }

// Good — one flag in config
const { useV4ModuleSpacing } = getPdpVersionConfig(usePdpVersion());
```

### 2. Version-scoped CSS

- **Do not** put round-specific rules in `globals.css`.
- **Do** use `src/app/v4/pdp-v4.css` with `[data-pdp-version="v4"]` selectors.
- Shared CSS changes (e.g. `.pdp-ugc-coverflow`) affect **every** route that uses that class — treat `globals.css` edits as cross-version unless explicitly intended.

### 3. Shared “v2” components serve v2, v3, and v4

Files like `pdp-v2-ugc-community.tsx` render on `/v2`, `/v3`, and `/v4`. Layout changes there affect all three unless gated:

```tsx
useV4ModuleSpacing ? "gap-[28px]" : "gap-2"
```

When a change is **v4-only**, gate it behind a v4 flag — never assume “v2 component” means “only v2.”

### 4. Frozen data

Never mutate `pdp-data.ts` for a new round. Add `pdp-data-v2.ts`, `pdp-v4-specs.ts`, etc.

### 5. Pre-ship spot check

Open production (or local) `/v1`, `/v2`, `/v3` side by side with `/v4`. Older routes should look identical to their last signed-off screenshots.

---

## Start a new round (e.g. `/v5`)

Copy this checklist when stakeholder feedback starts the next round:

### Code

1. Add `src/app/v5/` — `layout.tsx` (`data-pdp-version="v5"`), `page.tsx`, `products/[slug]/page.tsx`
2. Add `src/app/v5/pdp-v5.css` + `pdp-v5-root-marker.tsx` if portaled chrome needs v5 scope
3. Extend `PdpVersion` type in `pdp-version-context.tsx`
4. Add `V5_CONFIG` in `pdp-version-config.ts` — **spread `V4_CONFIG`**, then set new flags
5. Add v5-only components under `src/components/pdp/version/` as needed
6. Extend `scripts/check-pdp-version-boundaries.mjs` import guards for `v5`
7. Add `v5` to CI branch list in `.github/workflows/ci.yml` if needed

### Docs

1. Copy [rounds/_template.md](rounds/_template.md) → `docs/rounds/r6-v5.md`
2. Add row to [rounds/README.md](rounds/README.md)
3. Add section **8.6** (or next) to [pdp-versions.md](pdp-versions.md) for v5 flags
4. Update [deploy-and-links.md](deploy-and-links.md) stakeholder cheat sheet

### Ship

Follow [deploy-and-links.md](deploy-and-links.md) pre-ship checklist.

---

## Feedback tracking (outside the repo)

Keep a lightweight tracker (Notion, Linear, spreadsheet) alongside git:

| Round | Route | Paper page | Deployed | Status | Round doc |
|-------|-------|------------|----------|--------|-----------|
| r3 | `/v2` | updates r3 `4-0` | — | Frozen | [r3-v2.md](rounds/r3-v2.md) |
| r4 | `/v3` | updates r4 `5-0` | — | Frozen | [r4-v3.md](rounds/r4-v3.md) |
| r5 | `/v4` | updates r5 `6-0` | Jul 3, 2026 | In review | [r5-v4.md](rounds/r5-v4.md) |

Tag feedback comments with the route (`/v4`) and module name so fixes map back to flags.

---

## Design source

Paper is authoritative for PDP layout. See [pdp-paper-source-of-truth.md](pdp-paper-source-of-truth.md).

Per-round Paper links live in each `docs/rounds/*.md` file.

---

## Sunset (when a winner is picked)

See [pdp-versions.md §9](pdp-versions.md#9-sunset-plan):

- **Baseline wins** — remove version adapter, delete extra routes/CSS
- **Pivot wins** — promote flags to defaults, collapse routes to `/`

Remove boundary script and version Cursor rule when only one design remains.

---

## Related docs

| Doc | Purpose |
|-----|---------|
| [pdp-versions.md](pdp-versions.md) | PDP architecture, flags, module order |
| [deploy-and-links.md](deploy-and-links.md) | URLs, deploy commands, pre-ship checklist |
| [rounds/](rounds/) | Per-round changelogs |
| [pdp-r5-parity.md](pdp-r5-parity.md) | Deep r5 node-verify spec (v4) |
| [pdp-paper-source-of-truth.md](pdp-paper-source-of-truth.md) | Paper authority rules |
