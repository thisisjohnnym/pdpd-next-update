import type { ReactNode } from "react";

import "../v7/pdp-v7.css";
import { PdpUxr3RootMarker } from "./pdp-uxr3-root-marker";

/**
 * UXR study 3 — v7 with collapsed swatches + See more colorways.
 * Reuses version="v7" + data-pdp-version="v7" so existing CSS/config apply.
 */
export default function Uxr3Layout({ children }: { children: ReactNode }) {
  return (
    <div data-pdp-version="v7">
      <PdpUxr3RootMarker />
      {children}
    </div>
  );
}
