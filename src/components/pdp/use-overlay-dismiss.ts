"use client";

import { useEffect, useState } from "react";

/**
 * Shared chrome for PDP overlays (bottom sheets, menus): defers the first paint
 * until mounted so portals are SSR-safe, locks body scroll while open, and wires
 * Escape-to-close. Returns whether the overlay has mounted.
 */
export function useOverlayDismiss(open: boolean, onClose: () => void): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  return mounted;
}
