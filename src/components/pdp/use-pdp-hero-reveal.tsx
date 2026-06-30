"use client";

import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
  type ReactNode,
} from "react";

import { PDP_BRAND_BAR_HEIGHT } from "./pdp-brand-bar";
import { getPdpVersionConfig } from "./version/pdp-version-config";
import { usePdpVersion } from "./version/pdp-version-context";
import {
  HERO_INTRO_HOLD_MS,
  HERO_SHRINK_TO_FULL_MS,
} from "./pdp-hero-tokens";
import { useReducedMotion } from "./use-reduced-motion";

/**
 * Hero "reveal" — 0→1 value for shrunk↔full-bleed hero land (see docs/pdp-hero-chrome.md).
 * Purposeful states: intro peek on load (2s hold, 1s collapse), pull-to-reveal at top
 * (same hold + collapse after open animation), scroll-back rests full bleed.
 */

const INTRO_HOLD_MS = HERO_INTRO_HOLD_MS;
const SHRINK_TO_FULL_MS = HERO_SHRINK_TO_FULL_MS;
/** Drag distance is dampened so the switcher is not trivially triggered */
const PULL_DAMPING = 0.42;
/** Cap per-wheel tick so trackpad inertia cannot snap reveal to 1 in one frame */
const WHEEL_DELTA_CAP_PX = 20;
/** Minimum settle duration for latch open/close (make-interfaces-feel-better) */
const GESTURE_SETTLE_MIN_MS = 300;
/** Fraction of the bar height (after damping) needed to latch open */
const LATCH_THRESHOLD = 0.5;
/** Idle gap that ends a wheel "gesture" and decides latch vs spring-back */
const WHEEL_END_MS = 140;
/** User must have scrolled past this before scroll-back-to-top is recognized */
const SCROLL_AWAY_THRESHOLD_PX = 8;
/** Treat scrollY within this of 0 as "at top" (iOS rubber-band wobble) */
const SCROLL_TOP_EPSILON_PX = 2;
/** Block pull gestures after scroll-back or during scroll momentum (iOS) */
const GESTURE_SUPPRESS_MS = 800;
/** Scroll considered idle after this gap — ends "active scroll" window */
const SCROLL_SETTLE_MS = 150;
/** Horizontal movement past this wins over pull-to-reveal (v2 gallery track) */
const HORIZONTAL_GESTURE_DOMINANCE_PX = 8;

