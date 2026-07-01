"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";

import { cn } from "@/lib/cn";

import { pdpPressableClass } from "./pdp-type";
import { useReducedMotion } from "./use-reduced-motion";

type PdpExpandableTextProps = {
  text: string;
  className?: string;
  /** Collapsed line cap */
  clampLines?: number;
  moreLabel?: string;
  lessLabel?: string;
};

/** Body copy that collapses to a line cap with a Read more/less toggle when it overflows */
// fallow-ignore-next-line complexity
export function PdpExpandableText({
  text,
  className,
  clampLines = 2,
  moreLabel = "Read more",
  lessLabel = "Read less",
}: PdpExpandableTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const [collapsedHeight, setCollapsedHeight] = useState<number>();
  const [fullHeight, setFullHeight] = useState<number>();
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const measure = () => {
      // While collapsed (clamp active + overflow hidden), scrollHeight is the
      // full content height and clientHeight is the clamped height.
      setFullHeight(node.scrollHeight);
      if (!expanded) {
        setCollapsedHeight(node.clientHeight);
        setOverflowing(node.scrollHeight - 1 > node.clientHeight);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [text, clampLines, expanded]);

  // Keep the clamp (for the ellipsis) only while collapsed; height eases via max-height.
  const collapsedClamp: CSSProperties = expanded
    ? {}
    : {
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: clampLines,
      };

  const animate = overflowing && !reducedMotion;
  const paragraphStyle: CSSProperties = {
    ...collapsedClamp,
    overflow: "hidden",
    maxHeight: expanded ? fullHeight : collapsedHeight,
    transition: animate
      ? "max-height 260ms cubic-bezier(0.2, 0, 0, 1)"
      : undefined,
  };

  return (
    <div>
      <p ref={ref} className={cn("text-pretty", className)} style={paragraphStyle}>
        {text}
      </p>
      {overflowing || expanded ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className={cn(
            "font-extended mt-1 text-xs tracking-[0.2px] text-neutral-500 underline underline-offset-2 transition-colors hover:text-neutral-800 active:text-neutral-800",
            pdpPressableClass,
          )}
        >
          {expanded ? lessLabel : moreLabel}
        </button>
      ) : null}
    </div>
  );
}
