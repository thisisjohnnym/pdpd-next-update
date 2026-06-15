"use client";

import { type RefObject, useEffect } from "react";

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

    const getBlockWidth = () => {
      if (itemCount < 2) {
        return 0;
      }

      const blockStart = getChild(itemCount);
      const nextBlockStart = getChild(2 * itemCount);
      if (!blockStart || !nextBlockStart) {
        return 0;
      }

      return nextBlockStart.offsetLeft - blockStart.offsetLeft;
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
    let ticking = false;

    const onScroll = () => {
      if (ticking) {
        return;
      }

      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;

        const blockWidth = getBlockWidth();
        if (blockWidth <= 0) {
          return;
        }

        const maxScrollLeft = el.scrollWidth - el.clientWidth;

        if (el.scrollLeft <= edgeBuffer) {
          el.scrollLeft += blockWidth;
        } else if (el.scrollLeft >= maxScrollLeft - edgeBuffer) {
          el.scrollLeft -= blockWidth;
        }
      });
    };

    const onResize = () => centerChild(itemCount + initialIndex);

    const ro = new ResizeObserver(onResize);
    ro.observe(el);

    el.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, [scrollRef, itemCount, initialIndex]);
}
