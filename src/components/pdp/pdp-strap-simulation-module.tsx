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
import {
  pdpAddIconLabelClass,
  pdpPressableClass,
  pdpPressableSolidClass,
} from "./pdp-type";
import { galleryPanelClassName } from "./pdp-gallery-panel";
import { useTransientAddedSet } from "./use-transient-added-set";
import { BOTTOM_CTA_OFFSET, SCREEN_HEIGHT_STYLE } from "./pdp-viewport-chrome";

/** Picker sits above the fixed CTA bar with a little breathing room */
const STRAP_PICKER_BOTTOM = `calc(0.75rem + ${BOTTOM_CTA_OFFSET})`;

/** Scrim fades the lower half of the panel so the glass card reads as floating */
const STRAP_SCRIM_HEIGHT = `calc(22rem + ${BOTTOM_CTA_OFFSET})`;

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

function isStrapOptionIncluded(option: BuildPickerOption): boolean {
  return Boolean(option.stock) || option.priceLabel === "Included";
}

function canQuickAddStrapOption(
  isActive: boolean,
  included: boolean,
  quickAddId: string | undefined,
  onQuickAdd: ((id: string) => void) | undefined,
): boolean {
  return isActive && !included && Boolean(quickAddId) && Boolean(onQuickAdd);
}

// fallow-ignore-next-line complexity
function resolveStrapOptionAdded(
  showQuickAdd: boolean,
  quickAddId: string | undefined,
  isOptionAdded: ((id: string) => boolean) | undefined,
): boolean {
  if (!showQuickAdd || !quickAddId) {
    return false;
  }
  return isOptionAdded?.(quickAddId) ?? false;
}

function strapSelectButtonClass(showQuickAdd: boolean): string {
  return cn(
    "inline-flex min-w-0 items-center gap-2 py-1 pl-1 text-left transition-colors",
    showQuickAdd ? "pr-2" : "pr-3",
    pdpPressableClass,
  );
}

function strapQuickAddButtonClass(added: boolean): string {
  return cn(
    "inline-flex shrink-0 items-center justify-center gap-0.5 rounded-full px-2.5 py-1.5 text-[10px] leading-none tracking-[0.2px] transition-colors",
    added ? pdpPressableClass : pdpPressableSolidClass,
    added
      ? "bg-neutral-100 text-neutral-500"
      : "bg-black text-white active:bg-neutral-800",
  );
}

function BuildPickerOptionThumb({
  image,
}: {
  image: BuildPickerOption["image"];
}) {
  return (
    <span className="relative size-9 shrink-0 overflow-hidden rounded-full bg-neutral-100">
      <Image
        src={image.src}
        alt=""
        fill
        className="object-cover object-center"
        style={{ objectPosition: image.objectPosition ?? "center center" }}
        sizes="36px"
        draggable={false}
      />
    </span>
  );
}

function BuildPickerOptionMeta({
  option,
  included,
}: {
  option: BuildPickerOption;
  included: boolean;
}) {
  return (
    <span className="flex min-w-0 flex-col">
      <span className="font-extended text-[11px] leading-tight tracking-[0.2px] text-black">
        {option.label}
      </span>
      {included || option.priceLabel ? (
        <span className="font-extended text-[10px] leading-tight tracking-[0.2px] text-neutral-500">
          {included ? "Included" : option.priceLabel}
        </span>
      ) : null}
    </span>
  );
}

function BuildPickerQuickAddButton({
  optionLabel,
  added,
  onClick,
}: {
  optionLabel: string;
  added: boolean;
  onClick: () => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-2 self-center pr-1">
      <span aria-hidden className="h-6 w-px shrink-0 bg-neutral-200" />
      <button
        type="button"
        onClick={onClick}
        disabled={added}
        aria-label={
          added ? `${optionLabel} added to bag` : `Add ${optionLabel} to bag`
        }
        className={strapQuickAddButtonClass(added)}
      >
        <span className={pdpAddIconLabelClass}>{added ? "Added" : "Add"}</span>
        {!added ? (
          <MaterialIcon
            name="add"
            size={18}
            className="shrink-0 text-white"
            aria-hidden
          />
        ) : null}
      </button>
    </div>
  );
}

