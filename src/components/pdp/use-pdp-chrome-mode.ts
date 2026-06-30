"use client";

import { useSyncExternalStore } from "react";

import {
  PDP_CHAPTERS,
  pdpChapterAnchorId,
  type PdpChapter,
} from "./pdp-section-chapters";
import {
  getScrollSnapshot,
  subscribeScrollSnapshot,
  useScrollSnapshot,
} from "./use-coalesced-scroll";

/** Approx header height (safe-area + nav row) — keeps the active probe under the header */
export const PDP_CHROME_HEADER_OFFSET = 72;

/**
 * Jump bar replaces the CTA once the reader reaches "The Details"
 * (chapter index 1).
 */
const SWAP_CHAPTER_INDEX = 1;

/** Upward swipes required before the CTA replaces the jump bar */
const DISMISS_UP_GESTURES = 2;
/** Minimum net movement to count as one gesture */
const GESTURE_MIN_PX = 48;
/** Idle gap that ends the first buffered upward gesture */
const SCROLL_GESTURE_IDLE_MS = 140;

export type PresentChapter = PdpChapter & { top: number };

/** Chapters currently mounted in the DOM, sorted by document position */
function readPresentChapters(
  scrollY: number,
  chapterList: PdpChapter[] = PDP_CHAPTERS,
): PresentChapter[] {
  if (typeof document === "undefined") {
    return [];
  }

  return chapterList.flatMap((chapter) => {
    const el = document.getElementById(pdpChapterAnchorId(chapter.id));
    if (!el) {
      return [];
    }
    const top = el.getBoundingClientRect().top + scrollY;
    return [{ ...chapter, top }];
  }).sort((a, b) => a.top - b.top);
}

function readJumpBarEligible(scrollY: number, viewportHeight: number): boolean {
  const chapters = readPresentChapters(scrollY);
  if (chapters.length === 0 || viewportHeight <= 0) {
    return false;
  }

  const probe = scrollY + PDP_CHROME_HEADER_OFFSET + 8;
  let activeIndex = 0;
  chapters.forEach((chapter, index) => {
    if (chapter.top <= probe) {
      activeIndex = index;
    }
  });

  const pastHero = scrollY > viewportHeight * 0.85;
  const pastSwapPoint = activeIndex >= SWAP_CHAPTER_INDEX;
  return pastHero && pastSwapPoint;
}

/**
 * Shared state for jump bar ↔ CTA swap — one instance so all consumers stay
 * in sync (section indicator + bottom actions).
 *
 * jumpBarActive = eligible && !dismissedByUpGesture
 */
class JumpBarLatchStore {
  private dismissedByUpGesture = false;
  private jumpBarActive = false;
  private listeners = new Set<() => void>();
  private scrollUnsub: (() => void) | null = null;
  private upGestureCount = 0;
  private gestureStartScrollY = 0;
  private gestureIdleTimer: ReturnType<typeof setTimeout> | null = null;
  private initialized = false;

  subscribe = (onStoreChange: () => void): (() => void) => {
    const isFirst = this.listeners.size === 0;
    this.listeners.add(onStoreChange);

    if (isFirst) {
      this.scrollUnsub = subscribeScrollSnapshot(() => this.sync());
      this.sync();
    }

    return () => {
      this.listeners.delete(onStoreChange);
      if (this.listeners.size === 0) {
        this.scrollUnsub?.();
        this.scrollUnsub = null;
        this.clearGestureTimer();
      }
    };
  };

  getSnapshot = (): boolean => this.jumpBarActive;

  getServerSnapshot = (): boolean => false;

  private notify() {
    for (const listener of this.listeners) {
      listener();
    }
  }

  private setJumpBarActive(value: boolean) {
    if (this.jumpBarActive === value) {
      return;
    }

    this.jumpBarActive = value;
    this.notify();
  }

  private clearGestureTimer() {
    if (this.gestureIdleTimer !== null) {
      clearTimeout(this.gestureIdleTimer);
      this.gestureIdleTimer = null;
    }
  }

  private scheduleFirstUpGestureEnd() {
    this.clearGestureTimer();
    this.gestureIdleTimer = setTimeout(() => {
      this.gestureIdleTimer = null;

      if (this.dismissedByUpGesture) {
        return;
      }

      const { scrollY } = getScrollSnapshot();
      const netUp = this.gestureStartScrollY - scrollY;
      if (netUp >= GESTURE_MIN_PX) {
        this.upGestureCount = 1;
      }

      this.gestureStartScrollY = scrollY;
    }, SCROLL_GESTURE_IDLE_MS);
  }

