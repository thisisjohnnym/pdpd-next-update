"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { PdpIconSwap } from "./pdp-icon-swap";
import { pdpBottomSheetScrollRegionClass } from "./pdp-bottom-sheet";
import { PDP_NAV, type PdpNavCategory, type PdpNavHighlight } from "./pdp-nav-data";
import { pdpPressableClass, pdpPressableIconClass, pdpType } from "./pdp-type";
import { useOverlayDismiss } from "./use-overlay-dismiss";

type PdpNavMenuProps = {
  open: boolean;
  onClose: () => void;
};

type NavBrandTab = "coach" | "outlet";

function NavHighlightCard({ highlight }: { highlight: PdpNavHighlight }) {
  return (
    <button
      type="button"
      className={cn("group flex w-full flex-col gap-2 text-left", pdpPressableClass)}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden bg-neutral-100",
          highlight.layout === "full" ? "aspect-[4/3]" : "aspect-[3/4]",
        )}
      >
        <Image
          src={highlight.imageSrc}
          alt={highlight.imageAlt}
          fill
          className="object-cover object-center transition-transform duration-500 group-active:scale-[0.96]"
          sizes={highlight.layout === "full" ? "100vw" : "50vw"}
        />
      </div>
      <span className="font-extended text-center text-xs tracking-[0.2px] text-black">
        {highlight.label}
      </span>
    </button>
  );
}

function NavAccordionItem({
  category,
  open,
  onToggle,
}: {
  category: PdpNavCategory;
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = `nav-panel-${category.id}`;

  return (
    <div className="border-b border-neutral-200">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className={cn(
          "flex w-full min-h-11 items-center justify-between gap-3 py-3.5 text-left",
          pdpPressableClass,
        )}
      >
        <span className="font-extended text-sm tracking-[0.2px] text-black">
          {category.label}
        </span>
        <PdpIconSwap
          className="shrink-0 text-black"
          active={open}
          activeIcon={<MaterialIcon name="remove" size={20} />}
          inactiveIcon={<MaterialIcon name="add" size={20} />}
        />
      </button>
      <div
        id={panelId}
        role="region"
        aria-hidden={!open}
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <ul className="m-0 list-none pb-3 pl-1">
            {category.children.map((child) => (
              <li key={child}>
                <button
                  type="button"
                  className={cn(
                    "font-extended block w-full py-2 text-left text-neutral-700",
                    pdpType.caption,
                    pdpPressableClass,
                  )}
                >
                  {child}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/** Full-screen Coach navigation — FY26 tabbed menu with search, highlights, and accordions */
export function PdpNavMenu({ open, onClose }: PdpNavMenuProps) {
  const titleId = useId();
  const mounted = useOverlayDismiss(open, onClose);
  const [brandTab, setBrandTab] = useState<NavBrandTab>("coach");
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);

  const fullHighlights = PDP_NAV.highlights.filter((item) => item.layout === "full");
  const halfHighlights = PDP_NAV.highlights.filter((item) => item.layout === "half");

  useEffect(() => {
    if (!open) {
      setExpandedCategoryId(null);
      setBrandTab("coach");
    }
  }, [open]);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-50 overscroll-none transition-opacity duration-300",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      )}
      aria-hidden={!open}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "font-extended flex h-full w-full flex-col bg-white transition-transform duration-300 ease-out",
          open ? "translate-y-0" : "-translate-y-2",
        )}
      >
        <div className="shrink-0 border-b border-neutral-200 pt-[var(--pdp-safe-area-top)]">
          <div className="flex items-stretch">
            <button
              type="button"
              onClick={() => setBrandTab("coach")}
              aria-pressed={brandTab === "coach"}
              className={cn(
                "flex min-h-12 flex-1 items-center justify-center px-3 transition-colors",
                brandTab === "coach" ? "bg-white text-black" : "bg-neutral-100 text-neutral-500",
                pdpPressableClass,
              )}
            >
              <span
                id={titleId}
                className="font-extended text-[13px] font-bold tracking-[0.28em] text-black"
              >
                COACH
              </span>
            </button>

            <button
              type="button"
              onClick={() => setBrandTab("outlet")}
              aria-pressed={brandTab === "outlet"}
              className={cn(
                "flex min-h-12 flex-1 items-center justify-center bg-black px-3 transition-colors",
                pdpPressableClass,
              )}
            >
              <Image
                src="/images/coach-outlet-logo.png"
                alt="Coach Outlet"
                width={118}
                height={14}
                className="h-3.5 w-auto"
              />
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className={cn(
                "flex min-h-12 w-12 shrink-0 items-center justify-center border-l border-neutral-200 bg-white",
                pdpPressableIconClass,
              )}
            >
              <MaterialIcon name="close" size={24} className="text-black" />
            </button>
          </div>
        </div>

        <div
          data-pdp-sheet-scroll
          className={pdpBottomSheetScrollRegionClass("pb-[var(--pdp-safe-area-bottom)]")}
        >
          <PageGrid fullWidth className="py-4">
            <GridItem mobile={12} desktop={24}>
              <label className="relative mb-5 block">
                <span className="sr-only">Search</span>
                <MaterialIcon
                  name="search"
                  size={20}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
                />
                <input
                  type="search"
                  placeholder={PDP_NAV.searchPlaceholder}
                  className={cn(
                    "font-extended h-11 w-full rounded-full border border-neutral-300 bg-white pl-10 pr-4 text-sm tracking-[0.2px] text-black outline-none placeholder:text-neutral-500 focus:border-black",
                  )}
                />
              </label>

              <div className="flex flex-col gap-5">
                {fullHighlights.map((highlight) => (
                  <NavHighlightCard key={highlight.id} highlight={highlight} />
                ))}

                {halfHighlights.length > 0 ? (
                  <div className="grid grid-cols-2 gap-1">
                    {halfHighlights.map((highlight) => (
                      <NavHighlightCard key={highlight.id} highlight={highlight} />
                    ))}
                  </div>
                ) : null}

                <div className="border-t border-neutral-200 pt-1">
                  {PDP_NAV.categories.map((category) => (
                    <NavAccordionItem
                      key={category.id}
                      category={category}
                      open={expandedCategoryId === category.id}
                      onToggle={() =>
                        setExpandedCategoryId((current) =>
                          current === category.id ? null : category.id,
                        )
                      }
                    />
                  ))}
                </div>
              </div>
            </GridItem>
          </PageGrid>
        </div>
      </div>
    </div>,
    document.body,
  );
}
