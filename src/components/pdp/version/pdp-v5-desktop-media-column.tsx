"use client";

import Image from "next/image";

import { cn } from "@/lib/cn";

import { PdpGalleryHeroVideo } from "../pdp-gallery-hero-video";
import { PDP_HERO_GALLERY_SLIDES } from "../pdp-hero-gallery-data";

/**
 * v5 desktop media column (lg+ only).
 *
 * A vertical stack of the curated Tabby hero gallery stills so several product
 * frames are visible at once (Miu Miu-style scrolling media rail). It reuses the
 * same `PDP_HERO_GALLERY_SLIDES` set the mobile hero carousel draws from; v5
 * pins the hero to the template (`lockHeroGalleryTemplate`), so this list stays
 * consistent with the mobile experience and does not color-swap.
 *
 * Rendered only at the desktop breakpoint — the mobile hero (`PdpV3HeroLayout`)
 * still owns everything below lg.
 */
export function PdpV5DesktopMediaColumn() {
  return (
    <div className="pdp-v5-desktop-media grid w-full grid-cols-2 gap-2 bg-[#f0f0f0]">
      {PDP_HERO_GALLERY_SLIDES.map((slide, index) => (
        <figure
          key={`${slide.src}-${index}`}
          className={cn(
            "relative m-0 w-full overflow-hidden bg-[#f0f0f0]",
            "aspect-[4/5]",
          )}
        >
          {slide.kind === "video" ? (
            <PdpGalleryHeroVideo
              src={slide.src}
              poster={slide.poster}
              ariaLabel={slide.alt}
              isActive
              showControls
              showMuteControl
              preload="metadata"
              skeletonTone="light"
              className="size-full object-cover object-center"
            />
          ) : (
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              className="object-cover object-center"
              sizes="(min-width: 1024px) 30vw, 100vw"
            />
          )}
        </figure>
      ))}
    </div>
  );
}
