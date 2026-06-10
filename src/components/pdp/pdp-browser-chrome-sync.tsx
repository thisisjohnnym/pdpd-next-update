"use client";

import { useBrowserBottomInsetCssVar } from "./use-browser-bottom-inset";

/** Sets --pdp-browser-bottom-inset on <html> for fixed chrome + scroll offsets */
export function PdpBrowserChromeSync() {
  useBrowserBottomInsetCssVar();
  return null;
}
