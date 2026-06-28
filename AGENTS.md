<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Layout grid (always use)

**Mobile `12/12/4`** · **Desktop `24/20/8`**

| | Mobile | Desktop |
|---|--------|---------|
| Columns | 12 | 24 |
| Margin | 12px | 20px |
| Gutter | 4px | 8px |
| Frame | 375px | 1440px |

Use `PageShell`, `PageGrid`, `GridItem` from `@/components/grid/page-grid`. See `docs/design-system/grid.md`.

## Hero chrome

Tabby video hero land (inset shell, floating CTA): `docs/pdp-hero-chrome.md`.

## Typography

All UI text uses **Helvetica Neue LT Pro** (Coach 2026 Font Set). See `docs/design-system/typography.md`.

## Icons

All icons use **Google Material Symbols** via `MaterialIcon`. See `docs/design-system/icons.md`.

## Animation & motion

Any animation, transition, enter/exit, stagger, scroll fade, or micro-interaction work **must** implement and validate the **make-interfaces-feel-better** skill before handoff.

- JS-orchestrated motion uses **GSAP**; see `docs/design-system/animations.md`
- Full reference: `docs/design-system/animations.md`
- Skill: `.agents/skills/make-interfaces-feel-better/SKILL.md` · Cursor: `.cursor/skills/make-interfaces-feel-better/SKILL.md`
- Hero timing/reveal: `docs/pdp-hero-chrome.md`
- Progressive blur: load `progressive-blur.mdc` when building fade-to-blur chrome

Work is not complete until the skill Review Checklist passes and handoff includes Before | After tables for every applied principle.
