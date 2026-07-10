"use client";

import { useLayoutEffect } from "react";

/**
 * Marks `<html>` with data-pdp-version="v6" so v6-scoped CSS also reaches
 * portaled chrome (floating CTA) that mounts on document.body.
 * useLayoutEffect — before paint, so intro chrome hide rules apply immediately.
 */
export function PdpV6RootMarker() {
  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-pdp-version", "v6");
    return () => {
      // Keep attr on Strict Mode remount — clearing it flashes intro chrome.
      if (typeof location !== "undefined" && /^\/v6(\/|$)/.test(location.pathname)) {
        return;
      }
      document.documentElement.removeAttribute("data-pdp-version");
    };
  }, []);

  return null;
}
