"use client";

import { cn } from "@/lib/cn";

import { PdpLeatherAgingCareUpsell } from "../pdp-leather-aging-care-upsell";
import { PdpModuleHeading } from "../pdp-module-heading";
import { pdpModuleIntroClass } from "../pdp-module-section";
import { PdpRevealItem } from "../pdp-reveal-item";
import { PdpTextReveal } from "../pdp-text-reveal";
import { revealStaggerDelay } from "../use-pdp-element-reveal";

import {
  PDP_WAYS_TO_WEAR_SECTION,
  PDP_WAYS_TO_WEAR_SECTION_AGING,
  PDP_WAYS_TO_WEAR_STYLES,
  PDP_WAYS_TO_WEAR_STYLES_AGING,
} from "./pdp-data-v2";
import { PdpV5WaysToWearCompareSlider } from "./pdp-v5-ways-to-wear-compare-slider";
import { getPdpVersionConfig } from "./pdp-version-config";
import { usePdpVersion } from "./pdp-version-context";

/**
 * v5 "Ways to wear" — shoulder/crossbody on v5; leather aging wipe on v7 (Skelly).
 */
// fallow-ignore-next-line complexity
export function PdpV5WaysToWear({
  onQuickAdd,
}: {
  onQuickAdd?: () => void;
} = {}) {
  const {
    leftAlignModuleHeadings,
    useV4ModuleSpacing,
    useLeatherAgingWaysToWear,
    showLeatherCareUpsell,
  } = getPdpVersionConfig(usePdpVersion());
  const section = useLeatherAgingWaysToWear
    ? PDP_WAYS_TO_WEAR_SECTION_AGING
    : PDP_WAYS_TO_WEAR_SECTION;
  const styles = useLeatherAgingWaysToWear
    ? PDP_WAYS_TO_WEAR_STYLES_AGING
    : PDP_WAYS_TO_WEAR_STYLES;
  const { headline, body } = section;
  const alignClass = leftAlignModuleHeadings
    ? "items-start text-left"
    : "items-center text-center";

  const [leftStyle, rightStyle] = styles;

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
          styles={[leftStyle, rightStyle]}
          leftAlign={leftAlignModuleHeadings}
          tablistLabel={
            useLeatherAgingWaysToWear ? "Leather aging" : "Compare options"
          }
          sliderLabel={
            useLeatherAgingWaysToWear
              ? "Compare new leather and two years of wear"
              : "Compare left and right views"
          }
        />

        {useLeatherAgingWaysToWear && showLeatherCareUpsell ? (
          <PdpRevealItem delay={revealStaggerDelay(3)} className="w-full">
            <PdpLeatherAgingCareUpsell
              stageIndex={1}
              alwaysVisible
              onQuickAdd={onQuickAdd}
            />
          </PdpRevealItem>
        ) : null}
      </div>
    </section>
  );
}
