import type { ReactNode } from "react";

import "./pdp-v8.css";
import { PdpV8RootMarker } from "./pdp-v8-root-marker";

/** v8 route scope — inherits v7 with DoorDash-style carousel reviews. All v8-only CSS is scoped under this attribute. */
export default function V8Layout({ children }: { children: ReactNode }) {
  return (
    <div data-pdp-version="v8">
      <PdpV8RootMarker />
      {children}
    </div>
  );
}
