"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Point = { x: number; y: number };
type Size = { width: number; height: number };
type LensPosition = Point & { xPct: number; yPct: number };

type Phase = "idle" | "pending" | "zooming";

type CloseReason = "pointerup" | "pointercancel" | "lostpointercapture" | "blur" | "unmount" | "recapture-failed";

/**
 * How long the user must hold still before the zoom lens engages. Long enough
 * that a scroll flick never trips it, short enough to feel intentional.
 */
const HOLD_TO_ZOOM_MS = 520;

/**
 * If the pointer travels more than this many pixels before the hold completes,
 * we treat the gesture as a scroll and abandon the zoom.
 */
const MOVE_CANCEL_THRESHOLD = 10;

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

/**
 * Press-and-hold magnifier lens. The hold gesture is intentionally scoped to a
 * dedicated trigger control (see `triggerHandlers`) rather than the whole image
 * — so the image body stays freely scrollable and accidental holds while
 * scrolling can never arm the zoom. Once the hold completes, the pointer is
 * captured and the lens roams the entire photo until release.
 */
export function useDragZoomLens() {
  const containerRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<Phase>("idle");
  const pointerIdRef = useRef<number | null>(null);
  const captureTargetRef = useRef<HTMLElement | null>(null);
  const pageScrollLockedRef = useRef(false);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pressOriginRef = useRef<Point | null>(null);
  const lastClientRef = useRef<Point | null>(null);

  const [phase, setPhase] = useState<Phase>("idle");
  const [lensPosition, setLensPosition] = useState<LensPosition | null>(null);
  const [pressPoint, setPressPoint] = useState<Point | null>(null);
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

  const clearHoldTimer = useCallback(() => {
    if (holdTimerRef.current !== null) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  }, []);

  const release = useCallback(
    (target?: HTMLElement | null, pointerId?: number, _reason: CloseReason = "pointerup") => {
      clearHoldTimer();

      const el = target ?? captureTargetRef.current;
      const pid = pointerId ?? pointerIdRef.current;
      const hadCapture = Boolean(el && pid !== null && el.hasPointerCapture(pid));

      if (el && pid !== null && hadCapture) {
        try {
          el.releasePointerCapture(pid);
        } catch {
          /* already released */
        }
      }

      unlockPageScrollIfNeeded();

      captureTargetRef.current = null;
      pointerIdRef.current = null;
      pressOriginRef.current = null;
      lastClientRef.current = null;
      setPhaseSafe("idle");
      setLensPosition(null);
      setPressPoint(null);
      setPointerType(null);
    },
    [clearHoldTimer, setPhaseSafe, unlockPageScrollIfNeeded],
  );

  /**
   * Fires once the hold timer completes. The pointer is already captured on the
   * trigger; here we lock the page and reveal the lens so a continued drag can
   * roam the whole photo.
   */
  const activateZoom = useCallback(
    (type: React.PointerEvent["pointerType"]) => {
      const last = lastClientRef.current;
      if (pointerIdRef.current === null || !last) {
        return;
      }

      lockPageScroll();
      pageScrollLockedRef.current = true;

      setPointerType(type);
      setPhaseSafe("zooming");
      setPressPoint(null);
      updateLens(last.x, last.y);

      if (type === "touch") {
        exploreHaptic();
      }
    },
    [setPhaseSafe, updateLens],
  );

  /**
   * Attach these to the dedicated zoom trigger control — NOT the image. The hold
   * begins on the trigger and the pointer is captured immediately, so the
   * subsequent drag continues across the photo even though it left the trigger.
   */
  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (event.pointerType === "mouse" && event.button !== 0) {
        return;
      }

      // A press while already zooming dismisses the lens.
      if (phaseRef.current === "zooming") {
        release(event.currentTarget, event.pointerId, "pointerup");
        return;
      }

      clearHoldTimer();

      const target = event.currentTarget;

      // Capture on the trigger now so the drag keeps reporting once the finger
      // moves off the control and onto the image.
      try {
        target.setPointerCapture(event.pointerId);
      } catch {
        /* capture unsupported — handlers still work without it */
      }

      captureTargetRef.current = target;
      pointerIdRef.current = event.pointerId;
      pressOriginRef.current = { x: event.clientX, y: event.clientY };
      lastClientRef.current = { x: event.clientX, y: event.clientY };

      const type = event.pointerType;
      setPointerType(type);
      setPhaseSafe("pending");

      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
        setPressPoint(localPoint(event.clientX, event.clientY, rect));
      } else {
        setPressPoint(null);
      }

      holdTimerRef.current = setTimeout(() => {
        holdTimerRef.current = null;
        if (phaseRef.current === "pending") {
          activateZoom(type);
        }
      }, HOLD_TO_ZOOM_MS);
    },
    [activateZoom, clearHoldTimer, release, setPhaseSafe],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (pointerIdRef.current !== event.pointerId) {
        return;
      }

      lastClientRef.current = { x: event.clientX, y: event.clientY };

      if (phaseRef.current === "pending") {
        const origin = pressOriginRef.current;
        if (origin) {
          const dx = event.clientX - origin.x;
          const dy = event.clientY - origin.y;
          // Sliding off the trigger before the hold lands means it wasn't a
          // deliberate press — abandon so the gesture can't accidentally arm.
          if (Math.hypot(dx, dy) > MOVE_CANCEL_THRESHOLD) {
            release(event.currentTarget, event.pointerId, "pointercancel");
          }
        }
        return;
      }

      if (phaseRef.current !== "zooming") {
        return;
      }

      if (event.cancelable) {
        event.preventDefault();
      }

      updateLens(event.clientX, event.clientY);
    },
    [release, updateLens],
  );

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (pointerIdRef.current !== event.pointerId) {
        return;
      }

      release(event.currentTarget, event.pointerId, "pointerup");
    },
    [release],
  );

  const handlePointerCancel = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (pointerIdRef.current !== event.pointerId) {
        return;
      }

      release(event.currentTarget, event.pointerId, "pointercancel");
    },
    [release],
  );

  const handlePointerEnd = handlePointerUp;

  const handleLostPointerCapture = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (pointerIdRef.current !== event.pointerId) {
        return;
      }

      release(event.currentTarget, event.pointerId, "lostpointercapture");
    },
    [release],
  );

  const handleContextMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
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

  // The native long-press menu (Android Chrome context menu / iOS callout) fires
  // around the same moment our hold timer completes. A React onContextMenu on the
  // trigger isn't enough — the callout can target the page or a child element — so
  // we suppress it at the document level for the entire life of an active press.
  useEffect(() => {
    if (phase === "idle") {
      return;
    }

    const blockContextMenu = (event: Event) => {
      event.preventDefault();
    };

    document.addEventListener("contextmenu", blockContextMenu, { capture: true });

    return () => {
      document.removeEventListener("contextmenu", blockContextMenu, { capture: true });
    };
  }, [phase]);

  useEffect(() => {
    const onBlur = () => release(undefined, undefined, "blur");
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("blur", onBlur);
      release(undefined, undefined, "unmount");
    };
  }, [release]);

  /** Spread onto the dedicated press-and-hold zoom trigger control. */
  const triggerHandlers = {
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    onPointerCancel: handlePointerCancel,
    onLostPointerCapture: handleLostPointerCapture,
    onContextMenu: handleContextMenu,
  };

  return {
    containerRef,
    lensPosition,
    pressPoint,
    containerSize,
    isPending: phase === "pending",
    isZooming: phase === "zooming",
    holdDurationMs: HOLD_TO_ZOOM_MS,
    pointerType,
    triggerHandlers,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
    handlePointerEnd,
    handleLostPointerCapture,
    handleContextMenu,
  };
}
