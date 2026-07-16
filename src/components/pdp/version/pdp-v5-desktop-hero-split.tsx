"use client";

import { PdpV5DesktopBuyPanel } from "./pdp-v5-desktop-buy-panel";
import { PdpV5DesktopMediaColumn } from "./pdp-v5-desktop-media-column";

type PdpV5DesktopHeroSplitProps = {
  selectedColorId: string;
  onColorSelect: (id: string) => void;
  onAddToBag: () => void;
  onViewReviews?: () => void;
};

/**
 * v5 desktop hero split (lg+ only) — Miu Miu-style two-column PDP land.
 *
 * Left: scrolling product media rail. Right: sticky buy panel. Toggled on with
 * the mobile hero via `lg` visibility classes in `PdpSocialView`; the grid
 * columns, sticky offset, and spacing live in `src/app/v5/pdp-v5.css`.
 */
export function PdpV5DesktopHeroSplit({
  selectedColorId,
  onColorSelect,
  onAddToBag,
  onViewReviews,
}: PdpV5DesktopHeroSplitProps) {
  return (
    <div className="pdp-v5-desktop-split hidden bg-white lg:grid">
      <div className="pdp-v5-desktop-split__media">
        <PdpV5DesktopMediaColumn />
      </div>
      <div className="pdp-v5-desktop-split__rail">
        <div className="pdp-v5-desktop-split__rail-inner">
          <PdpV5DesktopBuyPanel
            selectedColorId={selectedColorId}
            onColorSelect={onColorSelect}
            onAddToBag={onAddToBag}
            onViewReviews={onViewReviews}
          />
        </div>
      </div>
    </div>
  );
}
