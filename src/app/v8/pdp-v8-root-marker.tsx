"use client";

import { useEffect } from "react";

/**
 * Marks `<html>` with data-pdp-version="v8" so v8-scoped CSS also reaches
 * portaled chrome (floating CTA) that mounts on document.body.
 */
export function PdpV8RootMarker() {
  useEffect(() => {
    document.documentElement.setAttribute("data-pdp-version", "v8");
    return () => {
      document.documentElement.removeAttribute("data-pdp-version");
    };
  }, []);

  return null;
}
