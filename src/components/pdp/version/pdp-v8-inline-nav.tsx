"use client";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { CoachWordmark } from "../pdp-brand-logos";
import { pdpPressableIconClass } from "../pdp-type";

type PdpV8InlineNavProps = {
  bagCount?: number;
  menuOpen?: boolean;
  onOpenMenu?: () => void;
  className?: string;
};

/**
 * Paper v8 inline header — Coach wordmark + search / MENU / CART text links
 * sitting above the gallery (not the fixed overlay chrome).
 */
export function PdpV8InlineNav({
  bagCount = 0,
  menuOpen = false,
  onOpenMenu,
  className,
}: PdpV8InlineNavProps) {
  return (
    <header
      className={cn(
        "pdp-v8-inline-nav flex w-full shrink-0 items-center justify-between",
        className,
      )}
    >
      <CoachWordmark className="h-[9px] w-auto text-neutral-900" />
      <div className="pdp-v8-inline-nav-links">
        <button
          type="button"
          aria-label="Search"
          className={cn(
            "flex h-6 w-5 items-center justify-center",
            pdpPressableIconClass,
          )}
        >
          <MaterialIcon name="search" size={20} className="text-[var(--pdp-v8-color-ink,#171717)]" />
        </button>
        <span className="pdp-v8-inline-nav-divider" aria-hidden />
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={onOpenMenu}
          className={cn(
            "font-extended text-[11px] font-medium uppercase leading-[14px]",
            pdpPressableIconClass,
          )}
        >
          MENU
        </button>
        <button
          type="button"
          aria-label={`Shopping bag, ${bagCount} item${bagCount === 1 ? "" : "s"}`}
          className={cn(
            "font-extended text-[11px] font-medium uppercase leading-[14px]",
            pdpPressableIconClass,
          )}
        >
          CART ({bagCount})
        </button>
      </div>
    </header>
  );
}
