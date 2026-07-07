// fallow-ignore-file unused-file
"use client";

import Image from "next/image";
import { useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { useActiveProduct } from "./pdp-active-product-context";
import { PDP_PRODUCT_EXPLORER } from "./pdp-data";
import { PdpGalleryDragZoomImage } from "./pdp-gallery-drag-zoom-image";
import { PdpModuleHeading } from "./pdp-module-heading";
import { getTabbyProductExplorerForColor } from "./pdp-tabby-color-media";
import { useOptionalTabbyVariant } from "./pdp-tabby-variant-context";
import { pdpType } from "./pdp-type";
import { BOTTOM_CTA_OFFSET } from "./pdp-viewport-chrome";

/** Chapter 3 — tabbed product explorer (Front · Side · Inside · Detail · Worn) */
// fallow-ignore-next-line complexity
export function PdpProductExplorerModule({
  onOpenShopTheLook,
}: {
  onOpenShopTheLook?: (lookId: string) => void;
}) {
  const { productId } = useActiveProduct();
  const tabby = useOptionalTabbyVariant();
  const colorId = productId === "tabby" && tabby ? tabby.selectedColorId : "";
  const explorer =
    productId === "tabby"
      ? getTabbyProductExplorerForColor(colorId)
      : PDP_PRODUCT_EXPLORER;

  const [activeId, setActiveId] = useState(explorer.views[0]?.id ?? "front");
  const activeView =
    explorer.views.find((view) => view.id === activeId) ?? explorer.views[0];

  if (!activeView) {
    return null;
  }

  return (
    <section
      id="pdp-product-explorer"
      data-header-surface="light"
      className="relative w-full shrink-0 overflow-x-clip bg-white pt-8 pb-6"
      style={{ minHeight: "min(80dvh, 720px)", paddingBottom: BOTTOM_CTA_OFFSET }}
      aria-label={explorer.title}
    >
      <PageGrid fullWidth>
        <GridItem mobile={12} desktop={24} className="flex min-h-0 flex-col gap-4">
          <PdpModuleHeading spacing="none">{explorer.title}</PdpModuleHeading>

          <div
            className="flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="tablist"
            aria-label="Product views"
          >
            {explorer.views.map((view) => {
              const selected = view.id === activeId;
              return (
                <button
                  key={view.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveId(view.id)}
                  className={cn(
                    "font-extended shrink-0 rounded-full px-3.5 py-2 text-[11px] tracking-[0.2px] transition-colors",
                    selected
                      ? "bg-black text-white"
                      : "bg-neutral-100 text-neutral-700 active:bg-neutral-200",
                  )}
                >
                  {view.label}
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id={`pdp-explorer-${activeView.id}`}
            className="relative min-h-0 flex-1"
          >
            <div className="relative aspect-[9/16] w-full overflow-hidden bg-neutral-100">
              {activeView.dragZoom ? (
                <PdpGalleryDragZoomImage
                  src={activeView.src}
                  alt={activeView.alt}
                  objectPosition={activeView.objectPosition ?? "center"}
                  scale="scale-100"
                  fitContain={false}
                  panel={false}
                />
              ) : (
                <Image
                  src={activeView.src}
                  alt={activeView.alt}
                  fill
                  className="object-cover"
                  style={{
                    objectPosition: activeView.objectPosition ?? "center",
                  }}
                  sizes="100vw"
                />
              )}

              {activeView.shopTheLookId && onOpenShopTheLook ? (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-start p-3">
                  <button
                    type="button"
                    onClick={() => onOpenShopTheLook(activeView.shopTheLookId!)}
                    className={cn(
                      "pointer-events-auto flex items-center gap-1 rounded-full border border-white/55 bg-white/80 py-1 pl-1 pr-2.5 text-neutral-900 shadow-[0_4px_20px_rgba(0,0,0,0.14)] backdrop-blur-md transition-colors active:bg-white/95",
                      pdpType.micro,
                    )}
                  >
                    <span
                      aria-hidden
                      className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/90"
                    >
                      <MaterialIcon name="checkroom" size={18} className="text-neutral-900" />
                    </span>
                    <span className="font-extended">Shop the look</span>
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </GridItem>
      </PageGrid>
    </section>
  );
}
