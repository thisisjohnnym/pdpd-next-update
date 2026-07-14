"use client";

import Image from "next/image";

import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { usePdpElementReveal } from "../use-pdp-element-reveal";

import { PDP_V5_EDITORIAL_QUOTE } from "./pdp-data-v2";
import { getPdpVersionConfig } from "./pdp-version-config";
import { usePdpVersion } from "./pdp-version-context";

/** Card begins slightly undersized and settles to full size on scroll. */
const QUOTE_CARD_SCALE_FROM = 0.88;

/**
 * v5 — 9:16 editorial quote card.
 *
 * Celebrity photo above a warm beige pull-quote panel.
 * v7 flush caption: photo-led card, quote + name only (no competing eyebrow).
 */
export function PdpV5QuoteCard() {
  const version = usePdpVersion();
  const { useV4GranularScrollReveal, quoteCardFlushCaption } =
    getPdpVersionConfig(version);
  const { eyebrow, quote, attribution, src, alt } = PDP_V5_EDITORIAL_QUOTE;
  const cardRef = usePdpElementReveal<HTMLElement>({
    scaleFrom: QUOTE_CARD_SCALE_FROM,
    enabled: useV4GranularScrollReveal,
  });

  return (
    <PageGrid
      as="section"
      fullWidth
      data-header-surface="light"
      className={cn(
        "pdp-v5-quote-card-section shrink-0",
        quoteCardFlushCaption ? "py-2 lg:py-3" : "py-3 lg:py-4",
      )}
    >
      <GridItem mobile={12} desktop={6} desktopStart={10}>
        <figure
          ref={useV4GranularScrollReveal ? cardRef : undefined}
          aria-label={
            quoteCardFlushCaption ? `Quote from ${attribution}` : undefined
          }
          className={cn(
            "pdp-v5-quote-card m-0 flex w-full min-w-0 flex-col overflow-hidden",
            quoteCardFlushCaption
              ? "pdp-v5-quote-card--flush"
              : "aspect-[9/16]",
          )}
        >
          <div
            className={cn(
              "pdp-v5-quote-card__media relative min-h-0 w-full",
              quoteCardFlushCaption
                ? "aspect-[4/5] shrink-0"
                : "flex-[11]",
            )}
          >
            <Image
              src={src}
              alt={alt}
              fill
              className="object-cover object-[center_20%]"
              sizes="(min-width: 1024px) 22rem, 100vw"
              priority={false}
            />
          </div>

          <figcaption
            className={cn(
              "pdp-v5-quote-card__body flex w-full flex-col items-center text-center",
              quoteCardFlushCaption
                ? "shrink-0"
                : "min-h-0 flex-[9] justify-center",
            )}
          >
            {!quoteCardFlushCaption ? (
              <p className="pdp-v5-quote-card__eyebrow m-0 uppercase">
                {eyebrow}
              </p>
            ) : null}

            <div className="pdp-v5-quote-card__quote-wrap w-full">
              <blockquote className="m-0 p-0">
                <p className="pdp-v5-quote-card__quote m-0 text-balance">
                  &ldquo;{quote}&rdquo;
                </p>
              </blockquote>
            </div>

            <p
              className={cn(
                "pdp-v5-quote-card__attribution m-0",
                !quoteCardFlushCaption && "uppercase",
              )}
            >
              {attribution}
            </p>
          </figcaption>
        </figure>
      </GridItem>
    </PageGrid>
  );
}
