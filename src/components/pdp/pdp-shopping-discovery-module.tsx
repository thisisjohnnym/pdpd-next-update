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
import { useActiveProduct } from "./pdp-active-product-context";
import { PdpCoachAiSheet, type PdpCoachAiAsk } from "./pdp-coach-ai-sheet";
import { getPdpCoachAiContent } from "./pdp-coach-ai-content";
import { PDP_MORE_LIKE_THIS } from "./pdp-data";
import { PdpModuleHeading } from "./pdp-module-heading";
import { PdpRevealItem } from "./pdp-reveal-item";
import { pdpModuleSectionClass } from "./pdp-module-section";
import { pdpType, pdpPressableClass, pdpPressableSolidClass } from "./pdp-type";
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
                        <p className={`font-extended mt-0.5 text-black tabular-nums ${pdpType.micro}`}>
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

/** Coach AI — on-page shopping assistant (dark card, Paper node 48O-0) */
export function PdpCoachAiModule({
  spacious = false,
}: {
  /** Roomier vertical padding when placed inline in the gallery scroll */
  spacious?: boolean;
} = {}) {
  const { productId } = useActiveProduct();
  const { prompts } = getPdpCoachAiContent(productId);
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
          <PdpRevealItem className="flex flex-col gap-8 rounded-2xl bg-[#1C1C1C] px-4 pt-6 pb-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col items-center gap-2.5">
                <MaterialIcon
                  name="auto_awesome"
                  size={26}
                  filled
                  style={{ fontSize: 32 }}
                  className="text-white"
                />
                <PdpModuleHeading spacing="none" className="text-center text-white">
                  Coach AI
                </PdpModuleHeading>
              </div>
              <button
                type="button"
                onClick={() => setChatOpen(true)}
                className={cn(
                  "flex w-full items-center justify-between gap-2.5 rounded-full bg-white/[0.13] py-2 pr-2 pl-4 text-left",
                  pdpPressableClass,
                )}
              >
                <span className={`font-extended text-white ${pdpType.body}`}>
                  Ask the AI Concierge
                </span>
                <span
                  aria-hidden
                  className="flex size-[38px] shrink-0 items-center justify-center rounded-full bg-white"
                >
                  <MaterialIcon
                    name="arrow_upward"
                    size={18}
                    className="text-neutral-900"
                  />
                </span>
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {prompts.map((prompt, index) => (
                <div key={prompt.id} className="flex flex-col gap-4">
                  {index > 0 ? (
                    <div aria-hidden className="h-px w-full bg-white/20" />
                  ) : null}
                  <button
                    type="button"
                    onClick={() => handleAsk(prompt.question, prompt.id)}
                    className={cn(
                      "flex w-full items-center gap-2.5 text-left",
                      pdpPressableClass,
                    )}
                  >
                    <span
                      className={`font-extended flex-1 text-white ${pdpType.body}`}
                    >
                      {prompt.question}
                    </span>
                    <MaterialIcon
                      name="search"
                      size={20}
                      className="shrink-0 text-white"
                      aria-hidden
                    />
                  </button>
                </div>
              ))}
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
