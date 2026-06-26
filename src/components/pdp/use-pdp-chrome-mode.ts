"use client";

import {
  PDP_CHAPTERS,
  pdpChapterAnchorId,
  type PdpChapter,
} from "./pdp-section-chapters";
import { useScrollSnapshot } from "./use-coalesced-scroll";

/** Approx header height (safe-area + nav row) — keeps the active probe under the header */
export const PDP_CHROME_HEADER_OFFSET = 72;

/**
 * The jump bar replaces the CTA only once we're past the 2nd chapter
 * (index 1 = "The Details"), i.e. when the active chapter is index >= 2.
 */
const SWAP_CHAPTER_INDEX = 2;

export type PresentChapter = PdpChapter & { top: number };

/** Chapters currently mounted in the DOM, sorted by document position */
function readPresentChapters(scrollY: number): PresentChapter[] {
  if (typeof document === "undefined") {
    return [];
  }

  return PDP_CHAPTERS.flatMap((chapter) => {
    const el = document.getElementById(pdpChapterAnchorId(chapter.id));
    if (!el) {
      return [];
    }
    const top = el.getBoundingClientRect().top + scrollY;
    return [{ ...chapter, top }];
  }).sort((a, b) => a.top - b.top);
}

export type PdpChromeMode = {
  chapters: PresentChapter[];
  activeIndex: number;
  active: PresentChapter | undefined;
  progress: number;
  pastHero: boolean;
  /**
   * Jump bar is shown (and the CTA is hidden) — past the 2nd chapter while
   * scrolling down. Scrolling back up flips this off so the CTA returns.
   */
  jumpBarActive: boolean;
};

/**
 * Single source of truth for the bottom-chrome swap: derives the active
 * chapter and whether the jump bar (rather than the CTA) should be visible.
 * Pure derivation from the shared scroll snapshot, so multiple consumers stay
 * in sync without extra state.
 */
// fallow-ignore-next-line complexity
export function usePdpChromeMode(mounted: boolean): PdpChromeMode {
  const { scrollY, viewportHeight, direction } = useScrollSnapshot();

  const chapters = mounted ? readPresentChapters(scrollY) : [];
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

  const pastSwapPoint = activeIndex >= SWAP_CHAPTER_INDEX;
  const jumpBarActive =
    pastHero && pastSwapPoint && direction === "down" && chapters.length > 0;

  return {
    chapters,
    activeIndex,
    active: chapters[activeIndex],
    progress,
    pastHero,
    jumpBarActive,
  };
}
