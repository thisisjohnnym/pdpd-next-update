"use client";

import { useEffect, useState } from "react";

const MAX_BROWSER_CHROME = 112;

/** Obscured layout space below the visual viewport (mobile browser toolbars) */
function readBrowserBottomInset(): number {
  if (typeof window === "undefined") {
    return 0;
  }

  const viewport = window.visualViewport;
  if (!viewport) {
    return 0;
  }

  const obscured = window.innerHeight - viewport.height - viewport.offsetTop;

  // Soft keyboard — don't lift the bar with the keyboard
  if (viewport.height < window.innerHeight * 0.6) {
    return 0;
  }

  return Math.min(Math.max(0, obscured), MAX_BROWSER_CHROME);
}

/** Track Safari/Chrome bottom toolbar show/hide via Visual Viewport API */
export function useBrowserBottomInset() {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    const update = () => {
      setInset(readBrowserBottomInset());
    };

    update();

    const viewport = window.visualViewport;
    viewport?.addEventListener("resize", update);
    viewport?.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);

    return () => {
      viewport?.removeEventListener("resize", update);
      viewport?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return inset;
}

/** Sync --pdp-browser-bottom-inset for scroll padding / HUD offsets */
export function useBrowserBottomInsetCssVar() {
  const inset = useBrowserBottomInset();

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--pdp-browser-bottom-inset",
      `${inset}px`,
    );

    return () => {
      document.documentElement.style.removeProperty("--pdp-browser-bottom-inset");
    };
  }, [inset]);
}
