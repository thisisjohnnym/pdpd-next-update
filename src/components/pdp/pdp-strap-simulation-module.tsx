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
import { pdpPressableClass, pdpPressableSolidClass, pdpType } from "./pdp-type";
import { galleryPanelClassName } from "./pdp-gallery-panel";

/** Paper 43L-0 — product preview block (~445px on 375px frame) */
const PREVIEW_IMAGE_CLASS =
  "relative aspect-[375/445] w-full shrink-0 overflow-hidden rounded-lg bg-neutral-100";

const BUILD_ROW_SCROLL_CLASS = cn(
  "pdp-carousel-scroll pdp-build-picker-scroll -mx-2 flex items-stretch gap-2 px-2",
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
  included: boolean;
  quickAddOptionId?: string;
  image: {
    src: string;
    alt: string;
    objectPosition?: string;
  };
};

function formatSetPrice(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}

/** One option card — image on top, label + price beneath (Paper node 43N-0) */
function BuildOptionCard({
  option,
  isActive,
  onSelect,
}: {
  option: BuildPickerOption;
  isActive: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={isActive}
      onClick={() => onSelect(option.id)}
      className={cn(
        "flex h-[136px] w-[100px] shrink-0 flex-col gap-2 rounded-lg bg-white p-2 text-left transition-[outline-color]",
        isActive
          ? "[outline:2px_solid_#000000] -outline-offset-2"
          : "[outline:1px_solid_#E4E4E4] -outline-offset-1",
        pdpPressableClass,
      )}
    >
      <span className="relative h-16 shrink-0 self-stretch overflow-hidden rounded bg-neutral-100">
        <Image
          src={option.image.src}
          alt=""
          fill
          className="object-cover object-center"
          style={{ objectPosition: option.image.objectPosition ?? "center" }}
          sizes="100px"
          draggable={false}
        />
      </span>
      <span className="flex flex-1 flex-col justify-between">
        <span className={`font-extended text-black ${pdpType.label}`}>
          {option.label}
        </span>
        <span className={`font-extended text-neutral-500 ${pdpType.micro}`}>
          {option.included ? "Included" : option.priceLabel}
        </span>
      </span>
    </button>
  );
}

