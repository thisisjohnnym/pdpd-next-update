"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { PdpMaterialExploreZone } from "./pdp-data";

type ExplorePosition = {
  x: number;
  y: number;
  xPct: number;
  yPct: number;
};

type ContainerSize = {
  width: number;
  height: number;
};

/** Touch hold duration before zoom lens activates */
const TOUCH_HOLD_MS = 400;
/** Defer scroll lock until hold intent is clear — quick swipes can still scroll */
const HOLD_LOCK_MS = 80;
/** Movement before hold commits — treat as vertical scroll, cancel zoom */
const SCROLL_CANCEL_PX = 12;

function lockTouchTarget(target: HTMLDivElement) {
  target.classList.add("touch-none");
  target.style.touchAction = "none";
}

function unlockTouchTarget(target: HTMLDivElement) {
  target.classList.remove("touch-none");
  target.style.removeProperty("touch-action");
}

function triggerExploreHaptic() {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(12);
  }
}

function getActiveZone(
  xPct: number,
  yPct: number,
  zones: readonly PdpMaterialExploreZone[],
): PdpMaterialExploreZone | null {
  return (
    zones.find(
      (zone) =>
        xPct >= zone.x &&
        xPct <= zone.x + zone.width &&
        yPct >= zone.y &&
        yPct <= zone.y + zone.height,
    ) ?? null
  );
}

