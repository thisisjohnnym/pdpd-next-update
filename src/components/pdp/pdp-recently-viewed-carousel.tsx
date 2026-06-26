"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { useActiveProduct } from "./pdp-active-product-context";
import { PDP_RECENTLY_VIEWED, PDP_RECENTLY_VIEWED_SECTION } from "./pdp-data";
import { PdpModuleHeading } from "./pdp-module-heading";
import { PdpRevealItem } from "./pdp-reveal-item";
import { pdpModuleSectionClass } from "./pdp-module-section";
import { getDefaultColorId } from "./pdp-product-colors";
import { productPath } from "./pdp-product-routes";
import { getRecentlyViewedProductId } from "./pdp-products";
import { useOptionalTabbyVariant } from "./pdp-tabby-variant-context";
import { pdpType, pdpPressableClass } from "./pdp-type";

/** History rail — vertical list rows with viewed-time labels (Paper node 4CK-0) */
export function PdpRecentlyViewedCarousel() {
  const router = useRouter();
  const { productId } = useActiveProduct();
  const tabby = useOptionalTabbyVariant();

  const handleViewAgain = (itemId: string) => {
    const targetProductId = getRecentlyViewedProductId(itemId);
    if (!targetProductId || targetProductId === productId) {
      return;
    }

    router.push(
      productPath(targetProductId, {
        tabbySlug: tabby?.slug,
        colorId: getDefaultColorId(targetProductId),
      }),
    );
  };

  return (
    <section
      data-header-surface="light"
      className={pdpModuleSectionClass({ variant: "muted", rhythm: "break" })}
    >
      <PageGrid fullWidth>
        <GridItem mobile={12} desktop={24} className="min-w-0">
          <PdpModuleHeading className="text-center">
            {PDP_RECENTLY_VIEWED_SECTION.eyebrow}
          </PdpModuleHeading>

          <PdpRevealItem>
            <ul
              className="m-0 flex list-none flex-col gap-3.5 p-0"
              aria-label="Recently viewed items"
            >
              {PDP_RECENTLY_VIEWED.map((item) => {
                const isLinked = getRecentlyViewedProductId(item.id) !== null;

                return (
                  <li key={item.id} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={
                        isLinked ? () => handleViewAgain(item.id) : undefined
                      }
                      aria-label={`View again: ${item.name}, viewed ${item.viewedLabel}`}
                      className={cn(
                        "flex min-w-0 grow items-center gap-2 text-left",
                        isLinked && pdpPressableClass,
                      )}
                      disabled={!isLinked}
                    >
                      <span className="relative h-[70px] w-[56px] shrink-0 overflow-hidden rounded-md bg-neutral-100">
                        <Image
                          src={item.imageSrc}
                          alt={item.imageAlt}
                          fill
                          className="object-cover object-center"
                          sizes="56px"
                        />
                      </span>
                      <span className="flex min-w-0 grow flex-col gap-2">
                        <span
                          className={`font-extended text-black/50 ${pdpType.micro}`}
                        >
                          {item.viewedLabel}
                        </span>
                        <span className="flex flex-col gap-0.5">
                          <span
                            className={`font-extended text-black ${pdpType.body}`}
                          >
                            {item.name}
                          </span>
                          <span
                            className={`font-extended text-black ${pdpType.micro}`}
                          >
                            {item.price}
                          </span>
                        </span>
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={
                        isLinked ? () => handleViewAgain(item.id) : undefined
                      }
                      aria-label={`View again: ${item.name}`}
                      disabled={!isLinked}
                      className={cn(
                        "flex shrink-0 items-center gap-1.5 text-black",
                        isLinked && pdpPressableClass,
                      )}
                    >
                      <span className="font-extended text-[13px] leading-none">
                        View again
                      </span>
                      <MaterialIcon
                        name="arrow_forward"
                        size={18}
                        style={{ fontSize: 15 }}
                        className="text-black"
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </PdpRevealItem>
        </GridItem>
      </PageGrid>
    </section>
  );
}
