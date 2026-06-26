"use client";

import { useLayoutEffect, useRef } from "react";

import { PdpBrandBar } from "./pdp-brand-bar";
import {
  useHeroRevealApplier,
  useHeroRevealController,
} from "./use-pdp-hero-reveal";

/**
 * Fixed top overlay that holds the brand switcher. It collapses to zero height
 * at rest (hero is full-screen) and grows in as the shared reveal value rises.
 * Kept out of document flow so the hero never gets pushed down or clipped.
 */
export function PdpBrandBarReveal() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const fullHeightRef = useRef(0);
  const controller = useHeroRevealController();

  const measure = () => {
    fullHeightRef.current = innerRef.current?.offsetHeight ?? 0;
  };

  useLayoutEffect(() => {
    measure();
    if (typeof ResizeObserver === "undefined" || !innerRef.current) {
      return;
    }
    const observer = new ResizeObserver(() => {
      measure();
    });
    observer.observe(innerRef.current);
    return () => observer.disconnect();
  }, []);

  // fallow-ignore-next-line complexity
  useHeroRevealApplier((reveal) => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) {
      return;
    }
    if (!fullHeightRef.current) {
      measure();
    }
    outer.style.height = `${reveal * fullHeightRef.current}px`;
    outer.style.pointerEvents = reveal > 0.6 ? "auto" : "none";
    outer.style.visibility = reveal > 0 ? "visible" : "hidden";
    inner.style.opacity = String(reveal);
    inner.style.transform = `translateY(${(reveal - 1) * 12}px)`;
  });

  return (
    <div
      ref={outerRef}
      aria-hidden={false}
      className="fixed inset-x-0 top-0 z-40 overflow-hidden bg-white"
      style={{ height: 0 }}
    >
      <div ref={innerRef} style={{ opacity: 0 }}>
        <PdpBrandBar onSelect={() => controller?.animateTo(0)} />
      </div>
    </div>
  );
}
