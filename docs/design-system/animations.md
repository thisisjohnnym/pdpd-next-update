# PDP Next — Animation & Motion

All animation and motion work in this project must follow the **make-interfaces-feel-better** skill. That skill is not optional — it is part of the definition of done for any UI motion task.

## Mandatory skill

Before writing or changing animation code, read and apply:

| Resource | Path |
|----------|------|
| Skill (start here) | `.agents/skills/make-interfaces-feel-better/SKILL.md` |
| Animations detail | `.agents/skills/make-interfaces-feel-better/animations.md` |
| Surfaces (radius, press, shadows) | `.agents/skills/make-interfaces-feel-better/surfaces.md` |
| Typography (balance, tabular nums) | `.agents/skills/make-interfaces-feel-better/typography.md` |
| Performance (transitions, will-change) | `.agents/skills/make-interfaces-feel-better/performance.md` |
| Cursor skill wrapper | `.cursor/skills/make-interfaces-feel-better/SKILL.md` |

Agents must run the skill's **Review Checklist** before marking animation work complete. If a principle applies to the changed UI and was skipped, the work is not done.

## Work validation (definition of done)

Complete every step before handing off animation work.

### 1. Implement the skill

Apply all relevant principles from make-interfaces-feel-better to the changed surfaces — not only the obvious motion (e.g. also concentric radius on nested cards, `tabular-nums` on animated counts, `active:scale-[0.96]` on new buttons).

### 2. Self-review with the skill output format

Produce a markdown table grouped by principle (Concentric border radius, Interruptible animations, Scale on press, etc.) with **Before** and **After** columns for every change you made. Omit tables for principles that were reviewed but did not apply.

### 3. Respect reduced motion

- Use `useReducedMotion()` from `@/components/pdp/use-reduced-motion` in client hooks that drive motion.
- Honor `prefers-reduced-motion: reduce` in CSS (`animation: none`, snap to end state).
- New `@keyframes` classes must be listed in the reduced-motion block in `src/app/globals.css` when they are decorative.

### 4. Use the right motion primitive

| Need | Use | Avoid |
|------|-----|-------|
| Hover, toggle, open/close | CSS `transition` on specific properties | `@keyframes` on interactive state |
| One-shot page/module enter | `@keyframes` or staggered CSS classes | `transition: all` |
| Scroll-linked numeric chase | `useRafLerp` | Raw `setState` on every scroll event |
| Progressive blur (status bar, sticky chrome) | Stacked `backdrop-filter` layers — see progressive blur rule | Single blur + opacity mask |

### 5. Verify in browser

For visual motion work, confirm in Safari at mobile width (375px):

- Enter/exit feels intentional, not jarring
- No animation on unintended first paint (unless the design calls for a land sequence — see hero chrome)
- Reduced motion: OS setting on → motion snaps or disables
- Sticky/fixed chrome: scroll behavior matches spec

Screenshot or describe what you verified. Do not claim done without checking.

## Project stack

Layered motion — skill principles are normative; pick the right primitive:

| Need | Use | Avoid |
|------|-----|-------|
| Hover, toggle, open/close, press | **CSS `transition`** on specific properties (interruptible) | GSAP tweens users can reverse mid-gesture |
| Contextual icon swap | **`PdpIconSwap`** (CSS cross-fade) | `motion` / `framer-motion` |
| One-shot enter / stagger / timelines | **GSAP** (`gsap.timeline()`, `stagger: 0.1`) via `useGSAP` + `gsap.context()` | `motion` / `framer-motion` |
| Scroll-linked / pinned / scrub | **GSAP ScrollTrigger** | Raw `setState` on scroll |
| Scroll-linked numeric chase (chrome) | **`useRafLerp`** (existing) — migrate to GSAP only when touching that surface | — |
| Simple presence enter/exit | **CSS** + `useMountTransition` | — |
| Decorative one-shot enters | **CSS `@keyframes`** (hero land, ambient loops) | `transition: all` |

Install `gsap` + `@gsap/react` when a task first needs GSAP APIs. Much motion today is still CSS/`useRafLerp` — that is valid until a surface benefits from GSAP orchestration.

**Never add** `motion` or `framer-motion`. **Do not** use GSAP for simple `:active` press feedback or drawer toggles — CSS transitions stay interruptible.

## Shared utilities

| Utility | Path | Use for |
|---------|------|---------|
| `useReducedMotion` | `src/components/pdp/use-reduced-motion.ts` | Snap/disable motion when OS requests reduced motion |
| `useRafLerp` | `src/components/pdp/use-raf-lerp.ts` | Frame-smoothed chase toward a numeric target |
| `useScrollSnapshot` | `src/components/pdp/use-coalesced-scroll.ts` | Coalesced scroll reads for chrome/indicator logic |

## Domain specs (read when touching these areas)

| Area | Doc |
|------|-----|
| Hero land, reveal, intro timing | `docs/pdp-hero-chrome.md` |
| Progressive blur (fade-to-blur chrome) | User rule `progressive-blur.mdc` |
| Component inventory (what already animates) | `docs/pdp-components.md` |

## Common PDP patterns

### Hero land sequence

Staggered `@keyframes` in `globals.css` (`pdp-hero-*-enter`) with intentional delays. This is a designed first paint — do not add `initial={false}`-style suppression here. New hero chrome should follow the same stagger + `cubic-bezier(0.16, 1, 0.3, 1)` family unless Paper says otherwise.

### Scroll-driven chrome

`--hero-ui-opacity` and `--hero-ui-blur` fade fixed hero overlays on scroll. Prefer lerped values via `useRafLerp` when binding in React. Progressive blur stacks belong on scrim/backdrop layers, not on text.

### Press feedback

Buttons and tappable chips: `transition-transform duration-150 ease-out active:scale-[0.96]` unless a `static` prop or reduced motion applies.

### Tabular numbers

Any count that updates during animation (likes, bag badge, section indicator): `tabular-nums` / `font-variant-numeric: tabular-nums`.

## Anti-patterns (reject in review)

- `transition: all` or bare Tailwind `transition` without property list
- `scale(0.9)` or smaller on press — use `0.96` only
- Keyframes on properties users can reverse mid-gesture (drawers, toggles)
- Icon swap with no enter/exit (hard `display: none` or unmount without cross-fade)
- Ignoring reduced motion for new JS-driven motion
- Adding `framer-motion` / `motion` for one component
- Using GSAP for simple `:active` press or interruptible drawer toggle (use CSS)

## Agent routing

| Trigger | Load |
|---------|------|
| Any animation, motion, transition, enter/exit, stagger, scroll fade | This doc + make-interfaces-feel-better skill |
| Layout only (no motion) | `docs/design-system/grid.md` |
| Progressive blur request | `progressive-blur.mdc` + this doc |
