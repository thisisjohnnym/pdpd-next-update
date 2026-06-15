"use client";

import { cn } from "@/lib/cn";

import {
  pdpModuleHeadingClass,
  pdpModuleHeadingLeadClass,
} from "./pdp-module-section";
import { PdpTextReveal } from "./pdp-text-reveal";

type PdpModuleHeadingProps = {
  children: React.ReactNode;
  size?: "lg" | "sm";
  className?: string;
  delay?: number;
  /** mb-4 below title — off for inline header rows */
  spacing?: "lead" | "none";
};

/** Module H2 with scroll-triggered text reveal */
export function PdpModuleHeading({
  children,
  size = "lg",
  className,
  delay = 60,
  spacing = "lead",
}: PdpModuleHeadingProps) {
  return (
    <PdpTextReveal
      as="h2"
      delay={delay}
      className={cn(
        pdpModuleHeadingClass({ lead: false, size }),
        spacing === "lead" && pdpModuleHeadingLeadClass(),
        className,
      )}
    >
      {children}
    </PdpTextReveal>
  );
}
