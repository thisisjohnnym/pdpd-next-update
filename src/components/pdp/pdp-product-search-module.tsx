"use client";

import { useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { BOTTOM_CTA_OFFSET } from "./pdp-gallery-view";
import { PDP_PRODUCT_SEARCH } from "./pdp-data";
import { pdpModuleSectionClass, pdpModuleHeadingClass } from "./pdp-module-section";

/** Bottom search — prompt, input, and quick suggestion chips */
export function PdpProductSearchModule() {
  const [query, setQuery] = useState("");

  return (
    <section
      data-header-surface="light"
      className={cn(
        pdpModuleSectionClass({ variant: "muted", rhythm: "compact" }),
        "border-neutral-200",
      )}
      style={{ paddingBottom: BOTTOM_CTA_OFFSET }}
    >
      <PageGrid fullWidth>
        <GridItem mobile={12} desktop={24}>
          <div className="flex flex-col gap-5">
            <h2 className={pdpModuleHeadingClass({ lead: false })}>
              {PDP_PRODUCT_SEARCH.title}
            </h2>

            <form
              className="relative"
              onSubmit={(event) => {
                event.preventDefault();
              }}
            >
              <label htmlFor="pdp-product-search" className="sr-only">
                Search products
              </label>
              <MaterialIcon
                name="search"
                size={20}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                id="pdp-product-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={PDP_PRODUCT_SEARCH.placeholder}
                className="font-extended w-full rounded-full border border-neutral-300 bg-white py-3 pl-10 pr-4 text-sm tracking-[0.2px] text-black outline-none placeholder:text-neutral-400 focus:border-black"
              />
            </form>

            <div className="flex flex-wrap gap-2">
              {PDP_PRODUCT_SEARCH.suggestions.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setQuery(term)}
                  className={cn(
                    "font-extended rounded-full border px-3 py-1.5 text-xs tracking-[0.2px] transition-colors",
                    query === term
                      ? "border-black bg-black text-white"
                      : "border-neutral-300 bg-white text-black active:bg-neutral-50",
                  )}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </GridItem>
      </PageGrid>
    </section>
  );
}
