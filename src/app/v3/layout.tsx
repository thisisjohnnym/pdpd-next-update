import type { ReactNode } from "react";

import "./pdp-v3.css";
import { PdpV3RootMarker } from "./pdp-v3-root-marker";

/** v3 route scope — Paper r4 pivot. All v3-only CSS is scoped under this attribute. */
export default function V3Layout({ children }: { children: ReactNode }) {
  return (
    <div data-pdp-version="v3">
      <PdpV3RootMarker />
      {children}
    </div>
  );
}
