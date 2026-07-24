"use client";

import { useIsUxrStudyRoute } from "./use-uxr-study-route";
import { getPdpVersionConfig } from "./version/pdp-version-config";
import { usePdpVersion } from "./version/pdp-version-context";

/**
 * Whether this page should render UXR black/beige media packs.
 * True on `/uxr1`–`/uxr3` and on soft-hidden `/v5`–`/v7` (same study assets).
 */
export function useUxrStudyMedia(): boolean {
  const isUxrRoute = useIsUxrStudyRoute();
  const { useUxrStudyMedia } = getPdpVersionConfig(usePdpVersion());
  return isUxrRoute || useUxrStudyMedia;
}
