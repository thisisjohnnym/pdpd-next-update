"use client";

import { useLayoutEffect, useRef, useState } from "react";

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

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const measure = () => setOverflowing(node.scrollHeight - 1 > node.clientHeight);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [text, clampLines, expanded]);

  const clampStyle = expanded
    ? undefined
    : ({
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: clampLines,
        overflow: "hidden",
      } as const);

  return (
    <div>
      <p ref={ref} className={className} style={clampStyle}>
        {text}
      </p>
      {overflowing || expanded ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className="font-extended mt-1 text-xs tracking-[0.2px] text-neutral-500 underline underline-offset-2 transition-colors hover:text-neutral-800 active:text-neutral-800"
        >
          {expanded ? lessLabel : moreLabel}
        </button>
      ) : null}
    </div>
  );
}
