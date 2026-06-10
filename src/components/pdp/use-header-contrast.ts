"use client";

import { useEffect, useState, type RefObject } from "react";

import {
  luminanceToForeground,
  sampleBackdropLuminance,
  type HeaderForeground,
} from "@/lib/header-contrast";

export function useHeaderContrast(
  headerRef: RefObject<HTMLElement | null>,
): HeaderForeground {
  const [foreground, setForeground] = useState<HeaderForeground>("light");

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      const header = headerRef.current;
      if (!header) return;

      const rect = header.getBoundingClientRect();
      if (rect.height <= 0 || rect.width <= 0) return;

      const luminance = sampleBackdropLuminance(rect);
      if (luminance === null) return;

      setForeground((current) => {
        const next = luminanceToForeground(luminance, current);
        return next === current ? current : next;
      });
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        measure();
      });
    };

    const handleImageLoad = () => schedule();

    const bindImageLoads = () => {
      document.querySelectorAll("img").forEach((img) => {
        if (!img.complete) {
          img.addEventListener("load", handleImageLoad, { once: true });
        }
      });
    };

    schedule();
    bindImageLoads();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    const observer = new MutationObserver(() => {
      bindImageLoads();
      schedule();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [headerRef]);

  return foreground;
}
