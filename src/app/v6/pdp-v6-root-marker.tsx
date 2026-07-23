"use client";

import { useEffect } from "react";

/**
 * Marks `<html>` with data-pdp-version="v6" so v6-scoped CSS also reaches
 * portaled chrome (floating CTA) that mounts on document.body.
 */
export function PdpV6RootMarker() {
  useEffect(() => {
    document.documentElement.setAttribute("data-pdp-version", "v6");
    return () => {
      document.documentElement.removeAttribute("data-pdp-version");
    };
  }, []);

  return null;
}
