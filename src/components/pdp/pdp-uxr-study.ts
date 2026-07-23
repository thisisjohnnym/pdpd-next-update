/**
 * UXR study helpers — `/uxr1` (v5), `/uxr2` (v6), `/uxr3` (v7).
 * Soft-hidden `/vN` routes stay available for internal compare.
 *
 * Server-safe (no React hooks). Client hook: `use-uxr-study-route.ts`.
 */

export type UxrStudyId = "uxr1" | "uxr2" | "uxr3";

export type UxrColorPack = "black" | "beige";

const UXR_PATH_RE = /^\/(uxr[123])(\/|$)/;

/** True on `/uxr1`…`/uxr3` (and nested product paths). */
export function isUxrStudyPathname(pathname: string): boolean {
  return UXR_PATH_RE.test(pathname);
}

/** `/uxr2` from `/uxr2/products/…`, else null. */
export function getUxrStudyId(pathname: string): UxrStudyId | null {
  const match = pathname.match(UXR_PATH_RE);
  return (match?.[1] as UxrStudyId | undefined) ?? null;
}

/** Map Tabby color ids → UXR black / beige media packs. */
export function resolveUxrColorPack(colorId: string | undefined): UxrColorPack {
  switch (colorId) {
    case "brass-chalk":
    case "chalk":
    case "white":
    case "beige":
      return "beige";
    case "brass-black":
    case "black":
    case "silver-black":
    default:
      return "black";
  }
}
