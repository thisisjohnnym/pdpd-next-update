"use client";

import { useLayoutEffect } from "react";

/**
 * Marks `<html>` with data-pdp-version="fc01v" so fc01v-scoped CSS also
 * reaches portaled chrome (floating CTA) that mounts on document.body.
 * useLayoutEffect — before paint, so intro chrome hide rules apply immediately.
 */
export function PdpFc01vRootMarker() {
  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-pdp-version", "fc01v");
    return () => {
      // Keep attr on Strict Mode remount — clearing it flashes intro chrome.
      if (typeof location !== "undefined" && /^\/fc01v(\/|$)/.test(location.pathname)) {
        return;
      }
      document.documentElement.removeAttribute("data-pdp-version");
    };
  }, []);

  return null;
}
