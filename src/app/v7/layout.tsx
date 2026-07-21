import type { ReactNode } from "react";

import "./pdp-v7.css";
import { PdpV7RootMarker } from "./pdp-v7-root-marker";

/** v7 route scope — inherits v6 with all colorway swatches always open. All v7-only CSS is scoped under this attribute. */
export default function V7Layout({ children }: { children: ReactNode }) {
  return (
    <div data-pdp-version="v7">
      <PdpV7RootMarker />
      {children}
    </div>
  );
}
