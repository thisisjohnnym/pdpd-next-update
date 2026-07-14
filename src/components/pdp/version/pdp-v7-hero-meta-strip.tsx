"use client";

import { cn } from "@/lib/cn";

import { PdpV5ReviewTeaser } from "./pdp-v5-review-teaser";
import { PdpV5StorePickupLink } from "./pdp-v5-store-pickup-link";
import { getPdpVersionConfig } from "./pdp-version-config";
import { usePdpVersion } from "./pdp-version-context";

type PdpV7HeroMetaStripProps = {
  className?: string;
};

/**
 * v7 unified pickup + reviews block — single card with row affordances.
 */
export function PdpV7HeroMetaStrip({ className }: PdpV7HeroMetaStripProps) {
  const { showStorePickupLink, showSubtleReviewTeaser } =
    getPdpVersionConfig(usePdpVersion());

  if (!showStorePickupLink && !showSubtleReviewTeaser) {
    return null;
  }

  return (
    <div
      className={cn(
        "pdp-v7-hero-meta-strip flex flex-col overflow-hidden rounded-sm border border-neutral-100 bg-neutral-50",
        className,
      )}
    >
      {showStorePickupLink ? (
        <PdpV5StorePickupLink metaStripRow />
      ) : null}
      {showSubtleReviewTeaser ? (
        <PdpV5ReviewTeaser metaStripRow showDivider={showStorePickupLink} />
      ) : null}
    </div>
  );
}
