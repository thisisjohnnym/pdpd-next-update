"use client";

import { useLayoutEffect } from "react";

/**
 * Marks `<html>` with data-pdp-version="v7" so v7-scoped CSS reaches
 * portaled chrome. Preserves the attr while the shopper stays on /uxr3.
 */
export function PdpUxr3RootMarker() {
  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-pdp-version", "v7");
    return () => {
      if (typeof location !== "undefined" && /^\/uxr3(\/|$)/.test(location.pathname)) {
        return;
      }
      document.documentElement.removeAttribute("data-pdp-version");
    };
  }, []);

  return null;
}
