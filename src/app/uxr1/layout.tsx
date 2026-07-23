import type { ReactNode } from "react";

import "../v5/pdp-v5.css";
import { PdpUxr1RootMarker } from "./pdp-uxr1-root-marker";

/**
 * UXR study 1 — Skelly v5 baseline.
 * Reuses version="v5" + data-pdp-version="v5" so existing CSS/config apply.
 */
export default function Uxr1Layout({ children }: { children: ReactNode }) {
  return (
    <div data-pdp-version="v5">
      <PdpUxr1RootMarker />
      {children}
    </div>
  );
}
