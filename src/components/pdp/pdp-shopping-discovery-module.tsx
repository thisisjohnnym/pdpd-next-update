"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

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
import { PdpCoachAiSheet, type PdpCoachAiAsk } from "./pdp-coach-ai-sheet";
import { PDP_MORE_LIKE_THIS } from "./pdp-data";
import { PdpModuleHeading } from "./pdp-module-heading";
import { PdpRevealItem } from "./pdp-reveal-item";
import { pdpModuleSectionClass } from "./pdp-module-section";
import { PdpAiConciergePanel } from "./pdp-product-search-module";
import { pdpType, pdpPressableSolidClass } from "./pdp-type";
import { useTransientAddedSet } from "./use-transient-added-set";

type PdpMoreLikeThisModuleProps = {
  onAddToBag?: () => void;
};

/** More like this — on-page product discovery rail */
export function PdpMoreLikeThisModule({
  onAddToBag,
}: PdpMoreLikeThisModuleProps) {
  const { isAdded, confirmAdd } = useTransientAddedSet();

  const handleAdd = (id: string) => {
    onAddToBag?.();
    confirmAdd(id);
  };

  return (
    <section
      data-header-surface="light"
      className={pdpModuleSectionClass({ variant: "muted" })}
    >
      <PageGrid fullWidth>
        <GridItem mobile={12} desktop={24} className="min-w-0">
          <div className={cn("flex flex-col gap-6", pdpCarouselBlockClass)}>
            <PdpModuleHeading spacing="none">
              {PDP_MORE_LIKE_THIS.eyebrow}
            </PdpModuleHeading>

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
                    const confirmed = isAdded(item.id);

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
                          aria-label={`Add ${item.name} to bag`}
                          className={cn(
                            "mt-2 inline-flex w-full items-center justify-center gap-1 rounded-full py-2.5 transition-colors",
                            pdpType.micro,
                            "bg-black text-white",
                            pdpPressableSolidClass,
                          )}
                        >
                          <MaterialIcon
                            name={confirmed ? "check" : "shopping_bag"}
                            size={18}
                            className="shrink-0 text-white"
                            aria-hidden
                          />
                          <span className="font-extended -translate-y-px">
                            {confirmed ? "Added" : "Add to bag"}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </PdpRevealItem>
          </div>
        </GridItem>
      </PageGrid>
    </section>
  );
}

/** Coach AI — on-page shopping assistant */
export function PdpCoachAiModule({
  spacious = false,
}: {
  /** Roomier vertical padding when placed inline in the gallery scroll */
  spacious?: boolean;
} = {}) {
  const [chatOpen, setChatOpen] = useState(false);
  const [ask, setAsk] = useState<PdpCoachAiAsk | null>(null);

  const handleAsk = useCallback((question: string, promptId: string | null) => {
    setAsk((current) => ({
      token: (current?.token ?? 0) + 1,
      question,
      promptId,
    }));
    setChatOpen(true);
  }, []);

  return (
    <section
      data-header-surface="light"
      className={cn(
        pdpModuleSectionClass({ variant: "white" }),
        spacious && "py-28",
      )}
    >
      <PageGrid fullWidth>
        <GridItem mobile={12} desktop={24} className="min-w-0">
          <PdpRevealItem>
            <div className="flex flex-col gap-3">
              <PdpModuleHeading spacing="none">Coach AI</PdpModuleHeading>
              <PdpAiConciergePanel
                idSuffix="-discovery"
                showTitle={false}
                variant="flat"
                onAsk={handleAsk}
              />
            </div>
          </PdpRevealItem>
        </GridItem>
      </PageGrid>

      <PdpCoachAiSheet
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        ask={ask}
      />
    </section>
  );
}
