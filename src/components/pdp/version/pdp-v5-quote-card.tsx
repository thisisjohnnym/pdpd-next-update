"use client";

import { cn } from "@/lib/cn";

import { PdpTextReveal } from "../pdp-text-reveal";

import { PDP_V5_EDITORIAL_QUOTE } from "./pdp-data-v2";

/**
 * v5 — 9:16 editorial quote card.
 *
 * Soft blush panel, wide-track sans label + attribution, high-contrast serif quote.
 */
export function PdpV5QuoteCard() {
  const { eyebrow, quote, attribution } = PDP_V5_EDITORIAL_QUOTE;

  return (
    <section
      data-header-surface="light"
      aria-label={eyebrow}
      className="pdp-v5-quote-card-section w-full shrink-0 bg-white p-3"
    >
      <div className="mx-auto flex w-full max-w-[440px] justify-center">
        <figure className="pdp-v5-quote-card m-0 flex aspect-[9/16] w-full max-w-[360px] flex-col items-center justify-center gap-8 px-6 py-10 text-center sm:max-w-[400px] sm:px-8 sm:py-12">
          <PdpTextReveal
            as="p"
            className="pdp-v5-quote-card__eyebrow m-0 uppercase"
          >
            {eyebrow}
          </PdpTextReveal>

          <PdpTextReveal as="div" delay={80}>
            <blockquote className="m-0 p-0">
              <p className="pdp-v5-quote-card__quote m-0 text-balance">
                &ldquo;{quote}&rdquo;
              </p>
            </blockquote>
          </PdpTextReveal>

          <PdpTextReveal
            as="figcaption"
            delay={140}
            className={cn("pdp-v5-quote-card__attribution m-0 uppercase")}
          >
            {attribution}
          </PdpTextReveal>
        </figure>
      </div>
    </section>
  );
}
