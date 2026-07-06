import type { Metadata } from "next";

import { PdpProductPageView } from "@/components/pdp/pdp-product-page-view";
import {
  DEFAULT_TABBY_SLUG,
  getTabbyProductTitle,
  getTabbyStyle,
  parseTabbySlug,
} from "@/components/pdp/pdp-tabby-variants";

type V3HomeProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata(): Promise<Metadata> {
  const parsed = parseTabbySlug(DEFAULT_TABBY_SLUG);

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

export default async function V3Home({ searchParams }: V3HomeProps) {
  const query = await searchParams;

  return (
    <PdpProductPageView slug={DEFAULT_TABBY_SLUG} searchParams={query} version="v3" />
  );
}
