"use client";

import { useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { BOTTOM_CTA_OFFSET } from "./pdp-gallery-view";
import { PDP_PRODUCT_SEARCH } from "./pdp-data";
import { pdpModuleSectionClass, pdpModuleHeadingClass } from "./pdp-module-section";
import { pdpType } from "./pdp-type";

/** Bottom AI prompt — conversational input, send, and starter chips */
export function PdpProductSearchModule() {
  const [query, setQuery] = useState("");
  const hasQuery = query.trim().length > 0;

  return (
    <section
      data-header-surface="light"
      className={pdpModuleSectionClass({ variant: "muted", rhythm: "compact" })}
      style={{ paddingBottom: BOTTOM_CTA_OFFSET }}
    >
      <PageGrid fullWidth>
        <GridItem mobile={12} desktop={24}>
          <div className="flex flex-col gap-5">
            <h2 className={pdpModuleHeadingClass({ lead: false })}>
              {PDP_PRODUCT_SEARCH.title}
            </h2>

            <form
              className="rounded-2xl bg-white p-3 shadow-sm"
              onSubmit={(event) => {
                event.preventDefault();
              }}
            >
              <label htmlFor="pdp-ai-prompt" className="sr-only">
                Ask about products
              </label>

              <div className="flex items-start gap-2.5">
                <MaterialIcon
                  name="auto_awesome"
                  size={20}
                  className="mt-0.5 shrink-0 text-black"
                />
                <textarea
                  id="pdp-ai-prompt"
                  rows={2}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={PDP_PRODUCT_SEARCH.placeholder}
                  className="font-extended min-h-[3.25rem] w-full resize-none bg-transparent text-sm leading-[1.35] tracking-[0.2px] text-black outline-none placeholder:text-neutral-400"
                />
              </div>

              <div className="mt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={!hasQuery}
                  aria-label="Send prompt"
                  className={cn(
                    "flex size-9 items-center justify-center rounded-full transition-colors",
                    hasQuery
                      ? "bg-black text-white active:bg-neutral-800"
                      : "bg-neutral-100 text-neutral-400",
                  )}
                >
                  <MaterialIcon
                    name="arrow_upward"
                    size={20}
                    className={hasQuery ? "text-white" : "text-neutral-400"}
                  />
                </button>
              </div>
            </form>

            <div className="flex flex-wrap gap-2">
              {PDP_PRODUCT_SEARCH.suggestions.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setQuery(term)}
                  className={cn(
                    "rounded-full px-3 py-1.5 transition-colors",
                    pdpType.label,
                    query === term
                      ? "bg-black text-white"
                      : "bg-white text-black active:bg-neutral-50",
                  )}
                >
                  <span className="font-extended translate-y-px">{term}</span>
                </button>
              ))}
            </div>
          </div>
        </GridItem>
      </PageGrid>
    </section>
  );
}
