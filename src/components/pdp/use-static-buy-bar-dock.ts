// fallow-ignore-file unused-file
"use client";

import { useEffect, useState, type RefObject } from "react";

import { staticActionDockThreshold } from "./pdp-viewport-chrome";
import { useScrollSnapshot } from "./use-coalesced-scroll";

function readSafeBottomPx(): number {
  if (typeof window === "undefined") {
    return 0;
  }

  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--pdp-fixed-bottom-offset")
    .trim();

  if (!raw || !raw.endsWith("px")) {
    return 0;
  }

  return Number.parseFloat(raw);
}

/** True once the in-flow buy bar scrolls above the fixed bottom slot */
export function useStaticBuyBarDock(
  anchorRef: RefObject<HTMLElement | null>,
): boolean {
  const { scrollY, viewportHeight } = useScrollSnapshot();
  const [docked, setDocked] = useState(false);

  useEffect(() => {
    const anchor = anchorRef.current;

    if (!anchor || viewportHeight === 0) {
      return;
    }

    const rect = anchor.getBoundingClientRect();
    const threshold = staticActionDockThreshold(
      viewportHeight,
      false,
      readSafeBottomPx(),
    );

    setDocked(rect.bottom < threshold);
  }, [anchorRef, scrollY, viewportHeight]);

  return docked;
}
