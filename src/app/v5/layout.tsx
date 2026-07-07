import type { ReactNode } from "react";

import "./pdp-v5.css";
import { PdpV5RootMarker } from "./pdp-v5-root-marker";

/** v5 route scope — Sean r5 polish round. All v5-only CSS is scoped under this attribute. */
export default function V5Layout({ children }: { children: ReactNode }) {
  return (
    <div data-pdp-version="v5">
      <PdpV5RootMarker />
      {children}
    </div>
  );
}
