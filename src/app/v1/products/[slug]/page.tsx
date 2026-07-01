import type { Metadata } from "next";

import { PdpProductPageView } from "@/components/pdp/pdp-product-page-view";
import { getPdpProduct } from "@/components/pdp/pdp-products";
import { isKiraProductSlug } from "@/components/pdp/pdp-product-routes";
import {
  getTabbyProductTitle,
  getTabbyStyle,
  parseTabbySlug,
} from "@/components/pdp/pdp-tabby-variants";

type V1ProductPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  params,
}: V1ProductPageProps): Promise<Metadata> {
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

export default async function V1ProductPage({ params, searchParams }: V1ProductPageProps) {
  const { slug } = await params;
  const query = await searchParams;

  return <PdpProductPageView slug={slug} searchParams={query} version="v1" />;
}
