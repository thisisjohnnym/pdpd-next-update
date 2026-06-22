"use client";

import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { ColorSwatchCircle } from "./pdp-color-swatch";
import { pdpColorAvailabilityLabel, pdpColorIsSelectable } from "./pdp-data";
import { pdpModuleSectionClass } from "./pdp-module-section";
import { PdpTabbySizeOption } from "./pdp-tabby-size-option";
import { PdpTabbyStyleOption } from "./pdp-tabby-style-option";
import { useTabbyVariant } from "./pdp-tabby-variant-context";
import { getTabbyStyleGroups } from "./pdp-tabby-variants";
import { pdpPressableClass, pdpType } from "./pdp-type";

/** On-page Style → Size → Color — experiment variant, desktop / tablet only */
export function PdpTabbyVariantModule() {
  const {
    style,
    styleId,
    size,
    selectedColorId,
    colorOptions,
    sizeOptions,
    navigateToStyle,
    navigateToSize,
    setSelectedColorId,
    adjustment,
  } = useTabbyVariant();
  const styleGroups = getTabbyStyleGroups();

  return (
    <section className={cn(pdpModuleSectionClass({ rhythm: "compact" }), "hidden bg-white md:block")}>
      <PageGrid>
        <GridItem mobile={12} desktop={24}>
          <div className="flex flex-col gap-6">
            <header className="flex flex-col gap-1 border-b border-neutral-100 pb-4">
              <p className={cn("m-0 text-black", pdpType.body)}>
                {style.label} · Size {size}
              </p>
              <h2 className={cn("m-0", pdpType.headline)}>Configure your Tabby</h2>
              <p className={cn("m-0 text-neutral-500", pdpType.micro)}>
                Style first, then size and color options update to match.
              </p>
              {adjustment ? (
                <p
                  role="status"
                  className={cn(
                    "m-0 mt-2 rounded-lg bg-neutral-100 px-3 py-2 text-neutral-700",
                    pdpType.micro,
                  )}
                >
                  {adjustment.message}
                </p>
              ) : null}
            </header>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <p className={cn("m-0 font-extended text-xs text-black", pdpType.label)}>
                  1 · Style
                </p>
                {styleGroups.map(({ group, styles }) => (
                  <div key={group.id} className="flex flex-col gap-2">
                    <p className={cn("m-0 text-neutral-500", pdpType.micro)}>
                      {group.label}
                    </p>
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(8.5rem,1fr))] items-stretch gap-2">
                      {styles.map((entry) => (
                        <div key={entry.id} className="h-full">
                          <PdpTabbyStyleOption
                            style={entry}
                            selected={entry.id === styleId}
                            imageAspect="4/3"
                            imageSizes="120px"
                            showMaterial
                            onSelect={navigateToStyle}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className={cn("m-0 font-extended text-xs text-black", pdpType.label)}>
                2 · Size
                <span className="font-normal text-neutral-500">
                  {" "}
                  · for {style.label}
                </span>
              </p>
              <div className="grid grid-cols-4 items-stretch gap-2">
                {sizeOptions.map(({ option, available }) => (
                  <PdpTabbySizeOption
                    key={option.size}
                    option={option}
                    selected={option.size === size}
                    disabled={!available}
                    showDimensions={false}
                    imageSizes="120px"
                    onSelect={navigateToSize}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className={cn("m-0 font-extended text-xs text-black", pdpType.label)}>
                3 · Color
                <span className="font-normal text-neutral-500">
                  {" "}
                  · for {style.label} {size}
                </span>
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {colorOptions.map((color) => {
                  const isActive = color.id === selectedColorId;
                  const isSelectable =
                    color.combinationAvailable &&
                    pdpColorIsSelectable(color.availability);

                  return (
                    <button
                      key={color.id}
                      type="button"
                      aria-label={
                        color.combinationAvailable
                          ? `${color.name}, ${pdpColorAvailabilityLabel(color.availability)}`
                          : `${color.name}, not available in size ${size}`
                      }
                      aria-pressed={isActive}
                      disabled={!isSelectable}
                      onClick={() => isSelectable && setSelectedColorId(color.id)}
                      className={cn(
                        "rounded-full p-0.5 transition-all",
                        isActive ? "ring-2 ring-black ring-offset-2" : "",
                        !isSelectable && "cursor-not-allowed opacity-40",
                        isSelectable && pdpPressableClass,
                      )}
                    >
                      <ColorSwatchCircle src={color.swatch} sizeClass="size-10" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </GridItem>
      </PageGrid>
    </section>
  );
}
