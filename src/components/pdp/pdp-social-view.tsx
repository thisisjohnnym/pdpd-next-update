"use client";

import { Suspense, useEffect, useState } from "react";

import { cn } from "@/lib/cn";

import { SafeAreaMain } from "@/components/layout/safe-area-main";
import { useActiveProduct, PdpActiveProductProvider } from "./pdp-active-product-context";
import { PdpAddToBagSheet } from "./pdp-add-to-bag-sheet";
import { PdpArTryOnSheet } from "./pdp-ar-try-on-sheet";
import { PdpBottomActions } from "./pdp-bottom-actions";
import { PdpBrowserChromeSync } from "./pdp-browser-chrome-sync";
import { getDefaultColorId } from "./pdp-product-colors";
import {
  PdpProductUrlSync,
  useKiraColorFromSearchParam,
} from "./pdp-product-url-sync";
import { DEFAULT_PRODUCT_ID, type PdpProductId } from "./pdp-products";
import { PdpGalleryHero, PdpGalleryView } from "./pdp-gallery-view";
import { PdpNavMenu } from "./pdp-nav-menu";
import { PdpOverlayHeader } from "./pdp-overlay-header";
import { PdpReviewsSheet } from "./pdp-reviews-sheet";
import { PdpRuntimeProvider } from "./pdp-runtime-context";
import { PdpSectionIndicator } from "./pdp-section-indicator";
import { PdpStrippedHero, PdpStaticHero, PdpStrippedView } from "./pdp-stripped-view";
import { isStaticImageHero } from "./pdp-products";
import { TabbyVariantProvider, useOptionalTabbyVariant } from "./pdp-tabby-variant-context";
import { hasTabbyColorHeroOverride } from "./pdp-tabby-colors";
import { getTabbyColorHeroObjectPosition } from "./pdp-tabby-color-media";
import { PdpHeroEnterProvider } from "./use-hero-enter-once";
import { DEFAULT_TABBY_SLUG } from "./pdp-tabby-variants";
import type { PdpBundleAddPayload, PdpStrapSetAddPayload } from "./pdp-data";
import { TabbyFamilyCompareExperimentProvider } from "./experiments/tabby-family-compare-flag";
import { PdpScrollProvider } from "./use-coalesced-scroll";

type BagConfirmation =
  | { type: "product" }
  | { type: "bundle"; payload: PdpBundleAddPayload };

export function PdpSocialView({
  slug = DEFAULT_TABBY_SLUG,
  initialProductId = DEFAULT_PRODUCT_ID,
  tabbyExperimentEnabled = false,
}: {
  slug?: string;
  initialProductId?: PdpProductId;
  tabbyExperimentEnabled?: boolean;
}) {
  return (
    <PdpActiveProductProvider initialProductId={initialProductId}>
      <PdpRuntimeProvider>
        <PdpScrollProvider>
          <Suspense fallback={null}>
            <TabbyFamilyCompareExperimentProvider initialEnabled={tabbyExperimentEnabled}>
              <TabbyVariantProvider slug={slug}>
                <PdpHeroEnterProvider>
                  <PdpSocialViewInner />
                </PdpHeroEnterProvider>
              </TabbyVariantProvider>
            </TabbyFamilyCompareExperimentProvider>
          </Suspense>
        </PdpScrollProvider>
      </PdpRuntimeProvider>
    </PdpActiveProductProvider>
  );
}

