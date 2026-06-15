"use client";

import Image from "next/image";
import { useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import {
  pdpDiscoveryInnerScrollClass,
  pdpDiscoveryRailCardClass,
  pdpDiscoverySimilarCardClass,
} from "./pdp-carousel";
import {
  PDP_MORE_LIKE_THIS,
  PDP_RECENTLY_VIEWED,
  PDP_RECENTLY_VIEWED_SECTION,
  PDP_SHOPPING_ASSISTANT_PROMPT,
} from "./pdp-data";
import { pdpModuleSectionClass } from "./pdp-module-section";
import { PdpAiConciergePanel } from "./pdp-product-search-module";
import { pdpType } from "./pdp-type";

function DiscoveryEyebrow({ children }: { children: string }) {
  return (
    <p className="font-extended text-[10px] uppercase tracking-[0.6px] text-neutral-500">
      {children}
    </p>
  );
}

function DiscoveryDivider() {
  return <div className="h-px bg-neutral-200" aria-hidden />;
}

type PdpShoppingDiscoveryModuleProps = {
  onAddToBag?: () => void;
};

/** More like this, recently viewed, and shopping assistant — one grouped card */
export function PdpShoppingDiscoveryModule({
  onAddToBag,
}: PdpShoppingDiscoveryModuleProps) {
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const handleAdd = (id: string) => {
    setAddedIds((current) => {
      if (current.has(id)) {
        return current;
      }

      onAddToBag?.();
      return new Set(current).add(id);
    });
  };

  return (
    <section
      data-header-surface="light"
      className={pdpModuleSectionClass()}
    >
      <PageGrid fullWidth>
        <GridItem mobile={12} desktop={24} className="min-w-0">
          <div className="flex flex-col gap-5 border border-neutral-200 bg-neutral-100 p-3 lg:p-4">
            <div>
              <DiscoveryEyebrow>{PDP_MORE_LIKE_THIS.eyebrow}</DiscoveryEyebrow>
              <ul
                className={cn(
                  "m-0 mt-3 flex list-none gap-2",
                  pdpDiscoveryInnerScrollClass,
                )}
                aria-label="More like this"
              >
                {PDP_MORE_LIKE_THIS.items.map((item) => {
                  const added = addedIds.has(item.id);

                  return (
                    <li
                      key={item.id}
                      className={cn("flex flex-col", pdpDiscoverySimilarCardClass)}
                    >
                      <div
                        className="relative w-full overflow-hidden bg-white"
                        style={{ aspectRatio: "4 / 5" }}
                      >
                        <Image
                          src={item.imageSrc}
                          alt={item.imageAlt}
                          fill
                          className="object-cover object-center"
                          sizes="40vw"
                        />
                      </div>
                      <p
                        className={`font-extended mt-2 line-clamp-2 text-black ${pdpType.label}`}
                      >
                        {item.name}
                      </p>
                      <p className={`font-extended mt-0.5 text-black ${pdpType.micro}`}>
                        {item.price}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleAdd(item.id)}
                        disabled={added}
                        className={cn(
                          "mt-2 inline-flex w-full items-center justify-center gap-1 py-2.5 transition-colors",
                          pdpType.micro,
                          added
                            ? "bg-neutral-200 text-neutral-500"
                            : "bg-black text-white",
                        )}
                      >
                        <span className="font-extended -translate-y-px">
                          {added ? "Added" : "Add to Bag"}
                        </span>
                        {!added ? (
                          <MaterialIcon name="add" size={18} className="text-white" />
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <DiscoveryDivider />

            <div>
              <DiscoveryEyebrow>{PDP_RECENTLY_VIEWED_SECTION.eyebrow}</DiscoveryEyebrow>
              <ul
                className={cn(
                  "m-0 mt-3 flex list-none gap-2",
                  pdpDiscoveryInnerScrollClass,
                )}
                aria-label="Recently viewed items"
              >
                {PDP_RECENTLY_VIEWED.map((item, index) => (
                  <li
                    key={item.id}
                    className={cn("flex flex-col", pdpDiscoveryRailCardClass)}
                  >
                    <button
                      type="button"
                      className="group relative w-full text-left"
                      aria-label={`View again: ${item.name}, viewed ${item.viewedLabel}`}
                    >
                      <div
                        className="relative w-full overflow-hidden bg-white"
                        style={{ aspectRatio: "4 / 5" }}
                      >
                        <Image
                          src={item.imageSrc}
                          alt={item.imageAlt}
                          fill
                          className="object-cover object-center transition-[filter] duration-300 group-hover:brightness-[1.03]"
                          sizes="45vw"
                          priority={index === 0}
                        />
                        <span
                          className={`font-extended absolute left-1.5 top-1.5 inline-flex items-center bg-white/90 px-2 py-0.5 leading-none text-neutral-700 shadow-sm backdrop-blur-sm ${pdpType.micro}`}
                        >
                          {item.viewedLabel}
                        </span>
                      </div>
                    </button>
                    <p
                      className={`font-extended mt-2 line-clamp-2 text-black ${pdpType.label}`}
                    >
                      {item.name}
                    </p>
                    <p className={`font-extended mt-0.5 text-black ${pdpType.micro}`}>
                      {item.price}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className={cn(
                "border border-neutral-200 bg-neutral-50",
                assistantOpen ? "p-3" : "px-3 py-3",
              )}
            >
              {assistantOpen ? (
                <PdpAiConciergePanel
                  idSuffix="-discovery"
                  showTitle={false}
                  variant="flat"
                  onClose={() => setAssistantOpen(false)}
                />
              ) : (
                <>
                  <div className="flex items-start gap-2.5">
                    <span className="flex size-8 shrink-0 items-center justify-center bg-black text-white">
                      <MaterialIcon
                        name="auto_awesome"
                        size={18}
                        className="text-white"
                        aria-hidden
                      />
                    </span>
                    <div className="min-w-0">
                      <p className="font-extended text-sm tracking-[0.2px] text-black">
                        {PDP_SHOPPING_ASSISTANT_PROMPT.title}
                      </p>
                      <p className={`mt-1 text-neutral-700 ${pdpType.caption}`}>
                        {PDP_SHOPPING_ASSISTANT_PROMPT.body}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAssistantOpen(true)}
                    className={`font-extended mt-2 inline-flex items-center gap-0.5 text-black ${pdpType.label}`}
                  >
                    {PDP_SHOPPING_ASSISTANT_PROMPT.cta}
                    <MaterialIcon
                      name="arrow_forward"
                      size={18}
                      className="text-black"
                    />
                  </button>
                </>
              )}
            </div>
          </div>
        </GridItem>
      </PageGrid>
    </section>
  );
}
