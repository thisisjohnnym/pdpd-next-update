"use client";

import { useEffect } from "react";

/**
 * Marks `<html>` with data-pdp-version="v2" so v2-scoped CSS also reaches
 * portaled chrome (bottom CTA, jump bar) that mounts on document.body.
 */
export function PdpV2RootMarker() {
  useEffect(() => {
    document.documentElement.setAttribute("data-pdp-version", "v2");
    return () => {
      document.documentElement.removeAttribute("data-pdp-version");
    };
  }, []);

  return null;
}
