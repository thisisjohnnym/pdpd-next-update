"use client";

import { type RefObject, useCallback, useEffect, useRef, useState } from "react";

import { useReducedMotion } from "./use-reduced-motion";

const LOOP_REPETITIONS = 3;

type InfiniteCenteredCarouselOptions = {
  initialIndex?: number;
  /**
   * Preserve the logical slide across resize, commit active index when scroll
   * settles, and track pointer (touch + mouse) before loop teleport.
   */
  stableLoop?: boolean;
};

function readLoopedSlideIndex(el: HTMLElement): number {
  const width = el.clientWidth;
  if (width <= 0) {
    return 0;
  }
  return Math.round(el.scrollLeft / width);
}

function readLogicalSlideIndex(loopedIndex: number, itemCount: number): number {
  if (itemCount <= 0) {
    return 0;
  }
  return ((loopedIndex % itemCount) + itemCount) % itemCount;
}

function supportsScrollEndEvent(): boolean {
  return typeof window !== "undefined" && "onscrollend" in window;
}

function getCenteredScrollLeft(
  container: HTMLElement,
  child: HTMLElement,
): number {
  return child.offsetLeft - (container.clientWidth - child.offsetWidth) / 2;
}

/** Triple items for seamless horizontal looping */
export function loopCarouselItems<T>(items: readonly T[]): T[] {
  if (items.length <= 1) {
    return [...items];
  }

  return Array.from({ length: LOOP_REPETITIONS }, () => items).flat();
}

/** Center-snapped rail that loops infinitely left and right */
export function useInfiniteCenteredCarousel(
  scrollRef: RefObject<HTMLDivElement | null>,
  itemCount: number,
  options?: InfiniteCenteredCarouselOptions,
) {
  const initialIndex = options?.initialIndex ?? 0;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || itemCount === 0) {
      return;
    }

    const getChild = (index: number) => el.children[index] as HTMLElement | undefined;

    const centerChild = (index: number) => {
      const child = getChild(index);
      if (!child) {
        return;
      }

      el.scrollLeft = getCenteredScrollLeft(el, child);
    };

    const startIndex =
      itemCount > 1 ? itemCount + initialIndex : initialIndex;

    requestAnimationFrame(() => {
      centerChild(startIndex);
    });

    if (itemCount < 2) {
      const onResize = () => centerChild(startIndex);
      const ro = new ResizeObserver(onResize);
      ro.observe(el);
      return () => ro.disconnect();
    }

    const edgeBuffer = 12;

    // Geometry is static between resizes — cache it so the idle check only
    // reads scrollLeft (one layout read) and never re-measures the rail mid-drag.
    let blockWidth = 0;
    let maxScrollLeft = 0;

    const measure = () => {
      const blockStart = getChild(itemCount);
      const nextBlockStart = getChild(2 * itemCount);
      blockWidth =
        blockStart && nextBlockStart
          ? nextBlockStart.offsetLeft - blockStart.offsetLeft
          : 0;
      maxScrollLeft = el.scrollWidth - el.clientWidth;
    };

    // The loop teleport (shifting scrollLeft by one full block) must only run
    // once the rail has come to rest. Mutating scrollLeft while an iOS momentum
    // fling is still animating cancels the fling — the carousel "sticks" — and
    // mandatory snap then re-snaps, which reads as a jump. The destination is a
    // pixel-identical snap point one block away, so the recenter is invisible.
    let pointerDown = false;
    let idleTimer = 0;

    // fallow-ignore-next-line complexity
    const recenterIfAtEdge = () => {
      if (blockWidth <= 0 || pointerDown || isCarouselDragSettling(el)) {
        return;
      }

      if (el.scrollLeft <= edgeBuffer) {
        el.scrollLeft += blockWidth;
      } else if (el.scrollLeft >= maxScrollLeft - edgeBuffer) {
        el.scrollLeft -= blockWidth;
      }
    };

    const scheduleIdleCheck = () => {
      if (idleTimer) {
        window.clearTimeout(idleTimer);
      }
      idleTimer = window.setTimeout(recenterIfAtEdge, 90);
    };

    const onPointerDown = () => {
      pointerDown = true;
    };

    const onPointerUp = () => {
      pointerDown = false;
      scheduleIdleCheck();
    };

    const onResize = () => {
      measure();
      centerChild(itemCount + initialIndex);
    };

    const ro = new ResizeObserver(onResize);
    ro.observe(el);

    measure();
    el.addEventListener("scroll", scheduleIdleCheck, { passive: true });
    el.addEventListener("scrollend", recenterIfAtEdge);
    // Pointer events cover touch AND mouse (click-and-drag via useDragToScroll)
    // so the edge-teleport recenter never fires mid-drag for either input.
    el.addEventListener("pointerdown", onPointerDown, { passive: true });
    el.addEventListener("pointerup", onPointerUp, { passive: true });
    el.addEventListener("pointercancel", onPointerUp, { passive: true });

    return () => {
      if (idleTimer) {
        window.clearTimeout(idleTimer);
      }
      el.removeEventListener("scroll", scheduleIdleCheck);
      el.removeEventListener("scrollend", recenterIfAtEdge);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
      ro.disconnect();
    };
  }, [scrollRef, itemCount, initialIndex]);
}

