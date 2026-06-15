"use client";

import { useState } from "react";

import { PdpAddToBagSheet } from "./pdp-add-to-bag-sheet";
import { PdpBottomActions } from "./pdp-bottom-actions";
import { PdpBrowserChromeSync } from "./pdp-browser-chrome-sync";
import { DEFAULT_COLOR_ID, PDP_FAMILY_SIZES } from "./pdp-data";
import { PdpGalleryView } from "./pdp-gallery-view";
import { PdpOverlayHeader } from "./pdp-overlay-header";
import { PdpReviewsSheet } from "./pdp-reviews-sheet";
import type { PdpBundleAddPayload } from "./pdp-data";

type BagConfirmation =
  | { type: "product" }
  | { type: "bundle"; payload: PdpBundleAddPayload };

export function PdpSocialView() {
  const [selectedColorId, setSelectedColorId] = useState(DEFAULT_COLOR_ID);
  const [selectedFamilySizeId, setSelectedFamilySizeId] = useState<string>(
    PDP_FAMILY_SIZES.selectedId,
  );
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [bagSheetOpen, setBagSheetOpen] = useState(false);
  const [strapOptionsOpen, setStrapOptionsOpen] = useState(false);
  const [bagCount, setBagCount] = useState(0);
  const [bagConfirmation, setBagConfirmation] = useState<BagConfirmation>({
    type: "product",
  });

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

  return (
    <div
      className="relative w-full bg-black"
      style={{ minHeight: "var(--pdp-screen-height, 100dvh)" }}
    >
      <PdpBrowserChromeSync />
      <PdpGalleryView
        onOpenReviews={() => setReviewsOpen(true)}
        onAddSimilarToBag={handleQuickAddToBag}
        onAddBundle={handleAddBundle}
        onQuickAddStrap={() => handleQuickAddToBag()}
        onStrapOptionsOpenChange={setStrapOptionsOpen}
        selectedColorId={selectedColorId}
      />

      <PdpOverlayHeader bagCount={bagCount} />
      <PdpBottomActions
        selectedColorId={selectedColorId}
        onColorSelect={setSelectedColorId}
        selectedFamilySizeId={selectedFamilySizeId}
        onFamilySizeSelect={setSelectedFamilySizeId}
        onAddToBag={handleAddToBag}
        suppressed={reviewsOpen || bagSheetOpen || strapOptionsOpen}
      />
      <PdpReviewsSheet open={reviewsOpen} onClose={() => setReviewsOpen(false)} />
      <PdpAddToBagSheet
        open={bagSheetOpen}
        onClose={() => setBagSheetOpen(false)}
        selectedColorId={selectedColorId}
        onQuickAdd={handleQuickAddToBag}
        confirmation={bagConfirmation}
      />
    </div>
  );
}