/** Pointer-driven microscope lens — hold then drag on touch; instant drag on mouse */
export function useMaterialExplore(zones: readonly PdpMaterialExploreZone[]) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isExploringRef = useRef(false);
  const isPendingHoldRef = useRef(false);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingPointerIdRef = useRef<number | null>(null);
  const activePointerIdRef = useRef<number | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const lastPointerPosRef = useRef<{ x: number; y: number } | null>(null);
  const holdStartMsRef = useRef<number | null>(null);
  const holdRafRef = useRef<number | null>(null);
  const [position, setPosition] = useState<ExplorePosition | null>(null);
  const [containerSize, setContainerSize] = useState<ContainerSize>({ width: 0, height: 0 });
  const [isExploring, setIsExploring] = useState(false);
  const [isPendingHold, setIsPendingHold] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [holdAnchor, setHoldAnchor] = useState<{ x: number; y: number } | null>(null);
  const [pointerType, setPointerType] = useState<React.PointerEvent["pointerType"] | null>(
    null,
  );

  const updatePosition = useCallback((clientX: number, clientY: number) => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const rect = container.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(clientY - rect.top, rect.height));

    setContainerSize({ width: rect.width, height: rect.height });
    setPosition({
      x,
      y,
      xPct: (x / rect.width) * 100,
      yPct: (y / rect.height) * 100,
    });
  }, []);

  const cancelHoldAnimation = useCallback(() => {
    if (holdRafRef.current !== null) {
      cancelAnimationFrame(holdRafRef.current);
      holdRafRef.current = null;
    }
  }, []);

  const updateHoldAnchor = useCallback((clientX: number, clientY: number) => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const rect = container.getBoundingClientRect();
    setHoldAnchor({
      x: Math.max(0, Math.min(clientX - rect.left, rect.width)),
      y: Math.max(0, Math.min(clientY - rect.top, rect.height)),
    });
  }, []);

  const ensurePendingLock = useCallback((target: HTMLDivElement, pointerId: number) => {
    if (target.classList.contains("touch-none")) {
      return;
    }

    lockTouchTarget(target);

    try {
      target.setPointerCapture(pointerId);
    } catch {
      /* pointer may have lifted */
    }
  }, []);

  const tickHoldProgress = useCallback(
    function runTick(now: number) {
      if (!isPendingHoldRef.current || holdStartMsRef.current === null) {
        return;
      }

      const elapsed = now - holdStartMsRef.current;
      const nextProgress = Math.min(elapsed / TOUCH_HOLD_MS, 1);
      setHoldProgress(nextProgress);

      if (
        elapsed >= HOLD_LOCK_MS &&
        pendingPointerIdRef.current !== null &&
        containerRef.current
      ) {
        ensurePendingLock(containerRef.current, pendingPointerIdRef.current);
      }

      if (nextProgress < 1 && isPendingHoldRef.current) {
        holdRafRef.current = requestAnimationFrame(runTick);
      }
    },
    [ensurePendingLock],
  );

  const startHoldProgress = useCallback(() => {
    cancelHoldAnimation();
    setHoldProgress(0);
    holdRafRef.current = requestAnimationFrame(tickHoldProgress);
  }, [cancelHoldAnimation, tickHoldProgress]);

  const clearTouchHold = useCallback(() => {
    cancelHoldAnimation();

    if (holdTimerRef.current !== null) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }

    pendingPointerIdRef.current = null;
    touchStartRef.current = null;
    lastPointerPosRef.current = null;
    holdStartMsRef.current = null;
    isPendingHoldRef.current = false;
    setHoldProgress(0);
    setHoldAnchor(null);
    setIsPendingHold(false);
  }, [cancelHoldAnimation]);

  const resetExplore = useCallback(
    (target?: HTMLDivElement | null, pointerId?: number) => {
      const container = target ?? containerRef.current;
      clearTouchHold();

      if (
        container &&
        pointerId !== undefined &&
        container.hasPointerCapture(pointerId)
      ) {
        try {
          container.releasePointerCapture(pointerId);
        } catch {
          /* pointer already released */
        }
      }

      if (container) {
        unlockTouchTarget(container);
      }

      activePointerIdRef.current = null;
      isExploringRef.current = false;
      setIsExploring(false);
      setPointerType(null);
      setPosition(null);
    },
    [clearTouchHold],
  );

  const beginExplore = useCallback(
    (
      target: HTMLDivElement,
      pointerId: number,
      type: React.PointerEvent["pointerType"],
      clientX: number,
      clientY: number,
    ) => {
      clearTouchHold();
      lockTouchTarget(target);

      try {
        target.setPointerCapture(pointerId);
      } catch {
        unlockTouchTarget(target);
        return false;
      }

      activePointerIdRef.current = pointerId;
      isExploringRef.current = true;
      setPointerType(type);
      setIsExploring(true);
      updatePosition(clientX, clientY);

      if (type === "touch") {
        triggerExploreHaptic();
      }

      return true;
    },
    [clearTouchHold, updatePosition],
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (isExploringRef.current) {
        resetExplore(event.currentTarget, activePointerIdRef.current ?? undefined);
      }

      if (event.pointerType === "touch") {
        const target = event.currentTarget;
        const pointerId = event.pointerId;

        holdStartMsRef.current = performance.now();
        touchStartRef.current = { x: event.clientX, y: event.clientY };
        lastPointerPosRef.current = { x: event.clientX, y: event.clientY };
        pendingPointerIdRef.current = pointerId;
        isPendingHoldRef.current = true;
        setIsPendingHold(true);
        updateHoldAnchor(event.clientX, event.clientY);
        startHoldProgress();

        holdTimerRef.current = setTimeout(() => {
          holdTimerRef.current = null;

          if (pendingPointerIdRef.current !== pointerId) {
            return;
          }

          const pos = lastPointerPosRef.current ?? touchStartRef.current;
          if (!pos) {
            return;
          }

          beginExplore(target, pointerId, "touch", pos.x, pos.y);
        }, TOUCH_HOLD_MS);

        return;
      }

      beginExplore(
        event.currentTarget,
        event.pointerId,
        event.pointerType,
        event.clientX,
        event.clientY,
      );
    },
    [beginExplore, resetExplore, startHoldProgress, updateHoldAnchor],
  );

  const handleContextMenu = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
    },
    [],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (
        event.pointerType === "touch" &&
        pendingPointerIdRef.current === event.pointerId &&
        !isExploringRef.current
      ) {
        const start = touchStartRef.current;
        if (start) {
          const dx = event.clientX - start.x;
          const dy = event.clientY - start.y;
          const holdElapsedMs =
            holdStartMsRef.current === null
              ? 0
              : performance.now() - holdStartMsRef.current;

          if (Math.abs(dy) > SCROLL_CANCEL_PX && Math.abs(dy) > Math.abs(dx)) {
            resetExplore(event.currentTarget, event.pointerId);
            return;
          }

          if (holdElapsedMs >= HOLD_LOCK_MS) {
            ensurePendingLock(event.currentTarget, event.pointerId);
            event.preventDefault();
          }

          if (holdElapsedMs >= TOUCH_HOLD_MS) {
            beginExplore(
              event.currentTarget,
              event.pointerId,
              "touch",
              event.clientX,
              event.clientY,
            );
            return;
          }
        }

        lastPointerPosRef.current = { x: event.clientX, y: event.clientY };
        updateHoldAnchor(event.clientX, event.clientY);
        return;
      }

      if (!isExploringRef.current) {
        return;
      }

      if (activePointerIdRef.current !== event.pointerId) {
        return;
      }

      if (event.pointerType === "touch") {
        event.preventDefault();
      }

      updatePosition(event.clientX, event.clientY);
    },
    [beginExplore, ensurePendingLock, resetExplore, updateHoldAnchor, updatePosition],
  );

  const handlePointerEnd = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const isActivePointer =
        activePointerIdRef.current === event.pointerId ||
        pendingPointerIdRef.current === event.pointerId;

      if (!isActivePointer) {
        return;
      }

      resetExplore(event.currentTarget, event.pointerId);
    },
    [resetExplore],
  );

  const handleLostPointerCapture = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (
        activePointerIdRef.current !== event.pointerId &&
        pendingPointerIdRef.current !== event.pointerId
      ) {
        return;
      }

      resetExplore(event.currentTarget, event.pointerId);
    },
    [resetExplore],
  );

  useEffect(() => () => cancelHoldAnimation(), [cancelHoldAnimation]);

  useEffect(() => {
    const onWindowBlur = () => {
      resetExplore(containerRef.current);
    };

    window.addEventListener("blur", onWindowBlur);

    return () => {
      window.removeEventListener("blur", onWindowBlur);
      resetExplore(containerRef.current);
    };
  }, [resetExplore]);

  const activeZone = position
    ? getActiveZone(position.xPct, position.yPct, zones)
    : null;

  return {
    containerRef,
    position,
    containerSize,
    isExploring,
    isPendingHold,
    holdProgress,
    holdAnchor,
    activeZone,
    pointerType,
    handlePointerDown,
    handlePointerMove,
    handlePointerEnd,
    handleLostPointerCapture,
    handleContextMenu,
  };
}
