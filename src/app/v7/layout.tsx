import type { ReactNode } from "react";

import "../v5/pdp-v5.css";
import "./pdp-v7.css";
import { PdpV7RootMarker } from "./pdp-v7-root-marker";

/**
 * v7 route scope — Skelly parity round (Jul 2026). Shares v5 baseline tokens via
 * imported stylesheet plus v7-only overrides (land intro, editorial beige).
 */
export default function V7Layout({ children }: { children: ReactNode }) {
  return (
    <div data-pdp-version="v7">
      <PdpV7RootMarker />
      {children}
    </div>
  );
}
