import type { ReactNode } from "react";

/** v1 route scope — frozen current design. Marks the subtree for version-aware styling. */
export default function V1Layout({ children }: { children: ReactNode }) {
  return <div data-pdp-version="v1">{children}</div>;
}
