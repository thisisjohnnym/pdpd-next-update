"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import {
  pdpCarouselScrollClass,
  pdpCarouselScrollWrapClass,
} from "./pdp-carousel";
import {
  PDP_STRAP_SIMULATION,
  type PdpStrapSimulationCharm,
  type PdpStrapSimulationMode,
} from "./pdp-data";
import { resolveStrapSimulationPreview } from "./pdp-strap-simulation-preview";
import { pdpPressableClass, pdpPressableSolidClass } from "./pdp-type";
import {
  experiencePanelSectionProps,
} from "./pdp-experience-panel";

const BUILD_PICKER_CARD_CLASS =
  "w-[calc((100vw-1.25rem)/3.4)] shrink-0 snap-start snap-always lg:w-[calc((100vw-2.25rem)/5.5)]";

const STRAP_PREVIEW_MEDIA_CLASS = "relative aspect-[5/4] w-full overflow-hidden";

type BuildPickerOption = {
  id: string;
  label: string;
  priceLabel?: string;
  stock?: boolean;
  quickAddOptionId?: string;
  image: {
    src: string;
    alt: string;
    objectPosition?: string;
  };
};

function BuildPickerRow({
  label,
  options,
  activeId,
  onSelect,
  addedOptionIds,
  onQuickAdd,
}: {
  label: string;
  options: BuildPickerOption[];
  activeId: string;
  onSelect: (id: string) => void;
  addedOptionIds: ReadonlySet<string>;
  onQuickAdd?: (optionId: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <p className="font-extended px-0.5 text-[10px] uppercase tracking-[0.14em] text-neutral-500">
        {label}
      </p>

      <div className={pdpCarouselScrollWrapClass}>
        <div
          className={cn("flex gap-1.5", pdpCarouselScrollClass)}
          role="listbox"
          aria-label={label}
        >
          {options.map((option) => {
            const isActive = activeId === option.id;
            const isStock = option.stock || option.priceLabel === "Included";
            const quickAddId = option.quickAddOptionId;
            const added = quickAddId ? addedOptionIds.has(quickAddId) : false;

            return (
              <div
                key={option.id}
                role="option"
                aria-selected={isActive}
                className={cn(
                  "flex flex-col gap-0.5 rounded-lg p-0.5 transition-colors",
                  BUILD_PICKER_CARD_CLASS,
                  isActive ? "bg-black text-white" : "bg-neutral-100 text-neutral-700",
                )}
              >
                <button
                  type="button"
                  onClick={() => onSelect(option.id)}
                  className={cn("flex w-full flex-col gap-0.5 text-left", pdpPressableClass)}
                >
                  <span className="relative aspect-[5/4] overflow-hidden rounded-md bg-white">
                    <Image
                      src={option.image.src}
                      alt=""
                      fill
                      className="object-cover object-center"
                      style={{
                        objectPosition: option.image.objectPosition ?? "center center",
                      }}
                      sizes="24vw"
                      draggable={false}
                    />
                  </span>
                  <span className="font-extended px-0.5 text-center text-[10px] leading-tight tracking-[0.2px]">
                    {option.label}
                  </span>
                </button>

                {isActive ? (
                  isStock ? (
                    <span className="font-extended block px-0.5 pb-0.5 text-center text-[10px] tracking-[0.2px] text-white/75">
                      Included
                    </span>
                  ) : quickAddId && onQuickAdd ? (
                    <button
                      type="button"
                      onClick={() => onQuickAdd(quickAddId)}
                      disabled={added}
                      className={cn(
                        "inline-flex w-full items-center justify-center gap-0.5 rounded-full px-2 py-1 text-[10px] leading-none tracking-[0.2px] transition-colors",
                        added ? pdpPressableClass : pdpPressableSolidClass,
                        added
                          ? "bg-white/20 text-white/75"
                          : "bg-white text-black active:bg-white/90",
                      )}
                    >
                      <span className="font-extended">
                        {added ? "Added" : `Add ${option.priceLabel}`}
                      </span>
                      {!added ? (
                        <MaterialIcon name="add" size={18} className="shrink-0 text-black" />
                      ) : null}
                    </button>
                  ) : null
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function toStrapOptions(modes: readonly PdpStrapSimulationMode[]): BuildPickerOption[] {
  return modes.map((mode) => ({
    id: mode.id,
    label: mode.label,
    priceLabel: mode.priceLabel,
    stock: mode.id === "included-dual",
    quickAddOptionId: mode.quickAddOptionId,
    image: mode.image,
  }));
}

function toCharmOptions(charms: readonly PdpStrapSimulationCharm[]): BuildPickerOption[] {
  return charms.map((charm) => ({
    id: charm.id,
    label: charm.label,
    priceLabel: charm.priceLabel,
    stock: charm.stock,
    quickAddOptionId: charm.quickAddOptionId,
    image: charm.image,
  }));
}

/** Strap + charm builder — preview one strap and one charm on the bag */
export function PdpStrapSimulationModule({
  isLastPanel = false,
  onQuickAddStrap,
}: {
  isLastPanel?: boolean;
  onQuickAddStrap?: (optionId: string) => void;
}) {
  const { modes, charms } = PDP_STRAP_SIMULATION;
  const panel = experiencePanelSectionProps(isLastPanel);
  const [activeStrapId, setActiveStrapId] = useState(modes[0]!.id);
  const [activeCharmId, setActiveCharmId] = useState(charms[0]!.id);
  const [addedOptionIds, setAddedOptionIds] = useState<Set<string>>(() => new Set());

  const activeMode = modes.find((mode) => mode.id === activeStrapId) ?? modes[0]!;

  const preview = useMemo(
    () => resolveStrapSimulationPreview(activeMode, activeCharmId),
    [activeCharmId, activeMode],
  );

  const handleQuickAdd = (optionId: string) => {
    if (addedOptionIds.has(optionId)) {
      return;
    }

    onQuickAddStrap?.(optionId);
    setAddedOptionIds((current) => new Set(current).add(optionId));
  };

  return (
    <section data-header-surface="light" className={panel.className} style={panel.style}>
      <div className={cn(STRAP_PREVIEW_MEDIA_CLASS, "bg-neutral-100")}>
        <Image
          key={preview.src}
          src={preview.src}
          alt={preview.alt}
          fill
          className="object-cover object-center transition-opacity duration-500 ease-out"
          style={{ objectPosition: preview.objectPosition ?? "center center" }}
          sizes="100vw"
          priority
          draggable={false}
        />
      </div>

      <div className="flex shrink-0 flex-col gap-2 px-3 pt-3 pb-4">
        <BuildPickerRow
          label="Strap"
          options={toStrapOptions(modes)}
          activeId={activeStrapId}
          onSelect={setActiveStrapId}
          addedOptionIds={addedOptionIds}
          onQuickAdd={onQuickAddStrap ? handleQuickAdd : undefined}
        />

        <BuildPickerRow
          label="Charm"
          options={toCharmOptions(charms)}
          activeId={activeCharmId}
          onSelect={setActiveCharmId}
          addedOptionIds={addedOptionIds}
          onQuickAdd={onQuickAddStrap ? handleQuickAdd : undefined}
        />
      </div>
    </section>
  );
}
