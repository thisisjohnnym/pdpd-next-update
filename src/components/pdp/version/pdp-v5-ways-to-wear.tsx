"use client";

import { cn } from "@/lib/cn";

import { PdpModuleHeading } from "../pdp-module-heading";
import { pdpModuleIntroClass } from "../pdp-module-section";
import { PdpTextReveal } from "../pdp-text-reveal";

import {
  PDP_WAYS_TO_WEAR_SECTION,
  PDP_WAYS_TO_WEAR_STYLES,
} from "./pdp-data-v2";
import { PdpV5WaysToWearCompareSlider } from "./pdp-v5-ways-to-wear-compare-slider";
import { getPdpVersionConfig } from "./pdp-version-config";
import { usePdpVersion } from "./pdp-version-context";

/**
 * v5 "Ways to wear" — before/after drag slider between shoulder and crossbody.
 */
export function PdpV5WaysToWear() {
  const { leftAlignModuleHeadings, useV4ModuleSpacing } =
    getPdpVersionConfig(usePdpVersion());
  const { headline, body } = PDP_WAYS_TO_WEAR_SECTION;
  const alignClass = leftAlignModuleHeadings
    ? "items-start text-left"
    : "items-center text-center";

  const [shoulder, crossbody] = PDP_WAYS_TO_WEAR_STYLES;

  return (
    <section
      data-header-surface="light"
      className={cn(
        "w-full shrink-0 bg-white",
        useV4ModuleSpacing ? "pt-14 pb-10" : "pt-12 pb-8",
      )}
    >
      <div
        className={cn(
          "flex flex-col",
          useV4ModuleSpacing ? "gap-8 px-4" : "gap-6 px-3",
        )}
      >
        <div className={cn("flex flex-col gap-3", alignClass)}>
          <PdpModuleHeading
            spacing="none"
            className={leftAlignModuleHeadings ? "text-left" : "text-center"}
          >
            {headline}
          </PdpModuleHeading>
          <PdpTextReveal
            as="p"
            delay={100}
            className={pdpModuleIntroClass(
              leftAlignModuleHeadings ? "left" : "center",
            )}
          >
            {body}
          </PdpTextReveal>
        </div>

        <PdpV5WaysToWearCompareSlider
          styles={[shoulder, crossbody]}
          leftAlign={leftAlignModuleHeadings}
        />
      </div>
    </section>
  );
}
