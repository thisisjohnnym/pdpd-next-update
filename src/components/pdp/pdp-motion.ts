/**
 * PDP motion tokens — JS mirror of CSS vars in `globals.css`.
 *
 * Use these for `useMountTransition` durations and any timed JS that must
 * match sheet / overlay CSS. Prefer the CSS utility classes
 * (`.pdp-sheet-*`, `.pdp-fade`, `.pdp-pop`) for visual transitions.
 *
 * Skill: make-interfaces-feel-better — interruptible CSS for drawers;
 * sheet panel = transform only; backdrop = opacity only.
 */

/** Emphasized decelerate — small UI (fade, pop, icons). Skill default. */
const PDP_EASE_EMPHASIZED = "cubic-bezier(0.2, 0, 0, 1)" as const;

/** Settle curve — sheets + hero family. Soft land, not snappy. */
const PDP_EASE_SETTLE = "cubic-bezier(0.16, 1, 0.3, 1)" as const;

const PDP_MOTION_MS = {
  /** Press / tap scale return */
  press: 140,
  /** Scrim / simple opacity fades */
  fade: 220,
  /** Popovers, tooltips, jump menus */
  pop: 220,
  /**
   * Bottom sheet / drawer enter — premium middle ground
   * (not iOS-spring-fast, not sluggish).
   */
  sheetEnter: 380,
  /** Sheet exit — shorter than enter per skill */
  sheetExit: 280,
  /** Dim layer behind sheets — tracks enter, slightly under */
  backdrop: 320,
  /** Contextual icon cross-fade */
  iconSwap: 300,
} as const;

/**
 * Keep the sheet mounted until the slower of enter/exit finishes.
 * Pair with `useMountTransition(open, PDP_SHEET_PRESENCE_MS)`.
 */
export const PDP_SHEET_PRESENCE_MS = Math.max(
  PDP_MOTION_MS.sheetEnter,
  PDP_MOTION_MS.sheetExit,
  PDP_MOTION_MS.backdrop,
);
