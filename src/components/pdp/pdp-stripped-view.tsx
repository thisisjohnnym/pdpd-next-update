"use client";

import Image from "next/image";

import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { PdpGalleryProductHud } from "./pdp-gallery-product-hud";
import { PdpHeroActionRail } from "./pdp-hero-action-rail";
import { PdpModuleHeading } from "./pdp-module-heading";
import { PdpRecentlyViewedCarousel } from "./pdp-recently-viewed-carousel";
import { PdpRevealItem } from "./pdp-reveal-item";
import { PdpScrollReveal } from "./pdp-scroll-reveal";
import { PdpSiteFooter } from "./pdp-site-footer";
import { PDP_STUDIO_BACKDROP_CLASS } from "./pdp-data";
import { pdpModuleSectionClass } from "./pdp-module-section";
import type { PdpProductConfig } from "./pdp-products";
import { pdpType } from "./pdp-type";
import {
  BOTTOM_CTA_OFFSET,
  HERO_IMMERSIVE_CLASS,
  HERO_IMMERSIVE_MEDIA_CLASS,
  PANEL_MEDIA_FILL_CLASS,
} from "./pdp-viewport-chrome";

const STRIPPED_SCROLL_PAD = { paddingBottom: BOTTOM_CTA_OFFSET } as const;

/** Full-screen image hero — stripped counterpart to the immersive video hero */
export function PdpStrippedHero({
  src,
  alt,
  objectPosition = "center",
  onOpenReviews,
}: {
  src: string;
  alt: string;
  objectPosition?: string;
  onOpenReviews?: () => void;
}) {
  return (
    <section className={cn(HERO_IMMERSIVE_CLASS, "shrink-0")}>
      <div className={HERO_IMMERSIVE_MEDIA_CLASS}>
        <div className={PANEL_MEDIA_FILL_CLASS}>
          <Image
            src={src}
            alt={alt}
            fill
            priority
            sizes="100vw"
            className="pdp-gallery-panel__cover size-full object-cover object-center"
            style={{ objectPosition }}
          />
        </div>
      </div>

      <div aria-hidden className="pdp-hero-immersive__top-scrim" />

      <PdpGalleryProductHud />
      <PdpHeroActionRail onOpenReviews={onOpenReviews} />
    </section>
  );
}

/** Pared-back PDP body — same template shell, fewer modules below the fold */
export function PdpStrippedView({
  product,
  onOpenReviews,
}: {
  product: PdpProductConfig;
  onOpenReviews?: () => void;
}) {
  const slides = product.slides ?? [];
  const detail = product.detail;

  return (
    <div className="w-full overflow-x-clip bg-white" style={STRIPPED_SCROLL_PAD}>
      {slides.length > 0 ? (
        <div className="flex flex-col bg-white">
          {slides.map((slide, index) => (
            <PdpScrollReveal
              key={`${slide.src}-${index}`}
              surface="light"
              lazyMount
            >
              <section
                className={cn(
                  "relative w-full shrink-0 overflow-hidden",
                  PDP_STUDIO_BACKDROP_CLASS,
                )}
              >
                <PdpRevealItem
                  className={cn(
                    "relative w-full overflow-hidden",
                    slide.aspect === "9/16" ? "aspect-[9/16]" : "aspect-[4/5]",
                  )}
                >
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    sizes="100vw"
                    className="object-cover object-center"
                    style={{ objectPosition: slide.objectPosition ?? "center" }}
                  />
                </PdpRevealItem>
              </section>
            </PdpScrollReveal>
          ))}
        </div>
      ) : null}

      {detail ? (
        <PdpScrollReveal
          className="w-full shrink-0"
          surface="light"
          lazyMount
          reserveMinHeight="32dvh"
        >
          <section
            data-header-surface="light"
            className={pdpModuleSectionClass({ first: true })}
          >
            <PageGrid fullWidth>
              <GridItem mobile={12} desktop={24} className="min-w-0">
                <PdpModuleHeading>{detail.heading}</PdpModuleHeading>
                <p className={`font-extended text-neutral-700 ${pdpType.body}`}>
                  {detail.body}
                </p>
                <dl className="mt-5 m-0">
                  {detail.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="flex items-baseline justify-between gap-4 border-b border-neutral-200 py-3"
                    >
                      <dt
                        className={`font-extended text-neutral-500 ${pdpType.label}`}
                      >
                        {spec.label}
                      </dt>
                      <dd
                        className={`font-extended m-0 text-right text-neutral-900 ${pdpType.body}`}
                      >
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </GridItem>
            </PageGrid>
          </section>
        </PdpScrollReveal>
      ) : null}

      <PdpScrollReveal
        className="w-full shrink-0"
        surface="muted"
        lazyMount
        reserveMinHeight="24dvh"
      >
        <PdpRecentlyViewedCarousel />
      </PdpScrollReveal>
      <PdpScrollReveal
        className="w-full shrink-0"
        surface="light"
        lazyMount
        reserveMinHeight="20dvh"
      >
        <PdpSiteFooter />
      </PdpScrollReveal>
    </div>
  );
}
