# Round rN — `/vN` changelog

> Copy this file to `rN-vN.md` when starting a new feedback round. Fill in every section before the first stakeholder share.

## Summary

| Field | Value |
|-------|-------|
| **Route** | `/vN` |
| **Paper page** | [updates rN `…-0`](https://app.paper.design/file/…) |
| **Inherits from** | `/v(N-1)` via `VN_CONFIG` spreading `V(N-1)_CONFIG` |
| **Stakeholder goal** | One sentence — what feedback this round addresses |
| **Status** | Draft · In review · Frozen |
| **Prod URL** | https://pdp-next-sigma.vercel.app/vN |

---

## What changed (stakeholder-facing)

Bullet list of visible differences vs the previous route. Plain language — no flag names.

-

---

## What changed (implementation)

| Area | Flags / files | Notes |
|------|---------------|-------|
| | | |

Add new flags to [pdp-version-config.ts](../../src/components/pdp/version/pdp-version-config.ts) and document them in [pdp-versions.md](../pdp-versions.md).

---

## Module map (Paper → code)

| # | Paper node | Layer name | Component | Parity |
|---|------------|------------|-----------|--------|
| 1 | | | | pending |

For deep node-verify specs, add a dedicated parity doc (see [pdp-r5-parity.md](../pdp-r5-parity.md) as example).

---

## Known deviations

List any intentional differences from Paper and why.

-

---

## Verification

- [ ] Paper nodes captured via MCP (`get_jsx` / `get_computed_styles`) — not screenshot guesses
- [ ] `/vN` matches design intent
- [ ] `/v1` … `/v(N-1)` unchanged
- [ ] `pnpm check:versions` passes
- [ ] Production deploy: [deploy-and-links.md](../deploy-and-links.md)
- [ ] [rounds/README.md](README.md) index updated

---

## Deploy log

| Date | Commit | Notes |
|------|--------|-------|
| | | |
