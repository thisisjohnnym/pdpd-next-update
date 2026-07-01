"use client";

import { useEffect, useRef, useState } from "react";

import { useReducedMotion } from "./use-reduced-motion";

const EPSILON = 0.0005;

type UseRafLerpOptions = {
  smoothing?: number;
  enabled?: boolean;
};

/** Smoothly chase a numeric target each frame — snaps when reduced motion is on */
export function useRafLerp(target: number, options: UseRafLerpOptions = {}) {
  const reducedMotion = useReducedMotion();
  const { smoothing = 0.16, enabled = true } = options;
  const shouldSnap = !enabled || reducedMotion;
  const [value, setValue] = useState(target);
  const valueRef = useRef(target);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    if (shouldSnap) {
      return;
    }

    let active = true;
    let frame = 0;

    const step = () => {
      if (!active) {
        return;
      }

      const delta = target - valueRef.current;
      if (Math.abs(delta) <= EPSILON) {
        if (valueRef.current !== target) {
          valueRef.current = target;
          setValue(target);
        }
      } else {
        const next = valueRef.current + delta * smoothing;
        valueRef.current = next;
        setValue(next);
      }

      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);

    return () => {
      active = false;
      cancelAnimationFrame(frame);
    };
  }, [target, smoothing, shouldSnap]);

  return shouldSnap ? target : value;
}