function BuildOptionRow({
  eyebrow,
  options,
  activeId,
  onSelect,
}: {
  eyebrow: string;
  options: BuildPickerOption[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className={`font-extended m-0 text-neutral-500 ${pdpType.label}`}>
        {eyebrow}
      </p>
      <div className={BUILD_ROW_SCROLL_CLASS} role="listbox" aria-label={eyebrow}>
        {options.map((option) => (
          <BuildOptionCard
            key={option.id}
            option={option}
            isActive={activeId === option.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

function BuildTabBar({
  activeTab,
  onChange,
}: {
  activeTab: BuildTab;
  onChange: (tab: BuildTab) => void;
}) {
  const tabs: { id: BuildTab; label: string }[] = [
    { id: "strap", label: "Strap" },
    { id: "charm", label: "Charm" },
  ];

  return (
    <div
      role="tablist"
      aria-label="Customize strap or charm"
      className="flex rounded-full bg-[#E4E4E4] p-[3px]"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex-1 rounded-full px-[18px] py-3 transition-colors",
              isActive && "bg-white",
              pdpPressableClass,
            )}
          >
            <span
              className={cn(
                "font-extended block text-center text-sm leading-none tracking-[0.2px]",
                isActive ? "text-black" : "text-neutral-500",
              )}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** One row in "Your selection" — thumbnail, label, value, check box */
// fallow-ignore-next-line complexity
function BuildSelectionRow({
  imageSrc,
  imageAlt,
  objectPosition,
  eyebrow,
  label,
  value,
  selected,
  checkTone,
  onToggle,
  toggleAriaLabel,
}: {
  imageSrc: string;
  imageAlt: string;
  objectPosition?: string;
  eyebrow?: string;
  label: string;
  value: string;
  selected: boolean;
  /** Dark filled check vs muted grey check (included / locked) */
  checkTone: "dark" | "muted";
  onToggle?: () => void;
  toggleAriaLabel?: string;
}) {
  const checkBox = (
    <span
      aria-hidden
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded",
        !selected
          ? "border border-neutral-300 bg-white"
          : checkTone === "dark"
            ? "bg-[#171717]"
            : "bg-[#D3D3D3]",
      )}
    >
      {selected ? (
        <MaterialIcon
          name="check"
          size={18}
          style={{ fontSize: 14 }}
          className={checkTone === "dark" ? "text-white" : "text-[#818181]"}
        />
      ) : null}
    </span>
  );

  return (
    <div className="flex items-center gap-3 rounded-lg bg-white p-2.5 [outline:1px_solid_#E4E4E4] -outline-offset-1">
      <span className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover object-center"
          style={{ objectPosition: objectPosition ?? "center" }}
          sizes="44px"
        />
      </span>
      <span className="flex min-w-0 grow flex-col gap-0.5">
        {eyebrow ? (
          <span className={`font-extended text-neutral-500 ${pdpType.label}`}>
            {eyebrow}
          </span>
        ) : null}
        <span className={`font-extended truncate text-black ${pdpType.label}`}>
          {label}
        </span>
      </span>
      <span
        className={cn(
          "font-extended shrink-0",
          pdpType.label,
          value === "Included" ? "text-neutral-500" : "text-black",
        )}
      >
        {value}
      </span>
      {onToggle ? (
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={selected}
          aria-label={toggleAriaLabel}
          className={pdpPressableClass}
        >
          {checkBox}
        </button>
      ) : (
        checkBox
      )}
    </div>
  );
}

function toStrapOptions(
  modes: readonly PdpStrapSimulationMode[],
): BuildPickerOption[] {
  return modes.map((mode) => ({
    id: mode.id,
    label: mode.label,
    priceLabel: mode.priceLabel,
    included: mode.id === "included-dual" || mode.priceLabel === "Included",
    quickAddOptionId: mode.quickAddOptionId,
    image: mode.image,
  }));
}

function toCharmOptions(
  charms: readonly PdpStrapSimulationCharm[],
): BuildPickerOption[] {
  return charms.map((charm) => ({
    id: charm.id,
    label: charm.label,
    priceLabel: charm.priceLabel,
    included: Boolean(charm.stock) || charm.priceLabel === "Included",
    quickAddOptionId: charm.quickAddOptionId,
    image: charm.image,
  }));
}

/** Strap + charm builder — "Make it Yours" configurator (Paper node 43L-0) */
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

  const strapOptions = useMemo(() => toStrapOptions(modes), [modes]);
  const charmOptions = useMemo(() => toCharmOptions(charms), [charms]);

  const activeMode = modes.find((mode) => mode.id === activeStrapId) ?? modes[0]!;
  const activeCharm = charms.find((charm) => charm.id === activeCharmId) ?? charms[0]!;

  const preview = useMemo(
    () => resolveStrapSimulationPreview(activeMode, activeCharmId),
    [activeCharmId, activeMode],
  );

  const strapIncluded =
    activeMode.id === "included-dual" || activeMode.priceLabel === "Included";
  const strapPrice = strapIncluded ? 0 : parsePriceLabel(activeMode.priceLabel);

  const charmSelected = !activeCharm.stock;
  const charmPrice = charmSelected ? parsePriceLabel(activeCharm.priceLabel) : 0;

  const setTotal =
    (includeBag ? BAG_SET_PRICE : 0) + strapPrice + charmPrice;

  // fallow-ignore-next-line complexity
  const optionIds = useMemo(() => {
    const ids: string[] = [];
    if (!strapIncluded && activeMode.quickAddOptionId) {
      ids.push(activeMode.quickAddOptionId);
    }
    if (charmSelected && activeCharm.quickAddOptionId) {
      ids.push(activeCharm.quickAddOptionId);
    }
    return ids;
  }, [strapIncluded, activeMode, charmSelected, activeCharm]);

  const canCommit = includeBag || optionIds.length > 0;

  const handleCommit = () => {
    if (!canCommit || !onAddSetToBag) {
      return;
    }
    onAddSetToBag({ optionIds, includeBag, total: setTotal });
    setJustCommitted(true);
  };

  const clearCommitted = () => setJustCommitted(false);

  return (
    <section
      data-header-surface="light"
      className={cn(
        "flex w-full shrink-0 flex-col gap-6 bg-[#F6F6F6] px-2 pb-6",
        galleryPanelClassName(isLastPanel),
      )}
    >
      <div className={PREVIEW_IMAGE_CLASS}>
        <Image
          key={preview.src}
          src={preview.src}
          alt={preview.alt}
          fill
          className="object-contain transition-opacity duration-500 ease-out"
          style={{ objectPosition: preview.objectPosition ?? "center 37%" }}
          sizes="100vw"
          priority
          draggable={false}
        />
      </div>

      <div className="flex flex-col gap-6 bg-[#F6F6F6]">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <h2 className={`m-0 text-center text-black ${pdpType.headline}`}>
              {title}
            </h2>
            {subtitle ? (
              <p
                className={`font-extended m-0 text-center text-black ${pdpType.body}`}
              >
                {subtitle}
              </p>
            ) : null}
          </div>

          <BuildTabBar activeTab={activeTab} onChange={setActiveTab} />
        </div>

        <div role="tabpanel">
          {activeTab === "strap" ? (
            <BuildOptionRow
              eyebrow="Straps"
              options={strapOptions}
              activeId={activeStrapId}
              onSelect={(id) => {
                setActiveStrapId(id);
                clearCommitted();
              }}
            />
          ) : (
            <BuildOptionRow
              eyebrow="Charms"
              options={charmOptions}
              activeId={activeCharmId}
              onSelect={(id) => {
                setActiveCharmId(id);
                clearCommitted();
              }}
            />
          )}
        </div>

        <div className="flex flex-col gap-2">
          <p className={`font-extended m-0 text-neutral-500 ${pdpType.label}`}>
            Your selection
          </p>

          <BuildSelectionRow
            imageSrc={PDP_PRODUCT.imageSrc}
            imageAlt={PDP_PRODUCT.imageAlt}
            eyebrow="Main item"
            label={PDP_PRODUCT.name}
            value={formatSetPrice(BAG_SET_PRICE)}
            selected={includeBag}
            checkTone="dark"
            onToggle={() => {
              setIncludeBag((current) => !current);
              clearCommitted();
            }}
            toggleAriaLabel={
              includeBag
                ? `Remove ${PDP_PRODUCT.name} from your set`
                : `Add ${PDP_PRODUCT.name} to your set`
            }
          />

          <BuildSelectionRow
            imageSrc={activeMode.image.src}
            imageAlt={activeMode.image.alt}
            objectPosition={activeMode.image.objectPosition}
            label={activeMode.label}
            value={strapIncluded ? "Included" : formatSetPrice(strapPrice)}
            selected
            checkTone={strapIncluded ? "muted" : "dark"}
          />

          {charmSelected ? (
            <BuildSelectionRow
              imageSrc={activeCharm.image.src}
              imageAlt={activeCharm.image.alt}
              objectPosition={activeCharm.image.objectPosition}
              label={activeCharm.label}
              value={formatSetPrice(charmPrice)}
              selected
              checkTone="dark"
              onToggle={() => {
                setActiveCharmId(charms[0]!.id);
                clearCommitted();
              }}
              toggleAriaLabel={`Remove ${activeCharm.label} from your set`}
            />
          ) : null}
        </div>

        <div className="flex items-center justify-between border-t border-black/10 pt-2">
          <span className={`font-extended text-neutral-500 ${pdpType.label}`}>
            Total
          </span>
          <span className={`font-extended text-black ${pdpType.label}`}>
            {formatSetPrice(setTotal)}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCommit}
          disabled={!canCommit || !onAddSetToBag || justCommitted}
          className={cn(
            "flex h-[52px] w-full items-center justify-center rounded-full text-base leading-none tracking-[0.2px] transition-colors",
            justCommitted
              ? "bg-neutral-200 text-neutral-500"
              : canCommit
                ? "bg-[#171717] text-white active:bg-neutral-800"
                : "bg-neutral-200 text-neutral-400",
            "font-extended",
            pdpPressableSolidClass,
          )}
        >
          {justCommitted ? "Added to bag" : "Add set to bag"}
        </button>
      </div>
    </section>
  );
}
