"use client";

import {
  useLayoutEffect,
  useRef,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from "react";

import { cn } from "@/lib/cn";

type PdpRevealItemProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
  /** Stagger offset in ms — same rhythm as FAQ rows */
  delay?: number;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

/** Block target for parent section GSAP stagger (cards, rows, rails) */
export function PdpRevealItem<T extends ElementType = "div">({
  as,
  children,
  className,
  delay = 0,
  ...props
}: PdpRevealItemProps<T>) {
  const Tag = as ?? "div";

  return (
    <Tag
      data-pdp-reveal-item=""
      data-pdp-text-delay={delay > 0 ? delay : undefined}
      className={cn("pdp-reveal-item", className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
