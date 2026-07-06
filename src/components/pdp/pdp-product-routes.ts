import type { PdpProductId } from "./pdp-products";
import type { PdpVersion } from "./version/pdp-version-context";
import {
  DEFAULT_TABBY_SLUG,
  parseTabbySlug,
  tabbyProductPath,
} from "./pdp-tabby-variants";

/** Shareable route slug for the Kira stripped PDP */
const KIRA_PRODUCT_SLUG = "kira-crossbody";

export function isKiraProductSlug(slug: string): boolean {
  return slug === KIRA_PRODUCT_SLUG;
}

export function resolveProductIdFromSlug(slug: string): PdpProductId {
  return isKiraProductSlug(slug) ? "kira" : "tabby";
}

/** Tabby variant state when the route slug belongs to another product */
export function resolveTabbySlugFromRoute(slug: string): string {
  if (isKiraProductSlug(slug)) {
    return DEFAULT_TABBY_SLUG;
  }

  return parseTabbySlug(slug) ? slug : DEFAULT_TABBY_SLUG;
}

function kiraProductPath(colorId?: string): string {
  const base = `/products/${KIRA_PRODUCT_SLUG}`;
  return colorId ? `${base}?color=${encodeURIComponent(colorId)}` : base;
}

export function productPath(
  productId: PdpProductId,
  options: { tabbySlug?: string; colorId?: string } = {},
): string {
  if (productId === "kira") {
    return kiraProductPath(options.colorId);
  }

  return tabbyProductPath(options.tabbySlug ?? DEFAULT_TABBY_SLUG, options.colorId);
}

/** Keep the active PDP version when linking to another product slug. */
export function versionedProductPath(
  version: PdpVersion,
  productId: PdpProductId,
  options: { tabbySlug?: string; colorId?: string } = {},
): string {
  const path = productPath(productId, options);

  if (version === "v1") {
    return path;
  }

  return `/${version}${path}`;
}

/** In-place URL update — color/style changes within the active product */
export function replaceProductBrowserUrl(path: string): void {
  if (typeof window === "undefined") {
    return;
  }

  window.history.replaceState(window.history.state, "", path);
}