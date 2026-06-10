"use client";

import Image from "next/image";
import { useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { PdpGalleryEditorialSlide } from "./pdp-gallery-editorial-slide";
import { PdpGalleryProductHud } from "./pdp-gallery-product-hud";
import { PdpHeroActionRail } from "./pdp-hero-action-rail";
import { PdpShopTheLookSheet } from "./pdp-shop-the-look-sheet";
import {
  PDP_GALLERY_HERO_IMAGE,
  PDP_GALLERY_SLIDES,
  PDP_SHOP_THE_LOOK,
} from "./pdp-data";

/** Space for fixed bottom CTAs (54px button + pt-2.5 + pb) */
export const BOTTOM_CTA_OFFSET =
  "calc(54px + 0.625rem + max(30px, env(safe-area-inset-bottom, 0px)))";

const GALLERY_CLASS = "w-full";

/** Hero only — full-viewport immersive with product HUD */
function PdpHeroSlide({
  src,
  alt,
  priority = false,
  onOpenReviews,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  onOpenReviews?: () => void;
}) {
  return (
    <section className="relative h-[100dvh] w-full shrink-0 overflow-hidden bg-[#e9e9e9]">
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className="object-cover object-center"
        sizes="100vw"
      />

      <PdpGalleryProductHud />
      <PdpHeroActionRail onOpenReviews={onOpenReviews} />
    </section>
  );
}

type PdpGalleryPortraitSlideProps = {
  src: string;
  alt: string;
  priority?: boolean;
  scale?: string;
  insetMargins?: boolean;
  shopTheLookId?: string;
  onOpenShopTheLook?: (lookId: string) => void;
  reserveBottomCta?: boolean;
  objectPosition?: string;
};

/** Immersive 4:5 portrait — full-bleed by default, optional 12px white inset */
function PdpGalleryPortraitSlide({
  src,
  alt,
  priority = false,
  scale = "scale-100",
  insetMargins = false,
  shopTheLookId,
  onOpenShopTheLook,
  reserveBottomCta = false,
  objectPosition = "top",
}: PdpGalleryPortraitSlideProps) {
  return (
    <section
      className={
        insetMargins
          ? "relative w-full shrink-0 bg-white p-3"
          : "relative w-full shrink-0 overflow-hidden bg-[#e9e9e9]"
      }
      style={reserveBottomCta ? { paddingBottom: BOTTOM_CTA_OFFSET } : undefined}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className={`object-cover ${scale}`}
          style={{ objectPosition }}
          sizes="100vw"
        />

        {shopTheLookId && onOpenShopTheLook ? (
          <button
            type="button"
            onClick={() => onOpenShopTheLook(shopTheLookId)}
            className="font-extended absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full border border-white/50 bg-white/75 py-2.5 pl-3 pr-4 text-xs tracking-[0.2px] text-neutral-900 backdrop-blur-md"
          >
            <MaterialIcon name="checkroom" size={18} className="text-neutral-900" />
            <span>Shop the look</span>
          </button>
        ) : null}
      </div>
    </section>
  );
}

export function PdpGalleryView({ onOpenReviews }: { onOpenReviews?: () => void }) {
  const [shopLookId, setShopLookId] = useState<string | null>(null);
  const activeShopLook = shopLookId ? PDP_SHOP_THE_LOOK[shopLookId] ?? null : null;

  return (
    <>
    <div className={GALLERY_CLASS}>
      <PdpHeroSlide
        src={PDP_GALLERY_HERO_IMAGE}
        alt="Model wearing Tabby 26 shoulder bag with grey sweater and light-wash jeans"
        priority
        onOpenReviews={onOpenReviews}
      />

      {PDP_GALLERY_SLIDES.flatMap((slide, index) => {
        if (slide.type === "editorial") {
          return [
            <PdpGalleryEditorialSlide
              key={`editorial-${slide.src}`}
              src={slide.src}
              alt={slide.alt}
              caption={slide.caption}
              secondarySrc={slide.secondarySrc}
              secondaryAlt={slide.secondaryAlt}
              reserveBottomCta={index === PDP_GALLERY_SLIDES.length - 1}
            />,
          ];
        }

        return [
          <PdpGalleryPortraitSlide
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            priority={index === 0}
            scale={
              slide.scale ??
              (slide.src.includes("interior-packed") ||
              slide.src.includes("interior-packed-bleed")
                ? "scale-[1.12]"
                : "scale-[1.08]")
            }
            shopTheLookId={slide.shopTheLookId}
            onOpenShopTheLook={setShopLookId}
            insetMargins={slide.insetMargins}
            reserveBottomCta={index === PDP_GALLERY_SLIDES.length - 1}
            objectPosition={slide.objectPosition}
          />,
        ];
      })}

    </div>
    <PdpShopTheLookSheet
      look={activeShopLook}
      open={shopLookId !== null}
      onClose={() => setShopLookId(null)}
    />
    </>
  );
}