  private tryImmediateDismiss(scrollY: number): boolean {
    if (this.upGestureCount < DISMISS_UP_GESTURES - 1) {
      return false;
    }

    const netUp = this.gestureStartScrollY - scrollY;
    if (netUp < GESTURE_MIN_PX) {
      return false;
    }

    this.dismissedByUpGesture = true;
    this.upGestureCount = 0;
    this.clearGestureTimer();
    this.setJumpBarActive(false);
    return true;
  }

  // fallow-ignore-next-line complexity
  private sync() {
    const { scrollY, viewportHeight } = getScrollSnapshot();
    const eligible = readJumpBarEligible(scrollY, viewportHeight);

    if (!this.initialized) {
      this.initialized = true;
      this.gestureStartScrollY = scrollY;
      this.setJumpBarActive(eligible && !this.dismissedByUpGesture);
      return;
    }

    const netDown = scrollY - this.gestureStartScrollY;
    const netUp = this.gestureStartScrollY - scrollY;

    if (!eligible) {
      this.dismissedByUpGesture = false;
      this.upGestureCount = 0;
      this.gestureStartScrollY = scrollY;
      this.clearGestureTimer();
      this.setJumpBarActive(false);
      return;
    }

    if (this.dismissedByUpGesture) {
      if (netDown >= GESTURE_MIN_PX) {
        this.dismissedByUpGesture = false;
        this.upGestureCount = 0;
        this.gestureStartScrollY = scrollY;
        this.clearGestureTimer();
        this.setJumpBarActive(true);
        return;
      }

      this.setJumpBarActive(false);
      return;
    }

    this.setJumpBarActive(true);

    if (netDown >= GESTURE_MIN_PX) {
      this.upGestureCount = 0;
      this.gestureStartScrollY = scrollY;
      this.clearGestureTimer();
      return;
    }

    if (this.tryImmediateDismiss(scrollY)) {
      return;
    }

    if (this.upGestureCount === 0 && netUp > 0) {
      this.scheduleFirstUpGestureEnd();
    }
  }
}

const jumpBarLatchStore = new JumpBarLatchStore();

function useJumpBarLatched(): boolean {
  return useSyncExternalStore(
    jumpBarLatchStore.subscribe,
    jumpBarLatchStore.getSnapshot,
    jumpBarLatchStore.getServerSnapshot,
  );
}

export type PdpChromeMode = {
  chapters: PresentChapter[];
  activeIndex: number;
  active: PresentChapter | undefined;
  progress: number;
  /** 0–1 scroll progress within the active chapter */
  sectionProgress: number;
  pastHero: boolean;
  direction: "up" | "down";
  /**
   * Jump bar is shown (and the CTA is hidden) — from "The Details" onward,
   * unless dismissed by a second upward swipe. Restored immediately on the
   * next downward swipe while still in the Details zone.
   */
  jumpBarActive: boolean;
};

/**
 * Single source of truth for the bottom-chrome swap: derives the active
 * chapter and whether the jump bar (rather than the CTA) should be visible.
 */
// fallow-ignore-next-line complexity
export function usePdpChromeMode(
  mounted: boolean,
  chapterList: PdpChapter[] = PDP_CHAPTERS,
): PdpChromeMode {
  const { scrollY, viewportHeight, direction } = useScrollSnapshot();
  const jumpBarActive = useJumpBarLatched();

  const chapters = mounted ? readPresentChapters(scrollY, chapterList) : [];
  const probe = scrollY + PDP_CHROME_HEADER_OFFSET + 8;
  let activeIndex = 0;
  chapters.forEach((chapter, index) => {
    if (chapter.top <= probe) {
      activeIndex = index;
    }
  });

  const pastHero = viewportHeight > 0 && scrollY > viewportHeight * 0.85;
  const scrollMax = mounted
    ? document.documentElement.scrollHeight - viewportHeight || 1
    : 1;
  const progress = Math.min(1, Math.max(0, scrollY / scrollMax));

  const sectionStart = chapters[activeIndex]?.top ?? 0;
  const sectionEnd =
    chapters[activeIndex + 1]?.top ??
    (mounted ? scrollMax + viewportHeight : sectionStart + 1);
  const sectionProgress =
    chapters.length > 0
      ? Math.min(
          1,
          Math.max(0, (scrollY - sectionStart) / Math.max(1, sectionEnd - sectionStart)),
        )
      : 0;

  return {
    chapters,
    activeIndex,
    active: chapters[activeIndex],
    progress,
    sectionProgress,
    pastHero,
    direction,
    jumpBarActive,
  };
}
