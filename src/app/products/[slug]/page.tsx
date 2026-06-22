import { Suspense } from "react";
import type { Metadata } from "next";

import { PdpSocialView } from "@/components/pdp/pdp-social-view";
import {
  resolveTabbyFamilyCompareExperiment,
  TABBY_FAMILY_COMPARE_EXPERIMENT_FLAG,
} from "@/components/pdp/experiments/tabby-family-compare-resolve";
import { getPdpProduct } from "@/components/pdp/pdp-products";
import {
  isKiraProductSlug,
  resolveProductIdFromSlug,
  resolveTabbySlugFromRoute,
} from "@/components/pdp/pdp-product-routes";
import {
  DEFAULT_TABBY_SLUG,
  getTabbyProductTitle,
  getTabbyStyle,
  parseTabbySlug,
} from "@/components/pdp/pdp-tabby-variants";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  if (isKiraProductSlug(slug)) {
    const product = getPdpProduct("kira");

    return {
      title: `${product.summary.name} | Coach`,
      description: `${product.summary.name} in ${product.summary.subtitle.toLowerCase()}.`,
    };
  }

  const parsed = parseTabbySlug(slug);

  if (!parsed) {
    return {
      title: "Tabby Shoulder Bag | Coach",
    };
  }

  const style = getTabbyStyle(parsed.styleId);
  const title = `${getTabbyProductTitle(parsed.size, parsed.styleId)} | ${style.materialLabel}`;

  return {
    title,
    description: `${getTabbyProductTitle(parsed.size, parsed.styleId)} in ${style.materialLabel.toLowerCase()}.`,
  };
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  const { slug } = await params;
  const initialProductId = resolveProductIdFromSlug(slug);
  const tabbySlug = resolveTabbySlugFromRoute(slug);
  const query = await searchParams;
  const rawFlag = query[TABBY_FAMILY_COMPARE_EXPERIMENT_FLAG];
  const searchParam = typeof rawFlag === "string" ? rawFlag : null;
  const tabbyExperimentEnabled = resolveTabbyFamilyCompareExperiment(searchParam);

  return (
    <Suspense fallback={null}>
      <PdpSocialView
        slug={tabbySlug}
        initialProductId={initialProductId}
        tabbyExperimentEnabled={tabbyExperimentEnabled}
      />
    </Suspense>
  );
}
