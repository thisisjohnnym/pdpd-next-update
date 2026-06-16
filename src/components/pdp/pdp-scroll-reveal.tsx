"use client";

import { useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";

import {
  buildRevealTimeline,
  clearRevealTargets,
  ensureGsapPlugins,
  markRevealComplete,
  markTargetsComplete,
  prefersReducedMotion,
  queryRevealTargets,
  ScrollTrigger,
  syncRevealIfAlreadyInView,
  type RevealLayout,
} from "./pdp-gsap";
import { PDP_PANEL_SCROLL } from "./pdp-panel-scroll";
import { ScrollRevealSectionContext } from "./scroll-reveal-section-context";
import { useLazyNearView } from "./use-lazy-near-view";

type PdpScrollRevealProps = {
  children: React.ReactNode;
  className?: string;
  /** rise — modules below gallery · subtle — stacked gallery frames */
  variant?: "rise" | "subtle";
  /** Opaque shell color — prevents color flashes during opacity fade */
  surface?: "dark" | "light" | "muted" | "transparent";
  /** Defer mounting children until the section is near the viewport */
  lazyMount?: boolean;
  /** Placeholder height while lazy content is not yet mounted */
  reserveMinHeight?: string;
};

function finishReveal(
  inner: HTMLElement,
  targets: NodeListOf<HTMLElement>,
  onVisible: () => void,
) {
  markRevealComplete(inner);
  markTargetsComplete(targets);
  onVisible();
}

/** GSAP section reveal — stack layout preserves gallery spacing */
export function PdpScrollReveal({
  children,
  className,
  variant = "rise",
  surface,
  lazyMount = false,
  reserveMinHeight = "70dvh",
}: PdpScrollRevealProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const nearView = useLazyNearView(triggerRef, lazyMount);
  const [sectionVisible, setSectionVisible] = useState(
    () => prefersReducedMotion() || !PDP_PANEL_SCROLL,
  );
  const layout: RevealLayout = variant === "subtle" ? "stack" : "module";
  const resolvedSurface =
    surface ?? (layout === "stack" ? "transparent" : "light");
  const shouldMount = !lazyMount || nearView;

  useLayoutEffect(() => {
    const trigger = triggerRef.current;
    const inner = innerRef.current;

    if (!shouldMount || !trigger || !inner) {
      return;
    }

    ensureGsapPlugins();

    const targets = queryRevealTargets(inner);

    if (prefersReducedMotion() || !PDP_PANEL_SCROLL) {
      clearRevealTargets(inner, ...targets);
      setSectionVisible(true);
      return;
    }

    const finish = () => finishReveal(inner, targets, () => setSectionVisible(true));

    const timeline = buildRevealTimeline({
      trigger,
      inner,
      targets,
      layout,
      onRevealStart: () => setSectionVisible(true),
      onRevealComplete: finish,
    });

    syncRevealIfAlreadyInView(timeline, finish);

    const refreshTimer = window.requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      window.cancelAnimationFrame(refreshTimer);
      timeline.kill();
    };
  }, [shouldMount, layout]);

  return (
    <div
      ref={triggerRef}
      className={cn(
        "pdp-scroll-reveal w-full shrink-0",
        layout === "stack" && "pdp-scroll-reveal--stack",
        layout === "module" && "pdp-scroll-reveal--module",
        resolvedSurface === "dark" && "bg-black",
        resolvedSurface === "light" && "bg-white",
        resolvedSurface === "muted" && "bg-neutral-100",
        resolvedSurface === "transparent" && "bg-transparent",
        className,
      )}
      style={!shouldMount ? { minHeight: reserveMinHeight } : undefined}
    >
      {shouldMount ? (
        <ScrollRevealSectionContext.Provider value={{ sectionVisible }}>
          <div ref={innerRef} className="pdp-scroll-reveal__inner">
            {children}
          </div>
        </ScrollRevealSectionContext.Provider>
      ) : null}
    </div>
  );
}
