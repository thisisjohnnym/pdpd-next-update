"use client";

import { useEffect } from "react";

/**
 * Marks `<html>` with data-pdp-version="v7" so v7-scoped CSS also reaches
 * portaled chrome (floating CTA) that mounts on document.body.
 */
export function PdpV7RootMarker() {
  useEffect(() => {
    document.documentElement.setAttribute("data-pdp-version", "v7");
    return () => {
      document.documentElement.removeAttribute("data-pdp-version");
    };
  }, []);

  return null;
}
