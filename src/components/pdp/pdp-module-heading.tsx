"use client";

import { cn } from "@/lib/cn";

import {
  pdpModuleHeadingClass,
  pdpModuleHeadlineDisplayClass,
  pdpModuleHeadingLeadClass,
} from "./pdp-module-section";
import { PdpTextReveal } from "./pdp-text-reveal";
import { getPdpVersionConfig } from "./version/pdp-version-config";
import { usePdpVersion } from "./version/pdp-version-context";

type PdpModuleHeadingProps = {
  children: React.ReactNode;
  size?: "lg" | "sm";
  className?: string;
  delay?: number;
  /** mb-4 below title — off for inline header rows */
  spacing?: "lead" | "none";
};

/** Module H2 */
export function PdpModuleHeading({
  children,
  size = "lg",
  className,
  delay = 60,
  spacing = "lead",
}: PdpModuleHeadingProps) {
  const { useConsistentModuleHeadings } = getPdpVersionConfig(usePdpVersion());

  return (
    <PdpTextReveal
      as="h2"
      delay={delay}
      className={cn(
        useConsistentModuleHeadings
          ? pdpModuleHeadlineDisplayClass(true)
          : pdpModuleHeadingClass({ lead: false, size }),
        spacing === "lead" && pdpModuleHeadingLeadClass(),
        className,
      )}
    >
      {children}
    </PdpTextReveal>
  );
}
