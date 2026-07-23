import type { PdpProductId } from "./pdp-products";
import { getUxrStudyId } from "./pdp-uxr-study";
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

// fallow-ignore-next-line unused-export
export function productPath(
  productId: PdpProductId,
  options: { tabbySlug?: string; colorId?: string } = {},
): string {
  if (productId === "kira") {
    return kiraProductPath(options.colorId);
  }

  return tabbyProductPath(options.tabbySlug ?? DEFAULT_TABBY_SLUG, options.colorId);
}

/** Route prefix for a PDP version — empty for legacy v1. */
// fallow-ignore-next-line unused-export
export function pdpVersionPrefix(version: PdpVersion): string {
  return version === "v1" ? "" : `/${version}`;
}

/** True when the pathname is a version home route (`/`, `/v5`, …) not `/products/…`. */
// fallow-ignore-next-line unused-export
export function isPdpVersionHomePathname(
  pathname: string,
  version: PdpVersion,
): boolean {
  const home = pdpVersionPrefix(version) || "/";

  if (pathname.includes("/products/")) {
    return false;
  }

  return pathname === home || pathname === `${home}/`;
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

  return `${pdpVersionPrefix(version)}${path}`;
}

/**
 * Shareable Tabby URL that preserves the active version and whether the shopper
 * is on a version home route (`/v5`) vs a product route (`/v5/products/…`).
 */
// fallow-ignore-next-line unused-export
export function tabbyBrowserUrl(
  version: PdpVersion,
  slug: string,
  colorId?: string,
  pathname?: string,
): string {
  const currentPath =
    pathname ?? (typeof window !== "undefined" ? window.location.pathname : "");
  const query = colorId ? `?color=${encodeURIComponent(colorId)}` : "";

  // UXR study aliases (`/uxr1`→v5, `/uxr2`→v6, `/uxr3`→v7) — keep the public prefix.
  const uxrId = getUxrStudyId(currentPath);
  if (uxrId) {
    const onProduct = currentPath.includes("/products/");
    if (!onProduct) {
      return `/${uxrId}${query}`;
    }
    return `/${uxrId}/products/${slug}${query}`;
  }

  if (isPdpVersionHomePathname(currentPath, version)) {
    const home = pdpVersionPrefix(version) || "/";
    return `${home}${query}`;
  }

  return versionedProductPath(version, "tabby", { tabbySlug: slug, colorId });
}

/** In-place URL update — color/style changes within the active product */
export function replaceProductBrowserUrl(path: string): void {
  if (typeof window === "undefined") {
    return;
  }

  window.history.replaceState(window.history.state, "", path);
}

/** Version-aware in-place URL sync for Tabby style/size/color changes. */
export function replaceTabbyBrowserUrl(
  version: PdpVersion,
  slug: string,
  colorId?: string,
): void {
  replaceProductBrowserUrl(tabbyBrowserUrl(version, slug, colorId));
}
