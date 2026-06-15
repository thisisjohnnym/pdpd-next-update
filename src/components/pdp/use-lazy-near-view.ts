"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

/** Mount children one viewport before they enter the scrollport */
export function useLazyNearView(
  ref: RefObject<HTMLElement | null>,
  enabled: boolean,
): boolean {
  const [nearView, setNearView] = useState(() => !enabled);

  useLayoutEffect(() => {
    if (!enabled || nearView) {
      return;
    }

    const node = ref.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearView(true);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px 100% 0px" },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [enabled, nearView, ref]);

  return nearView;
}
