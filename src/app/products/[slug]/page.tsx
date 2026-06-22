import { Suspense } from "react";
import type { Metadata } from "next";

import { PdpSocialView } from "@/components/pdp/pdp-social-view";
import {
  DEFAULT_TABBY_SLUG,
  getTabbyProductTitle,
  getTabbyStyle,
  parseTabbySlug,
} from "@/components/pdp/pdp-tabby-variants";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseTabbySlug(slug);

  if (!parsed) {
    return {
      title: "Tabby Shoulder Bag | Coach",
    };
  }

  const style = getTabbyStyle(parsed.styleId);
  const title = `${getTabbyProductTitle(parsed.size)} | ${style.materialLabel}`;

  return {
    title,
    description: `${getTabbyProductTitle(parsed.size)} in ${style.materialLabel.toLowerCase()}.`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const resolvedSlug = parseTabbySlug(slug) ? slug : DEFAULT_TABBY_SLUG;

  return (
    <Suspense fallback={null}>
      <PdpSocialView slug={resolvedSlug} />
    </Suspense>
  );
}
