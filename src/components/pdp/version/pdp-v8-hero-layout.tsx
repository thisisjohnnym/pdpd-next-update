"use client";

import { type RefObject, useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { useActiveProduct } from "../pdp-active-product-context";
import { PdpBuyBarCompactColor } from "../pdp-buy-bar-compact-color";
import { PdpGalleryHero } from "../pdp-gallery-view";
import { PdpProductPrice } from "../pdp-product-price";
import { useOptionalTabbyVariant } from "../pdp-tabby-variant-context";
import { pdpProductTitleClass } from "../pdp-type";
import { usePdpDisplayPrice } from "../use-pdp-display-price";

import { getPdpVersionConfig } from "./pdp-version-config";
import { usePdpVersion } from "./pdp-version-context";
import { PdpV8ColorDrawer } from "./pdp-v8-color-drawer";
import { PdpV8InlineNav } from "./pdp-v8-inline-nav";
import { PdpV8ThumbnailStrip } from "./pdp-v8-thumbnail-strip";

type PdpV8HeroLayoutProps = {
  selectedColorId: string;
  onColorSelect: (id: string) => void;
  onAddToBag: () => void;
  onOpenMenu?: () => void;
  menuOpen?: boolean;
  bagCount?: number;
  onOpenReviews?: () => void;
  onOpenArTryOn?: () => void;
  sentinelRef?: RefObject<HTMLDivElement | null>;
};

/**
 * v8 alternate hero — flex column in document flow:
 * inline nav → gallery (flex-1) → product info. Color drawer is absolute on
 * product info only (grows up). Paper page v8.
 */
export function PdpV8HeroLayout({
  selectedColorId,
  onColorSelect,
  onAddToBag,
  onOpenMenu,
  menuOpen = false,
  bagCount = 0,
  onOpenReviews,
  onOpenArTryOn,
  sentinelRef,
}: PdpV8HeroLayoutProps) {
  const { product, productId } = useActiveProduct();
  const tabby = useOptionalTabbyVariant();
  const {
    showHeroThumbnailStrip,
    useAbsoluteColorDrawer,
    useInlineHeroNav,
    hideBuyBarAtbIcon,
  } = getPdpVersionConfig(usePdpVersion());
  const [colorDrawerOpen, setColorDrawerOpen] = useState(false);

  const summary =
    productId === "tabby" && tabby ? tabby.summary : product.summary;
  const displayPrice = usePdpDisplayPrice(summary.price);

  return (
    <div className="pdp-v8-hero relative flex w-full flex-col bg-white">
      {useInlineHeroNav ? (
        <PdpV8InlineNav
          bagCount={bagCount}
          menuOpen={menuOpen}
          onOpenMenu={onOpenMenu}
        />
      ) : null}

      {/*
        Land stack: gallery + product info share one flex column so the gallery
        sits in normal flow between nav and buy box (not a full-viewport absolute
        layer). Thumbs stay inside the gallery provider via afterGallery.
      */}
      <div className="pdp-v8-land-stack">
        <PdpGalleryHero
          onOpenReviews={onOpenReviews}
          onOpenArTryOn={onOpenArTryOn}
          fillFrame
          afterGallery={
            <div className="pdp-v8-product-info">
              {useAbsoluteColorDrawer ? (
                <PdpV8ColorDrawer
                  open={colorDrawerOpen}
                  onOpenChange={setColorDrawerOpen}
                  selectedColorId={selectedColorId}
                  onColorSelect={onColorSelect}
                />
              ) : null}

              {showHeroThumbnailStrip ? <PdpV8ThumbnailStrip /> : null}

              <div className="pdp-v8-info-row">
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <p
                    className={cn(
                      pdpProductTitleClass,
                      "pdp-v8-title text-pretty text-black",
                    )}
                  >
                    {summary.name}
                    <span className="block font-normal text-neutral-900">
                      {summary.subtitle.startsWith("In ")
                        ? summary.subtitle
                        : `In ${summary.subtitle}`}
                    </span>
                  </p>
                  <PdpProductPrice
                    price={displayPrice.price}
                    compareAtPrice={displayPrice.compareAtPrice}
                    className="pdp-v8-price leading-none"
                  />
                </div>
                <PdpBuyBarCompactColor
                  selectedColorId={selectedColorId}
                  onColorSelect={onColorSelect}
                  onOpenAbsoluteDrawer={() => setColorDrawerOpen(true)}
                  variant="dot"
                  className="shrink-0"
                />
              </div>

              <button
                type="button"
                onClick={onAddToBag}
                className="pdp-v8-atb"
              >
                {!hideBuyBarAtbIcon ? (
                  <MaterialIcon
                    name="shopping_bag"
                    size={18}
                    className="shrink-0 text-white"
                    aria-hidden
                  />
                ) : null}
                <span>Add to bag</span>
              </button>
            </div>
          }
        />
      </div>

      <div
        ref={sentinelRef}
        aria-hidden
        className="h-0 w-full shrink-0 overflow-hidden"
      />
    </div>
  );
}
