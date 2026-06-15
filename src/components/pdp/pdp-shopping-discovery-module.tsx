"use client";

import Image from "next/image";
import { useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import {
  pdpCarouselBlockClass,
  pdpCarouselCard15Gap2Class,
  pdpCarouselImageClass,
  pdpCarouselScrollClass,
  pdpCarouselScrollWrapClass,
} from "./pdp-carousel";
import {
  PDP_MORE_LIKE_THIS,
  PDP_SHOPPING_ASSISTANT_PROMPT,
} from "./pdp-data";
import { PdpModuleHeading } from "./pdp-module-heading";
import { PdpRevealItem } from "./pdp-reveal-item";
import { pdpModuleSectionClass } from "./pdp-module-section";
import { PdpAiConciergePanel } from "./pdp-product-search-module";
import { PdpAiInsightCard } from "./pdp-ai-insight-card";
import { pdpType, pdpPressableClass, pdpPressableSolidClass } from "./pdp-type";
import { PdpTextLinkCta } from "./pdp-text-link-cta";

type PdpShoppingDiscoveryModuleProps = {
  onAddToBag?: () => void;
};

/** More like this and shopping assistant — on-page discovery rails */
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
      className={pdpModuleSectionClass({ variant: "muted" })}
    >
      <PageGrid fullWidth>
        <GridItem mobile={12} desktop={24} className="min-w-0">
          <div className={cn("flex flex-col gap-6", pdpCarouselBlockClass)}>
            <PdpModuleHeading>{PDP_MORE_LIKE_THIS.eyebrow}</PdpModuleHeading>

            <PdpRevealItem className={pdpCarouselBlockClass}>
              <div className={pdpCarouselScrollWrapClass}>
                <ul
                  className={cn(
                    "m-0 flex list-none gap-2",
                    pdpCarouselScrollClass,
                  )}
                  aria-label="More like this"
                >
                  {PDP_MORE_LIKE_THIS.items.map((item) => {
                    const added = addedIds.has(item.id);

                    return (
                      <li
                        key={item.id}
                        className={cn("flex flex-col", pdpCarouselCard15Gap2Class)}
                      >
                        <div
                          className="relative w-full overflow-hidden bg-neutral-100"
                          style={{ aspectRatio: "4 / 5" }}
                        >
                          <Image
                            src={item.imageSrc}
                            alt={item.imageAlt}
                            fill
                            className={cn("object-cover object-center", pdpCarouselImageClass)}
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
                            "mt-2 inline-flex w-full items-center justify-center gap-1 rounded-full py-2.5 transition-colors",
                            pdpType.micro,
                            added
                              ? cn("bg-neutral-100 text-neutral-500", pdpPressableClass)
                              : cn("bg-black text-white", pdpPressableSolidClass),
                          )}
                        >
                          {!added ? (
                            <MaterialIcon
                              name="shopping_bag"
                              size={18}
                              className="shrink-0 text-white"
                              aria-hidden
                            />
                          ) : null}
                          <span className="font-extended -translate-y-px">
                            {added ? "Added" : "Add to bag"}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </PdpRevealItem>

            {assistantOpen ? (
              <PdpRevealItem delay={140}>
              <PdpAiConciergePanel
                idSuffix="-discovery"
                showTitle={false}
                variant="flat"
                onClose={() => setAssistantOpen(false)}
              />
              </PdpRevealItem>
            ) : (
              <PdpRevealItem delay={140}>
              <PdpAiInsightCard
                variant="minimal"
                title={PDP_SHOPPING_ASSISTANT_PROMPT.title}
                body={PDP_SHOPPING_ASSISTANT_PROMPT.body}
                footer={
                  <PdpTextLinkCta
                    type="button"
                    onClick={() => setAssistantOpen(true)}
                    className={pdpType.micro}
                  >
                    {PDP_SHOPPING_ASSISTANT_PROMPT.cta}
                  </PdpTextLinkCta>
                }
              />
              </PdpRevealItem>
            )}
          </div>
        </GridItem>
      </PageGrid>
    </section>
  );
}
