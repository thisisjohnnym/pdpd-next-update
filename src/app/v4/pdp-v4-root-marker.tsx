"use client";

import { useEffect } from "react";

/**
 * Marks `<html>` with data-pdp-version="v4" so v4-scoped CSS also reaches
 * portaled chrome (floating CTA) that mounts on document.body.
 */
export function PdpV4RootMarker() {
  useEffect(() => {
    document.documentElement.setAttribute("data-pdp-version", "v4");
    return () => {
      document.documentElement.removeAttribute("data-pdp-version");
    };
  }, []);

  return null;
}
