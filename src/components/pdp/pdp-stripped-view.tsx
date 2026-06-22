"use client";

import Image from "next/image";

import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { PdpGalleryProductHud } from "./pdp-gallery-product-hud";
import { PdpHeroActionRail, PdpStaticActionRow } from "./pdp-hero-action-rail";
import { useActiveProduct } from "./pdp-active-product-context";
import { PdpModuleHeading } from "./pdp-module-heading";
import { PdpRecentlyViewedCarousel } from "./pdp-recently-viewed-carousel";
import { PdpCoachPremiumModule } from "./pdp-coach-premium-module";
import { PdpFaqModule } from "./pdp-faq-module";
import { PdpReviewsModule } from "./pdp-reviews-module";
import {
  PdpCoachAiModule,
  PdpMoreLikeThisModule,
} from "./pdp-shopping-discovery-module";
import { PdpRevealItem } from "./pdp-reveal-item";
import { PdpScrollReveal } from "./pdp-scroll-reveal";
import { PdpSiteFooter } from "./pdp-site-footer";
import { PDP_STUDIO_BACKDROP_CLASS } from "./pdp-data";
import { pdpModuleSectionClass } from "./pdp-module-section";
import type { PdpProductConfig, PdpProductHero, PdpProductSummary } from "./pdp-products";
import { useOptionalTabbyVariant } from "./pdp-tabby-variant-context";
import { pdpType } from "./pdp-type";
import {
  BOTTOM_CTA_OFFSET,
  HERO_IMMERSIVE_CLASS,
  HERO_IMMERSIVE_MEDIA_CLASS,
  PANEL_MEDIA_FILL_CLASS,
} from "./pdp-viewport-chrome";

const STRIPPED_SCROLL_PAD = { paddingBottom: BOTTOM_CTA_OFFSET } as const;

function staticHeroAspectClass(aspect?: "4/5" | "9/16") {
  return aspect === "9/16" ? "aspect-[9/16]" : "aspect-[4/5]";
}

export type PdpStaticHeroImage = {
  src: string;
  alt: string;
  objectPosition?: string;
  aspect?: "4/5" | "9/16";
};

function toStaticHeroImage(
  hero: Extract<PdpProductHero, { kind: "image" }>,
): PdpStaticHeroImage {
  return {
    src: hero.src,
    alt: hero.alt,
    objectPosition: hero.objectPosition,
    aspect: hero.aspect,
  };
}

function normalizeStaticHeroImage(
  hero: PdpStaticHeroImage | Extract<PdpProductHero, { kind: "image" }>,
): PdpStaticHeroImage {
  return "kind" in hero ? toStaticHeroImage(hero) : hero;
}

/** 4:5 product shot + in-flow summary — studio heroes without video-style overlays */
export function PdpStaticHero({
  hero,
  onOpenReviews,
  onOpenArTryOn,
  summary: summaryOverride,
}: {
  hero: PdpStaticHeroImage | Extract<PdpProductHero, { kind: "image" }>;
  onOpenReviews?: () => void;
  onOpenArTryOn?: () => void;
  summary?: PdpProductSummary;
}) {
  const { productId, product } = useActiveProduct();
  const tabby = useOptionalTabbyVariant();
  const image = normalizeStaticHeroImage(hero);
  const summary =
    summaryOverride ??
    (productId === "tabby" && tabby ? tabby.summary : product.summary);
  const aspectClass = staticHeroAspectClass(image.aspect ?? "4/5");

  return (
    <section
      data-header-surface="light"
      className="w-full shrink-0 bg-white"
    >
      <div className={cn("relative w-full overflow-hidden", PDP_STUDIO_BACKDROP_CLASS)}>
        <PdpRevealItem className={cn("relative w-full overflow-hidden", aspectClass)}>
          <Image
            key={`${productId}-${image.src}`}
            src={image.src}
            alt={image.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: image.objectPosition ?? "center" }}
          />
        </PdpRevealItem>
      </div>

      <PageGrid fullWidth className="py-4">
        <GridItem mobile={12} desktop={24} className="flex flex-col gap-3">
          <div className="font-extended tracking-[0.2px] text-neutral-900">
            <div className="flex items-center justify-between gap-4 text-base font-normal leading-none">
              <p className="min-w-0 truncate">{summary.name}</p>
              <p className="shrink-0 tabular-nums">{summary.price}</p>
            </div>
            <p className={`mt-1 ${pdpType.label} text-neutral-500`}>
              {summary.subtitle}
            </p>
          </div>
          <PdpStaticActionRow
            onOpenReviews={onOpenReviews}
            onOpenArTryOn={onOpenArTryOn}
          />
        </GridItem>
      </PageGrid>
    </section>
  );
}

/** Full-screen image hero — stripped counterpart to the immersive video hero */
export function PdpStrippedHero({
  src,
  alt,
  objectPosition = "center",
  onOpenReviews,
  onOpenArTryOn,
}: {
  src: string;
  alt: string;
  objectPosition?: string;
  onOpenReviews?: () => void;
  onOpenArTryOn?: () => void;
}) {
  return (
    <section className={cn(HERO_IMMERSIVE_CLASS, "shrink-0")}>
      <div className={HERO_IMMERSIVE_MEDIA_CLASS}>
        <div className={PANEL_MEDIA_FILL_CLASS}>
          <Image
            key={src}
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
      <PdpHeroActionRail
        onOpenReviews={onOpenReviews}
        onOpenArTryOn={onOpenArTryOn}
      />
    </section>
  );
}

const ECOMM_MODULE_CLASS = "w-full shrink-0";

/** Pared-back PDP body — same template shell, fewer modules below the fold */
export function PdpStrippedView({
  product,
  onOpenReviews,
  onAddSimilarToBag,
}: {
  product: PdpProductConfig;
  onOpenReviews?: () => void;
  onAddSimilarToBag?: () => void;
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
        className={ECOMM_MODULE_CLASS}
        surface="light"
        lazyMount
        reserveMinHeight="40dvh"
      >
        <PdpReviewsModule
          first={!detail}
          onReadAll={onOpenReviews}
          onWriteReview={onOpenReviews}
        />
      </PdpScrollReveal>
      <PdpScrollReveal
        className={ECOMM_MODULE_CLASS}
        surface="light"
        lazyMount
        reserveMinHeight="32dvh"
      >
        <PdpCoachAiModule />
      </PdpScrollReveal>
      <PdpScrollReveal
        className={ECOMM_MODULE_CLASS}
        surface="muted"
        lazyMount
        reserveMinHeight="40dvh"
      >
        <PdpMoreLikeThisModule onAddToBag={onAddSimilarToBag} />
      </PdpScrollReveal>
      <PdpScrollReveal
        className={ECOMM_MODULE_CLASS}
        surface="muted"
        lazyMount
        reserveMinHeight="24dvh"
      >
        <PdpRecentlyViewedCarousel />
      </PdpScrollReveal>
      <PdpScrollReveal
        className={ECOMM_MODULE_CLASS}
        surface="light"
        lazyMount
        reserveMinHeight="32dvh"
      >
        <PdpFaqModule />
      </PdpScrollReveal>
      <PdpScrollReveal
        className={ECOMM_MODULE_CLASS}
        surface="muted"
        lazyMount
        reserveMinHeight="28dvh"
      >
        <PdpCoachPremiumModule />
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