const DRAG_CLICK_SUPPRESS_THRESHOLD_PX = 6;

/** Longest a smooth settle should ever take — fallback for browsers without `scrollend`. */
const DRAG_SETTLE_FALLBACK_MS = 500;

const CAROUSEL_DRAGGING_CLASS = "pdp-carousel-dragging";

function readScrollPaddingLeft(el: HTMLElement): number {
  return parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0;
}

/** Center-snapped rails (UGC infinite) vs snap-start peek rails (reviews, details). */
function isCenterSnappedRail(el: HTMLElement): boolean {
  const firstChild = el.children[0] as HTMLElement | undefined;
  if (!firstChild) {
    return false;
  }

  return getComputedStyle(firstChild).scrollSnapAlign === "center";
}

function snapTargetScrollLeft(el: HTMLElement, child: HTMLElement): number {
  if (isCenterSnappedRail(el)) {
    return getCenteredScrollLeft(el, child);
  }

  return child.offsetLeft - readScrollPaddingLeft(el);
}

/** Nearest child's snap scrollLeft — matches the rail's snap-align mode. */
function nearestChildScrollLeft(el: HTMLElement): number {
  const paddingLeft = readScrollPaddingLeft(el);
  const useCenter = isCenterSnappedRail(el);
  const probe = useCenter
    ? el.scrollLeft + el.clientWidth / 2
    : el.scrollLeft + paddingLeft;

  let target = el.scrollLeft;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const child of Array.from(el.children) as HTMLElement[]) {
    const comparePoint = useCenter
      ? child.offsetLeft + child.offsetWidth / 2
      : child.offsetLeft;
    const distance = Math.abs(comparePoint - probe);

    if (distance < bestDistance) {
      bestDistance = distance;
      target = snapTargetScrollLeft(el, child);
    }
  }

  const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
  return Math.min(Math.max(0, target), maxScroll);
}

function isCarouselDragSettling(el: HTMLElement): boolean {
  return el.classList.contains(CAROUSEL_DRAGGING_CLASS);
}

/**
 * Click-and-drag horizontal scrolling for mouse pointers. Touch and pen
 * already scroll the rail natively (`overflow-x-auto` + `touch-action`), so
 * this only intercepts mouse input — a plain desktop mouse has no built-in
 * way to pan a horizontal rail, which otherwise makes carousels unusable
 * when demoing off a laptop trackpad-free mouse.
 *
 * Sets `scrollLeft` directly during the drag (CSS `scroll-snap-type` is
 * suspended via `.pdp-carousel-dragging` so it can't fight the live drag),
 * then on release animates to the nearest card with `scrollTo({ behavior:
 * "smooth" })` — an explicit tween rather than trusting the browser's own
 * (instant, `scroll-behavior: auto`) snap correction — before handing scroll
 * snap back for touch/keyboard/resize. Skips the tween under reduced motion.
 */
