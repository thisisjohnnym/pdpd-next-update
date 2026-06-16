"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Point = { x: number; y: number };
type Size = { width: number; height: number };
type LensPosition = Point & { xPct: number; yPct: number };

const HOLD_MS = 380;
/** Vertical movement before hold cancels — user is scrolling the gallery */
const SCROLL_CANCEL_PX = 14;

type Phase = "idle" | "holding" | "zooming";

function localPoint(clientX: number, clientY: number, rect: DOMRect): Point {
  return {
    x: Math.max(0, Math.min(clientX - rect.left, rect.width)),
    y: Math.max(0, Math.min(clientY - rect.top, rect.height)),
  };
}

function exploreHaptic() {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(10);
  }
}

/** Press-and-hold magnifier lens — touch needs a short hold; mouse activates immediately */
export function useDragZoomLens() {
  const containerRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<Phase>("idle");
  const pointerIdRef = useRef<number | null>(null);
  const touchOriginRef = useRef<Point | null>(null);
  const holdStartMsRef = useRef(0);
  const holdRafRef = useRef<number | null>(null);

  const [phase, setPhase] = useState<Phase>("idle");
  const [holdProgress, setHoldProgress] = useState(0);
  const [holdAnchor, setHoldAnchor] = useState<Point | null>(null);
  const [lensPosition, setLensPosition] = useState<LensPosition | null>(null);
  const [containerSize, setContainerSize] = useState<Size>({ width: 0, height: 0 });
  const [pointerType, setPointerType] = useState<React.PointerEvent["pointerType"] | null>(
    null,
  );

  const setPhaseSafe = useCallback((next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  const stopHoldRaf = useCallback(() => {
    if (holdRafRef.current !== null) {
      cancelAnimationFrame(holdRafRef.current);
      holdRafRef.current = null;
    }
  }, []);

  const updateLens = useCallback((clientX: number, clientY: number) => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const rect = container.getBoundingClientRect();
    const point = localPoint(clientX, clientY, rect);

    setContainerSize({ width: rect.width, height: rect.height });
    setLensPosition({
      x: point.x,
      y: point.y,
      xPct: rect.width > 0 ? (point.x / rect.width) * 100 : 0,
      yPct: rect.height > 0 ? (point.y / rect.height) * 100 : 0,
    });
  }, []);

  const updateHoldAnchor = useCallback((clientX: number, clientY: number) => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    setHoldAnchor(localPoint(clientX, clientY, container.getBoundingClientRect()));
  }, []);

  const release = useCallback(
    (target?: HTMLDivElement | null, pointerId?: number) => {
      const el = target ?? containerRef.current;
      stopHoldRaf();

      const pid = pointerId ?? pointerIdRef.current;
      if (el && pid !== null && el.hasPointerCapture(pid)) {
        try {
          el.releasePointerCapture(pid);
        } catch {
          /* already released */
        }
      }

      if (el) {
        el.classList.remove("touch-none");
        el.style.removeProperty("touch-action");
      }

      pointerIdRef.current = null;
      touchOriginRef.current = null;
      holdStartMsRef.current = 0;
      setPhaseSafe("idle");
      setHoldProgress(0);
      setHoldAnchor(null);
      setLensPosition(null);
      setPointerType(null);
    },
    [setPhaseSafe, stopHoldRaf],
  );

  const activateZoom = useCallback(
    (
      target: HTMLDivElement,
      pointerId: number,
      type: React.PointerEvent["pointerType"],
      clientX: number,
      clientY: number,
    ) => {
      stopHoldRaf();
      setHoldProgress(1);
      setHoldAnchor(null);

      target.classList.add("touch-none");
      target.style.touchAction = "none";

      try {
        target.setPointerCapture(pointerId);
      } catch {
        release(target, pointerId);
        return;
      }

      pointerIdRef.current = pointerId;
      setPointerType(type);
      setPhaseSafe("zooming");
      updateLens(clientX, clientY);

      if (type === "touch") {
        exploreHaptic();
      }
    },
    [release, setPhaseSafe, stopHoldRaf, updateLens],
  );

  const startHoldLoop = useCallback(
    (target: HTMLDivElement, pointerId: number) => {
      stopHoldRaf();
      holdStartMsRef.current = performance.now();
      setHoldProgress(0);

      const tick = (now: number) => {
        if (phaseRef.current !== "holding" || pointerIdRef.current !== pointerId) {
          return;
        }

        const elapsed = now - holdStartMsRef.current;
        setHoldProgress(Math.min(elapsed / HOLD_MS, 1));

        if (elapsed >= HOLD_MS) {
          const origin = touchOriginRef.current;
          if (origin) {
            activateZoom(target, pointerId, "touch", origin.x, origin.y);
          }
          return;
        }

        holdRafRef.current = requestAnimationFrame(tick);
      };

      holdRafRef.current = requestAnimationFrame(tick);
    },
    [activateZoom, stopHoldRaf],
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === "mouse" && event.button !== 0) {
        return;
      }

      if (phaseRef.current === "zooming") {
        release(event.currentTarget, event.pointerId);
        return;
      }

      const target = event.currentTarget;

      if (event.pointerType === "touch") {
        pointerIdRef.current = event.pointerId;
        touchOriginRef.current = { x: event.clientX, y: event.clientY };
        setPhaseSafe("holding");
        updateHoldAnchor(event.clientX, event.clientY);
        startHoldLoop(target, event.pointerId);
        return;
      }

      activateZoom(target, event.pointerId, event.pointerType, event.clientX, event.clientY);
    },
    [activateZoom, release, setPhaseSafe, startHoldLoop, updateHoldAnchor],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (pointerIdRef.current !== event.pointerId) {
        return;
      }

      if (phaseRef.current === "holding" && event.pointerType === "touch") {
        const origin = touchOriginRef.current;
        if (origin) {
          const dx = event.clientX - origin.x;
          const dy = event.clientY - origin.y;

          if (Math.abs(dy) > SCROLL_CANCEL_PX && Math.abs(dy) > Math.abs(dx)) {
            release(event.currentTarget, event.pointerId);
            return;
          }
        }

        updateHoldAnchor(event.clientX, event.clientY);

        const elapsed = performance.now() - holdStartMsRef.current;
        if (elapsed >= HOLD_MS) {
          activateZoom(
            event.currentTarget,
            event.pointerId,
            "touch",
            event.clientX,
            event.clientY,
          );
        }
        return;
      }

      if (phaseRef.current !== "zooming") {
        return;
      }

      event.preventDefault();
      updateLens(event.clientX, event.clientY);
    },
    [activateZoom, release, updateHoldAnchor, updateLens],
  );

  const handlePointerEnd = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (pointerIdRef.current !== event.pointerId) {
        return;
      }

      release(event.currentTarget, event.pointerId);
    },
    [release],
  );

  const handleLostPointerCapture = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (pointerIdRef.current !== event.pointerId) {
        return;
      }

      release(event.currentTarget, event.pointerId);
    },
    [release],
  );

  const handleContextMenu = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  useEffect(() => () => stopHoldRaf(), [stopHoldRaf]);

  useEffect(() => {
    const onBlur = () => release(containerRef.current);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("blur", onBlur);
      release(containerRef.current);
    };
  }, [release]);

  return {
    containerRef,
    lensPosition,
    containerSize,
    isZooming: phase === "zooming",
    isHolding: phase === "holding",
    holdProgress,
    holdAnchor,
    pointerType,
    handlePointerDown,
    handlePointerMove,
    handlePointerEnd,
    handleLostPointerCapture,
    handleContextMenu,
  };
}
