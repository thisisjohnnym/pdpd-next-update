"use client";

import { useCallback, useRef, useState } from "react";

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

/** Pointer-driven microscope lens — drag to reveal leather macro details */
export function useMaterialExplore(zones: readonly PdpMaterialExploreZone[]) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isExploringRef = useRef(false);
  const [position, setPosition] = useState<ExplorePosition | null>(null);
  const [containerSize, setContainerSize] = useState<ContainerSize>({ width: 0, height: 0 });
  const [isExploring, setIsExploring] = useState(false);

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

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      // Block iOS long-press image callout (Copy / Save) so drag-to-zoom works.
      if (event.pointerType === "touch") {
        event.preventDefault();
      }

      event.currentTarget.setPointerCapture(event.pointerId);
      isExploringRef.current = true;
      setIsExploring(true);
      updatePosition(event.clientX, event.clientY);
    },
    [updatePosition],
  );

  const handleContextMenu = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
    },
    [],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isExploringRef.current) {
        return;
      }

      updatePosition(event.clientX, event.clientY);
    },
    [updatePosition],
  );

  const handlePointerEnd = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }

      isExploringRef.current = false;
      setIsExploring(false);
      setPosition(null);
    },
    [],
  );

  const activeZone = position
    ? getActiveZone(position.xPct, position.yPct, zones)
    : null;

  return {
    containerRef,
    position,
    containerSize,
    isExploring,
    activeZone,
    handlePointerDown,
    handlePointerMove,
    handlePointerEnd,
    handleContextMenu,
  };
}
