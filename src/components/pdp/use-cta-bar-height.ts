"use client";

import { useEffect, type RefObject } from "react";

/** Measure floating CTA bar and publish --cta-bar-height for Phone padding (docs/pdp-hero-chrome.md). */
export function useCtaBarHeight(
  ref: RefObject<HTMLElement | null>,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const node = ref.current;
    if (!node || typeof ResizeObserver === "undefined") {
      return;
    }

    const publish = () => {
      const height = node.getBoundingClientRect().height;
      document.documentElement.style.setProperty("--cta-bar-height", `${height}px`);
      window.dispatchEvent(new Event("pdp-cta-bar-height"));
    };

    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(node);

    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--cta-bar-height");
    };
  }, [ref, enabled]);
}
