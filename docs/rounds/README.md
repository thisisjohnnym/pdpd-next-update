# Feedback rounds index

Each **Paper / design round** maps to a **route version** on the same production deploy. Use this table for stakeholder tracking and link sharing.

**Production base:** https://pdp-next-sigma.vercel.app

## Active share set (UXR)

| Study | Route | Underlying version | Intent | Changelog |
|-------|-------|--------------------|--------|-----------|
| UXR 1 | `/uxr1` | v5 | Skelly baseline | [uxr.md](uxr.md) |
| UXR 2 | `/uxr2` | v6 | Inline See more (1-row scroll) | [uxr.md](uxr.md) |
| UXR 3 | `/uxr3` | v7 | Inline See more (1-row scroll) | [uxr.md](uxr.md) |

## Soft-hidden compare routes

| Round | Route | Intent | Status | Changelog |
|-------|-------|--------|--------|-----------|
| r2 | `/v1` (+ legacy `/`) | Frozen brand baseline | Soft-hidden | — |
| r3 | `/v2` | First stakeholder pivot | Soft-hidden | [r3-v2.md](r3-v2.md) |
| r4 | `/v3` | Hero scrolls, docked CTA, color drawer | Soft-hidden | [r4-v3.md](r4-v3.md) |
| r5 | `/v4` | r5 feedback refinements | Soft-hidden | [r5-v4.md](r5-v4.md) |
| r6 | `/v5` | Sean / Skelly polish | Soft-hidden (alias `/uxr1`) | — |
| r7 | `/v6` | See more colorways | Soft-hidden (alias `/uxr2`) | [r7-v6.md](r7-v6.md) |
| r8 | `/v7` | Always-open swatches | Soft-hidden (alias `/uxr3`) | [r8-v7.md](r8-v7.md) |
| r9 | `/v8` | Carousel reviews | Soft-hidden | [r9-v8.md](r9-v8.md) |
| FC | `/fc01` · `/fc01v` | Prior UXR pair | Soft-hidden | [fc01.md](fc01.md) |

## Last production deploy

| Field | Value |
|-------|-------|
| Date | 2026-07-23 |
| Commit | `43f88b1` |
| URL | https://pdp-next-sigma.vercel.app/uxr1 |

Update this section after every `vercel --prod`.

## Quick links (Tabby UXR)

```
uxr1  https://pdp-next-sigma.vercel.app/uxr1
uxr2  https://pdp-next-sigma.vercel.app/uxr2
uxr3  https://pdp-next-sigma.vercel.app/uxr3
```

Deploy process: [deploy-and-links.md](../deploy-and-links.md) · Playbook: [prototype-versions.md](../prototype-versions.md)
