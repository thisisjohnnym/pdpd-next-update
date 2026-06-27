# PDP Paper Source Of Truth

This document is the non-negotiable implementation policy for PDP.

If code and Paper disagree, Paper wins.

---

## Intent

Build and maintain PDP so implementation always matches the approved Paper design.
This policy exists to prevent drift, partial interpretation, and "close enough" delivery.

---

## Authority Order (Highest To Lowest)

1. Approved Paper design (specific page, frame, and node)
2. Explicit direction from the designer in this project thread
3. Existing production code
4. Internal docs and workshop notes

If two sources conflict, use the highest source in this list.

---

## Non-Negotiable Rules

- No module is considered done unless it matches Paper structure, spacing, typography, and interaction behavior.
- Do not simplify or reorganize a module's DOM hierarchy if it changes the visual structure from Paper.
- Do not introduce "creative interpretation" unless the designer explicitly requests it.
- If a technical constraint blocks exact parity, pause and get design approval before shipping a deviation.
- Every changed PDP module must reference the exact Paper node(s) it implements.

---

## Required Workflow For Any PDP UI Change

## 1) Pre-Implementation

- Identify exact Paper page/frame/node IDs for each module being touched.
- Record target module list before coding.
- Confirm whether change applies to full layout, stripped layout, or both.

## 2) Implementation

- Implement module in runtime order to avoid downstream spacing drift.
- Keep layout grid, typography, and icon standards intact.
- Preserve wrapper structure and sibling order implied by Paper.

## 3) Verification

- Compare implementation against Paper module-by-module (not just full-page glance).
- Capture browser screenshots for each changed module state.
- Validate sticky/fixed/sheet behavior and safe-area behavior on mobile.

## 4) Sign-Off

- Mark each module as `match`, `fixed`, or `deferred`.
- Any `deferred` item must include reason, owner, and next action.
- Work is not complete until all high-priority modules are `match` or explicitly approved as deferred.

---

## Deviation Protocol (When Exact Match Is Blocked)

If exact parity cannot be achieved:

1. Document the blocked module and Paper node ID.
2. State exactly what cannot match and why.
3. Propose the smallest possible fallback.
4. Wait for explicit design approval.

No silent deviations.

---

## Definition Of Done For PDP Design Fidelity

A PDP module is done only when all are true:

- Paper node mapping exists.
- Structure and layout match Paper.
- Typography and iconography match standards.
- Interactions and transitions match intended behavior.
- Verified in browser with screenshots.
- No unapproved deviation remains.

---

## Hero chrome (Tabby video land)

- Paper nodes: **shrunk** `6AJ-0` · **full bleed** `64P-0` on page `updates - r2`
- Implementation companion: [`docs/pdp-hero-chrome.md`](pdp-hero-chrome.md)

---

## Required Companion Checklist

Use `docs/pdp-paper-parity-audit-checklist.md` on every PDP module pass.
