import type { ReactNode } from "react";

import "../v5/pdp-v5.css";
import "../v7/pdp-v7.css";
import "./pdp-v8.css";
import { PdpV8RootMarker } from "./pdp-v8-root-marker";

/**
 * v8 route scope — alternate hero composition (Paper page v8). Shares v5/v7
 * baselines via imported stylesheets plus v8-only overrides.
 */
export default function V8Layout({ children }: { children: ReactNode }) {
  return (
    <div data-pdp-version="v8">
      <PdpV8RootMarker />
      {children}
    </div>
  );
}
