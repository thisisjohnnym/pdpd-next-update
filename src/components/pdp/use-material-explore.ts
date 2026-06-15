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
/** Movement before hold completes — treat as vertical scroll, cancel zoom */
const SCROLL_CANCEL_PX = 12;

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
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingPointerIdRef = useRef<number | null>(null);
  const activePointerIdRef = useRef<number | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const lastPointerPosRef = useRef<{ x: number; y: number } | null>(null);
  const [position, setPosition] = useState<ExplorePosition | null>(null);
  const [containerSize, setContainerSize] = useState<ContainerSize>({ width: 0, height: 0 });
  const [isExploring, setIsExploring] = useState(false);
  const [isPendingHold, setIsPendingHold] = useState(false);
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

  const clearTouchHold = useCallback(() => {
    if (holdTimerRef.current !== null) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }

    pendingPointerIdRef.current = null;
    touchStartRef.current = null;
    lastPointerPosRef.current = null;
    setIsPendingHold(false);
  }, []);

  const resetExplore = useCallback(
    (target?: HTMLDivElement | null, pointerId?: number) => {
      clearTouchHold();

      if (
        target &&
        pointerId !== undefined &&
        target.hasPointerCapture(pointerId)
      ) {
        try {
          target.releasePointerCapture(pointerId);
        } catch {
          /* pointer already released */
        }
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

      try {
        target.setPointerCapture(pointerId);
      } catch {
        return false;
      }

      activePointerIdRef.current = pointerId;
      isExploringRef.current = true;
      setPointerType(type);
      setIsExploring(true);
      updatePosition(clientX, clientY);
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
        touchStartRef.current = { x: event.clientX, y: event.clientY };
        lastPointerPosRef.current = { x: event.clientX, y: event.clientY };
        pendingPointerIdRef.current = event.pointerId;
        setIsPendingHold(true);

        const target = event.currentTarget;
        const pointerId = event.pointerId;

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
    [beginExplore, resetExplore],
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

          if (Math.abs(dy) > SCROLL_CANCEL_PX && Math.abs(dy) > Math.abs(dx)) {
            resetExplore();
            return;
          }
        }

        lastPointerPosRef.current = { x: event.clientX, y: event.clientY };
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
    [resetExplore, updatePosition],
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
      if (activePointerIdRef.current !== event.pointerId) {
        return;
      }

      resetExplore();
    },
    [resetExplore],
  );

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
    activeZone,
    pointerType,
    handlePointerDown,
    handlePointerMove,
    handlePointerEnd,
    handleLostPointerCapture,
    handleContextMenu,
  };
}
