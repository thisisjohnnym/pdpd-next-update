"use client";

import Image from "next/image";
import { useState } from "react";

import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { PDP_BAG_SIZE } from "./pdp-data";
import { pdpModuleSectionClass, pdpModuleHeadingClass } from "./pdp-module-section";

/** Interactive capacity explorer — tap hotspots on the product shot */
export function PdpBagSizeModule() {
  const [activeId, setActiveId] = useState(PDP_BAG_SIZE.hotspots[0].id);

  const activeHotspot =
    PDP_BAG_SIZE.hotspots.find((hotspot) => hotspot.id === activeId) ??
    PDP_BAG_SIZE.hotspots[0];

  return (
    <section
      data-header-surface="light"
      className={pdpModuleSectionClass({ rhythm: "compact" })}
    >
      <PageGrid fullWidth>
        <GridItem mobile={12} desktop={24}>
          <div className="flex flex-col gap-5">
            <h2 className={pdpModuleHeadingClass({ lead: false })}>{PDP_BAG_SIZE.title}</h2>

            <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#e9e9e9]">
              <Image
                src={PDP_BAG_SIZE.imageSrc}
                alt={PDP_BAG_SIZE.imageAlt}
                fill
                className="object-contain object-bottom"
                sizes="100vw"
              />

              {PDP_BAG_SIZE.hotspots.map((hotspot, index) => {
                const isActive = activeId === hotspot.id;
                const staggerDelay = `${index * 0.45}s`;

                return (
                  <div
                    key={hotspot.id}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                  >
                    <button
                      type="button"
                      aria-pressed={isActive}
                      aria-label={`${hotspot.label} — tap for details`}
                      onClick={() => setActiveId(hotspot.id)}
                      className="relative flex size-10 items-center justify-center"
                    >
                      <span
                        aria-hidden
                        className="pointer-events-none absolute size-7 rounded-full border-2 border-white/80 animate-hotspot-ring-ripple"
                        style={{ animationDelay: staggerDelay }}
                      />
                      <span
                        aria-hidden
                        className="pointer-events-none absolute size-7 rounded-full border border-white/50 animate-hotspot-ring-ripple"
                        style={{ animationDelay: `calc(${staggerDelay} + 1.1s)` }}
                      />
                      <span
                        aria-hidden
                        className={cn(
                          "absolute size-7 rounded-full animate-hotspot-pulse",
                          isActive ? "bg-white/75" : "bg-white/55",
                        )}
                        style={{ animationDelay: staggerDelay }}
                      />
                      <span
                        aria-hidden
                        className={cn(
                          "relative size-2.5 rounded-full border shadow-[0_1px_4px_rgba(0,0,0,0.18)] transition-colors duration-200",
                          isActive
                            ? "border-black/20 bg-black"
                            : "border-white/90 bg-white",
                        )}
                      />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col gap-4 border border-neutral-200 bg-neutral-50 px-4 py-5">
              <div>
                <p className="font-extended text-sm tracking-[0.2px] text-black">
                  {activeHotspot.title}
                </p>
                <p className="mt-1 text-xs leading-[1.35] tracking-[0.2px] text-neutral-600">
                  {activeHotspot.body}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {activeHotspot.fits.map((item) => (
                  <span
                    key={item}
                    className="font-extended rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-[11px] tracking-[0.2px] text-black"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </GridItem>
      </PageGrid>
    </section>
  );
}
