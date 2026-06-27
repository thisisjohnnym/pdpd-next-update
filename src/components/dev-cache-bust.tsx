"use client";

import { useEffect } from "react";

/**
 * Dev only — iOS Safari back-forward cache can restore a tab with stale JS
 * bundles when testing over LAN. Reload so the latest dev build is used.
 */
export function DevCacheBust() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      return;
    }

    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        window.location.reload();
      }
    };

    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  return null;
}
