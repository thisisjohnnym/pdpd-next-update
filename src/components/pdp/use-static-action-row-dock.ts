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

  if (!raw) {
    return 0;
  }

  if (raw.endsWith("px")) {
    return Number.parseFloat(raw);
  }

  return 0;
}

/** True once the in-flow social row scrolls above the buy bar — show fixed dock */
export function useStaticActionRowDock(
  anchorRef: RefObject<HTMLElement | null>,
  buyBarDocked: boolean,
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
      buyBarDocked,
      readSafeBottomPx(),
    );

    setDocked(rect.bottom < threshold);
  }, [anchorRef, buyBarDocked, scrollY, viewportHeight]);

  return docked;
}
