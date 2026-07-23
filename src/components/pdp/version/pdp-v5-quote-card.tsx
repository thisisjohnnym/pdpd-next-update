"use client";

import Image from "next/image";

import { cn } from "@/lib/cn";

import { usePdpElementReveal } from "../use-pdp-element-reveal";

import { PDP_V5_EDITORIAL_QUOTE } from "./pdp-data-v2";
import { getPdpVersionConfig } from "./pdp-version-config";
import { usePdpVersion } from "./pdp-version-context";

/** Card begins slightly undersized and settles to full size on scroll. */
const QUOTE_CARD_SCALE_FROM = 0.88;

/**
 * v5 — editorial quote card.
 *
 * Mobile: stacked 9:16 card (photo above warm pull-quote).
 * Desktop: photo flush left, quote panel on the right.
 */
export function PdpV5QuoteCard() {
  const version = usePdpVersion();
  const { useV4GranularScrollReveal } = getPdpVersionConfig(version);
  const { eyebrow, quote, attribution, src, alt } = PDP_V5_EDITORIAL_QUOTE;
  const cardRef = usePdpElementReveal<HTMLElement>({
    scaleFrom: QUOTE_CARD_SCALE_FROM,
    enabled: useV4GranularScrollReveal,
  });

  return (
    <section
      data-header-surface="light"
      aria-label={eyebrow}
      className="pdp-v5-quote-card-section w-full shrink-0 px-2 py-3 lg:px-0 lg:py-0"
    >
      <figure
        ref={useV4GranularScrollReveal ? cardRef : undefined}
        className="pdp-v5-quote-card m-0 flex aspect-[9/16] w-full min-w-0 flex-col overflow-hidden lg:aspect-auto"
      >
        <div className="pdp-v5-quote-card__media relative min-h-0 w-full flex-[11] lg:flex-none">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover object-[center_20%]"
            sizes="(min-width: 1024px) 55vw, 24rem"
            priority={false}
          />
        </div>

        <figcaption
          className={cn(
            "pdp-v5-quote-card__body flex min-h-0 w-full flex-[9] flex-col",
            "items-center justify-center text-center",
            "lg:flex-none lg:items-start lg:justify-center lg:text-left",
          )}
        >
          <p className="pdp-v5-quote-card__eyebrow m-0 uppercase">{eyebrow}</p>

          <div className="pdp-v5-quote-card__quote-wrap w-full">
            <blockquote className="m-0 p-0">
              <p className="pdp-v5-quote-card__quote m-0 text-balance">
                &ldquo;{quote}&rdquo;
              </p>
            </blockquote>
          </div>

          <p className="pdp-v5-quote-card__attribution m-0 uppercase">
            {attribution}
          </p>
        </figcaption>
      </figure>
    </section>
  );
}
