"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Point = { x: number; y: number };
type Size = { width: number; height: number };
type LensPosition = Point & { xPct: number; yPct: number };

type Phase = "idle" | "zooming";

type CloseReason = "pointerup" | "pointercancel" | "lostpointercapture" | "blur" | "unmount" | "recapture-failed";

/** Ref-counted body scroll lock — prevents page scroll while the lens is active */
let pageScrollLockCount = 0;
let pageScrollLockY = 0;

function lockPageScroll() {
  if (typeof document === "undefined") {
    return;
  }

  if (pageScrollLockCount++ > 0) {
    return;
  }

  pageScrollLockY = window.scrollY;
  const { body } = document;
  const html = document.documentElement;

  body.style.position = "fixed";
  body.style.top = `-${pageScrollLockY}px`;
  body.style.left = "0";
  body.style.right = "0";
  body.style.width = "100%";
  body.style.overflow = "hidden";
  html.style.overflow = "hidden";
  html.classList.add("pdp-drag-zoom-scroll-lock");
}

function unlockPageScroll() {
  if (typeof document === "undefined") {
    return;
  }

  if (pageScrollLockCount === 0) {
    return;
  }

  if (--pageScrollLockCount > 0) {
    return;
  }

  const scrollY = pageScrollLockY;
  const { body } = document;
  const html = document.documentElement;

  body.style.position = "";
  body.style.top = "";
  body.style.left = "";
  body.style.right = "";
  body.style.width = "";
  body.style.overflow = "";
  html.style.overflow = "";
  html.classList.remove("pdp-drag-zoom-scroll-lock");

  window.scrollTo(0, scrollY);
}

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

function lockGestureScroll(target: HTMLDivElement) {
  target.style.touchAction = "none";
  target.classList.add("touch-none");
}

function restoreGestureScroll(target: HTMLDivElement) {
  target.classList.remove("touch-none");
  target.style.touchAction = "pan-y";
}

/** Instant magnifier lens — touch and mouse activate on pointerdown */
export function useDragZoomLens() {
  const containerRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<Phase>("idle");
  const pointerIdRef = useRef<number | null>(null);
  const pageScrollLockedRef = useRef(false);

  const [phase, setPhase] = useState<Phase>("idle");
  const [lensPosition, setLensPosition] = useState<LensPosition | null>(null);
  const [containerSize, setContainerSize] = useState<Size>({ width: 0, height: 0 });
  const [pointerType, setPointerType] = useState<React.PointerEvent["pointerType"] | null>(
    null,
  );

  const setPhaseSafe = useCallback((next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
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

  const unlockPageScrollIfNeeded = useCallback(() => {
    if (!pageScrollLockedRef.current) {
      return;
    }

    pageScrollLockedRef.current = false;
    unlockPageScroll();
  }, []);

  const release = useCallback(
    (target?: HTMLDivElement | null, pointerId?: number, _reason: CloseReason = "pointerup") => {
      const el = target ?? containerRef.current;
      const pid = pointerId ?? pointerIdRef.current;
      const hadCapture = Boolean(el && pid !== null && el.hasPointerCapture(pid));

      if (el && pid !== null && hadCapture) {
        try {
          el.releasePointerCapture(pid);
        } catch {
          /* already released */
        }
      }

      if (el) {
        restoreGestureScroll(el);
      }

      unlockPageScrollIfNeeded();

      pointerIdRef.current = null;
      setPhaseSafe("idle");
      setLensPosition(null);
      setPointerType(null);
    },
    [setPhaseSafe, unlockPageScrollIfNeeded],
  );

  const activateZoom = useCallback(
    (
      target: HTMLDivElement,
      pointerId: number,
      type: React.PointerEvent["pointerType"],
      clientX: number,
      clientY: number,
    ) => {
      try {
        target.setPointerCapture(pointerId);
      } catch {
        release(target, pointerId, "recapture-failed");
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
    [release, setPhaseSafe, updateLens],
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === "mouse" && event.button !== 0) {
        return;
      }

      if (phaseRef.current === "zooming") {
        release(event.currentTarget, event.pointerId, "pointerup");
        return;
      }

      const target = event.currentTarget;

      // Lock page scroll synchronously — must run before the browser applies pan-y
      // from the initial touch (scroll can jump before the first pointermove).
      lockPageScroll();
      pageScrollLockedRef.current = true;
      lockGestureScroll(target);

      if (event.pointerType === "touch" && event.cancelable) {
        event.preventDefault();
      }

      activateZoom(target, event.pointerId, event.pointerType, event.clientX, event.clientY);
    },
    [activateZoom, release],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (pointerIdRef.current !== event.pointerId || phaseRef.current !== "zooming") {
        return;
      }

      if (event.cancelable) {
        event.preventDefault();
      }

      updateLens(event.clientX, event.clientY);
    },
    [updateLens],
  );

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (pointerIdRef.current !== event.pointerId) {
        return;
      }

      release(event.currentTarget, event.pointerId, "pointerup");
    },
    [release],
  );

  const handlePointerCancel = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (pointerIdRef.current !== event.pointerId) {
        return;
      }

      release(event.currentTarget, event.pointerId, "pointercancel");
    },
    [release],
  );

  const handlePointerEnd = handlePointerUp;

  const handleLostPointerCapture = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (pointerIdRef.current !== event.pointerId) {
        return;
      }

      release(event.currentTarget, event.pointerId, "lostpointercapture");
    },
    [release],
  );

  const handleContextMenu = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  useEffect(() => {
    if (phase !== "zooming") {
      return;
    }

    const blockScrollGesture = (event: Event) => {
      event.preventDefault();
    };

    document.addEventListener("touchmove", blockScrollGesture, { capture: true, passive: false });
    document.addEventListener("wheel", blockScrollGesture, { capture: true, passive: false });

    return () => {
      document.removeEventListener("touchmove", blockScrollGesture, { capture: true });
      document.removeEventListener("wheel", blockScrollGesture, { capture: true });
    };
  }, [phase]);

  useEffect(() => {
    const onBlur = () => release(containerRef.current, undefined, "blur");
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("blur", onBlur);
      release(containerRef.current, undefined, "unmount");
    };
  }, [release]);

  return {
    containerRef,
    lensPosition,
    containerSize,
    isZooming: phase === "zooming",
    pointerType,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
    handlePointerEnd,
    handleLostPointerCapture,
    handleContextMenu,
  };
}
