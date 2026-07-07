"use client";

import { cn } from "@/lib/cn";

import { useActiveProduct } from "../pdp-active-product-context";
import { PdpBuyBarRow } from "../pdp-buy-bar-row";
import { PdpBuyBarCompactColor } from "../pdp-buy-bar-compact-color";
import { useOptionalTabbyVariant } from "../pdp-tabby-variant-context";
import { pdpProductPriceClass, pdpProductTitleClass, pdpType } from "../pdp-type";
import { getPdpVersionConfig } from "./pdp-version-config";
import { usePdpVersion } from "./pdp-version-context";

type PdpV5DesktopBuyPanelProps = {
  selectedColorId: string;
  onColorSelect: (id: string) => void;
  onAddToBag: () => void;
};

/**
 * v5 desktop buy panel (lg+ only) — the sticky right rail of the desktop split.
 *
 * Mirrors the v5 mobile flow (docked name/price + Add to bag, then the grouped
 * color swatches and "Explore Other Tabby Silhouettes" nav) so all selection
 * state and behavior stay shared with mobile. Placed inside a sticky wrapper by
 * the split layout so it holds while the media column scrolls.
 */
export function PdpV5DesktopBuyPanel({
  selectedColorId,
  onColorSelect,
  onAddToBag,
}: PdpV5DesktopBuyPanelProps) {
  const { product, productId } = useActiveProduct();
  const tabby = useOptionalTabbyVariant();
  const { useCompactBuyBarColorDots } = getPdpVersionConfig(usePdpVersion());
  const summary =
    productId === "tabby" && tabby ? tabby.summary : product.summary;

  return (
    <div className="pdp-v5-desktop-buy-panel flex w-full flex-col gap-6 bg-white">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between gap-4">
          <p className={cn(pdpProductTitleClass, "min-w-0 flex-1 text-lg leading-none text-neutral-900")}>
            {summary.name}
          </p>
          <p className={cn(pdpProductPriceClass, "shrink-0 text-lg leading-none text-neutral-900")}>
            {summary.price}
          </p>
        </div>

        <div className="flex items-center justify-between gap-4">
          <p className={cn(pdpType.label, "min-w-0 flex-1 text-neutral-500")}>
            {summary.subtitle}
          </p>
          {useCompactBuyBarColorDots ? (
            <PdpBuyBarCompactColor
              selectedColorId={selectedColorId}
              onColorSelect={onColorSelect}
              className="shrink-0"
            />
          ) : null}
        </div>
      </div>

      <PdpBuyBarRow
        selectedColorId={selectedColorId}
        onColorSelect={onColorSelect}
        onAddToBag={onAddToBag}
        hideColor
        inlineColorSwatches={false}
      />
    </div>
  );
}
