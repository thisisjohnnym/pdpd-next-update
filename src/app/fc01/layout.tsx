import type { ReactNode } from "react";

import "../v5/pdp-v5.css";
import "./pdp-fc01.css";
import { PdpFc01RootMarker } from "./pdp-fc01-root-marker";

/**
 * fc01 route scope — final-candidate UXR study, horizontal gallery.
 * Shares the v5 baseline CSS (dual selectors) plus fc01-only overrides.
 */
export default function Fc01Layout({ children }: { children: ReactNode }) {
  return (
    <div data-pdp-version="fc01">
      <PdpFc01RootMarker />
      {children}
    </div>
  );
}
