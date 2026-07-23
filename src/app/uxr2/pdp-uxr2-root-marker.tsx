"use client";

import { useLayoutEffect } from "react";

/**
 * Marks `<html>` with data-pdp-version="v6" so v6-scoped CSS reaches
 * portaled chrome. Preserves the attr while the shopper stays on /uxr2.
 */
export function PdpUxr2RootMarker() {
  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-pdp-version", "v6");
    return () => {
      if (typeof location !== "undefined" && /^\/uxr2(\/|$)/.test(location.pathname)) {
        return;
      }
      document.documentElement.removeAttribute("data-pdp-version");
    };
  }, []);

  return null;
}
