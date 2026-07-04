"use client";

import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from "react";

import { cn } from "@/lib/cn";

import { getPdpVersionConfig } from "./version/pdp-version-config";
import { usePdpVersion } from "./version/pdp-version-context";
import { usePdpElementReveal } from "./use-pdp-element-reveal";

type PdpRevealItemProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
  /** Stagger offset in px — shortens the scroll runway before the 30% end line */
  delay?: number;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

/** Layout block — scroll-scrubbed opacity + lift reveal on v4 */
export function PdpRevealItem<T extends ElementType = "div">({
  as,
  children,
  className,
  delay = 0,
  ...props
}: PdpRevealItemProps<T>) {
  const version = usePdpVersion();
  const { useV4GranularScrollReveal } = getPdpVersionConfig(version);
  const ref = usePdpElementReveal<HTMLElement>({
    blur: false,
    delay,
    enabled: useV4GranularScrollReveal,
  });
  const Tag = as ?? "div";

  return (
    <Tag
      ref={useV4GranularScrollReveal ? (ref as never) : undefined}
      className={cn(className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
