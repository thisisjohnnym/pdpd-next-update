"use client";

import { useSearchParams } from "next/navigation";

import { useActiveProduct } from "./pdp-active-product-context";
import { PdpCompareModule } from "./pdp-compare-module";
import { TabbyFamilyCompareExperiment } from "./experiments/tabby-family-compare-experiment";
import {
  TABBY_FAMILY_COMPARE_EXPERIMENT_FLAG,
  resolveTabbyFamilyCompareExperiment,
} from "./experiments/tabby-family-compare-flag";

type PdpCompareModuleGateProps = {
  onAddToBag?: () => void;
  onPickerOpenChange?: (open: boolean) => void;
};

/**
 * A/B gate — control renders the existing Compare the family module;
 * variant renders the Tabby family discovery experiment.
 */
export function PdpCompareModuleGate({
  onAddToBag,
  onPickerOpenChange,
}: PdpCompareModuleGateProps) {
  const searchParams = useSearchParams();
  const { productId } = useActiveProduct();
  const experimentEnabled = resolveTabbyFamilyCompareExperiment(
    searchParams.get(TABBY_FAMILY_COMPARE_EXPERIMENT_FLAG),
  );

  if (productId === "tabby" && experimentEnabled) {
    return (
      <TabbyFamilyCompareExperiment
        onAddToBag={onAddToBag}
        onPickerOpenChange={onPickerOpenChange}
      />
    );
  }

  return (
    <PdpCompareModule
      onAddToBag={onAddToBag}
      onPickerOpenChange={onPickerOpenChange}
    />
  );
}