function PdpSocialViewInner() {
  const { productId, product } = useActiveProduct();
  const tabby = useOptionalTabbyVariant();
  const [selectedColorId, setSelectedColorId] = useState(() =>
    getDefaultColorId(productId),
  );
  const [navOpen, setNavOpen] = useState(false);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [reviewsFeedFilter, setReviewsFeedFilter] = useState<
    "reviews" | "comments"
  >("reviews");
  const [bagSheetOpen, setBagSheetOpen] = useState(false);
  const [strapOptionsOpen, setStrapOptionsOpen] = useState(false);
  const [comparePickerOpen, setComparePickerOpen] = useState(false);
  const [arTryOnOpen, setArTryOnOpen] = useState(false);
  const [bagCount, setBagCount] = useState(0);
  const [bagConfirmation, setBagConfirmation] = useState<BagConfirmation>({
    type: "product",
  });

  const activeColorId =
    productId === "tabby" && tabby ? tabby.selectedColorId : selectedColorId;

  const selectedTabbyColor =
    productId === "tabby" && tabby
      ? tabby.colors.find((entry) => entry.id === activeColorId)
      : null;
  const tabbyColorHero =
    selectedTabbyColor && hasTabbyColorHeroOverride(selectedTabbyColor)
      ? selectedTabbyColor
      : null;

  useKiraColorFromSearchParam(productId, selectedColorId, setSelectedColorId);

  const handleAddToBag = () => {
    setBagCount((count) => count + 1);
    setBagConfirmation({ type: "product" });
    setBagSheetOpen(true);
  };

  const handleAddSetToBag = (payload: PdpStrapSetAddPayload) => {
    const count = payload.optionIds.length + (payload.includeBag ? 1 : 0);
    setBagCount((current) => current + count);
    if (payload.includeBag) {
      setBagConfirmation({ type: "product" });
      setBagSheetOpen(true);
    }
  };

  const handleAddBundle = (payload: PdpBundleAddPayload) => {
    setBagCount((count) => count + payload.items.length);
    setBagConfirmation({ type: "bundle", payload });
    setBagSheetOpen(true);
  };

  const openReviews = (feed: "reviews" | "comments" = "reviews") => {
    setReviewsFeedFilter(feed);
    setReviewsOpen(true);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    setSelectedColorId(getDefaultColorId(productId));
  }, [productId]);

  const isStripped = product.layout === "stripped";
  const isStaticHero = isStripped && isStaticImageHero(product.hero);
  const isColorHero = Boolean(tabbyColorHero);
  const chromeSuppressed =
    navOpen ||
    reviewsOpen ||
    bagSheetOpen ||
    strapOptionsOpen ||
    comparePickerOpen ||
    arTryOnOpen;

  return (
    <div
      className={cn(
        "relative min-h-svh w-full overflow-x-clip",
        isStaticHero || isColorHero ? "bg-white" : "bg-black",
      )}
    >
      <PdpBrowserChromeSync />
      <PdpProductUrlSync activeColorId={activeColorId} />
      <PdpOverlayHeader
        bagCount={bagCount}
        onOpenMenu={() => setNavOpen(true)}
      />
      {!isStripped ? (
        <PdpSectionIndicator suppressed={chromeSuppressed} />
      ) : null}
      {tabbyColorHero ? null : isStripped && product.hero.kind === "image" && !isStaticHero ? (
        <PdpStrippedHero
          src={product.hero.src}
          alt={product.hero.alt}
          objectPosition={product.hero.objectPosition}
          onOpenReviews={() => openReviews("comments")}
        />
      ) : !isStaticHero && !tabbyColorHero && product.hero.kind === "video" ? (
        <PdpGalleryHero
          videoSrc={product.hero.videoSrc}
          poster={product.hero.poster}
          alt={product.hero.alt}
          onOpenReviews={() => openReviews("comments")}
          onOpenArTryOn={() => setArTryOnOpen(true)}
        />
      ) : null}
      <SafeAreaMain className="bg-white" omitTop>
        {tabbyColorHero ? (
          <PdpStaticHero
            hero={{
              src: tabbyColorHero.hero,
              alt: tabbyColorHero.heroAlt,
              objectPosition: getTabbyColorHeroObjectPosition(tabbyColorHero.id),
              aspect: "4/5",
            }}
            onOpenReviews={() => openReviews("comments")}
            onOpenArTryOn={() => setArTryOnOpen(true)}
          />
        ) : isStaticHero && product.hero.kind === "image" ? (
          <PdpStaticHero
            hero={product.hero}
            onOpenReviews={() => openReviews("comments")}
          />
        ) : null}
        {isStripped ? (
          <PdpStrippedView
            product={product}
            onOpenReviews={() => openReviews("comments")}
            onReadAllReviews={() => openReviews("reviews")}
            onWriteReview={() => openReviews("reviews")}
            onAddSimilarToBag={() => {
              setBagCount((count) => count + 1);
            }}
          />
        ) : (
          <PdpGalleryView
            omitHero
            onOpenReviews={() => openReviews("comments")}
            onReadAllReviews={() => openReviews("reviews")}
            onWriteReview={() => openReviews("reviews")}
            onAddSimilarToBag={() => {
              setBagCount((count) => count + 1);
            }}
            onAddBundle={handleAddBundle}
            onAddSetToBag={handleAddSetToBag}
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
        suppressed={chromeSuppressed}
      />
      <PdpNavMenu open={navOpen} onClose={() => setNavOpen(false)} />
      <PdpReviewsSheet
        open={reviewsOpen}
        onClose={() => setReviewsOpen(false)}
        openFeedFilter={reviewsFeedFilter}
      />
      {!isStripped ? (
        <PdpArTryOnSheet
          open={arTryOnOpen}
          onClose={() => setArTryOnOpen(false)}
          onAddToBag={() => {
            setArTryOnOpen(false);
            handleAddToBag();
          }}
        />
      ) : null}
      <PdpAddToBagSheet
        open={bagSheetOpen}
        onClose={() => setBagSheetOpen(false)}
        selectedColorId={activeColorId}
        onQuickAdd={() => {
          setBagCount((count) => count + 1);
        }}
        confirmation={bagConfirmation}
      />
    </div>
  );
}
