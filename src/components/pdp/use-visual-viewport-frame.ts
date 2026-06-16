"use client";

import { useEffect, useState } from "react";

export type VisualViewportFrame = {
  top: number;
  left: number;
  width: number;
  height: number;
  /** True when the visible viewport is substantially shorter than the layout viewport */
  keyboardLikelyOpen: boolean;
};

function readVisualViewportFrame(): VisualViewportFrame {
  if (typeof window === "undefined") {
    return { top: 0, left: 0, width: 0, height: 0, keyboardLikelyOpen: false };
  }

  const viewport = window.visualViewport;

  if (!viewport) {
    return {
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight,
      keyboardLikelyOpen: false,
    };
  }

  const keyboardLikelyOpen = viewport.height < window.innerHeight * 0.75;

  return {
    top: viewport.offsetTop,
    left: viewport.offsetLeft,
    width: viewport.width,
    height: viewport.height,
    keyboardLikelyOpen,
  };
}

/** Tracks the visible viewport — keeps sheets/composers aligned when the iOS keyboard opens */
export function useVisualViewportFrame(active: boolean): VisualViewportFrame {
  const [frame, setFrame] = useState<VisualViewportFrame>(() =>
    readVisualViewportFrame(),
  );

  useEffect(() => {
    if (!active) {
      setFrame(readVisualViewportFrame());
      return;
    }

    const update = () => {
      setFrame(readVisualViewportFrame());
    };

    update();

    const viewport = window.visualViewport;
    viewport?.addEventListener("resize", update);
    viewport?.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);

    return () => {
      viewport?.removeEventListener("resize", update);
      viewport?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, [active]);

  return frame;
}

/** Prevent background scroll while a modal/sheet is open — restores position on close */
export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active || typeof document === "undefined") {
      return;
    }

    const { body, documentElement: html } = document;
    const scrollY = window.scrollY;
    const previous = {
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyWidth: body.style.width,
      bodyOverflow: body.style.overflow,
      htmlOverflow: html.style.overflow,
    };

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";
    html.style.overflow = "hidden";

    return () => {
      body.style.position = previous.bodyPosition;
      body.style.top = previous.bodyTop;
      body.style.width = previous.bodyWidth;
      body.style.overflow = previous.bodyOverflow;
      html.style.overflow = previous.htmlOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [active]);
}
