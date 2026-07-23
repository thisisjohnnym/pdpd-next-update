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
  PDP_WAYS_TO_WEAR_STYLES,
} from "./pdp-data-v2";
import { PdpV5WaysToWearCompareSlider } from "./pdp-v5-ways-to-wear-compare-slider";
import { getPdpVersionConfig } from "./pdp-version-config";
import { usePdpVersion } from "./pdp-version-context";

/**
 * v5 leather-aging wipe — New vs 2 years compare, with Leather Cleaner /
 * Conditioner upsell underneath (replaces the separate aging stage rail).
 *
 * Mobile: stacked heading → compare → care.
 * Desktop: flush-left compare beside a right rail of copy + care products.
 */
// fallow-ignore-next-line complexity
export function PdpV5WaysToWear({
  onQuickAdd,
}: {
  onQuickAdd?: () => void;
} = {}) {
  const {
    useV4ModuleSpacing,
    showLeatherCareUpsell,
  } = getPdpVersionConfig(usePdpVersion());
  const { headline, body } = PDP_WAYS_TO_WEAR_SECTION;
  const [newStage, agedStage] = PDP_WAYS_TO_WEAR_STYLES;

  return (
    <section
      data-header-surface="light"
      className={cn(
        "w-full shrink-0 bg-white",
        useV4ModuleSpacing ? "pt-14 pb-10 lg:pt-10 lg:pb-0" : "pt-12 pb-8 lg:pt-10 lg:pb-0",
      )}
    >
      <div
        className={cn(
          "pdp-v5-aging-sheet flex flex-col",
          useV4ModuleSpacing ? "gap-8 px-4" : "gap-6 px-3",
        )}
      >
        <div className="pdp-v5-aging-sheet__copy flex flex-col items-start gap-3 text-left">
          <PdpModuleHeading spacing="none" className="text-left">
            {headline}
          </PdpModuleHeading>
          <PdpTextReveal
            as="p"
            delay={100}
            className={pdpModuleIntroClass("left")}
          >
            {body}
          </PdpTextReveal>
        </div>

        <div className="pdp-v5-aging-sheet__media min-w-0">
          <PdpV5WaysToWearCompareSlider
            styles={[newStage, agedStage]}
            leftAlign
            tablistLabel="Leather aging"
            sliderLabel="Compare new leather and two years of wear"
          />
        </div>

        {showLeatherCareUpsell ? (
          <PdpRevealItem
            delay={revealStaggerDelay(3)}
            className="pdp-v5-aging-sheet__care w-full"
          >
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
