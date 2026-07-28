# Deploy & stakeholder links

How to ship prototype rounds and which URLs to share. Read this before any deploy or stakeholder handoff.

## In short

- **Share UXR study** for research: `/uxr1` · `/uxr2` · `/uxr3` on `https://pdp-next-sigma.vercel.app`.
- **Soft-hidden compare** routes (`/v1`…`/v8`, `/fc01`, `/fc01v`) stay on the same deploy for internal use — do not lead with them.
- Design SoT for this UXR ship: `skelly363/pdp-next` (see [rounds/uxr.md](rounds/uxr.md)).
- **Git push alone** updates Preview / Production when Vercel tracks `main`; run `vercel --prod` to promote manually.

---

## Live URLs (production)

**Base:** https://pdp-next-sigma.vercel.app

| Purpose | URL |
|---------|-----|
| **UXR share set** | https://pdp-next-sigma.vercel.app/uxr1 · `/uxr2` · `/uxr3` |
| Internal compare (soft-hidden) | `/v1` … `/v8` · `/fc01` · `/fc01v` |
| Legacy baseline (same as v1) | https://pdp-next-sigma.vercel.app/ |

Update the **Last prod deploy** row in [rounds/README.md](rounds/README.md) after every production ship.

---

## Preview vs production

| | Preview | Production |
|---|---------|------------|
| **When it updates** | Every `git push` to a tracked branch | When you run `vercel --prod` (or push `main` — Vercel production branch) |
| **Use for** | Your own QA before promoting | Stakeholder / UXR links |
| **SSO** | May require Vercel team login | Public |

---

## Deploy commands

From repo root, on the ship branch:

```bash
# 1. Verify (same as CI)
pnpm typecheck
pnpm check:versions
pnpm build

# 2. Commit and push
git push -u origin HEAD

# 3. Optional: manual production promote from local
vercel --prod --yes
```

---

## Git branch vs route versions

| Name | Meaning |
|------|---------|
| Git branch **`main`** (or feature branch) | Holds all route versions |
| Routes `/uxr1`–`/uxr3` | **Active UXR share set** (aliases of v5 / v6 / v7) |
| Routes `/v1`–`/v8` | Soft-hidden compare URLs — still live |
| Remote **`origin`** | `thisisjohnnym/pdpd-next-update` → sigma host |
| Remote **`skelly`** | Design SoT fetch (`skelly363/pdp-next`) |

---

## Stakeholder link cheat sheet

Copy-paste for UXR sessions:

```
Tabby 26 UXR protos (same deploy):

uxr1 (v5): https://pdp-next-sigma.vercel.app/uxr1
uxr2 (v6 — inline See more): https://pdp-next-sigma.vercel.app/uxr2
uxr3 (v7 — See more colorways below): https://pdp-next-sigma.vercel.app/uxr3

Switch Brass/Black ↔ Brass/Chalk on each to swap hero + Get the highlights stills.
```

Details: [rounds/uxr.md](rounds/uxr.md).

---

## Pre-ship checklist

Use before every production deploy:

1. `pnpm typecheck`
2. `pnpm check:versions`
3. `pnpm build`
4. Smoke `/uxr1` `/uxr2` `/uxr3` — color swap + Get the highlights
5. Confirm soft-hidden `/v5` still loads (no accidental hard delete)
6. Update [rounds/uxr.md](rounds/uxr.md) verification boxes after QA
