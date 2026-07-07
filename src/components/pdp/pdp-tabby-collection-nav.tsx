// fallow-ignore-file unused-file
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { pdpCarouselScrollClass } from "./pdp-carousel";
import { pdpModuleSectionClass } from "./pdp-module-section";
import { useTabbyVariant } from "./pdp-tabby-variant-context";
import { versionedProductPath } from "./pdp-product-routes";
import { pdpPressableClass, pdpType } from "./pdp-type";
import { usePdpVersion } from "./version/pdp-version-context";

/** Family navigation — explore Tabby styles and sizes near the top of the PDP */
// fallow-ignore-next-line complexity
export function PdpTabbyCollectionNav() {
  const router = useRouter();
  const version = usePdpVersion();
  const { slug, collectionItems } = useTabbyVariant();

  return (
    <section className={cn(pdpModuleSectionClass({ first: true }), "bg-white")}>
      <PageGrid>
        <GridItem mobile={12} desktop={24}>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <h2 className={cn("m-0 text-black", pdpType.subhead)}>
                Explore the Tabby Collection
              </h2>
              <p className={cn("m-0 text-neutral-600", pdpType.micro)}>
                Classic, Quilted, Pillow, Signature Canvas, and Loved Leather — in
                four sizes.
              </p>
            </div>

            <div className={cn(pdpCarouselScrollClass, "gap-3 pb-1")}>
              {collectionItems.map((item) => {
                const isActive = item.slug === slug;

                return (
                  <button
                    key={item.slug}
                    type="button"
                    onClick={() =>
                      router.push(
                        versionedProductPath(version, "tabby", {
                          tabbySlug: item.slug,
                        }),
                      )
                    }
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "flex w-[9.5rem] shrink-0 flex-col overflow-hidden rounded-xl border text-left transition-colors",
                      isActive
                        ? "border-black bg-neutral-50"
                        : "border-neutral-200 bg-white active:bg-neutral-50",
                      pdpPressableClass,
                    )}
                  >
                    <span className="relative aspect-[4/5] w-full bg-neutral-100">
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        className="object-cover object-center"
                        sizes="152px"
                      />
                    </span>
                    <span className="flex flex-col gap-0.5 px-2 py-2">
                      <span className={cn("text-black", pdpType.micro)}>
                        {item.label}
                      </span>
                      <span className={cn("text-neutral-500", pdpType.micro)}>
                        {item.materialLabel}
                      </span>
                      <span className={cn("text-black", pdpType.micro)}>
                        {item.price}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </GridItem>
      </PageGrid>
    </section>
  );
}
