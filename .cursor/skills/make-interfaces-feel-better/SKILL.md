---
name: make-interfaces-feel-better
description: >-
  Mandatory quality bar for animation, motion, transitions, micro-interactions,
  and tactile UI in pdp-next. Use for any enter/exit animation, hover state,
  scroll-linked motion, icon swap, press feedback, stagger, blur fade, or
  review of interface polish. Work is not complete until this skill is applied
  and validated.
---

# Make interfaces feel better (PDP Next)

**This skill is mandatory for animation work.** Implementing the motion the user asked for is only half the task — the other half is applying the principles below and passing validation before handoff.

## Before you code

1. Read the full skill: [`.agents/skills/make-interfaces-feel-better/SKILL.md`](../../../.agents/skills/make-interfaces-feel-better/SKILL.md)
2. Read the category files that apply to your task:
   - [animations.md](../../../.agents/skills/make-interfaces-feel-better/animations.md) — transitions, enter/exit, icon swaps, press scale
   - [surfaces.md](../../../.agents/skills/make-interfaces-feel-better/surfaces.md) — concentric radius, shadows, hit areas
   - [typography.md](../../../.agents/skills/make-interfaces-feel-better/typography.md) — balance, pretty wrap, tabular nums
   - [performance.md](../../../.agents/skills/make-interfaces-feel-better/performance.md) — no `transition: all`, will-change
3. Read [docs/design-system/animations.md](../../../docs/design-system/animations.md) for PDP-specific utilities and validation steps.

## PDP constraints

| Need | Use | Avoid |
|------|-----|-------|
| Hover, toggle, press | CSS `transition` on specific properties | GSAP for interruptible UI state |
| Icon swap | `PdpIconSwap` (CSS) | `motion` / `framer-motion` |
| Stagger / timelines / scroll | **GSAP** (`useGSAP`, ScrollTrigger) | `motion` / `framer-motion` |
| Scroll chrome numeric chase | `useRafLerp` until migrated | — |
| Reduced motion | `useReducedMotion()` + `gsap.matchMedia` | Ungated decorative motion |

GSAP agent skills: `gsap-react`, `gsap-scrolltrigger`, `gsap-core`. **Never add** `motion` or `framer-motion`.
- **Hero / chrome** — timing and reveal rules live in `docs/pdp-hero-chrome.md`; do not invent parallel intro systems.

## Validation (required before done)

Run the **Review Checklist** from the agents skill. For every principle that applied to your changes, include a **Before | After** table in your handoff (see skill Review Output Format).

Minimum bar:

- [ ] Nested rounded elements use concentric border radius
- [ ] Interactive state uses CSS transitions (not keyframes)
- [ ] Enter animations split and staggered where content has multiple groups
- [ ] Exit animations subtler than enter (shorter, smaller `translateY`)
- [ ] Dynamic numbers use `tabular-nums`
- [ ] New buttons/taps use `active:scale-[0.96]` unless `static`
- [ ] No `transition: all`
- [ ] Reduced motion honored for new JS-driven motion
- [ ] Browser-verified at 375px (Safari) for visual motion work

If any applicable row is unchecked, the task is not complete.

## Quick reference (non-negotiable values)

| Pattern | Values |
|---------|--------|
| Press scale | `0.96` only — never below `0.95` |
| Contextual icon enter | `scale 0.25→1`, `opacity 0→1`, `blur(4px)→blur(0)` |
| Icon timing (if using springs elsewhere) | `bounce: 0` always |
| Stagger delay | ~100ms between semantic groups |
| Exit `translateY` | Small fixed offset (e.g. `-12px`), shorter duration than enter |

Full rationale and examples: `.agents/skills/make-interfaces-feel-better/`.
