"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";

import { getPdpVersionConfig } from "./version/pdp-version-config";
import { usePdpVersion } from "./version/pdp-version-context";
import { ScrollRevealSectionContext } from "./scroll-reveal-section-context";
import { useLazyNearView } from "./use-lazy-near-view";
import { useReducedMotion } from "./use-reduced-motion";

type PdpScrollRevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Opaque shell color */
  surface?: "dark" | "light" | "muted" | "transparent";
  /** Defer mounting children until the section is near the viewport */
  lazyMount?: boolean;
  /** Placeholder height while lazy content is not yet mounted */
  reserveMinHeight?: string;
};

/**
 * One reveal for the whole page — every section fades and lifts in the same way
 * as it scrolls into view. Keeping a single, uniform motion (rather than
 * per-element staggers) is what calms the "lots happening at once" feeling on a
 * media-dense scroll.
 */
function RevealContent({
  children,
  granular,
}: {
  children: React.ReactNode;
  granular: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [revealed, setRevealed] = useState(reducedMotion || granular);

  useEffect(() => {
    if (granular || reducedMotion) {
      setRevealed(true);
      return;
    }

    const node = ref.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      // Trigger as the section begins entering from the bottom of the viewport.
      { threshold: 0, rootMargin: "0px 0px -12% 0px" },
    );

    observer.observe(node);

    // IntersectionObserver only calls back when the ratio crosses a
    // threshold. An instant/jump scroll (End key, anchor links,
    // viewport-resize scroll snaps) can skip a section clean over its
    // trigger zone in a single frame, so the ratio stays at 0 the whole
    // time and the observer never fires again — the section is stranded
    // at opacity-0 forever. Catch that directly: if it's already fully
    // above the viewport, reveal it now.
    let rafId = 0;
    const checkSkippedPast = () => {
      rafId = 0;
      if (node.getBoundingClientRect().bottom <= 0) {
        setRevealed(true);
      }
    };
    const onScrollOrResize = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(checkSkippedPast);
      }
    };
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [granular, reducedMotion]);

  if (granular) {
    return <div>{children}</div>;
  }

  return (
    <div
      ref={ref}
      data-revealed={revealed}
      className={cn(
        "motion-safe:transition-[opacity,transform] motion-safe:duration-700 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]",
        revealed
          ? "opacity-100 translate-y-0"
          : "motion-safe:opacity-0 motion-safe:translate-y-4",
      )}
    >
      {children}
    </div>
  );
}

/** Section shell — lazy-mount + one consistent scroll-in reveal */
// fallow-ignore-next-line complexity
export function PdpScrollReveal({
  children,
  className,
  surface = "light",
  lazyMount = false,
  reserveMinHeight = "70dvh",
}: PdpScrollRevealProps) {
  const version = usePdpVersion();
  const { useV4GranularScrollReveal } = getPdpVersionConfig(version);
  const [triggerEl, setTriggerEl] = useState<HTMLDivElement | null>(null);
  const nearView = useLazyNearView(triggerEl, lazyMount);
  const shouldMount = !lazyMount || nearView;

  return (
    <div
      ref={setTriggerEl}
      className={cn(
        "w-full shrink-0",
        surface === "dark" && "bg-black",
        surface === "light" && "bg-white",
        surface === "muted" && "bg-neutral-100",
        surface === "transparent" && "bg-transparent",
        className,
      )}
      style={!shouldMount ? { minHeight: reserveMinHeight } : undefined}
    >
      {shouldMount ? (
        <ScrollRevealSectionContext.Provider value={{ sectionVisible: true }}>
          <RevealContent granular={useV4GranularScrollReveal}>
            {children}
          </RevealContent>
        </ScrollRevealSectionContext.Provider>
      ) : null}
    </div>
  );
}
