"use client";

import { useScrollSnapshot } from "./use-coalesced-scroll";

/** Hero rest — bar is flush to the viewport bottom; past this it floats */
function getBottomBarDocked(scrollY: number, viewportHeight: number) {
  return scrollY <= viewportHeight * 0.12;
}

export function useBottomBarDocked() {
  const { scrollY, viewportHeight } = useScrollSnapshot();

  return {
    docked: getBottomBarDocked(scrollY, viewportHeight),
  };
}
