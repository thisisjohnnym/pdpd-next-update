"use client";

import { useEffect } from "react";

/**
 * Marks `<html>` with data-pdp-version="v3" so v3-scoped CSS also reaches
 * portaled chrome (floating CTA) that mounts on document.body.
 */
export function PdpV3RootMarker() {
  useEffect(() => {
    document.documentElement.setAttribute("data-pdp-version", "v3");
    return () => {
      document.documentElement.removeAttribute("data-pdp-version");
    };
  }, []);

  return null;
}
