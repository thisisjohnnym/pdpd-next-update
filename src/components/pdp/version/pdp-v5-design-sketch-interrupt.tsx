"use client";

import Image from "next/image";

import { cn } from "@/lib/cn";

import { PdpModuleHeading } from "../pdp-module-heading";
import { pdpModuleIntroClass } from "../pdp-module-section";
import { PdpTextReveal } from "../pdp-text-reveal";

import { PDP_DESIGN_SKETCH_INTERRUPT } from "./pdp-data-v2";
import { getPdpVersionConfig } from "./pdp-version-config";
import { usePdpVersion } from "./pdp-version-context";

/**
 * v5 scroll interrupter — warm color-blocked studio spread between
 * "Get up close and personal" and "Ways to wear".
 */
export function PdpV5DesignSketchInterrupt() {
  const { leftAlignModuleHeadings, useV4ModuleSpacing } =
    getPdpVersionConfig(usePdpVersion());
  const { src, alt, headline, intro } = PDP_DESIGN_SKETCH_INTERRUPT;
  const alignClass = leftAlignModuleHeadings
    ? "items-start text-left"
    : "items-center text-center";

  return (
    <section
      aria-label="Tabby Shoulder Bag 26 design sketch"
      data-header-surface="light"
      className="pdp-design-sketch-interrupt w-full shrink-0 overflow-x-clip"
    >
      <div
        className={cn(
          "pdp-design-sketch-interrupt__intro flex flex-col bg-[#F2EDEA] px-4",
          useV4ModuleSpacing ? "gap-3 pt-14 pb-8" : "gap-2.5 pt-12 pb-6",
          alignClass,
        )}
      >
        <PdpModuleHeading
          spacing="none"
          className={leftAlignModuleHeadings ? "text-left" : "text-center"}
        >
          {headline}
        </PdpModuleHeading>
        <PdpTextReveal
          as="p"
          delay={100}
          className={cn(
            pdpModuleIntroClass(leftAlignModuleHeadings ? "left" : "center"),
            "text-neutral-700",
          )}
        >
          {intro}
        </PdpTextReveal>
      </div>

      <div className="pdp-design-sketch-interrupt__media relative aspect-[4/5] w-full overflow-hidden bg-[#F2EDEA]">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority={false}
        />
      </div>
    </section>
  );
}
