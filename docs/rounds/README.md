# Feedback rounds index

Each **Paper round** maps to a **route version** on the same production deploy. Use this table for stakeholder tracking and link sharing.

**Production base:** https://pdp-next-sigma.vercel.app

| Round | Route | Paper page | Intent | Status | Changelog |
|-------|-------|------------|--------|--------|-----------|
| r2 | `/v1` (+ legacy `/`) | [updates r2 `3-0`](https://app.paper.design/file/01KVTV0K48C5PNSC96MPDBVQBM/3-0) | Frozen brand baseline | Frozen | — (baseline) |
| r3 | `/v2` | [updates r3 `4-0`](https://app.paper.design/file/01KVTV0K48C5PNSC96MPDBVQBM/4-0) | First stakeholder pivot (shorter page, UGC up) | Frozen | [r3-v2.md](r3-v2.md) |
| r4 | `/v3` | [updates r4 `5-0`](https://app.paper.design/file/01KVTV0K48C5PNSC96MPDBVQBM/5-0) | Hero scrolls with page, docked CTA, color drawer | Frozen | [r4-v3.md](r4-v3.md) |
| r5 | `/v4` | [updates r5 `6-0`](https://app.paper.design/file/01KVTV0K48C5PNSC96MPDBVQBM/6-0) | r5 feedback refinements | Frozen | [r5-v4.md](r5-v4.md) |
| r6 | `/v5` | Sean r5 polish | Buy box merchandising, Tabby family nav, module polish | Frozen | — |
| r7 | `/v6` | Post-v5 feedback | Fall-in intro + vertical mobile gallery UXR variant | Frozen | [r7-v6.md](r7-v6.md) |
| r8 | `/v7` | Skelly parity | Skelly visual SoT on our motion stack | **Active** | [r8-v7.md](r8-v7.md) |

## Current state (Jul 13, 2026)

- **Active round:** r8 → `/v7` (Skelly parity on our motion stack).
- **Merged to `main`:** PR [#1](https://github.com/thisisjohnnym/pdpd-next-update/pull/1) · `272ce8b` — `feat(v7): Skelly parity route on our motion stack`.
- **Comparison routes:** `/v1`–`/v7` all live on one deploy — nothing removed.
- **Also on `main`:** `/fc01` + `/fc01v` UXR study pair (see [fc01.md](fc01.md)).
- **Frozen note:** `/v1`–`/v4` should match their baselines. `/v5` and `/v6` inherited shared Skelly component updates from the same merge train (docked color rail, closer-look stage, etc.) — no longer pixel-frozen to their Jul 7 ship.
- **Next:** stakeholder feedback lands on `/v7` behind new flags in `V7_CONFIG` — do not rewrite frozen route defaults.

## Last production deploy

| Field | Value |
|-------|-------|
| Date | Jul 13, 2026 |
| Commit | `6d6c04d` — fix(v7): land chrome spacing, intro meta sync, padded ATB |
| URL | https://pdp-next-sigma.vercel.app/v7 |
| Prior ship | Jul 13, 2026 · `9548c7f` · ATB flush + WebKit intro |

## Quick links (Tabby)

```
v1  https://pdp-next-sigma.vercel.app/v1
v2  https://pdp-next-sigma.vercel.app/v2
v3  https://pdp-next-sigma.vercel.app/v3
v4  https://pdp-next-sigma.vercel.app/v4
v5  https://pdp-next-sigma.vercel.app/v5   ← frozen Sean polish
v6  https://pdp-next-sigma.vercel.app/v6   ← fall-in + vertical gallery
v7  https://pdp-next-sigma.vercel.app/v7   ← latest (Skelly parity)
```

Deploy process: [deploy-and-links.md](../deploy-and-links.md) · Playbook: [prototype-versions.md](../prototype-versions.md)
