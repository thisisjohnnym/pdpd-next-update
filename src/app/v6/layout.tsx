import type { ReactNode } from "react";

import "./pdp-v6.css";
import { PdpV6RootMarker } from "./pdp-v6-root-marker";

/** v6 route scope — inherits v5 with material-grouped swatch rail. All v6-only CSS is scoped under this attribute. */
export default function V6Layout({ children }: { children: ReactNode }) {
  return (
    <div data-pdp-version="v6">
      <PdpV6RootMarker />
      {children}
    </div>
  );
}
