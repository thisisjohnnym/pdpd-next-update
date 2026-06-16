import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type SafeAreaMainProps = {
  children: ReactNode;
  className?: string;
  as?: "main" | "div" | "section";
  /** Skip top inset — use when an edge-to-edge hero sits above this container */
  omitTop?: boolean;
};

/**
 * Default document-flow container — all normal content lives inside the safe area.
 * Edge-to-edge sections opt out via `.pdp-edge-to-edge` / `.pdp-hero-immersive`.
 */
export function SafeAreaMain({
  children,
  className,
  as: Component = "div",
  omitTop = false,
}: SafeAreaMainProps) {
  return (
    <Component
      className={cn(
        "pdp-safe-area-main w-full",
        omitTop && "pdp-safe-area-main--no-top",
        className,
      )}
    >
      {children}
    </Component>
  );
}
