"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { PdpBuyBarRow } from "./pdp-buy-bar-row";
import { getAtbChromeFromColorSample } from "./pdp-color-chrome";
import { useActiveProduct } from "./pdp-active-product-context";
import { getPdpColors } from "./pdp-product-colors";
import { useOptionalTabbyVariant } from "./pdp-tabby-variant-context";
import { BOTTOM_CHROME_OFFSET } from "./pdp-viewport-chrome";
import { useBottomBarDocked } from "./use-bottom-bar-docked";
import { usePdpChromeMode } from "./use-pdp-chrome-mode";
import { useHeroEnterOnce } from "./use-hero-enter-once";

type PdpBottomActionsProps = {
  selectedColorId: string;
  onColorSelect: (id: string) => void;
  onAddToBag: () => void;
  /** Hide while a sheet/modal is open */
  suppressed?: boolean;
};

/** Fixed bottom chrome — Color + Add to bag */
export function PdpBottomActions({
  selectedColorId,
  onColorSelect,
  onAddToBag,
  suppressed = false,
}: PdpBottomActionsProps) {
  const [mounted, setMounted] = useState(false);
  const [colorSheetOpen, setColorSheetOpen] = useState(false);
  const { docked } = useBottomBarDocked();
  const { jumpBarActive } = usePdpChromeMode(mounted);
  const tabby = useOptionalTabbyVariant();
  const { productId } = useActiveProduct();
  const isTabbyProduct = productId === "tabby" && Boolean(tabby);
  const playHeroEnter = useHeroEnterOnce();

  const colors = isTabbyProduct ? tabby!.colorOptions : getPdpColors(productId);
  const activeColorId = isTabbyProduct ? tabby!.selectedColorId : selectedColorId;
  const selectedColor =
    (isTabbyProduct
      ? tabby!.colors.find((entry) => entry.id === activeColorId)
      : colors.find((entry) => entry.id === activeColorId)) ?? colors[0];
  const atbChrome = getAtbChromeFromColorSample(selectedColor?.chromeSample ?? "#0a0a0a");
  const isDarkChrome = atbChrome.isDarkBackdrop;
  const atbUsesRoundedPill = !docked || isDarkChrome || isTabbyProduct;
  const chromeHidden = suppressed || jumpBarActive;
  const dockedContentInset = docked ? "px-2 lg:px-5" : "";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const bar = (
    <div
      className={cn(
        "flex w-full items-stretch gap-2 transition-[gap,padding] duration-300 ease-out",
        isTabbyProduct ? "gap-1.5" : "gap-2",
        isTabbyProduct && docked && dockedContentInset,
        playHeroEnter && "pdp-hero-bottom-enter",
      )}
    >
      <PdpBuyBarRow
        selectedColorId={selectedColorId}
        onColorSelect={onColorSelect}
        onAddToBag={onAddToBag}
        onColorSheetOpenChange={setColorSheetOpen}
        squared={!atbUsesRoundedPill}
        elevated={!docked}
      />
    </div>
  );

  return createPortal(
    <>
      <footer
        className={cn(
          "pointer-events-none fixed inset-x-0 z-40 transition-[transform,padding] duration-300 ease-out",
          chromeHidden || colorSheetOpen ? "translate-y-full" : "translate-y-0",
        )}
        style={{
          bottom: BOTTOM_CHROME_OFFSET,
          paddingBottom: atbUsesRoundedPill ? "0.625rem" : 0,
          paddingLeft: "var(--hero-inset, calc(var(--hero-reveal, 0) * 8px))",
          paddingRight: "var(--hero-inset, calc(var(--hero-reveal, 0) * 8px))",
        }}
      >
        <div
          className={cn(
            "relative z-[1] transition-[padding] duration-300 ease-out",
            docked ? "pt-0" : "pt-2.5",
          )}
        >
          {docked ? (
            <div className="pointer-events-auto w-full">{bar}</div>
          ) : (
            <PageGrid fullWidth className="pointer-events-auto">
              <GridItem mobile={12} desktop={24}>{bar}</GridItem>
            </PageGrid>
          )}
        </div>
      </footer>
    </>,
    document.body,
  );
}
