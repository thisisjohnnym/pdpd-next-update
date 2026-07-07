import { cn } from "@/lib/cn";
import type { CSSProperties } from "react";

type MaterialIconProps = {
  /** Material Symbols icon name — https://fonts.google.com/icons */
  name: string;
  className?: string;
  style?: CSSProperties;
  /** Optical size (default 24) */
  size?: 14 | 15 | 16 | 18 | 20 | 24 | 26;
  /** Filled variant */
  filled?: boolean;
  ariaHidden?: boolean;
};

/**
 * Google Material Symbols (Outlined by default).
 * All icons in this project should use this component.
 */
export function MaterialIcon({
  name,
  className,
  style,
  size = 24,
  filled = false,
  ariaHidden = true,
}: MaterialIconProps) {
  return (
    <span
      className={cn(
        filled ? "material-symbols-rounded" : "material-symbols-outlined",
        "inline-block leading-none select-none",
        className,
      )}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' ${size}`,
        ...style,
      }}
      aria-hidden={ariaHidden || undefined}
    >
      {name}
    </span>
  );
}
