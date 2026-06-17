"use client";

import { type RefObject, useEffect, useState } from "react";

const LOOP_REPETITIONS = 3;

type InfiniteCenteredCarouselOptions = {
  initialIndex?: number;
};

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

    // Geometry is static between resizes — cache it so the scroll handler only
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

    let ticking = false;

    const onScroll = () => {
      if (ticking) {
        return;
      }

      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;

        if (blockWidth <= 0) {
          return;
        }

        if (el.scrollLeft <= edgeBuffer) {
          el.scrollLeft += blockWidth;
        } else if (el.scrollLeft >= maxScrollLeft - edgeBuffer) {
          el.scrollLeft -= blockWidth;
        }
      });
    };

    const onResize = () => {
      measure();
      centerChild(itemCount + initialIndex);
    };

    const ro = new ResizeObserver(onResize);
    ro.observe(el);

    measure();
    el.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, [scrollRef, itemCount, initialIndex]);
}

/**
 * Single-swipe paging assist for the center-snapped rail.
 *
 * `scroll-snap-stop: always` on near-full-width tiles makes a gentle thumb
 * swipe feel sticky: if the flick doesn't carry enough momentum past the snap
 * threshold the browser rubber-bands back to the current card, so the next clip
 * only half slides in and the user has to swipe twice. This watches each touch
 * gesture and, on release, commits to the adjacent card with a smooth
 * programmatic scroll whenever the swipe shows clear horizontal intent — even a
 * short, slow one — so one swipe always advances exactly one card.
 */
export function useCarouselSwipeAssist(
  scrollRef: RefObject<HTMLDivElement | null>,
) {
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }

    // Distance (px) or velocity (px/ms) at which a swipe counts as intentional.
    const DISTANCE_THRESHOLD = 20;
    const VELOCITY_THRESHOLD = 0.18;

    const cardStep = () => {
      const first = el.children[0] as HTMLElement | undefined;
      const second = el.children[1] as HTMLElement | undefined;
      if (!first || !second) {
        return 0;
      }
      return Math.abs(second.offsetLeft - first.offsetLeft);
    };

    let tracking = false;
    let startX = 0;
    let startY = 0;
    let startScrollLeft = 0;
    let startTime = 0;

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) {
        tracking = false;
        return;
      }
      tracking = true;
      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
      startScrollLeft = el.scrollLeft;
      startTime = event.timeStamp;
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (!tracking) {
        return;
      }
      tracking = false;

      const touch = event.changedTouches[0];
      if (!touch) {
        return;
      }

      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;

      // Defer to the page for vertical scrolls and ignore taps.
      if (Math.abs(dx) <= Math.abs(dy)) {
        return;
      }

      const elapsed = Math.max(event.timeStamp - startTime, 1);
      const velocity = Math.abs(dx) / elapsed;
      if (Math.abs(dx) < DISTANCE_THRESHOLD && velocity < VELOCITY_THRESHOLD) {
        return;
      }

      const step = cardStep();
      if (step <= 0) {
        return;
      }

      // Swipe left (dx < 0) reveals the next clip → scroll right by one card.
      const direction = dx < 0 ? 1 : -1;
      const maxScrollLeft = el.scrollWidth - el.clientWidth;
      const target = clampNumber(
        startScrollLeft + direction * step,
        0,
        maxScrollLeft,
      );

      el.scrollTo({ left: target, behavior: "smooth" });
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("touchcancel", onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
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
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const children = () => Array.from(el.children) as HTMLElement[];

    const resetStyles = () => {
      for (const child of children()) {
        child.style.transform = "";
        child.style.filter = "";
        child.style.zIndex = "";
      }
    };

    if (prefersReducedMotion) {
      resetStyles();
      return;
    }

    // Per-card geometry (center + width) is fixed until a resize, so we cache
    // the elements and their measurements once. Each scroll frame then performs
    // a single layout read (scrollLeft) followed by pure style writes — no
    // interleaved reads — which avoids the layout thrash that made the rail
    // feel shaky while dragging.
    let cards: HTMLElement[] = [];
    let geometry: { center: number; width: number }[] = [];
    let viewportWidth = el.clientWidth;

    const measure = () => {
      cards = children();
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
        card.style.transform = `translate3d(${pullX.toFixed(2)}px, 0, ${translateZ.toFixed(
          2,
        )}px) rotateY(${rotateY.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
        card.style.filter = `brightness(${brightness.toFixed(3)})`;
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
  }, [scrollRef]);
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
