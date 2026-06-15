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
      <div className={cn(EXPERIENCE_PANEL_MEDIA_CLASS, "bg-white")}>
        {modes.map((mode, index) => {
          const isActive = index === activeIndex;

          return (
            <div
              key={mode.id}
              aria-hidden={!isActive}
              className={cn(
                "absolute inset-0 transition-opacity duration-500 ease-out",
                isActive ? "opacity-100" : "opacity-0",
              )}
            >
              <Image
                src={mode.image.src}
                alt={isActive ? mode.image.alt : ""}
                fill
                className="object-cover object-center scale-[1.08]"
                style={{ objectPosition: mode.image.objectPosition ?? "center" }}
                sizes="100vw"
                priority={index === 0}
                draggable={false}
              />
            </div>
          );
        })}
      </div>

      <div className="shrink-0 px-3 pt-5 pb-5">
        <div className="grid grid-cols-4 gap-1.5" role="listbox" aria-label="Strap options">
          {modes.map((mode, index) => {
            const isActive = activeIndex === index;
            const optionQuickAddId = mode.quickAddOptionId;
            const optionAdded = optionQuickAddId
              ? addedOptionIds.has(optionQuickAddId)
              : false;

            return (
              <div
                key={mode.id}
                role="option"
                aria-selected={isActive}
                className={cn(
                  "flex flex-col gap-1 rounded-xl p-1 transition-colors",
                  isActive
                    ? "bg-black text-white"
                    : "bg-neutral-100 text-neutral-700",
                )}
              >
                <button
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className="flex w-full flex-col gap-1 text-left"
                >
                  <span className="relative aspect-[4/5] overflow-hidden rounded-lg bg-white">
                    <Image
                      src={mode.image.src}
                      alt=""
                      fill
                      className="object-cover object-center scale-[1.08]"
                      sizes="20vw"
                      draggable={false}
                    />
                  </span>
                  <span className="font-extended px-0.5 text-center text-[10px] leading-tight tracking-[0.2px]">
                    {mode.label}
                  </span>
                </button>

                {isActive && optionQuickAddId && onQuickAddStrap ? (
                  <button
                    type="button"
                    onClick={handleQuickAdd}
                    disabled={optionAdded}
                    className={cn(
                      "inline-flex w-full items-center justify-center gap-0.5 rounded-full px-2 py-1.5 text-[10px] leading-none tracking-[0.2px] transition-colors",
                      optionAdded
                        ? "bg-white/20 text-white/75"
                        : "bg-white text-black active:bg-white/90",
                    )}
                  >
                    <span className="font-extended truncate">
                      {optionAdded
                        ? "Added"
                        : `Add · ${mode.priceLabel}`}
                    </span>
                    {!optionAdded ? (
                      <MaterialIcon name="add" size={18} className="shrink-0 text-black" />
                    ) : null}
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
