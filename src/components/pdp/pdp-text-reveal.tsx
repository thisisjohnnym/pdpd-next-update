"use client";

import {
  useLayoutEffect,
  useRef,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from "react";

import { cn } from "@/lib/cn";

import {
  clearRevealTargets,
  ensureGsapPlugins,
  gsap,
  prefersReducedMotion,
  REVEAL_EASE,
  REVEAL_MODULE_START,
} from "./pdp-gsap";
import { useScrollRevealSection } from "./scroll-reveal-section-context";

type PdpTextRevealProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
  /** Stagger offset in ms */
  delay?: number;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

/** Copy target for GSAP scroll reveals — parent section orchestrates stagger */
export function PdpTextReveal<T extends ElementType = "div">({
  as,
  children,
  className,
  delay = 0,
  style,
  ...props
}: PdpTextRevealProps<T>) {
  const Tag = as ?? "div";
  const section = useScrollRevealSection();
  const nestedInSection = section !== null;
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (nestedInSection) {
      return;
    }

    const node = ref.current;
    if (!node) {
      return;
    }

    ensureGsapPlugins();

    if (prefersReducedMotion()) {
      clearRevealTargets(node);
      return;
    }

    gsap.set(node, { opacity: 0, y: 20, filter: "blur(6px)" });

    const timeline = gsap.timeline({
      paused: true,
      scrollTrigger: {
        trigger: node,
        start: REVEAL_MODULE_START,
        toggleActions: "play none none none",
        once: true,
      },
    });

    timeline.to(node, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.85,
      ease: REVEAL_EASE,
      delay: delay / 1000,
    });

    timeline.eventCallback("onComplete", () => {
      node.classList.add("pdp-reveal-target--revealed");
      gsap.set(node, { clearProps: "opacity,transform,filter" });
    });

    const scrollTrigger = timeline.scrollTrigger;
    if (scrollTrigger && scrollTrigger.progress > 0.08) {
      timeline.progress(1);
      scrollTrigger.kill(false);
    }

    return () => {
      timeline.kill();
    };
  }, [nestedInSection, delay]);

  return (
    <Tag
      ref={!nestedInSection ? (ref as never) : undefined}
      data-pdp-text-reveal=""
      data-pdp-text-delay={delay > 0 ? delay : undefined}
      className={cn("pdp-text-reveal", className)}
      style={style}
      {...props}
    >
      {children}
    </Tag>
  );
}
