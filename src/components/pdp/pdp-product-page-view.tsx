import { Suspense } from "react";

import {
  resolveTabbyFamilyCompareExperiment,
  TABBY_FAMILY_COMPARE_EXPERIMENT_FLAG,
} from "@/components/pdp/experiments/tabby-family-compare-resolve";
import { PdpSocialView } from "@/components/pdp/pdp-social-view";
import {
  resolveProductIdFromSlug,
  resolveTabbySlugFromRoute,
} from "@/components/pdp/pdp-product-routes";
import {
  PdpVersionProvider,
  type PdpVersion,
} from "@/components/pdp/version/pdp-version-context";

type PdpProductPageViewProps = {
  slug: string;
  searchParams: Record<string, string | string[] | undefined>;
  /** Which PDP version this route serves — defaults to the frozen v1 design */
  version?: PdpVersion;
};

export function PdpProductPageView({
  slug,
  searchParams,
  version = "v1",
}: PdpProductPageViewProps) {
  const initialProductId = resolveProductIdFromSlug(slug);
  const tabbySlug = resolveTabbySlugFromRoute(slug);
  const rawFlag = searchParams[TABBY_FAMILY_COMPARE_EXPERIMENT_FLAG];
  const searchParam = typeof rawFlag === "string" ? rawFlag : null;
  const tabbyExperimentEnabled = resolveTabbyFamilyCompareExperiment(searchParam);

  return (
    <PdpVersionProvider version={version}>
      <Suspense fallback={null}>
        <PdpSocialView
          slug={tabbySlug}
          initialProductId={initialProductId}
          tabbyExperimentEnabled={tabbyExperimentEnabled}
        />
      </Suspense>
    </PdpVersionProvider>
  );
}
