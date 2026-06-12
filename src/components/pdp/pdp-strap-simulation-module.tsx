"use client";

import Image from "next/image";
import { useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { PDP_STRAP_SIMULATION } from "./pdp-data";
import {
  EXPERIENCE_PANEL_MEDIA_CLASS,
  experiencePanelSectionProps,
} from "./pdp-experience-panel";
import { pdpType } from "./pdp-type";

/** Strap swap simulator — tap strap options to preview on the bag */
export function PdpStrapSimulationModule({
  isLastPanel = false,
  onQuickAddStrap,
}: {
  isLastPanel?: boolean;
  onQuickAddStrap?: (optionId: string) => void;
}) {
  const { modes } = PDP_STRAP_SIMULATION;
  const panel = experiencePanelSectionProps(isLastPanel);
  const [activeIndex, setActiveIndex] = useState(0);
  const [addedOptionIds, setAddedOptionIds] = useState<Set<string>>(() => new Set());
  const activeMode = modes[activeIndex] ?? modes[0]!;
  const quickAddId = activeMode.quickAddOptionId;
  const quickAddAdded = quickAddId ? addedOptionIds.has(quickAddId) : false;

  const handleQuickAdd = () => {
    if (!quickAddId || quickAddAdded) {
      return;
    }

    onQuickAddStrap?.(quickAddId);
    setAddedOptionIds((current) => new Set(current).add(quickAddId));
  };

  return (
    <section data-header-surface="light" className={panel.className} style={panel.style}>
      <div className={cn(EXPERIENCE_PANEL_MEDIA_CLASS, "bg-[#ececec]")}>
        {modes.map((mode, index) => {
          const fit = mode.image.fit ?? "contain";
          const isActive = index === activeIndex;

          return (
            <div
              key={mode.id}
              aria-hidden={!isActive}
              className={cn(
                "absolute inset-x-0 bottom-[16%] top-[5%] transition-opacity duration-500 ease-out",
                isActive ? "opacity-100" : "opacity-0",
              )}
            >
              <Image
                src={mode.image.src}
                alt={isActive ? mode.image.alt : ""}
                fill
                className={cn(
                  fit === "contain" ? "object-contain" : "object-cover scale-[1.06]",
                  "object-center",
                )}
                style={{ objectPosition: mode.image.objectPosition ?? "center" }}
                sizes="100vw"
                priority={index === 0}
                draggable={false}
              />
            </div>
          );
        })}

        <div
          className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent px-3 pb-3 pt-14"
        >
          <div aria-hidden className="pointer-events-none">
            <p className="font-extended text-sm tracking-[0.2px] text-white">
              {activeMode.label}
              {activeMode.priceLabel ? (
                <span className="text-white/75"> · {activeMode.priceLabel}</span>
              ) : null}
            </p>
            <p className={`mt-1 text-white/80 ${pdpType.micro}`}>{activeMode.detail}</p>
          </div>
          {quickAddId && onQuickAddStrap ? (
            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={quickAddAdded}
              className={cn(
                "font-extended mt-2 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] tracking-[0.2px] transition-colors",
                quickAddAdded
                  ? "bg-white/25 text-white/80"
                  : "bg-white text-black active:bg-white/90",
              )}
            >
              <span className="-translate-y-px">
                {quickAddAdded ? "Added to bag" : `Add chain · ${activeMode.priceLabel}`}
              </span>
              {!quickAddAdded ? (
                <MaterialIcon name="add" size={18} className="text-black" />
              ) : null}
            </button>
          ) : null}
        </div>
      </div>

      <div className="shrink-0 px-3 pt-3">
        <div className="grid grid-cols-4 gap-1.5" role="listbox" aria-label="Strap options">
          {modes.map((mode, index) => {
            const isActive = activeIndex === index;

            return (
              <button
                key={mode.id}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "flex flex-col gap-1 rounded-xl p-1 transition-colors",
                  isActive
                    ? "bg-black text-white"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200",
                )}
              >
                <span
                  className={cn(
                    "relative aspect-[4/5] overflow-hidden rounded-lg bg-[#ececec]",
                    isActive ? "ring-2 ring-white/90 ring-offset-1 ring-offset-black" : "",
                  )}
                >
                  <Image
                    src={mode.image.src}
                    alt=""
                    fill
                    className="object-contain object-center p-0.5"
                    sizes="20vw"
                    draggable={false}
                  />
                </span>
                <span className="font-extended px-0.5 text-center text-[10px] leading-tight tracking-[0.2px]">
                  {mode.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
