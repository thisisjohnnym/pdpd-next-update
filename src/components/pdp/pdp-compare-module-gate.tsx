"use client";

import { useActiveProduct } from "./pdp-active-product-context";
import { PdpCompareModule } from "./pdp-compare-module";
import { TabbyFamilyCompareExperiment } from "./experiments/tabby-family-compare-experiment";

type PdpCompareModuleGateProps = {
  onAddToBag?: () => void;
  onPickerOpenChange?: (open: boolean) => void;
};

/**
 * Tabby PDPs use the family compare module (full attribute list, plain-language deltas).
 * Legacy compare module remains for non-Tabby products.
 */
export function PdpCompareModuleGate({
  onAddToBag,
  onPickerOpenChange,
}: PdpCompareModuleGateProps) {
  const { productId } = useActiveProduct();

  if (productId === "tabby") {
    return <TabbyFamilyCompareExperiment />;
  }

  return (
    <PdpCompareModule
      onAddToBag={onAddToBag}
      onPickerOpenChange={onPickerOpenChange}
    />
  );
}