function clamp01(value: number): number {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/** Settle duration scales with how far reveal still has to travel. */
function gestureSettleDuration(from: number, to: number): number {
  const distance = Math.abs(to - from);
  return Math.max(GESTURE_SETTLE_MIN_MS, SHRINK_TO_FULL_MS * distance);
}

/** Map raw pull pixels to reveal — damping applies to live drag, not only latch. */
function revealFromPullPixels(pullPx: number, barHeight: number): number {
  return clamp01((pullPx * PULL_DAMPING) / barHeight);
}

function isOnHeroGalleryTrack(target: EventTarget | null): boolean {
  return (
    target instanceof Element &&
    Boolean(target.closest("[data-hero-gallery-track]"))
  );
}

function isHorizontalDominantGesture(dx: number, dy: number): boolean {
  return Math.abs(dx) > Math.abs(dy) + HORIZONTAL_GESTURE_DOMINANCE_PX;
}

class HeroRevealController {
  private reveal = 1;
  reducedMotion = false;
  /** Blocks collapse until intro hold finishes — guards against stray gestures / Strict Mode. */
  introCollapseAllowed = false;
  introComplete = false;
  /** Ignores pull-to-reveal after intro collapse or scroll-back-to-top. */
  gestureSuppressUntil = 0;
  private readonly listeners = new Set<(reveal: number) => void>();
  private raf = 0;
  private from = 0;
  private to = 0;
  private start = 0;
  private duration = 0;
  private autohideTimer = 0;

  getReveal(): number {
    return this.reveal;
  }

  subscribe(listener: (reveal: number) => void): () => void {
    this.listeners.add(listener);
    listener(this.reveal);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit() {
    for (const listener of this.listeners) {
      listener(this.reveal);
    }
  }

  private cancelAnim() {
    if (this.raf) {
      cancelAnimationFrame(this.raf);
      this.raf = 0;
    }
  }

  private canMoveTo(next: number): boolean {
    if (next < this.reveal && !this.introCollapseAllowed) {
      return false;
    }
    return true;
  }

  cancelAutohide() {
    if (this.autohideTimer) {
      window.clearTimeout(this.autohideTimer);
      this.autohideTimer = 0;
    }
  }

  /** After pull-to-reveal opens fully, hold then collapse like the intro peek. */
  private scheduleAutohideAfterOpen() {
    if (!this.introComplete || this.reveal < 0.99) {
      return;
    }
    this.cancelAutohide();
    this.autohideTimer = window.setTimeout(() => {
      this.autohideTimer = 0;
      if (this.reveal < 0.99) {
        return;
      }
      if (this.reducedMotion) {
        this.setDirect(0, "autohide-hold-timer");
        return;
      }
      this.animateTo(0, undefined, "autohide-hold-timer");
    }, INTRO_HOLD_MS);
  }

  allowIntroCollapse() {
    this.introCollapseAllowed = true;
  }

  suppressGestures(ms: number) {
    this.gestureSuppressUntil = Math.max(
      this.gestureSuppressUntil,
      performance.now() + ms,
    );
  }

  isGestureSuppressed(): boolean {
    return performance.now() < this.gestureSuppressUntil;
  }

  finishIntro() {
    this.introComplete = true;
    this.suppressGestures(GESTURE_SUPPRESS_MS);
  }

  /** One-shot intro peek — always emits even when already at 1 (Strict Mode remount). */
  rearmIntro() {
    this.cancelAutohide();
    this.cancelAnim();
    this.introCollapseAllowed = false;
    this.introComplete = false;
    this.reveal = 1;
    this.emit();
  }

  /** Imperative set during an active drag (no tween). */
  setDirect(value: number, source = "unknown") {
    const next = clamp01(value);
    if (!this.canMoveTo(next)) {
      return;
    }
    if (next < this.reveal) {
      this.cancelAutohide();
    }
    this.cancelAnim();
    if (next === this.reveal) {
      return;
    }
    this.reveal = next;
    this.emit();
  }

  // fallow-ignore-next-line complexity
  animateTo(target: number, durationMs?: number, source = "unknown") {
    const next = clamp01(target);
    if (!this.canMoveTo(next)) {
      return;
    }
    if (next < this.reveal) {
      this.cancelAutohide();
    }
    const collapsing = next < this.reveal;
    const resolved =
      durationMs ??
      (this.reducedMotion && collapsing
        ? 0
        : gestureSettleDuration(this.reveal, next));
    if (resolved <= 0 || typeof performance === "undefined") {
      this.setDirect(next, source);
      if (next >= 0.99 && this.introComplete) {
        this.scheduleAutohideAfterOpen();
      }
      return;
    }
    this.from = this.reveal;
    this.to = next;
    this.start = performance.now();
    this.duration = resolved;
    if (!this.raf) {
      this.raf = requestAnimationFrame(this.tick);
    }
  }

  private tick = (now: number) => {
    const t = this.duration <= 0 ? 1 : Math.min(1, (now - this.start) / this.duration);
    const next = this.from + (this.to - this.from) * easeOutCubic(t);
    if (!this.canMoveTo(next)) {
      this.cancelAnim();
      return;
    }
    this.reveal = next;
    this.emit();
    if (t < 1) {
      this.raf = requestAnimationFrame(this.tick);
    } else {
      this.raf = 0;
      this.reveal = this.to;
      if (this.to >= 0.99 && this.introComplete) {
        this.scheduleAutohideAfterOpen();
      }
      this.emit();
    }
  };
}

const HeroRevealContext = createContext<HeroRevealController | null>(null);

export function PdpHeroRevealProvider({
  children,
}: {
  children: ReactNode;
}) {
  const reducedMotion = useReducedMotion();
  const { heroRevealDeferToHorizontalGallery } = getPdpVersionConfig(
    usePdpVersion(),
  );
  const [controller] = useState(() => new HeroRevealController());

  useEffect(() => {
    controller.reducedMotion = reducedMotion;
  }, [reducedMotion, controller]);

  // Publish reveal + run intro in one layout pass so subscribers never miss the peek.
  useLayoutEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const unsub = controller.subscribe((reveal) => {
      document.documentElement.style.setProperty("--hero-reveal", `${reveal}`);
    });

    let cancelled = false;
    let collapseTimer = 0;
    controller.rearmIntro();

    const holdTimer = window.setTimeout(() => {
      if (cancelled) {
        return;
      }

      controller.allowIntroCollapse();

      if (controller.reducedMotion) {
        controller.setDirect(0);
        controller.finishIntro();
        return;
      }

      controller.animateTo(0, undefined, "intro-hold-timer");
      collapseTimer = window.setTimeout(() => {
        if (!cancelled) {
          controller.finishIntro();
        }
      }, SHRINK_TO_FULL_MS + 32);
    }, INTRO_HOLD_MS);

    return () => {
      cancelled = true;
      controller.cancelAutohide();
      window.clearTimeout(holdTimer);
      window.clearTimeout(collapseTimer);
      unsub();
    };
  }, [controller]);

  // Pull-to-reveal: intentional overscroll at top only — scroll-back rests full bleed.
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const barHeight = PDP_BRAND_BAR_HEIGHT;
    const latchPx = barHeight * LATCH_THRESHOLD;
    const atTop = () => window.scrollY <= SCROLL_TOP_EPSILON_PX;
    const canTouchPull = () => controller.introComplete;
    /** Wheel pull only after the user has scrolled — blocks load-time trackpad noise. */
    const canWheelPull = () => controller.introComplete && hasScrolledAwayFromTop;

    let touching = false;
    let startX = 0;
    let startY = 0;
    let dragPx = 0;
    let wheelAccum = 0;
    let wheelTimer = 0;
    let scrollEndTimer = 0;
    let isScrollActive = false;
    /** Latched once the user scrolls past the top threshold — enables wheel pull-to-reveal. */
    let hasScrolledAwayFromTop = false;
    /** Only set by scroll events — never from initial scrollY (avoids false arrival on load) */
    let wasAwayFromTop = false;

    const blockTouchPull = () => {
      if (!canTouchPull()) {
        return true;
      }
      if (controller.isGestureSuppressed()) {
        return true;
      }
      if (isScrollActive && window.scrollY > SCROLL_AWAY_THRESHOLD_PX) {
        return true;
      }
      return false;
    };

    const blockWheelPull = () => {
      if (!canWheelPull()) {
        return true;
      }
      if (controller.isGestureSuppressed()) {
        return true;
      }
      if (isScrollActive && window.scrollY > SCROLL_AWAY_THRESHOLD_PX) {
        return true;
      }
      return false;
    };

    const onArrivedAtTopViaScroll = () => {
      if (!controller.introComplete) {
        return;
      }
      wheelAccum = 0;
      controller.setDirect(0, "scroll-back-to-top");
      controller.suppressGestures(GESTURE_SUPPRESS_MS);
    };

    const onScroll = () => {
      const y = window.scrollY;
      isScrollActive = true;
      window.clearTimeout(scrollEndTimer);
      scrollEndTimer = window.setTimeout(() => {
        isScrollActive = false;
      }, SCROLL_SETTLE_MS);

      if (y > SCROLL_AWAY_THRESHOLD_PX) {
        if (controller.introComplete) {
          hasScrolledAwayFromTop = true;
        }
        wasAwayFromTop = true;
      } else if (atTop() && wasAwayFromTop) {
        wasAwayFromTop = false;
        onArrivedAtTopViaScroll();
      }
    };

    // fallow-ignore-next-line complexity
    const onTouchStart = (event: TouchEvent) => {
      if (blockTouchPull()) {
        touching = false;
        return;
      }
      if (
        heroRevealDeferToHorizontalGallery &&
        isOnHeroGalleryTrack(event.target)
      ) {
        touching = false;
        return;
      }
      if (!atTop() && controller.getReveal() <= 0) {
        touching = false;
        return;
      }
      if (window.scrollY > SCROLL_AWAY_THRESHOLD_PX && controller.getReveal() <= 0) {
        touching = false;
        return;
      }
      controller.cancelAutohide();
      touching = true;
      startX = event.touches[0]?.clientX ?? 0;
      startY = event.touches[0]?.clientY ?? 0;
      dragPx = 0;
    };

    // fallow-ignore-next-line complexity
    const onTouchMove = (event: TouchEvent) => {
      if (!touching || blockTouchPull()) {
        return;
      }
      const touch = event.touches[0];
      const dx = (touch?.clientX ?? 0) - startX;
      const dy = (touch?.clientY ?? 0) - startY;
      if (
        heroRevealDeferToHorizontalGallery &&
        isHorizontalDominantGesture(dx, dy)
      ) {
        touching = false;
        return;
      }
      if (dy <= 0 && controller.getReveal() <= 0) {
        touching = false;
        return;
      }
      dragPx = dy;
      controller.setDirect(
        revealFromPullPixels(dy, barHeight),
        "touch-move",
      );
      if (dy > 0) {
        event.preventDefault();
      }
    };

    const onTouchEnd = () => {
      if (!touching) {
        return;
      }
      touching = false;

      if (blockTouchPull()) {
        return;
      }

      const damped = dragPx * PULL_DAMPING;
      const reveal = controller.getReveal();
      if (damped >= latchPx) {
        controller.animateTo(
          1,
          gestureSettleDuration(reveal, 1),
          "touch-end",
        );
      } else {
        controller.animateTo(
          0,
          gestureSettleDuration(reveal, 0),
          "touch-end",
        );
      }
    };

    const decideWheel = () => {
      if (blockWheelPull()) {
        wheelAccum = 0;
        return;
      }

      const damped = wheelAccum * PULL_DAMPING;
      const reveal = controller.getReveal();
      if (damped >= latchPx) {
        controller.animateTo(
          1,
          gestureSettleDuration(reveal, 1),
          "wheel-end-latch",
        );
        wheelAccum = barHeight / PULL_DAMPING;
      } else {
        controller.animateTo(
          0,
          gestureSettleDuration(reveal, 0),
          "wheel-end-spring",
        );
        wheelAccum = 0;
      }
    };

    const scheduleWheelEnd = () => {
      window.clearTimeout(wheelTimer);
      wheelTimer = window.setTimeout(decideWheel, WHEEL_END_MS);
    };

    // fallow-ignore-next-line complexity
    const onWheel = (event: WheelEvent) => {
      if (
        heroRevealDeferToHorizontalGallery &&
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
      ) {
        return;
      }
      const reveal = controller.getReveal();
      if (event.deltaY < 0 && atTop()) {
        if (blockWheelPull()) {
          return;
        }
        controller.cancelAutohide();
        wheelAccum += Math.min(-event.deltaY, WHEEL_DELTA_CAP_PX);
        controller.setDirect(
          revealFromPullPixels(wheelAccum, barHeight),
          "wheel-pull",
        );
        event.preventDefault();
        scheduleWheelEnd();
      } else if (event.deltaY > 0 && reveal > 0) {
        if (blockWheelPull()) {
          return;
        }
        wheelAccum = Math.max(
          0,
          wheelAccum - Math.min(event.deltaY, WHEEL_DELTA_CAP_PX),
        );
        controller.setDirect(
          revealFromPullPixels(wheelAccum, barHeight),
          "wheel-push",
        );
        event.preventDefault();
        scheduleWheelEnd();
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("wheel", onWheel);
      window.clearTimeout(wheelTimer);
      window.clearTimeout(scrollEndTimer);
      controller.cancelAutohide();
    };
  }, [controller, heroRevealDeferToHorizontalGallery]);

  return (
    <HeroRevealContext.Provider value={controller}>
      <div data-hero-reveal-provider="" style={{ display: "contents" }}>
        {children}
      </div>
    </HeroRevealContext.Provider>
  );
}

export function useHeroRevealController(): HeroRevealController | null {
  return useContext(HeroRevealContext);
}

/**
 * Subscribe to the reveal value with a DOM applier (no React re-render). The
 * applier runs immediately with the current value and on every change.
 */
export function useHeroRevealApplier(applier: (reveal: number) => void) {
  const controller = useHeroRevealController();
  const applierRef = useRef(applier);
  applierRef.current = applier;

  useLayoutEffect(() => {
    if (!controller) {
      return;
    }
    return controller.subscribe((value) => applierRef.current(value));
  }, [controller]);
}
