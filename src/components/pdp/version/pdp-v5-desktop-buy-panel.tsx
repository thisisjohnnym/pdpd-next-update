"use client";

import { cn } from "@/lib/cn";

import { useActiveProduct } from "../pdp-active-product-context";
import { PdpBuyBarRow } from "../pdp-buy-bar-row";
import { PdpHeroBelowFoldColorSwatches } from "../pdp-hero-below-fold-color-swatches";
import { useOptionalTabbyVariant } from "../pdp-tabby-variant-context";
import { pdpType } from "../pdp-type";

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
  const summary =
    productId === "tabby" && tabby ? tabby.summary : product.summary;

  return (
    <div className="pdp-v5-desktop-buy-panel flex w-full flex-col gap-6 bg-white">
      <div className="flex items-start justify-between gap-4">
        <div className="font-extended flex min-w-0 flex-col text-neutral-900">
          <p className="min-w-0 text-lg leading-[120%] tracking-[0.4px]">
            {summary.name}
          </p>
          <p className={cn(pdpType.label, "mt-1 min-w-0 text-neutral-500")}>
            {summary.subtitle}
          </p>
        </div>
        <p className="font-extended shrink-0 text-lg leading-none tabular-nums text-neutral-900">
          {summary.price}
        </p>
      </div>

      <PdpBuyBarRow
        selectedColorId={selectedColorId}
        onColorSelect={onColorSelect}
        onAddToBag={onAddToBag}
        hideColor
        inlineColorSwatches={false}
      />

      <PdpHeroBelowFoldColorSwatches
        selectedColorId={selectedColorId}
        onColorSelect={onColorSelect}
        embedded
        collapsibleSilhouettes
      />
    </div>
  );
}
