"use client";

import { Suspense, useEffect, useState } from "react";

import { SafeAreaMain } from "@/components/layout/safe-area-main";
import { useActiveProduct, PdpActiveProductProvider } from "./pdp-active-product-context";
import { PdpAddToBagSheet } from "./pdp-add-to-bag-sheet";
import { PdpBottomActions } from "./pdp-bottom-actions";
import { PdpBrowserChromeSync } from "./pdp-browser-chrome-sync";
import { DEFAULT_COLOR_ID } from "./pdp-data";
import { PdpGalleryHero, PdpGalleryView } from "./pdp-gallery-view";
import { PdpNavMenu } from "./pdp-nav-menu";
import { PdpOverlayHeader } from "./pdp-overlay-header";
import { PdpReviewsSheet } from "./pdp-reviews-sheet";
import { PdpRuntimeProvider } from "./pdp-runtime-context";
import { PdpStrippedHero, PdpStrippedView } from "./pdp-stripped-view";
import { TabbyVariantProvider, useOptionalTabbyVariant } from "./pdp-tabby-variant-context";
import { PdpHeroEnterProvider } from "./use-hero-enter-once";
import { DEFAULT_TABBY_SLUG } from "./pdp-tabby-variants";
import type { PdpBundleAddPayload } from "./pdp-data";
import { PdpScrollProvider } from "./use-coalesced-scroll";

type BagConfirmation =
  | { type: "product" }
  | { type: "bundle"; payload: PdpBundleAddPayload };

export function PdpSocialView({ slug = DEFAULT_TABBY_SLUG }: { slug?: string }) {
  return (
    <PdpActiveProductProvider>
      <PdpRuntimeProvider>
        <PdpScrollProvider>
          <Suspense fallback={null}>
            <TabbyVariantProvider slug={slug}>
              <PdpHeroEnterProvider>
                <PdpSocialViewInner />
              </PdpHeroEnterProvider>
            </TabbyVariantProvider>
          </Suspense>
        </PdpScrollProvider>
      </PdpRuntimeProvider>
    </PdpActiveProductProvider>
  );
}

function PdpSocialViewInner() {
  const { productId, product } = useActiveProduct();
  const tabby = useOptionalTabbyVariant();
  const [selectedColorId, setSelectedColorId] = useState(DEFAULT_COLOR_ID);
  const [navOpen, setNavOpen] = useState(false);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [bagSheetOpen, setBagSheetOpen] = useState(false);
  const [strapOptionsOpen, setStrapOptionsOpen] = useState(false);
  const [comparePickerOpen, setComparePickerOpen] = useState(false);
  const [bagCount, setBagCount] = useState(0);
  const [bagConfirmation, setBagConfirmation] = useState<BagConfirmation>({
    type: "product",
  });

  const activeColorId = tabby?.selectedColorId ?? selectedColorId;

  const handleAddToBag = () => {
    setBagCount((count) => count + 1);
    setBagConfirmation({ type: "product" });
    setBagSheetOpen(true);
  };

  const handleQuickAddToBag = () => {
    setBagCount((count) => count + 1);
  };

  const handleAddBundle = (payload: PdpBundleAddPayload) => {
    setBagCount((count) => count + payload.items.length);
    setBagConfirmation({ type: "bundle", payload });
    setBagSheetOpen(true);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [productId]);

  const isStripped = product.layout === "stripped";

  return (
    <div className="relative min-h-svh w-full overflow-x-clip bg-black">
      <PdpBrowserChromeSync />
      <PdpOverlayHeader
        bagCount={bagCount}
        onOpenMenu={() => setNavOpen(true)}
      />
      {isStripped && product.hero.kind === "image" ? (
        <PdpStrippedHero
          src={product.hero.src}
          alt={product.hero.alt}
          objectPosition={product.hero.objectPosition}
          onOpenReviews={() => setReviewsOpen(true)}
        />
      ) : product.hero.kind === "video" ? (
        <PdpGalleryHero
          videoSrc={product.hero.videoSrc}
          poster={product.hero.poster}
          alt={product.hero.alt}
          onOpenReviews={() => setReviewsOpen(true)}
        />
      ) : null}
      <SafeAreaMain className="bg-white" omitTop>
        {isStripped ? (
          <PdpStrippedView
            product={product}
            onOpenReviews={() => setReviewsOpen(true)}
          />
        ) : (
          <PdpGalleryView
            omitHero
            onOpenReviews={() => setReviewsOpen(true)}
            onAddSimilarToBag={handleQuickAddToBag}
            onAddBundle={handleAddBundle}
            onQuickAddStrap={() => handleQuickAddToBag()}
            onStrapOptionsOpenChange={setStrapOptionsOpen}
            onComparePickerOpenChange={setComparePickerOpen}
            selectedColorId={activeColorId}
          />
        )}
      </SafeAreaMain>
      <PdpBottomActions
        selectedColorId={activeColorId}
        onColorSelect={setSelectedColorId}
        onAddToBag={handleAddToBag}
        suppressed={
          navOpen ||
          reviewsOpen ||
          bagSheetOpen ||
          strapOptionsOpen ||
          comparePickerOpen
        }
      />
      <PdpNavMenu open={navOpen} onClose={() => setNavOpen(false)} />
      <PdpReviewsSheet open={reviewsOpen} onClose={() => setReviewsOpen(false)} />
      <PdpAddToBagSheet
        open={bagSheetOpen}
        onClose={() => setBagSheetOpen(false)}
        selectedColorId={activeColorId}
        onQuickAdd={handleQuickAddToBag}
        confirmation={bagConfirmation}
      />
    </div>
  );
}
