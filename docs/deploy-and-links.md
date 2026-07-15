# Deploy & stakeholder links

How to ship prototype rounds and which URLs to share. Read this before any deploy or stakeholder handoff.

## In short

- **Share production** for feedback: `https://pdp-next-sigma.vercel.app/v8` (active alternate-hero round).
- **Compare all versions** on the same deploy: `/v1` … `/v8` on that host (nothing removed when newer routes merge).
- **UXR study pair** (same deploy): `/fc01` (horizontal) · `/fc01v` (vertical).
- Pushing **`main`** updates production when Vercel tracks `main`; use `vercel --prod --yes` to promote manually.

---

## Live URLs (production)

**Base:** https://pdp-next-sigma.vercel.app

| Purpose | URL |
|---------|-----|
| Compare all versions (Tabby default) | https://pdp-next-sigma.vercel.app/v1 · `/v2` · `/v3` · `/v4` · `/v5` · `/v6` · `/v7` · `/v8` |
| Latest feedback round only | https://pdp-next-sigma.vercel.app/v8 |
| Skelly parity (v7) | https://pdp-next-sigma.vercel.app/v7 |
| Frozen fall-in + vertical gallery (v6) | https://pdp-next-sigma.vercel.app/v6 |
| Frozen Sean polish (v5) | https://pdp-next-sigma.vercel.app/v5 |
| Legacy baseline (same as v1) | https://pdp-next-sigma.vercel.app/ |
| Stripped PDP (Kira) on latest round | https://pdp-next-sigma.vercel.app/v8/products/kira-crossbody-bag-18 |

Update the **Last prod deploy** row in [rounds/README.md](rounds/README.md) after every production ship.

---

## Preview vs production

| | Preview | Production |
|---|---------|------------|
| **When it updates** | Every `git push` to `origin/main` | When you run `vercel --prod` (or push `main` — Vercel production branch) |
| **Typical URL** | `https://pdp-next-git-main-thisisjohnnym-9611s-projects.vercel.app` | `https://pdp-next-sigma.vercel.app` |
| **Use for** | Your own QA before promoting | Stakeholder links, brand-team review |
| **SSO** | May require Vercel team login | Public (200 on `/v4`) |

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
| Git branch **`main`** | Canonical branch — holds all route versions (`/v1`–`/v8`, plus `/fc01`/`/fc01v`) and active prototype work |
| Routes `/v1`–`/v8` | Comparison URLs on one deploy — not separate git branches |
| Git branch `v2` | Legacy development line (merged into `main`); keep in sync or retire |

When someone says “deploy v4,” they mean **ship code to production so `/v4` shows the latest round** — not a separate `v4` git branch.

---

## Stakeholder link cheat sheet

Copy-paste for feedback sessions:

```
PDP prototype — compare versions (same product, same deploy):

v1 (frozen baseline):  https://pdp-next-sigma.vercel.app/v1
v2 (first pivot):      https://pdp-next-sigma.vercel.app/v2
v3 (r4 hero/CTA):      https://pdp-next-sigma.vercel.app/v3
v4 (Johnny r5 baseline): https://pdp-next-sigma.vercel.app/v4
v5 (frozen Sean polish): https://pdp-next-sigma.vercel.app/v5
v6 (fall-in + vertical):  https://pdp-next-sigma.vercel.app/v6
v7 (Skelly parity):       https://pdp-next-sigma.vercel.app/v7
v8 (latest — alt hero):   https://pdp-next-sigma.vercel.app/v8
```

**FC01 UXR study pair (final candidate — brand-approved template):**

```
fc01 (horizontal gallery): https://pdp-next-sigma.vercel.app/fc01
fc01v (vertical gallery):  https://pdp-next-sigma.vercel.app/fc01v
```

For “what changed in the latest round,” point reviewers to [rounds/r9-v8.md](rounds/r9-v8.md), [rounds/r8-v7.md](rounds/r8-v7.md), [rounds/fc01.md](rounds/fc01.md) (UXR pair), or [rounds/r7-v6.md](rounds/r7-v6.md).

---

## Pre-ship checklist

Use before every production deploy:

- [ ] Changes for the new round are behind flags in `pdp-version-config.ts` (or in `src/components/pdp/version/`)
- [ ] `/v1`, `/v2`, `/v3`, `/v4`, `/v5` spot-checked — still match their frozen baselines
- [ ] `/v6` matches the round doc (fall-in + vertical gallery)
- [ ] `/v8` matches [rounds/r9-v8.md](rounds/r9-v8.md) (alternate hero)
- [ ] `/v7` still matches [rounds/r8-v7.md](rounds/r8-v7.md) (Skelly parity)
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
