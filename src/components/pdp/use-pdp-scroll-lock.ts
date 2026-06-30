"use client";

import { useEffect } from "react";

const OVERLAY_SCROLL_LOCK_CLASS = "pdp-overlay-scroll-lock";

type SavedScrollLock = {
  bodyPosition: string;
  bodyTop: string;
  bodyLeft: string;
  bodyRight: string;
  bodyWidth: string;
  bodyOverflow: string;
  htmlOverflow: string;
};

let lockCount = 0;
let savedScrollY = 0;
let savedStyles: SavedScrollLock | null = null;

function isInsideSheetScrollRegion(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) {
    return false;
  }

  return target.closest("[data-pdp-sheet-scroll]") !== null;
}

function handleOverlayTouchMove(event: TouchEvent) {
  if (isInsideSheetScrollRegion(event.target)) {
    return;
  }

  event.preventDefault();
}

/** Ref-counted — safe when multiple overlays stack (e.g. color + notify). */
export function acquirePdpScrollLock() {
  if (typeof document === "undefined") {
    return;
  }

  if (lockCount++ > 0) {
    return;
  }

  savedScrollY = window.scrollY;
  const { body, documentElement: html } = document;

  savedStyles = {
    bodyPosition: body.style.position,
    bodyTop: body.style.top,
    bodyLeft: body.style.left,
    bodyRight: body.style.right,
    bodyWidth: body.style.width,
    bodyOverflow: body.style.overflow,
    htmlOverflow: html.style.overflow,
  };

  body.style.position = "fixed";
  body.style.top = `-${savedScrollY}px`;
  body.style.left = "0";
  body.style.right = "0";
  body.style.width = "100%";
  body.style.overflow = "hidden";
  html.style.overflow = "hidden";
  html.classList.add(OVERLAY_SCROLL_LOCK_CLASS);

  document.addEventListener("touchmove", handleOverlayTouchMove, {
    passive: false,
  });
}

export function releasePdpScrollLock() {
  if (typeof document === "undefined") {
    return;
  }

  if (lockCount === 0) {
    return;
  }

  if (--lockCount > 0) {
    return;
  }

  const { body, documentElement: html } = document;
  const previous = savedStyles;

  document.removeEventListener("touchmove", handleOverlayTouchMove);

  if (previous) {
    body.style.position = previous.bodyPosition;
    body.style.top = previous.bodyTop;
    body.style.left = previous.bodyLeft;
    body.style.right = previous.bodyRight;
    body.style.width = previous.bodyWidth;
    body.style.overflow = previous.bodyOverflow;
    html.style.overflow = previous.htmlOverflow;
  }

  html.classList.remove(OVERLAY_SCROLL_LOCK_CLASS);
  savedStyles = null;
  window.scrollTo(0, savedScrollY);
}

/** Prevent background scroll while a modal/sheet is open — restores position on close */
export function usePdpScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) {
      return;
    }

    acquirePdpScrollLock();

    return () => {
      releasePdpScrollLock();
    };
  }, [active]);
}
