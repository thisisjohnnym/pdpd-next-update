"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import {
  PDP_PRODUCT,
  PDP_STRAP_SIMULATION,
  type PdpStrapSetAddPayload,
  type PdpStrapSimulationCharm,
  type PdpStrapSimulationMode,
} from "./pdp-data";
import { resolveStrapSimulationPreview } from "./pdp-strap-simulation-preview";
import {
  pdpAddIconLabelClass,
  pdpPressableClass,
  pdpPressableIconClass,
  pdpPressableSolidClass,
} from "./pdp-type";
import { galleryPanelClassName } from "./pdp-gallery-panel";
import { useTransientAddedSet } from "./use-transient-added-set";
import { BOTTOM_CTA_OFFSET, SCREEN_HEIGHT_STYLE } from "./pdp-viewport-chrome";

/** Picker sits above the fixed CTA bar with a little breathing room */
const STRAP_PICKER_BOTTOM = `calc(0.75rem + ${BOTTOM_CTA_OFFSET})`;

/** Scrim fades the lower half of the panel so the glass card reads as floating */
const STRAP_SCRIM_HEIGHT = `calc(26rem + ${BOTTOM_CTA_OFFSET})`;

const BUILD_ROW_SCROLL_CLASS = cn(
  "pdp-carousel-scroll pdp-build-picker-scroll flex items-center gap-2",
  "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
);

/** Pull the numeric amount out of a price label ("$75" → 75, "Included" → 0) */
function parsePriceLabel(label?: string): number {
  if (!label) {
    return 0;
  }
  const match = label.replace(/,/g, "").match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : 0;
}

const BAG_SET_PRICE = parsePriceLabel(PDP_PRODUCT.price);

type BuildTab = "strap" | "charm";

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

/** Pull the numeric amount out of a price label ("$75" → 75, "Included" → 0) */
function formatSetPrice(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}

function isStrapOptionIncluded(option: BuildPickerOption): boolean {
  return Boolean(option.stock) || option.priceLabel === "Included";
}

function canAddToSetOption(
  isActive: boolean,
  included: boolean,
  quickAddId: string | undefined,
): boolean {
  return isActive && !included && Boolean(quickAddId);
}

function strapSelectButtonClass(showAddToSet: boolean): string {
  return cn(
    "inline-flex min-w-0 items-center gap-2 py-1 pl-1 text-left transition-colors",
    showAddToSet ? "pr-2" : "pr-3",
    pdpPressableClass,
  );
}

