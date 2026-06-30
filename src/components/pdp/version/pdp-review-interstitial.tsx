"use client";

import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { PDP_REVIEWS_SUMMARY } from "../pdp-data";
import { PdpModuleHeading } from "../pdp-module-heading";
import { PdpReviewRatingSummary } from "../pdp-reviews-body";
import { PdpTextLinkCta } from "../pdp-text-link-cta";
import { pdpType } from "../pdp-type";

/**
 * v2-only mid-page ratings teaser. Compact stars + "average · count · recommend%" with a
 * link into the full reviews module below. No comments, AI card, or UGC strip.
 */
export function PdpReviewInterstitial({ onReadAll }: { onReadAll?: () => void }) {
  const { count } = PDP_REVIEWS_SUMMARY;

  return (
    <section aria-label="Customer ratings" className="w-full bg-white py-8">
      <PageGrid fullWidth>
        <GridItem mobile={12} desktop={24} className="flex min-w-0 flex-col gap-3">
          <PdpModuleHeading spacing="none">Loved by customers</PdpModuleHeading>
          <PdpReviewRatingSummary />
          {onReadAll ? (
            <PdpTextLinkCta
              type="button"
              onClick={onReadAll}
              className={cn("self-start", pdpType.body)}
            >
              Read all {count} reviews
            </PdpTextLinkCta>
          ) : null}
        </GridItem>
      </PageGrid>
    </section>
  );
}