function BuildPickerOptionItem({
  option,
  isActive,
  onSelect,
  isOptionAdded,
  onQuickAdd,
}: {
  option: BuildPickerOption;
  isActive: boolean;
  onSelect: (id: string) => void;
  isOptionAdded?: (id: string) => boolean;
  onQuickAdd?: (optionId: string) => void;
}) {
  const included = isStrapOptionIncluded(option);
  const quickAddId = option.quickAddOptionId;
  const showQuickAdd = canQuickAddStrapOption(
    isActive,
    included,
    quickAddId,
    onQuickAdd,
  );
  const added = resolveStrapOptionAdded(showQuickAdd, quickAddId, isOptionAdded);

  return (
    <div
      role="option"
      aria-selected={isActive}
      className={cn(
        "inline-flex shrink-0 items-stretch overflow-hidden rounded-full text-left transition-colors",
        isActive ? "bg-neutral-100 text-black" : "bg-white text-neutral-700",
      )}
    >
      <button
        type="button"
        onClick={() => onSelect(option.id)}
        className={strapSelectButtonClass(showQuickAdd)}
      >
        <BuildPickerOptionThumb image={option.image} />
        <BuildPickerOptionMeta option={option} included={included} />
      </button>

      {showQuickAdd && quickAddId ? (
        <BuildPickerQuickAddButton
          optionLabel={option.label}
          added={added}
          onClick={() => onQuickAdd?.(quickAddId)}
        />
      ) : null}
    </div>
  );
}

function BuildPickerRow({
  label,
  options,
  activeId,
  onSelect,
  isOptionAdded,
  onQuickAdd,
}: {
  label: string;
  options: BuildPickerOption[];
  activeId: string;
  onSelect: (id: string) => void;
  isOptionAdded?: (id: string) => boolean;
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
          {options.map((option) => (
            <BuildPickerOptionItem
              key={option.id}
              option={option}
              isActive={activeId === option.id}
              onSelect={onSelect}
              isOptionAdded={isOptionAdded}
              onQuickAdd={onQuickAdd}
            />
          ))}
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
  const { modes, charms, title } = PDP_STRAP_SIMULATION;
  const [activeStrapId, setActiveStrapId] = useState(modes[0]!.id);
  const [activeCharmId, setActiveCharmId] = useState(charms[0]!.id);
  const { isAdded: isOptionAdded, confirmAdd: confirmOptionAdd } =
    useTransientAddedSet();

  const strapOptions = useMemo(() => toStrapOptions(modes), [modes]);
  const charmOptions = useMemo(() => toCharmOptions(charms), [charms]);
  const activeMode = modes.find((mode) => mode.id === activeStrapId) ?? modes[0]!;
  const preview = useMemo(
    () => resolveStrapSimulationPreview(activeMode, activeCharmId),
    [activeCharmId, activeMode],
  );

  const handleQuickAdd = (optionId: string) => {
    onQuickAddStrap?.(optionId);
    confirmOptionAdd(optionId);
  };

  return (
    <section
      data-header-surface="light"
      className={cn(
        "relative w-full shrink-0 overflow-hidden bg-neutral-100",
        galleryPanelClassName(isLastPanel),
      )}
      style={SCREEN_HEIGHT_STYLE}
    >
      <Image
        key={preview.src}
        src={preview.src}
        alt={preview.alt}
        fill
        className="object-cover object-center transition-opacity duration-500 ease-out"
        style={{ objectPosition: preview.objectPosition ?? "center 42%" }}
        sizes="100vw"
        priority
        draggable={false}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10"
        style={{
          height: STRAP_SCRIM_HEIGHT,
          background:
            "linear-gradient(to top, rgb(245 245 245 / 0.94) 28%, rgb(245 245 245 / 0.55) 62%, rgb(245 245 245 / 0) 100%)",
        }}
      />

      <div
        className="absolute inset-x-0 bottom-0 z-20 px-3"
        style={{ paddingBottom: STRAP_PICKER_BOTTOM }}
      >
        <div className="flex flex-col gap-3 overflow-visible rounded-2xl border border-white/70 bg-white/80 p-3 shadow-[0_12px_40px_rgba(0,0,0,0.14)] backdrop-blur-xl">
          <p className="font-extended px-0.5 text-[13px] leading-tight tracking-[0.2px] text-black">
            {title}
          </p>

          <BuildPickerRow
            label="Strap"
            options={strapOptions}
            activeId={activeStrapId}
            onSelect={setActiveStrapId}
            isOptionAdded={isOptionAdded}
            onQuickAdd={onQuickAddStrap ? handleQuickAdd : undefined}
          />

          <BuildPickerRow
            label="Charm"
            options={charmOptions}
            activeId={activeCharmId}
            onSelect={setActiveCharmId}
            isOptionAdded={isOptionAdded}
            onQuickAdd={onQuickAddStrap ? handleQuickAdd : undefined}
          />
        </div>
      </div>
    </section>
  );
}
