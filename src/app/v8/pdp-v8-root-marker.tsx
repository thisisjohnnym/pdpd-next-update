"use client";

import { useLayoutEffect } from "react";

/**
 * Marks `<html>` with data-pdp-version="v8" so v8-scoped CSS reaches portaled
 * chrome (floating CTA) that mounts on document.body.
 */
export function PdpV8RootMarker() {
  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-pdp-version", "v8");
    return () => {
      if (typeof location !== "undefined" && /^\/v8(\/|$)/.test(location.pathname)) {
        return;
      }
      document.documentElement.removeAttribute("data-pdp-version");
    };
  }, []);

  return null;
}
