"use client";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { useActiveProduct } from "./pdp-active-product-context";
import { getAtbChromeFromColorSample } from "./pdp-color-chrome";
import { PdpColorSelector } from "./pdp-color-selector";
import { pdpColorIsSelectable } from "./pdp-data";
import { getPdpColors } from "./pdp-product-colors";
import { useOptionalTabbyVariant } from "./pdp-tabby-variant-context";
import { pdpPressableSolidClass } from "./pdp-type";

type PdpBuyBarRowProps = {
  selectedColorId: string;
  onColorSelect: (id: string) => void;
  onAddToBag: () => void;
  onColorSheetOpenChange?: (open: boolean) => void;
  hideColor?: boolean;
  className?: string;
};

/** Color pill + Add to bag — floating CTA row (docs/pdp-hero-chrome.md). */
export function PdpBuyBarRow({
  selectedColorId,
  onColorSelect,
  onAddToBag,
  onColorSheetOpenChange,
  hideColor = false,
  className,
}: PdpBuyBarRowProps) {
  const tabby = useOptionalTabbyVariant();
  const { productId } = useActiveProduct();
  const isTabbyProduct = productId === "tabby" && Boolean(tabby);

  const colors = isTabbyProduct ? tabby!.colorOptions : getPdpColors(productId);
  const activeColorId = isTabbyProduct ? tabby!.selectedColorId : selectedColorId;
  const selectedColor =
    (isTabbyProduct
      ? tabby!.colors.find((entry) => entry.id === activeColorId)
      : colors.find((entry) => entry.id === activeColorId)) ?? colors[0];
  const atbChrome = getAtbChromeFromColorSample(selectedColor?.chromeSample ?? "#0a0a0a");

  const handleColorSheetOpenChange = (open: boolean) => {
    onColorSheetOpenChange?.(open);
  };

  const handleColorSelect = (id: string) => {
    const color = colors.find((entry) => entry.id === id);
    const combinationAvailable =
      !color ||
      !("combinationAvailable" in color) ||
      color.combinationAvailable;

    if (
      !color ||
      !combinationAvailable ||
      !pdpColorIsSelectable(color.availability)
    ) {
      return;
    }

    if (isTabbyProduct) {
      tabby!.setSelectedColorId(id);
      return;
    }

    onColorSelect(id);
  };

  return (
    <div className={cn("flex w-full items-stretch gap-2.5", className)}>
      {!hideColor ? (
        <div className={cn("flex items-center", isTabbyProduct ? "min-w-0 flex-1" : "shrink-0")}>
          <PdpColorSelector
            colors={colors}
            selectedId={activeColorId}
            onSelect={handleColorSelect}
            inline
            stretch={isTabbyProduct}
            onOpenChange={handleColorSheetOpenChange}
            heightClass="h-[50px]"
          />
        </div>
      ) : null}

      <div className={hideColor ? "min-w-0 w-full flex-1" : "min-w-0 flex-1"}>
        <button
          type="button"
          onClick={onAddToBag}
          className={cn(
            "font-extended relative isolate flex h-[50px] min-w-0 w-full items-center justify-center gap-2 overflow-hidden rounded-full px-3 text-center leading-none transition-[background-color,color,box-shadow,transform,filter] duration-300",
            pdpPressableSolidClass,
            "active:brightness-90",
          )}
          style={{
            backgroundColor: atbChrome.background,
            color: atbChrome.foreground,
            boxShadow: atbChrome.glow,
          }}
        >
          <span className="relative z-[1] flex min-w-0 items-center justify-center gap-2">
            <MaterialIcon
              name="shopping_bag"
              size={18}
              className="shrink-0 -translate-y-px"
              style={{ color: atbChrome.foreground }}
              aria-hidden
            />
            <span className="translate-y-px text-[14px]">Add to bag</span>
          </span>
        </button>
      </div>
    </div>
  );
}
