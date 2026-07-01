"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useShouldRun } from "./use-should-run";
import { useReducedMotion } from "./use-reduced-motion";

type UseWeightLiftOptions = {
  holdMs: number;
  onLift?: () => void;
};

/** Movement before hold commits — treat as vertical scroll, cancel lift */
const SCROLL_CANCEL_PX = 12;

/** Press-and-hold lift — progress fills, haptic at completion, resets on release */
export function useWeightLift({ holdMs, onLift }: UseWeightLiftOptions) {
  const shouldRun = useShouldRun();
  const reducedMotion = useReducedMotion();
  const holdMsRef = useRef(holdMs);
  const onLiftRef = useRef(onLift);
  const isHoldingRef = useRef(false);
  const hapticFiredRef = useRef(false);
  const pendingRef = useRef(false);
  const commitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number | null>(null);

  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);

  holdMsRef.current = holdMs;
  onLiftRef.current = onLift;

  const cancelAnimation = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const resetHold = useCallback(() => {
    if (commitTimerRef.current !== null) {
      clearTimeout(commitTimerRef.current);
      commitTimerRef.current = null;
    }
    pendingRef.current = false;
    isHoldingRef.current = false;
    hapticFiredRef.current = false;
    startTimeRef.current = null;
    startPosRef.current = null;
    cancelAnimation();
    setIsHolding(false);
    setProgress(0);
  }, [cancelAnimation]);

  const tick = useCallback(
    function runTick(now: number) {
      if (!isHoldingRef.current || startTimeRef.current === null || !shouldRun) {
        return;
      }

      if (reducedMotion) {
        return;
      }

      const elapsed = now - startTimeRef.current;
      const nextProgress = Math.min(elapsed / holdMsRef.current, 1);
      setProgress(nextProgress);

      if (nextProgress >= 1 && !hapticFiredRef.current) {
        hapticFiredRef.current = true;
        onLiftRef.current?.();
      }

      if (nextProgress < 1) {
        rafRef.current = requestAnimationFrame(runTick);
      }
    },
    [shouldRun, reducedMotion],
  );

  const commitHold = useCallback(
    (target: HTMLElement, pointerId: number) => {
      pendingRef.current = false;
      isHoldingRef.current = true;
      hapticFiredRef.current = false;
      startTimeRef.current = performance.now();
      setIsHolding(true);
      setProgress(0);
      cancelAnimation();

      try {
        target.setPointerCapture(pointerId);
      } catch {
        /* pointer may have lifted */
      }

      if (reducedMotion) {
        commitTimerRef.current = setTimeout(() => {
          commitTimerRef.current = null;
          if (!isHoldingRef.current) {
            return;
          }
          setProgress(1);
          if (!hapticFiredRef.current) {
            hapticFiredRef.current = true;
            onLiftRef.current?.();
          }
        }, holdMsRef.current);
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    },
    [cancelAnimation, reducedMotion, tick],
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      pendingRef.current = true;
      startPosRef.current = { x: event.clientX, y: event.clientY };
      if (event.pointerType !== "touch") {
        commitHold(event.currentTarget, event.pointerId);
        return;
      }

      const target = event.currentTarget;
      const pointerId = event.pointerId;

      commitTimerRef.current = setTimeout(() => {
        commitTimerRef.current = null;
        if (pendingRef.current) {
          commitHold(target, pointerId);
        }
      }, 80);
    },
    [commitHold],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!pendingRef.current || isHoldingRef.current) {
        return;
      }

      const start = startPosRef.current;
      if (!start) {
        return;
      }

      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;

      if (Math.abs(dy) > SCROLL_CANCEL_PX && Math.abs(dy) > Math.abs(dx)) {        if (commitTimerRef.current !== null) {
          clearTimeout(commitTimerRef.current);
          commitTimerRef.current = null;
        }
        pendingRef.current = false;
        startPosRef.current = null;
        return;
      }

      if (event.pointerType === "touch" && pendingRef.current) {
        if (commitTimerRef.current !== null) {
          clearTimeout(commitTimerRef.current);
          commitTimerRef.current = null;
        }
        commitHold(event.currentTarget, event.pointerId);
      }
    },
    [commitHold],
  );

  const handleContextMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
  }, []);

  const handlePointerEnd = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }

      resetHold();
    },
    [resetHold],
  );

  useEffect(() => {
    if (shouldRun) {
      return;
    }

    resetHold();
  }, [shouldRun, resetHold]);

  useEffect(() => cancelAnimation, [cancelAnimation]);

  return {
    progress,
    isHolding,
    handlePointerDown,
    handlePointerMove,
    handlePointerEnd,
    handleContextMenu,
  };
}
