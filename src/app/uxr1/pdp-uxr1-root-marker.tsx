"use client";

import { useLayoutEffect } from "react";

/**
 * Marks `<html>` with data-pdp-version="v5" so v5-scoped CSS reaches
 * portaled chrome. Preserves the attr while the shopper stays on /uxr1.
 */
export function PdpUxr1RootMarker() {
  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-pdp-version", "v5");
    return () => {
      if (typeof location !== "undefined" && /^\/uxr1(\/|$)/.test(location.pathname)) {
        return;
      }
      document.documentElement.removeAttribute("data-pdp-version");
    };
  }, []);

  return null;
}
