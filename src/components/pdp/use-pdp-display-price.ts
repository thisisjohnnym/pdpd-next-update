"use client";

import { useOptionalTabbyVariant } from "./pdp-tabby-variant-context";
import type { TabbySize } from "./pdp-tabby-variants";

import { PDP_V5_SALE_PRICES } from "./version/pdp-data-v2";
import { getPdpVersionConfig } from "./version/pdp-version-config";
import { usePdpVersion } from "./version/pdp-version-context";

/** Resolve list vs sale price for the hero / buy panel (v5 sale merchandising). */
export function usePdpDisplayPrice(listPrice: string): {
  price: string;
  compareAtPrice?: string;
} {
  const { showSalePricing } = getPdpVersionConfig(usePdpVersion());
  const tabby = useOptionalTabbyVariant();

  if (!showSalePricing) {
    return { price: listPrice };
  }

  const size = tabby?.size as TabbySize | undefined;
  const salePrice = size ? PDP_V5_SALE_PRICES[size] : undefined;

  if (!salePrice || salePrice === listPrice) {
    return { price: listPrice };
  }

  // Sale price only — no struck list price beside it (v5 / v6).
  return { price: salePrice };
}
