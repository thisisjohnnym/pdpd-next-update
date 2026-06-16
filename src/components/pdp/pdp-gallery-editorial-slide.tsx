"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { PdpGalleryDragZoomImage } from "./pdp-gallery-drag-zoom-image";
import { PdpGalleryHeroVideo } from "./pdp-gallery-hero-video";
import { galleryPanelClassName } from "./pdp-gallery-panel";
import { BOTTOM_CTA_OFFSET, SCREEN_HEIGHT_STYLE } from "./pdp-viewport-chrome";
import { pdpType } from "./pdp-type";
import { PdpTextLinkCta } from "./pdp-text-link-cta";
import { PdpTextReveal } from "./pdp-text-reveal";

type PdpGalleryEditorialSlideProps = {
  src: string;
  alt: string;
  caption: string;
  objectPosition?: string;
  videoSrc?: string;
  showMuteControl?: boolean;
  dragZoom?: boolean;
  scale?: string;
  secondarySrc?: string;
  secondaryAlt?: string;
  learnMore?: {
    label: string;
    href: string;
  };
  cta?: {
    label: string;
    href: string;
  };
  /** Full-viewport snap panel (experimental) */
  panelScroll?: boolean;
  isLastPanel?: boolean;
  /** Extra bottom inset for the fixed add-to-bag bar */
  reserveBottomCta?: boolean;
};

/** Inset editorial break — narrowed image or video + caption with generous margins */
export function PdpGalleryEditorialSlide({
  src,
  alt,
  caption,
  objectPosition = "center top",
  videoSrc,
  showMuteControl = true,
  dragZoom = false,
  scale = "scale-100",
  secondarySrc,
  secondaryAlt,
  learnMore,
  cta,
  panelScroll = false,
  isLastPanel = false,
  reserveBottomCta = false,
}: PdpGalleryEditorialSlideProps) {
  const mediaRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!videoSrc) {
      return;
    }

    const media = mediaRef.current;
    if (!media) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting && entry.intersectionRatio >= 0.35);
      },
      { threshold: [0, 0.35, 0.6] },
    );

    observer.observe(media);

    return () => {
      observer.disconnect();
    };
  }, [videoSrc]);

  return (
    <section
      data-header-surface="light"
      className={cn(
        "relative flex w-full shrink-0 flex-col bg-white",
        panelScroll
          ? cn("items-center justify-center px-3", galleryPanelClassName(isLastPanel))
          : "py-10 lg:py-14",
      )}
      style={
        panelScroll
          ? SCREEN_HEIGHT_STYLE
          : reserveBottomCta
            ? { paddingBottom: BOTTOM_CTA_OFFSET }
            : undefined
      }
    >
      <PageGrid fullWidth className={panelScroll ? "w-full" : undefined}>
        <GridItem
          mobile={panelScroll ? 12 : 10}
          mobileStart={panelScroll ? 1 : 2}
          desktop={panelScroll ? 24 : 14}
          desktopStart={panelScroll ? 1 : 6}
        >
          <div
            className={cn(
              "flex w-full flex-col gap-4 lg:gap-5",
              panelScroll && "max-h-[calc(var(--pdp-screen-height,100svh)-7rem)] justify-center",
            )}
          >
            <div
              ref={mediaRef}
              className={cn(
                "relative w-full overflow-hidden bg-neutral-100",
                panelScroll ? "aspect-[4/5] max-h-[52dvh]" : "aspect-[4/5]",
              )}
            >
              {videoSrc ? (
                <PdpGalleryHeroVideo
                  src={videoSrc}
                  ariaLabel={alt}
                  isActive={isActive}
                  preload={isActive ? "auto" : "metadata"}
                  skeletonTone="light"
                  showControls
                  showMuteControl={showMuteControl}
                  className="size-full object-cover object-center"
                />
              ) : dragZoom ? (
                <PdpGalleryDragZoomImage
                  src={src}
                  alt={alt}
                  objectPosition={objectPosition}
                  scale={scale}
                />
              ) : (
                <Image
                  src={src}
                  alt={alt}
                  fill
                  className="object-cover"
                  style={{ objectPosition }}
                  sizes="(max-width: 1023px) 78vw, 42vw"
                />
              )}
            </div>

            <div
              className={cn(
                "flex w-full flex-col items-start gap-1.5",
                learnMore && "pb-2 lg:pb-4",
              )}
            >
              <PdpTextReveal as="p" className={`font-extended m-0 w-full text-black ${pdpType.caption}`}>
                {caption}
              </PdpTextReveal>

              {cta ? (
                <PdpTextReveal as="div" delay={100}>
                  <PdpTextLinkCta as="a" href={cta.href} className={pdpType.micro}>
                    {cta.label}
                  </PdpTextLinkCta>
                </PdpTextReveal>
              ) : null}

              {learnMore ? (
                <PdpTextReveal as="div" delay={cta ? 200 : 100}>
                  <PdpTextLinkCta
                    as="a"
                    href={learnMore.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={pdpType.body}
                  >
                    {learnMore.label}
                  </PdpTextLinkCta>
                </PdpTextReveal>
              ) : null}
            </div>

            {secondarySrc && !panelScroll ? (
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">
                <Image
                  src={secondarySrc}
                  alt={secondaryAlt ?? ""}
                  fill
                  className="object-cover object-top scale-[1.12]"
                  sizes="(max-width: 1023px) 78vw, 42vw"
                />
              </div>
            ) : null}
          </div>
        </GridItem>
      </PageGrid>
    </section>
  );
}
