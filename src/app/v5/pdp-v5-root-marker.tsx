"use client";

import { useEffect } from "react";

/**
 * Marks `<html>` with data-pdp-version="v5" so v5-scoped CSS also reaches
 * portaled chrome (floating CTA) that mounts on document.body.
 */
export function PdpV5RootMarker() {
  useEffect(() => {
    document.documentElement.setAttribute("data-pdp-version", "v5");
    return () => {
      document.documentElement.removeAttribute("data-pdp-version");
    };
  }, []);

  return null;
}