export function useDragToScroll(scrollRef: RefObject<HTMLDivElement | null>) {
  const reducedMotion = useReducedMotion();
  const reducedMotionRef = useRef(reducedMotion);

  useEffect(() => {
    reducedMotionRef.current = reducedMotion;
  }, [reducedMotion]);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let retryRafId = 0;

    const attach = () => {
      const el = scrollRef.current;
      if (!el) {
        retryRafId = requestAnimationFrame(attach);
        return;
      }

      let dragging = false;
      let startX = 0;
      let startScrollLeft = 0;
      let moved = 0;
      let settleTimer = 0;

      const clearSettleTimer = () => {
        if (settleTimer) {
          window.clearTimeout(settleTimer);
          settleTimer = 0;
        }
        el.removeEventListener("scrollend", finishSettle);
      };

      const finishSettle = () => {
        clearSettleTimer();
        el.classList.remove(CAROUSEL_DRAGGING_CLASS);
      };

      const onPointerDown = (event: PointerEvent) => {
        if (event.pointerType !== "mouse" || event.button !== 0) {
          return;
        }

        clearSettleTimer();
        dragging = true;
        moved = 0;
        startX = event.clientX;
        startScrollLeft = el.scrollLeft;
        el.classList.add(CAROUSEL_DRAGGING_CLASS);

        try {
          el.setPointerCapture(event.pointerId);
        } catch {
          /* capture unsupported — drag still works via document-level fallback */
        }
      };

      const onPointerMove = (event: PointerEvent) => {
        if (!dragging) {
          return;
        }

        const dx = event.clientX - startX;
        moved = Math.max(moved, Math.abs(dx));
        el.scrollLeft = startScrollLeft - dx;
      };

      const endDrag = (event: PointerEvent) => {
        if (!dragging) {
          return;
        }

        dragging = false;

        el.scrollTo({
          left: nearestChildScrollLeft(el),
          behavior: reducedMotionRef.current ? "auto" : "smooth",
        });

        if (supportsScrollEndEvent()) {
          el.addEventListener("scrollend", finishSettle, { once: true });
        } else {
          settleTimer = window.setTimeout(finishSettle, DRAG_SETTLE_FALLBACK_MS);
        }

        if (el.hasPointerCapture(event.pointerId)) {
          el.releasePointerCapture(event.pointerId);
        }
      };

      const onClickCapture = (event: MouseEvent) => {
        if (moved > DRAG_CLICK_SUPPRESS_THRESHOLD_PX) {
          event.preventDefault();
          event.stopPropagation();
        }
      };

      el.addEventListener("pointerdown", onPointerDown);
      el.addEventListener("pointermove", onPointerMove);
      el.addEventListener("pointerup", endDrag);
      el.addEventListener("pointercancel", endDrag);
      el.addEventListener("click", onClickCapture, { capture: true });

      cleanup = () => {
        clearSettleTimer();
        el.removeEventListener("pointerdown", onPointerDown);
        el.removeEventListener("pointermove", onPointerMove);
        el.removeEventListener("pointerup", endDrag);
        el.removeEventListener("pointercancel", endDrag);
        el.removeEventListener("click", onClickCapture, { capture: true });
      };
    };

    attach();

    return () => {
      if (retryRafId) {
        cancelAnimationFrame(retryRafId);
      }
      cleanup?.();
    };
  }, [scrollRef]);
}

/** Coverflow depth tuning — how far the side clips rotate, recede, and dim */
const COVERFLOW = {
  /** Peak rotation (deg) reached ~1.4 cards from center */
  maxRotateDeg: 34,
  rotateSaturateCards: 1.4,
  /** How much smaller a side clip gets, saturating at 1 card away */
  maxScaleDrop: 0.2,
  /** Push side clips back into the scene (px) */
  maxTranslateZ: 120,
  /** Dim side clips so the center reads as the hero */
  maxBrightnessDrop: 0.42,
  /** Pull neighbours inward (fraction of card width) so they tuck like stacked pages */
  pullRatio: 0.16,
  pullSaturateCards: 1.6,
} as const;

