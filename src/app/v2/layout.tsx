import type { ReactNode } from "react";

import "./pdp-v2.css";
import { PdpV2RootMarker } from "./pdp-v2-root-marker";

/** v2 route scope — stakeholder pivot. All v2-only CSS is scoped under this attribute. */
export default function V2Layout({ children }: { children: ReactNode }) {
  return (
    <div data-pdp-version="v2">
      <PdpV2RootMarker />
      {children}
    </div>
  );
}
