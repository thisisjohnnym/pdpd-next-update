"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import {
  PDP_STRAP_SIMULATION,
  type PdpStrapSimulationCharm,
  type PdpStrapSimulationMode,
} from "./pdp-data";
import { resolveStrapSimulationPreview } from "./pdp-strap-simulation-preview";
import { pdpAddIconLabelClass, pdpPressableClass, pdpPressableSolidClass } from "./pdp-type";
import { experiencePanelSectionProps } from "./pdp-experience-panel";

const STRAP_PREVIEW_MEDIA_CLASS = "relative aspect-[4/3] w-full overflow-hidden";

const BUILD_ROW_SCROLL_CLASS = cn(
  "pdp-carousel-scroll pdp-build-picker-scroll flex items-center gap-2",
  "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
);

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
  addedOptionIds?: ReadonlySet<string>;
  onQuickAdd?: (optionId: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="font-extended px-0.5 text-[10px] uppercase tracking-[0.14em] text-neutral-500">
        {label}
      </p>

      <div className="-mx-1 overflow-visible px-1">
        <div
          className={BUILD_ROW_SCROLL_CLASS}
          role="listbox"
          aria-label={label}
        >
        {options.map((option) => {
          const isActive = activeId === option.id;
          const isIncluded = option.stock || option.priceLabel === "Included";
          const quickAddId = option.quickAddOptionId;
          const showQuickAdd =
            isActive &&
            !isIncluded &&
            Boolean(quickAddId) &&
            Boolean(onQuickAdd);
          const added =
            showQuickAdd && quickAddId
              ? addedOptionIds?.has(quickAddId) ?? false
              : false;

          return (
            <div
              key={option.id}
              role="option"
              aria-selected={isActive}
              className={cn(
                "inline-flex shrink-0 items-stretch overflow-hidden rounded-full border text-left transition-colors",
                isActive
                  ? "border-black bg-white"
                  : "border-neutral-200 bg-white text-neutral-700",
              )}
            >
              <button
                type="button"
                onClick={() => onSelect(option.id)}
                className={cn(
                  "inline-flex min-w-0 items-center gap-2 py-1 pl-1 text-left transition-colors",
                  showQuickAdd ? "pr-2" : "pr-3",
                  pdpPressableClass,
                )}
              >
                <span className="relative size-9 shrink-0 overflow-hidden rounded-full bg-neutral-100">
                  <Image
                    src={option.image.src}
                    alt=""
                    fill
                    className="object-cover object-center"
                    style={{
                      objectPosition: option.image.objectPosition ?? "center center",
                    }}
                    sizes="36px"
                    draggable={false}
                  />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="font-extended text-[11px] leading-tight tracking-[0.2px] text-black">
                    {option.label}
                  </span>
                  {isIncluded ? (
                    <span className="font-extended text-[10px] leading-tight tracking-[0.2px] text-neutral-500">
                      Included
                    </span>
                  ) : option.priceLabel ? (
                    <span className="font-extended text-[10px] leading-tight tracking-[0.2px] text-neutral-500">
                      {option.priceLabel}
                    </span>
                  ) : null}
                </span>
              </button>

              {showQuickAdd && quickAddId ? (
                <div className="flex shrink-0 items-center gap-2 self-center pr-1">
                  <span
                    aria-hidden
                    className="h-6 w-px shrink-0 bg-neutral-200"
                  />
                  <button
                    type="button"
                    onClick={() => onQuickAdd?.(quickAddId)}
                    disabled={added}
                    aria-label={
                      added
                        ? `${option.label} added to bag`
                        : `Add ${option.label} to bag`
                    }
                    className={cn(
                      "inline-flex shrink-0 items-center justify-center gap-0.5 rounded-full px-2.5 py-1.5 text-[10px] leading-none tracking-[0.2px] transition-colors",
                      added ? pdpPressableClass : pdpPressableSolidClass,
                      added
                        ? "bg-neutral-100 text-neutral-500"
                        : "bg-black text-white active:bg-neutral-800",
                    )}
                  >
                    <span className={pdpAddIconLabelClass}>
                      {added ? "Added" : "Add"}
                    </span>
                    <MaterialIcon
                      name="add"
                      size={18}
                      className={cn("shrink-0", added ? "invisible" : "text-white")}
                      aria-hidden={added}
                    />
                  </button>
                </div>
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

  const strapOptions = useMemo(() => toStrapOptions(modes), [modes]);
  const charmOptions = useMemo(() => toCharmOptions(charms), [charms]);
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

      <div className="px-3 pt-3 pb-4">
        <div className="flex flex-col gap-3 overflow-visible rounded-xl bg-neutral-50 p-3">
          <BuildPickerRow
            label="Strap"
            options={strapOptions}
            activeId={activeStrapId}
            onSelect={setActiveStrapId}
            addedOptionIds={addedOptionIds}
            onQuickAdd={onQuickAddStrap ? handleQuickAdd : undefined}
          />

          <BuildPickerRow
            label="Charm"
            options={charmOptions}
            activeId={activeCharmId}
            onSelect={setActiveCharmId}
            addedOptionIds={addedOptionIds}
            onQuickAdd={onQuickAddStrap ? handleQuickAdd : undefined}
          />
        </div>
      </div>
    </section>
  );
}
