import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/cn";

type PageGridProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "header" | "section" | "footer" | "main";
  /** Full viewport width — use for immersive overlays outside 375px mobile frame */
  fullWidth?: boolean;
};

/**
 * PDP layout grid — Figma spec:
 * Mobile 12/12/4 (12 cols · 12px margin · 4px gutter)
 * Desktop 24/20/8 (24 cols · 20px margin · 8px gutter)
 */
export function PageGrid({
  children,
  className,
  as: Component = "div",
  fullWidth = false,
}: PageGridProps) {
  return (
    <Component
      className={cn(
        "pdp-grid mx-auto grid w-full grid-cols-12 gap-1 px-2 lg:grid-cols-24 lg:gap-2 lg:px-5",
        fullWidth ? "max-w-none lg:max-w-none" : "max-w-[375px] lg:max-w-[90rem]",
        className,
      )}
    >
      {children}
    </Component>
  );
}

type GridItemProps = {
  children: ReactNode;
  className?: string;
  /** Column span on mobile (1–12). Default: 12 */
  mobile?: number;
  /** Column span on desktop (1–24). Default: 24 */
  desktop?: number;
  /** Grid column start on mobile (1–12) */
  mobileStart?: number;
  /** Grid column start on desktop (1–24) */
  desktopStart?: number;
};

export function GridItem({
  children,
  className,
  mobile = 12,
  desktop = 24,
  mobileStart,
  desktopStart,
}: GridItemProps) {
  const style = {
    "--grid-span-mobile": mobile,
    "--grid-span-desktop": desktop,
    ...(mobileStart != null && {
      "--grid-column-mobile": `${mobileStart} / span ${mobile}`,
    }),
    ...(desktopStart != null && {
      "--grid-column-desktop": `${desktopStart} / span ${desktop}`,
    }),
  } as CSSProperties;

  return (
    <div className={cn("pdp-grid-item", className)} style={style}>
      {children}
    </div>
  );
}

function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-full w-full bg-white lg:max-w-[90rem]">
      {children}
    </div>
  );
}
