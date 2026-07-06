import type { ReactNode } from "react";

import "./pdp-v4.css";
import { PdpV4RootMarker } from "./pdp-v4-root-marker";

/** v4 route scope — Paper r5 pivot. All v4-only CSS is scoped under this attribute. */
export default function V4Layout({ children }: { children: ReactNode }) {
  return (
    <div data-pdp-version="v4">
      <PdpV4RootMarker />
      {children}
    </div>
  );
}
