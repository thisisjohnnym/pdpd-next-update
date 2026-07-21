# Deploy & stakeholder links

How to ship prototype rounds and which URLs to share. Read this before any deploy or stakeholder handoff.

## In short

- **Share production** for feedback: `https://pdp-next-sigma.vercel.app/v6` (latest round).
- **Compare all versions** on the same deploy: `/v1` … `/v6` on that host.
- **Git push alone** updates Preview only — run `vercel --prod` when stakeholders need the main URL updated.

---

## Live URLs (production)

**Base:** https://pdp-next-sigma.vercel.app

| Purpose | URL |
|---------|-----|
| Compare all versions (Tabby default) | https://pdp-next-sigma.vercel.app/v1 · `/v2` · `/v3` · `/v4` · `/v5` · `/v6` |
| Latest feedback round only | https://pdp-next-sigma.vercel.app/v6 |
| Legacy baseline (same as v1) | https://pdp-next-sigma.vercel.app/ |
| Stripped PDP (Kira) on latest round | https://pdp-next-sigma.vercel.app/v6/products/kira-crossbody-bag-18 |

Update the **Last prod deploy** row in [rounds/README.md](rounds/README.md) after every production ship.

---

## Preview vs production

| | Preview | Production |
|---|---------|------------|
| **When it updates** | Every `git push` to `origin/main` | When you run `vercel --prod` (or push `main` — Vercel production branch) |
| **Typical URL** | `https://pdp-next-git-main-thisisjohnnym-9611s-projects.vercel.app` | `https://pdp-next-sigma.vercel.app` |
| **Use for** | Your own QA before promoting | Stakeholder links, brand-team review |
| **SSO** | May require Vercel team login | Public (200 on `/v6`) |

Pushing **`main`** updates `pdp-next-sigma.vercel.app` when Vercel’s production branch is set to `main`. Use `vercel --prod` for a manual promote from your machine.

---

## Deploy commands

From repo root, on branch `main`:

```bash
# 1. Verify (same as CI)
pnpm typecheck
pnpm check:versions
pnpm build

# 2. Commit and push (updates production when Vercel tracks main)
git push origin main

# 3. Optional: manual production promote from local
vercel --prod --yes
```

**Inspector** (after deploy): `vercel ls pdp-next` — confirm latest row shows `Production` · `Ready`.

---

## Git branch vs route versions

| Name | Meaning |
|------|---------|
| Git branch **`main`** | Canonical branch — holds all route versions (`/v1`–`/v6`); active work is **`/v6` only** |
| Routes `/v1`–`/v5` | Frozen comparison URLs on one deploy — not separate git branches |
| Route `/v6` | Active feedback round |
| Git branch `v2` | Legacy development line (merged into `main`); keep in sync or retire |

When someone says “deploy v6,” they mean **ship code to production so `/v6` shows the latest round** — not a separate `v6` git branch.

---

## Stakeholder link cheat sheet

Copy-paste for feedback sessions:

```
PDP prototype — compare versions (same product, same deploy):

v1 (frozen baseline):  https://pdp-next-sigma.vercel.app/v1
v2 (first pivot):      https://pdp-next-sigma.vercel.app/v2
v3 (r4 hero/CTA):      https://pdp-next-sigma.vercel.app/v3
v4 (Johnny r5 baseline): https://pdp-next-sigma.vercel.app/v4
v5 (Sean polish):      https://pdp-next-sigma.vercel.app/v5
v6 (latest — material swatch rail): https://pdp-next-sigma.vercel.app/v6
```

For “what changed in the latest round,” point reviewers to [rounds/README.md](rounds/README.md) (r7 / `/v6`).

---

## Pre-ship checklist

Use before every production deploy:

- [ ] Changes for the new round are behind flags in `pdp-version-config.ts` (or in `src/components/pdp/version/`)
- [ ] `/v1`–`/v5` spot-checked — still match their frozen baselines
- [ ] `/v6` matches the active round intent (material-grouped swatch rail)
- [ ] `pnpm check:versions` passes
- [ ] `pnpm build` passes
- [ ] `git push origin main` (and `vercel --prod --yes` if promoting manually)
- [ ] [rounds/README.md](rounds/README.md) deploy date updated
- [ ] Round changelog updated in `docs/rounds/rN-vN.md`

---

## Vercel project

| Field | Value |
|-------|-------|
| Project | `pdp-next` |
| Team | `thisisjohnnym-9611s-projects` |
| Production alias | `pdp-next-sigma.vercel.app` |
| Linked git branch (production) | `main` |
