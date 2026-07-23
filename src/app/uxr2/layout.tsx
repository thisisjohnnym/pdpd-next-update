import type { ReactNode } from "react";

import "../v6/pdp-v6.css";
import { PdpUxr2RootMarker } from "./pdp-uxr2-root-marker";

/**
 * UXR study 2 — v6 with collapsed swatches + See more colorways.
 * Reuses version="v6" + data-pdp-version="v6" so existing CSS/config apply.
 */
export default function Uxr2Layout({ children }: { children: ReactNode }) {
  return (
    <div data-pdp-version="v6">
      <PdpUxr2RootMarker />
      {children}
    </div>
  );
}
