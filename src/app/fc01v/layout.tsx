import type { ReactNode } from "react";

import "../v6/pdp-v6.css";
import "./pdp-fc01v.css";
import { PdpFc01vRootMarker } from "./pdp-fc01v-root-marker";

/**
 * fc01v route scope — final-candidate UXR study, vertical gallery variant.
 * Shares the v6 baseline CSS (dual selectors) plus fc01v-only overrides.
 */
export default function Fc01vLayout({ children }: { children: ReactNode }) {
  return (
    <div data-pdp-version="fc01v">
      <PdpFc01vRootMarker />
      {children}
    </div>
  );
}