function strapAddToSetButtonClass(added: boolean): string {
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

function BuildPickerAddToSetButton({
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
        aria-label={
          added
            ? `${optionLabel} added to your set`
            : `Add ${optionLabel} to your set`
        }
        className={strapAddToSetButtonClass(added)}
      >
        <span className={pdpAddIconLabelClass}>
          {added ? "Added" : "Add to set"}
        </span>
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
  onAddToSet,
  isOptionAdded,
}: {
  option: BuildPickerOption;
  isActive: boolean;
  onSelect: (id: string) => void;
  onAddToSet?: (optionId: string) => void;
  isOptionAdded?: (id: string) => boolean;
}) {
  const included = isStrapOptionIncluded(option);
  const quickAddId = option.quickAddOptionId;
  const showAddToSet = canAddToSetOption(isActive, included, quickAddId);
  const added =
    showAddToSet && quickAddId ? (isOptionAdded?.(quickAddId) ?? false) : false;

  return (
    <div
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
        className={strapSelectButtonClass(showAddToSet)}
      >
        <BuildPickerOptionThumb image={option.image} />
        <BuildPickerOptionMeta option={option} included={included} />
      </button>

      {showAddToSet && quickAddId && onAddToSet ? (
        <BuildPickerAddToSetButton
          optionLabel={option.label}
          added={added}
          onClick={() => onAddToSet(quickAddId)}
        />
      ) : null}
    </div>
  );
}

function BuildPickerRow({
  label,
  hideLabel = false,
  options,
  activeId,
  onSelect,
  onAddToSet,
  isOptionAdded,
}: {
  label: string;
  hideLabel?: boolean;
  options: BuildPickerOption[];
  activeId: string;
  onSelect: (id: string) => void;
  onAddToSet?: (optionId: string) => void;
  isOptionAdded?: (id: string) => boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {hideLabel ? null : (
        <p className="font-extended px-0.5 text-[10px] uppercase tracking-[0.14em] text-neutral-500">
          {label}
        </p>
      )}

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
              onAddToSet={onAddToSet}
              isOptionAdded={isOptionAdded}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function BuildTabButton({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={onClick}
      className={cn(
        "flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-1.5 transition-colors",
        pdpPressableClass,
        isActive ? "bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)]" : "bg-transparent",
      )}
    >
      <span
        className={cn(
          "font-extended text-[11px] leading-tight tracking-[0.2px]",
          isActive ? "text-black" : "text-neutral-500",
        )}
      >
        {label}
      </span>
    </button>
  );
}

function BuildTabBar({
  activeTab,
  onChange,
}: {
  activeTab: BuildTab;
  onChange: (tab: BuildTab) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Customize strap or charm"
      className="flex items-center gap-1 rounded-full bg-neutral-200/60 p-1"
    >
      <BuildTabButton
        label="Strap"
        isActive={activeTab === "strap"}
        onClick={() => onChange("strap")}
      />
      <BuildTabButton
        label="Charm"
        isActive={activeTab === "charm"}
        onClick={() => onChange("charm")}
      />
    </div>
  );
}

function BuildRemovableSummaryRow({
  label,
  value,
  imageSrc,
  imageAlt,
  objectPosition,
  onRemove,
}: {
  label: string;
  value: string;
  imageSrc: string;
  imageAlt: string;
  objectPosition?: string;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="relative size-9 shrink-0 overflow-hidden rounded-md bg-neutral-100">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover object-center"
          style={{ objectPosition: objectPosition ?? "center center" }}
          sizes="36px"
        />
      </span>
      <span className="font-extended min-w-0 flex-1 truncate text-[11px] leading-tight tracking-[0.2px] text-neutral-500">
        {label}
      </span>
      <div className="flex shrink-0 items-center gap-1.5">
        <span className="font-extended text-[11px] leading-tight tracking-[0.2px] text-neutral-700">
          {value}
        </span>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${label}`}
          className={cn(
            "flex size-5 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors active:bg-neutral-100 active:text-neutral-700",
            pdpPressableIconClass,
          )}
        >
          <MaterialIcon name="close" size={18} />
        </button>
      </div>
    </div>
  );
}

function BuildBagSetRow({
  name,
  priceLabel,
  imageSrc,
  imageAlt,
  included,
  onToggle,
}: {
  name: string;
  priceLabel: string;
  imageSrc: string;
  imageAlt: string;
  included: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={included}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg border p-2 text-left transition-colors",
        included
          ? "border-neutral-200 bg-neutral-50/90"
          : "border-neutral-200/60 bg-neutral-50/40 opacity-80",
        pdpPressableClass,
      )}
    >
      <span
        className={cn(
          "flex size-4 shrink-0 items-center justify-center self-center rounded border",
          included ? "border-black bg-black" : "border-neutral-300 bg-white",
        )}
        aria-hidden
      >
        {included ? (
          <MaterialIcon name="check" size={18} className="text-white" />
        ) : null}
      </span>

      <span className="relative size-11 shrink-0 overflow-hidden rounded-md bg-neutral-100">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover object-center"
          sizes="44px"
        />
      </span>

      <span className="flex min-w-0 flex-1 flex-col gap-0.5 self-center">
        <span className="font-extended text-[10px] uppercase tracking-[0.14em] text-neutral-500">
          Main item
        </span>
        <span className="font-extended truncate text-[12px] leading-tight tracking-[0.2px] text-black">
          {name}
        </span>
      </span>

      <span className="font-extended shrink-0 self-center text-[11px] leading-tight tracking-[0.2px] text-neutral-700">
        {priceLabel}
      </span>
    </button>
  );
}

type BuildAddedLine = {
  id: string;
  kind: "Strap" | "Charm";
  label: string;
  /** Unit price in whole dollars */
  price: number;
  count: number;
  order: number;
  imageSrc: string;
  imageAlt: string;
  objectPosition?: string;
};

function BuildSetSummary({
  bagName,
  bagPriceLabel,
  bagImageSrc,
  bagImageAlt,
  includeBag,
  onIncludeBagChange,
  lines,
  setTotalLabel,
  ctaLabel,
  ctaDisabled,
  justCommitted,
  onClear,
  onRemoveLine,
  onCommit,
}: {
  bagName: string;
  bagPriceLabel: string;
  bagImageSrc: string;
  bagImageAlt: string;
  includeBag: boolean;
  onIncludeBagChange: () => void;
  lines: BuildAddedLine[];
  setTotalLabel: string;
  ctaLabel: string;
  ctaDisabled: boolean;
  justCommitted: boolean;
  onClear: () => void;
  onRemoveLine: (id: string) => void;
  onCommit: () => void;
}) {
  const hasAccessoryLines = lines.length > 0;
  const showSetHeader = includeBag || hasAccessoryLines;

  return (
    <div className="flex flex-col gap-2">
      {showSetHeader ? (
        <div className="mb-0.5 flex items-center justify-between gap-3">
          <span className="font-extended text-[10px] uppercase tracking-[0.14em] text-neutral-500">
            Your set
          </span>
          {hasAccessoryLines ? (
            <button
              type="button"
              onClick={onClear}
              className={cn(
                "font-extended text-[10px] uppercase tracking-[0.14em] text-neutral-400 transition-colors active:text-neutral-700",
                pdpPressableClass,
              )}
            >
              Clear
            </button>
          ) : null}
        </div>
      ) : null}

      <BuildBagSetRow
        name={bagName}
        priceLabel={bagPriceLabel}
        imageSrc={bagImageSrc}
        imageAlt={bagImageAlt}
        included={includeBag}
        onToggle={onIncludeBagChange}
      />

      {hasAccessoryLines ? (
        <p className="font-extended px-0.5 text-[10px] uppercase tracking-[0.14em] text-neutral-400">
          Add-ons
        </p>
      ) : null}

      {hasAccessoryLines
        ? lines.map((line) => (
            <BuildRemovableSummaryRow
              key={line.id}
              label={`${line.kind} · ${line.label}${line.count > 1 ? ` ×${line.count}` : ""}`}
              value={formatSetPrice(line.price * line.count)}
              imageSrc={line.imageSrc}
              imageAlt={line.imageAlt}
              objectPosition={line.objectPosition}
              onRemove={() => onRemoveLine(line.id)}
            />
          ))
        : null}

      <div className="flex items-center justify-between gap-3">
        <span className="font-extended text-[11px] leading-tight tracking-[0.2px] text-black">
          Set total
        </span>
        <span className="font-extended text-[12px] leading-tight tracking-[0.2px] text-black">
          {setTotalLabel}
        </span>
      </div>

      <button
        type="button"
        onClick={onCommit}
        disabled={ctaDisabled || justCommitted}
        className={cn(
          "font-extended mt-0.5 inline-flex w-full items-center justify-center rounded-full py-2.5 text-[12px] leading-tight tracking-[0.2px] transition-colors",
          justCommitted
            ? "bg-neutral-100 text-neutral-500"
            : ctaDisabled
              ? "bg-neutral-200 text-neutral-400"
              : "bg-black text-white active:bg-neutral-800",
          pdpPressableSolidClass,
        )}
      >
        {justCommitted ? "Added to bag" : ctaLabel}
      </button>
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
  onAddSetToBag,
}: {
  isLastPanel?: boolean;
  onAddSetToBag?: (payload: PdpStrapSetAddPayload) => void;
}) {
  const { modes, charms, title, subtitle } = PDP_STRAP_SIMULATION;
  const [activeStrapId, setActiveStrapId] = useState(modes[0]!.id);
  const [activeCharmId, setActiveCharmId] = useState(charms[0]!.id);
  const [activeTab, setActiveTab] = useState<BuildTab>("strap");
  const [includeBag, setIncludeBag] = useState(true);
  const [justCommitted, setJustCommitted] = useState(false);
  /** Staged add-ons keyed by quick-add id — every tap stacks */
  const [stagedCounts, setStagedCounts] = useState<Record<string, number>>({});
  const { isAdded: isOptionAdded, confirmAdd: confirmOptionAdd } =
    useTransientAddedSet();

  const strapOptions = useMemo(() => toStrapOptions(modes), [modes]);
  const charmOptions = useMemo(() => toCharmOptions(charms), [charms]);
  const activeMode = modes.find((mode) => mode.id === activeStrapId) ?? modes[0]!;
  const preview = useMemo(
    () => resolveStrapSimulationPreview(activeMode, activeCharmId),
    [activeCharmId, activeMode],
  );

  const optionMeta = useMemo(() => {
    const map = new Map<
      string,
      {
        kind: "Strap" | "Charm";
        label: string;
        price: number;
        order: number;
        imageSrc: string;
        imageAlt: string;
        objectPosition?: string;
      }
    >();
    modes.forEach((mode, index) => {
      if (!mode.quickAddOptionId) {
        return;
      }
      map.set(mode.quickAddOptionId, {
        kind: "Strap",
        label: mode.label,
        price: parsePriceLabel(mode.priceLabel),
        order: index,
        imageSrc: mode.image.src,
        imageAlt: mode.image.alt,
        objectPosition: mode.image.objectPosition,
      });
    });
    charms.forEach((charm, index) => {
      const quickAddId = charm.quickAddOptionId ?? charm.id;
      map.set(quickAddId, {
        kind: "Charm",
        label: charm.label,
        price: parsePriceLabel(charm.priceLabel),
        order: 100 + index,
        imageSrc: charm.image.src,
        imageAlt: charm.image.alt,
        objectPosition: charm.image.objectPosition,
      });
    });
    return map;
  }, [modes, charms]);

  const stagedLines = useMemo<BuildAddedLine[]>(() => {
    return Object.entries(stagedCounts)
      .reduce<BuildAddedLine[]>((lines, [id, count]) => {
        const meta = optionMeta.get(id);
        if (meta && count > 0) {
          lines.push({ id, count, ...meta });
        }
        return lines;
      }, [])
      .sort((a, b) => a.order - b.order);
  }, [stagedCounts, optionMeta]);

  const accessoriesTotal = stagedLines.reduce(
    (sum, line) => sum + line.price * line.count,
    0,
  );
  const setTotal =
    accessoriesTotal + (includeBag ? BAG_SET_PRICE : 0);
  const setTotalLabel = formatSetPrice(setTotal);

  const stagedOptionIds = useMemo(() => {
    return Object.entries(stagedCounts).flatMap(([id, count]) =>
      Array.from({ length: count }, () => id),
    );
  }, [stagedCounts]);

  const canCommit = includeBag || stagedOptionIds.length > 0;
  const ctaLabel = includeBag ? "Add set to bag" : "Add all to bag";

  const handleAddToSet = (optionId: string) => {
    confirmOptionAdd(optionId);
    setJustCommitted(false);
    setStagedCounts((current) => ({
      ...current,
      [optionId]: (current[optionId] ?? 0) + 1,
    }));
  };

  const handleClearStaged = () => {
    setStagedCounts({});
    setJustCommitted(false);
  };

  const handleRemoveStagedLine = (id: string) => {
    setJustCommitted(false);
    setStagedCounts((current) => {
      const count = current[id] ?? 0;
      if (count <= 1) {
        const next = { ...current };
        delete next[id];
        return next;
      }
      return { ...current, [id]: count - 1 };
    });
  };

  const handleCommit = () => {
    if (!canCommit || !onAddSetToBag) {
      return;
    }

    onAddSetToBag({
      optionIds: stagedOptionIds,
      includeBag,
      total: setTotal,
    });
    setJustCommitted(true);
    setStagedCounts({});
    setIncludeBag(true);
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
        <div className="flex flex-col gap-3 overflow-visible border border-white/70 bg-white/80 p-3 shadow-[0_12px_40px_rgba(0,0,0,0.14)] backdrop-blur-xl">
          <div className="flex flex-col gap-0.5 px-0.5">
            <p className="font-extended text-[13px] leading-tight tracking-[0.2px] text-black">
              {title}
            </p>
            {subtitle ? (
              <p className="font-extended text-[11px] leading-tight tracking-[0.2px] text-neutral-500">
                {subtitle}
              </p>
            ) : null}
          </div>

          <BuildTabBar activeTab={activeTab} onChange={setActiveTab} />

          <div role="tabpanel">
            {activeTab === "strap" ? (
              <BuildPickerRow
                label="Strap"
                hideLabel
                options={strapOptions}
                activeId={activeStrapId}
                onSelect={setActiveStrapId}
                isOptionAdded={isOptionAdded}
                onAddToSet={onAddSetToBag ? handleAddToSet : undefined}
              />
            ) : (
              <BuildPickerRow
                label="Charm"
                hideLabel
                options={charmOptions}
                activeId={activeCharmId}
                onSelect={setActiveCharmId}
                isOptionAdded={isOptionAdded}
                onAddToSet={onAddSetToBag ? handleAddToSet : undefined}
              />
            )}
          </div>

          <BuildSetSummary
            bagName={PDP_PRODUCT.name}
            bagPriceLabel={PDP_PRODUCT.price}
            bagImageSrc={PDP_PRODUCT.imageSrc}
            bagImageAlt={PDP_PRODUCT.imageAlt}
            includeBag={includeBag}
            onIncludeBagChange={() => {
              setIncludeBag((current) => !current);
              setJustCommitted(false);
            }}
            lines={stagedLines}
            setTotalLabel={setTotalLabel}
            ctaLabel={ctaLabel}
            ctaDisabled={!canCommit || !onAddSetToBag}
            justCommitted={justCommitted}
            onClear={handleClearStaged}
            onRemoveLine={handleRemoveStagedLine}
            onCommit={handleCommit}
          />
        </div>
      </div>
    </section>
  );
}
