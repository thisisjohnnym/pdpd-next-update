"use client";

import { useEffect, useRef, useState } from "react";

type MountTransitionState = "open" | "closed";

/**
 * CSS-only presence: keeps a node mounted long enough to play an exit
 * transition. Pair with a class that reads `[data-state]` (e.g. `.pdp-pop`).
 *
 * - On open: mounts immediately, then flips to "open" on the next frame so the
 *   closed -> open transition runs.
 * - On close: flips to "closed", then unmounts after `durationMs`.
 */
export function useMountTransition(open: boolean, durationMs = 220) {
  const [mounted, setMounted] = useState(open);
  const [state, setState] = useState<MountTransitionState>(
    open ? "open" : "closed",
  );
  const frame = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    window.cancelAnimationFrame(frame.current);
    if (timer.current) {
      clearTimeout(timer.current);
    }

    if (open) {
      setMounted(true);
      // Two frames so the browser paints the closed state before transitioning.
      frame.current = window.requestAnimationFrame(() => {
        frame.current = window.requestAnimationFrame(() => setState("open"));
      });
    } else {
      setState("closed");
      timer.current = setTimeout(() => setMounted(false), durationMs);
    }

    return () => {
      window.cancelAnimationFrame(frame.current);
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [open, durationMs]);

  return { mounted, state };
}
