"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ReactNode, useRef } from "react";

import { cn } from "@/lib/cn";

import { useReducedMotion } from "./use-reduced-motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const DEFAULT_MULTIPLIER = 0.3;

type PdpParallaxMediaProps = {
  children: ReactNode;
  className?: string;
  /** Parallax travel as a fraction of extra image slack — 0.2–0.4 */
  multiplier?: number;
};

/**
 * Clipped viewport + oversized image layer with GSAP ScrollTrigger parallax.
 * Wrap a `fill` Next/Image (or any cover image) as the only child.
 */
export function PdpParallaxMedia({
  children,
  className,
  multiplier = DEFAULT_MULTIPLIER,
}: PdpParallaxMediaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageLayerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const container = containerRef.current;
      const imageLayer = imageLayerRef.current;
      if (!container || !imageLayer || reducedMotion) {
        return;
      }

      const extra = imageLayer.offsetHeight - container.offsetHeight;
      const travel =
        extra > 0
          ? extra * multiplier
          : container.offsetHeight * 0.2 * multiplier;

      gsap.fromTo(
        imageLayer,
        { y: -travel / 2 },
        {
          y: travel / 2,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    },
    {
      scope: containerRef,
      dependencies: [multiplier, reducedMotion],
      revertOnUpdate: true,
    },
  );

  return (
    <div
      ref={containerRef}
      className={cn("parallax-container overflow-hidden", className)}
    >
      <div
        ref={imageLayerRef}
        className={cn(
          "parallax-image absolute inset-x-0 top-[-10%] h-[120%] w-full",
          !reducedMotion && "will-change-transform",
        )}
      >
        <div className="relative h-full w-full">{children}</div>
      </div>
    </div>
  );
}

/** Call from Next/Image onLoadingComplete so ScrollTrigger recalculates travel. */
export function refreshPdpParallax() {
  ScrollTrigger.refresh();
}