function clampNumber(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Scroll-driven coverflow: the centered clip stays flat and bright while
 * neighbours rotate away, recede, dim, and tuck inward — a "flipping through
 * pages" sense of depth. Transforms are visual only and never touch layout or
 * scroll snapping.
 */
export function useCarouselCoverflow(scrollRef: RefObject<HTMLDivElement | null>) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }

    const children = () => Array.from(el.children) as HTMLElement[];

    // The visual transform must ride an inner layer, never the snap target
    // itself: a transformed snap card shifts its own snap area every frame, so
    // mandatory snap can never converge and the rail rests between cards.
    const layerOf = (card: HTMLElement) =>
      (card.querySelector("[data-coverflow-layer]") as HTMLElement | null) ??
      card;

    const resetStyles = () => {
      for (const card of children()) {
        card.style.zIndex = "";
        const layer = layerOf(card);
        layer.style.transform = "";
        layer.style.filter = "";
      }
    };

    if (reducedMotion) {
      resetStyles();
      return;
    }

    // Per-card geometry (center + width) is fixed until a resize, so we cache
    // the elements and their measurements once. Each scroll frame then performs
    // a single layout read (scrollLeft) followed by pure style writes — no
    // interleaved reads — which avoids the layout thrash that made the rail
    // feel shaky while dragging.
    let cards: HTMLElement[] = [];
    let layers: HTMLElement[] = [];
    let geometry: { center: number; width: number }[] = [];
    let viewportWidth = el.clientWidth;

    const measure = () => {
      cards = children();
      layers = cards.map(layerOf);
      viewportWidth = el.clientWidth;
      geometry = cards.map((child) => {
        const width = child.offsetWidth || 1;
        return { center: child.offsetLeft + width / 2, width };
      });
    };

    const apply = () => {
      const viewportCenter = el.scrollLeft + viewportWidth / 2;

      for (let i = 0; i < cards.length; i += 1) {
        const geo = geometry[i];
        if (!geo) {
          continue;
        }

        const offset = (geo.center - viewportCenter) / geo.width;
        const distance = Math.abs(offset);
        const near = Math.min(distance, 1);

        const scale = 1 - near * COVERFLOW.maxScaleDrop;
        const brightness = 1 - near * COVERFLOW.maxBrightnessDrop;
        const translateZ = -near * COVERFLOW.maxTranslateZ;
        const rotateY =
          (clampNumber(
            offset,
            -COVERFLOW.rotateSaturateCards,
            COVERFLOW.rotateSaturateCards,
          ) /
            COVERFLOW.rotateSaturateCards) *
          COVERFLOW.maxRotateDeg;
        const pullX =
          -clampNumber(
            offset,
            -COVERFLOW.pullSaturateCards,
            COVERFLOW.pullSaturateCards,
          ) *
          geo.width *
          COVERFLOW.pullRatio;

        const card = cards[i];
        const layer = layers[i];
        if (!layer) {
          continue;
        }

        layer.style.transform = `translate3d(${pullX.toFixed(2)}px, 0, ${translateZ.toFixed(
          2,
        )}px) rotateY(${rotateY.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
        layer.style.filter = `brightness(${brightness.toFixed(3)})`;
        card.style.zIndex = String(1000 - Math.round(distance * 100));
      }
    };

    // iOS dispatches `scroll` in sparse bursts during momentum, so applying
    // transforms only on those events makes the depth effect (and the text
    // riding on each card) lag and jump. Instead, once motion starts we drive a
    // self-sustaining rAF loop that re-applies every frame against the live
    // scrollLeft — buttery tracking — and shut it down a few idle frames after
    // the rail settles so we're not burning frames at rest.
    const IDLE_FRAMES_BEFORE_STOP = 4;
    let frame = 0;
    let running = false;
    let lastScrollLeft = Number.NaN;
    let idleFrames = 0;

    const tick = () => {
      apply();

      if (el.scrollLeft === lastScrollLeft) {
        idleFrames += 1;
      } else {
        idleFrames = 0;
        lastScrollLeft = el.scrollLeft;
      }

      if (idleFrames >= IDLE_FRAMES_BEFORE_STOP) {
        running = false;
        frame = 0;
        return;
      }

      frame = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (running) {
        return;
      }
      running = true;
      idleFrames = 0;
      lastScrollLeft = Number.NaN;
      frame = requestAnimationFrame(tick);
    };

    const onResize = () => {
      measure();
      apply();
    };

    measure();
    apply();
    el.addEventListener("scroll", startLoop, { passive: true });
    el.addEventListener("touchstart", startLoop, { passive: true });

    const ro = new ResizeObserver(onResize);
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", startLoop);
      el.removeEventListener("touchstart", startLoop);
      ro.disconnect();
      if (frame) {
        cancelAnimationFrame(frame);
      }
      running = false;
      resetStyles();
    };
  }, [scrollRef, reducedMotion]);
}

/** Maps snap-start scroll position to the active item index (finite rails) */
export function useCarouselSnapStartActiveIndex(
  scrollRef: RefObject<HTMLDivElement | null>,
) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }

    const updateActiveIndex = () => {
      const paddingLeft = parseFloat(getComputedStyle(el).paddingLeft) || 0;
      const anchor = el.scrollLeft + paddingLeft;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      for (let index = 0; index < el.children.length; index += 1) {
        const child = el.children[index] as HTMLElement;
        const distance = Math.abs(child.offsetLeft - anchor);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      }

      setActiveIndex(closestIndex);
    };

    updateActiveIndex();
    el.addEventListener("scroll", updateActiveIndex, { passive: true });

    const ro = new ResizeObserver(updateActiveIndex);
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", updateActiveIndex);
      ro.disconnect();
    };
  }, [scrollRef]);

  return activeIndex;
}

/** Maps center-snapped scroll position to the active source item index */
function useCarouselActiveIndex(
  scrollRef: RefObject<HTMLDivElement | null>,
  itemCount: number,
) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || itemCount === 0) {
      return;
    }

    const updateActiveIndex = () => {
      const center = el.scrollLeft + el.clientWidth / 2;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      for (let index = 0; index < el.children.length; index += 1) {
        const child = el.children[index] as HTMLElement;
        const childCenter = child.offsetLeft + child.offsetWidth / 2;
        const distance = Math.abs(center - childCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      }

      setActiveIndex(closestIndex % itemCount);
    };

    updateActiveIndex();
    el.addEventListener("scroll", updateActiveIndex, { passive: true });

    const ro = new ResizeObserver(updateActiveIndex);
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", updateActiveIndex);
      ro.disconnect();
    };
  }, [scrollRef, itemCount]);

  return activeIndex;
}

type InfiniteFullBleedCarouselState = {
  /** Logical slide index (0 … itemCount − 1) for indicator + nav contrast */
  activeIndex: number;
  /** Index into the tripled DOM rail — only this clone should play video */
  activeLoopedIndex: number;
  /** Scroll to a logical slide index (smooth when stableLoop is on). */
  scrollToIndex: (logicalIndex: number) => void;
};

/**
 * Full-viewport snap slides (`w-full` + `snap-center`) on a tripled rail.
 * Starts in the middle block; teleports scroll position at the edges so the
 * carousel loops seamlessly in both directions.
 */
export function useInfiniteFullBleedCarousel(
  scrollRef: RefObject<HTMLDivElement | null>,
  itemCount: number,
  options?: InfiniteCenteredCarouselOptions,
): InfiniteFullBleedCarouselState {
  const initialIndex = options?.initialIndex ?? 0;
  const stableLoop = options?.stableLoop ?? false;
  const [activeLoopedIndex, setActiveLoopedIndex] = useState(
    itemCount > 1 ? itemCount + initialIndex : initialIndex,
  );

  const activeIndex =
    itemCount > 0 ? activeLoopedIndex % itemCount : 0;

  const scrollToIndexRef = useRef<(logicalIndex: number) => void>(() => {});

  const scrollToIndex = useCallback((logicalIndex: number) => {
    scrollToIndexRef.current(logicalIndex);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || itemCount === 0) {
      return;
    }

    const getChild = (index: number) => el.children[index] as HTMLElement | undefined;

    const scrollToChild = (index: number, behavior: ScrollBehavior = "auto") => {
      const child = getChild(index);
      if (!child) {
        return;
      }
      if (behavior === "smooth") {
        el.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
      } else {
        el.scrollLeft = child.offsetLeft;
      }
    };

    const startIndex =
      itemCount > 1 ? itemCount + initialIndex : initialIndex;

    const scrollToLogicalIndex = (
      logicalIndex: number,
      behavior: ScrollBehavior = "auto",
    ) => {
      const clamped = Math.max(0, Math.min(logicalIndex, itemCount - 1));
      const target = itemCount > 1 ? itemCount + clamped : clamped;
      scrollToChild(target, behavior);
      setActiveLoopedIndex(target);
    };

    scrollToIndexRef.current = (logicalIndex: number) => {
      scrollToLogicalIndex(
        logicalIndex,
        stableLoop ? "smooth" : "auto",
      );
    };

    const scrollToStart = () => {
      scrollToChild(startIndex);
      setActiveLoopedIndex(startIndex);
    };

    requestAnimationFrame(() => {
      scrollToStart();
      // First rAF can run before slide widths exist — retry once layout settles.
      requestAnimationFrame(scrollToStart);
    });

    if (itemCount < 2) {
      const onResize = () => {
        if (stableLoop) {
          const logical = readLogicalSlideIndex(
            readLoopedSlideIndex(el),
            itemCount,
          );
          scrollToLogicalIndex(logical);
        } else {
          scrollToChild(startIndex);
        }
      };
      const ro = new ResizeObserver(onResize);
      ro.observe(el);
      return () => ro.disconnect();
    }

    const edgeBuffer = 12;
    let blockWidth = 0;
    let maxScrollLeft = 0;
    const scrollEndSupported = stableLoop && supportsScrollEndEvent();

    const measure = () => {
      const blockStart = getChild(itemCount);
      const nextBlockStart = getChild(2 * itemCount);
      blockWidth =
        blockStart && nextBlockStart
          ? nextBlockStart.offsetLeft - blockStart.offsetLeft
          : itemCount * el.clientWidth;
      maxScrollLeft = el.scrollWidth - el.clientWidth;
    };

    const updateActiveLoopedIndex = () => {
      const width = el.clientWidth;
      if (width <= 0) {
        return;
      }
      const next = Math.round(el.scrollLeft / width);
      setActiveLoopedIndex((prev) => (prev === next ? prev : next));
    };

    let pointerDown = false;
    let idleTimer = 0;

    const recenterIfAtEdge = () => {
      if (blockWidth <= 0 || pointerDown || isCarouselDragSettling(el)) {
        return;
      }

      if (el.scrollLeft <= edgeBuffer) {
        el.scrollLeft += blockWidth;
      } else if (el.scrollLeft >= maxScrollLeft - edgeBuffer) {
        el.scrollLeft -= blockWidth;
      }

      updateActiveLoopedIndex();
    };

    const scheduleIdleCheck = () => {
      if (!stableLoop) {
        updateActiveLoopedIndex();
      }
      if (idleTimer) {
        window.clearTimeout(idleTimer);
      }
      if (!scrollEndSupported) {
        idleTimer = window.setTimeout(() => {
          if (stableLoop) {
            updateActiveLoopedIndex();
          }
          recenterIfAtEdge();
        }, 90);
      }
    };

    const onScrollEnd = () => {
      updateActiveLoopedIndex();
      recenterIfAtEdge();
    };

    const onPointerDown = () => {
      pointerDown = true;
    };

    const onPointerUp = () => {
      pointerDown = false;
      if (scrollEndSupported) {
        return;
      }
      scheduleIdleCheck();
    };

    const onResize = () => {
      const logicalIndex = stableLoop
        ? readLogicalSlideIndex(readLoopedSlideIndex(el), itemCount)
        : initialIndex;
      measure();
      if (stableLoop) {
        scrollToLogicalIndex(logicalIndex);
      } else {
        scrollToChild(itemCount + initialIndex);
        setActiveLoopedIndex(itemCount + initialIndex);
      }
    };

    const ro = new ResizeObserver(onResize);
    ro.observe(el);

    measure();
    if (scrollEndSupported) {
      el.addEventListener("scrollend", onScrollEnd);
    } else {
      el.addEventListener("scroll", scheduleIdleCheck, { passive: true });
      el.addEventListener("scrollend", recenterIfAtEdge);
    }

    if (stableLoop) {
      el.addEventListener("pointerdown", onPointerDown, { passive: true });
      el.addEventListener("pointerup", onPointerUp, { passive: true });
      el.addEventListener("pointercancel", onPointerUp, { passive: true });
    } else {
      el.addEventListener("touchstart", onPointerDown, { passive: true });
      el.addEventListener("touchend", onPointerUp, { passive: true });
      el.addEventListener("touchcancel", onPointerUp, { passive: true });
    }

    return () => {
      if (idleTimer) {
        window.clearTimeout(idleTimer);
      }
      if (scrollEndSupported) {
        el.removeEventListener("scrollend", onScrollEnd);
      } else {
        el.removeEventListener("scroll", scheduleIdleCheck);
        el.removeEventListener("scrollend", recenterIfAtEdge);
      }
      if (stableLoop) {
        el.removeEventListener("pointerdown", onPointerDown);
        el.removeEventListener("pointerup", onPointerUp);
        el.removeEventListener("pointercancel", onPointerUp);
      } else {
        el.removeEventListener("touchstart", onPointerDown);
        el.removeEventListener("touchend", onPointerUp);
        el.removeEventListener("touchcancel", onPointerUp);
      }
      ro.disconnect();
    };
  }, [scrollRef, itemCount, initialIndex, stableLoop]);

  return { activeIndex, activeLoopedIndex, scrollToIndex };
}
