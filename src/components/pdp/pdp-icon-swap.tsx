import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type PdpIconSwapProps = {
  /** When true, `activeIcon` is shown; otherwise `inactiveIcon` */
  active: boolean;
  activeIcon: ReactNode;
  inactiveIcon: ReactNode;
  className?: string;
};

/**
 * Cross-fades between two icons without unmounting either, so both the enter
 * and exit animate (scale 0.25 -> 1, opacity, blur 4px -> 0). The non-overlay
 * layer defines the layout size; the overlay sits on top without affecting flow.
 */
export function PdpIconSwap({
  active,
  activeIcon,
  inactiveIcon,
  className,
}: PdpIconSwapProps) {
  return (
    <span className={cn("pdp-icon-swap", className)} aria-hidden>
      <span
        className="pdp-icon-swap__layer pdp-icon-swap__layer--overlay"
        data-active={active ? "true" : "false"}
      >
        {activeIcon}
      </span>
      <span
        className="pdp-icon-swap__layer"
        data-active={active ? "false" : "true"}
      >
        {inactiveIcon}
      </span>
    </span>
  );
}
