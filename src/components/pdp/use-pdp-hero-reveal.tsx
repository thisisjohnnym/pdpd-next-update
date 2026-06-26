"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

import { PDP_BRAND_BAR_HEIGHT } from "./pdp-brand-bar";
import { useReducedMotion } from "./use-reduced-motion";

/**
 * Hero "reveal" — a single 0→1 value shared by the brand-bar overlay, the hero
 * hug (inset + top radius) and the overlay header offset.
 *
 * The shrink/switcher is NOT a passive `scrollY === 0` state. It is purposeful:
 *  - a one-time intro peek on load (visible ~1s, then animates away), and
 *  - an intentional pull-down at the very top (touch drag or wheel overscroll)
 *    with rubber-band resistance; it latches open only past a threshold.
 *
 * Just scrolling back up to the top rests at full-screen (reveal 0).
 */

const INTRO_HOLD_MS = 3000;
/** Shrink (hugged) → full-bleed: a deliberate, gentle ~3s ease-out collapse */
const SHRINK_TO_FULL_MS = 3000;
const SETTLE_MS = 320;
/** Drag distance is dampened so the switcher is not trivially triggered */
const PULL_DAMPING = 0.42;
/** Fraction of the bar height (after damping) needed to latch open */
const LATCH_THRESHOLD = 0.5;
/** Idle gap that ends a wheel "gesture" and decides latch vs spring-back */
const WHEEL_END_MS = 140;

function clamp01(value: number): number {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

class HeroRevealController {
  private reveal = 0;
  reducedMotion = false;
  private readonly listeners = new Set<(reveal: number) => void>();
  private raf = 0;
  private from = 0;
  private to = 0;
  private start = 0;
  private duration = 0;

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

  /** Imperative set during an active drag (no tween). */
  setDirect(value: number) {
    this.cancelAnim();
    const next = clamp01(value);
    if (next === this.reveal) {
      return;
    }
    this.reveal = next;
    this.emit();
  }

  // fallow-ignore-next-line complexity
  animateTo(target: number, durationMs?: number) {
    const next = clamp01(target);
    // Collapsing toward full-bleed (reveal decreasing) is the deliberate ~3s
    // shrink→full-bleed animation; expanding back to the shrink stays snappy.
    const collapsing = next < this.reveal;
    const resolved =
      durationMs ??
      (collapsing
        ? this.reducedMotion
          ? 0
          : SHRINK_TO_FULL_MS
        : SETTLE_MS);
    if (resolved <= 0 || typeof performance === "undefined") {
      this.setDirect(next);
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
    this.reveal = this.from + (this.to - this.from) * easeOutCubic(t);
    this.emit();
    if (t < 1) {
      this.raf = requestAnimationFrame(this.tick);
    } else {
      this.raf = 0;
      this.reveal = this.to;
      this.emit();
    }
  };
}

const HeroRevealContext = createContext<HeroRevealController | null>(null);

export function PdpHeroRevealProvider({
  enabled,
  children,
}: {
  enabled: boolean;
  children: ReactNode;
}) {
  const reducedMotion = useReducedMotion();
  const controllerRef = useRef<HeroRevealController | null>(null);
  if (!controllerRef.current) {
    controllerRef.current = new HeroRevealController();
  }
  const controller = controllerRef.current;

  // Publish the normalized reveal progress as a CSS variable so fixed/overlay
  // chrome can animate with the same timing curve as the hero hug.
  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    const unsub = controller.subscribe((reveal) => {
      document.documentElement.style.setProperty("--hero-reveal", `${reveal}`);
    });
    return () => {
      unsub();
      document.documentElement.style.removeProperty("--hero-reveal");
    };
  }, [controller]);

  // One-time intro peek: show the switcher for ~1s, then let it slip away.
  useEffect(() => {
    controller.reducedMotion = reducedMotion;
    if (!enabled) {
      controller.setDirect(0);
      return;
    }
    controller.setDirect(1);
    const timer = window.setTimeout(() => {
      if (reducedMotion) {
        controller.setDirect(0);
      } else {
        controller.animateTo(0);
      }
    }, INTRO_HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [enabled, reducedMotion, controller]);

  // Pull-to-reveal: only fires as an *overscroll* past the top, so plain
  // scroll-up to the hero stays full-screen.
  useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      return;
    }

    const barHeight = PDP_BRAND_BAR_HEIGHT;
    const latchPx = barHeight * LATCH_THRESHOLD;
    const atTop = () => window.scrollY <= 0;

    let touching = false;
    let startY = 0;
    let dragPx = 0;

    // fallow-ignore-next-line complexity
    const onTouchStart = (event: TouchEvent) => {
      if (!atTop() && controller.getReveal() <= 0) {
        touching = false;
        return;
      }
      touching = true;
      startY = event.touches[0]?.clientY ?? 0;
      dragPx = 0;
    };

    // fallow-ignore-next-line complexity
    const onTouchMove = (event: TouchEvent) => {
      if (!touching) {
        return;
      }
      const dy = (event.touches[0]?.clientY ?? 0) - startY;
      if (dy <= 0 && controller.getReveal() <= 0) {
        touching = false;
        return;
      }
      dragPx = dy;
      const damped = dy * PULL_DAMPING;
      controller.setDirect(damped / barHeight);
      if (dy > 0) {
        event.preventDefault();
      }
    };

    const onTouchEnd = () => {
      if (!touching) {
        return;
      }
      touching = false;
      const damped = dragPx * PULL_DAMPING;
      controller.animateTo(damped >= latchPx ? 1 : 0);
    };

    let wheelAccum = 0;
    let wheelTimer = 0;

    const decideWheel = () => {
      const damped = wheelAccum * PULL_DAMPING;
      if (damped >= latchPx) {
        controller.animateTo(1);
        wheelAccum = barHeight / PULL_DAMPING;
      } else {
        controller.animateTo(0);
        wheelAccum = 0;
      }
    };

    const scheduleWheelEnd = () => {
      window.clearTimeout(wheelTimer);
      wheelTimer = window.setTimeout(decideWheel, WHEEL_END_MS);
    };

    // fallow-ignore-next-line complexity
    const onWheel = (event: WheelEvent) => {
      const reveal = controller.getReveal();
      if (event.deltaY < 0 && atTop()) {
        wheelAccum += -event.deltaY;
        controller.setDirect((wheelAccum * PULL_DAMPING) / barHeight);
        event.preventDefault();
        scheduleWheelEnd();
      } else if (event.deltaY > 0 && reveal > 0) {
        wheelAccum = Math.max(0, wheelAccum - event.deltaY);
        controller.setDirect((wheelAccum * PULL_DAMPING) / barHeight);
        event.preventDefault();
        scheduleWheelEnd();
      }
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("wheel", onWheel);
      window.clearTimeout(wheelTimer);
    };
  }, [enabled, controller]);

  return (
    <HeroRevealContext.Provider value={controller}>
      {children}
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

  useEffect(() => {
    if (!controller) {
      applierRef.current(0);
      return;
    }
    return controller.subscribe((value) => applierRef.current(value));
  }, [controller]);
}
