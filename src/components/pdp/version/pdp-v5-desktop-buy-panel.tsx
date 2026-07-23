"use client";

import { cn } from "@/lib/cn";

import { useActiveProduct } from "../pdp-active-product-context";
import { PdpBuyBarRow } from "../pdp-buy-bar-row";
import { PdpBuyBarCompactColor } from "../pdp-buy-bar-compact-color";
import { PdpProductPrice } from "../pdp-product-price";
import { useOptionalTabbyVariant } from "../pdp-tabby-variant-context";
import { pdpProductTitleClass, pdpType } from "../pdp-type";
import { usePdpDisplayPrice } from "../use-pdp-display-price";
import { getPdpVersionConfig } from "./pdp-version-config";
import { usePdpVersion } from "./pdp-version-context";
import { PdpV5ReviewTeaser } from "./pdp-v5-review-teaser";

type PdpV5DesktopBuyPanelProps = {
  selectedColorId: string;
  onColorSelect: (id: string) => void;
  onAddToBag: () => void;
  onViewReviews?: () => void;
  /** Portal target for the hero color tray (gallery frame on the left). */
  trayPortalRoot?: HTMLElement | null;
};

/**
 * v5 desktop buy panel (lg+ only) — sticky right rail of the desktop split.
 * Mirrors mobile land: name/price, material, compact color under price, Add to bag.
 * Store pickup sits below the fold on mobile, not in this sticky panel.
 */
export function PdpV5DesktopBuyPanel({
  selectedColorId,
  onColorSelect,
  onAddToBag,
  onViewReviews,
  trayPortalRoot,
}: PdpV5DesktopBuyPanelProps) {
  const { product, productId } = useActiveProduct();
  const tabby = useOptionalTabbyVariant();
  const { useCompactBuyBarColorDots, heroColorTrayOverlay, showSubtleReviewTeaser } =
    getPdpVersionConfig(usePdpVersion());
  const summary =
    productId === "tabby" && tabby ? tabby.summary : product.summary;
  const displayPrice = usePdpDisplayPrice(summary.price);

  return (
    <div className="pdp-v5-desktop-buy-panel flex w-full min-w-0 flex-col gap-0 bg-white">
      <div className="flex min-w-0 flex-col gap-3 pb-4 lg:gap-4">
        <div className="flex min-w-0 flex-col gap-0">
          <div className="flex min-w-0 items-baseline justify-between gap-x-3">
            <p
              className={cn(
                pdpProductTitleClass,
                "min-w-0 text-pretty text-lg leading-tight text-black",
              )}
            >
              {summary.name}
            </p>
            <PdpProductPrice
              price={displayPrice.price}
              compareAtPrice={displayPrice.compareAtPrice}
              className="shrink-0 text-lg leading-tight"
            />
          </div>
          <div className="flex min-w-0 items-center justify-between gap-x-3">
            <p
              className={cn(
                pdpType.body,
                "min-w-0 leading-none text-neutral-600",
              )}
            >
              in {summary.subtitle}
            </p>
            {useCompactBuyBarColorDots && heroColorTrayOverlay ? (
              <PdpBuyBarCompactColor
                selectedColorId={selectedColorId}
                onColorSelect={onColorSelect}
                variant="compact"
                trayPortalRoot={trayPortalRoot}
              />
            ) : null}
          </div>
        </div>
        {useCompactBuyBarColorDots && !heroColorTrayOverlay ? (
          <PdpBuyBarCompactColor
            selectedColorId={selectedColorId}
            onColorSelect={onColorSelect}
            variant="rail"
            className="min-w-0"
          />
        ) : null}
      </div>

      <PdpBuyBarRow
        selectedColorId={selectedColorId}
        onColorSelect={onColorSelect}
        onAddToBag={onAddToBag}
        hideColor
        inlineColorSwatches={false}
        landCta={useCompactBuyBarColorDots}
      />
      {showSubtleReviewTeaser && onViewReviews ? (
        <div className="pt-3">
          <PdpV5ReviewTeaser onViewReviews={onViewReviews} />
        </div>
      ) : null}
    </div>
  );
}
