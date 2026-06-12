import Image from "next/image";

import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { galleryPanelClassName } from "./pdp-gallery-panel";
import { BOTTOM_CTA_OFFSET, SCREEN_HEIGHT_STYLE } from "./pdp-viewport-chrome";
import { pdpType } from "./pdp-type";

type PdpGalleryEditorialSlideProps = {
  src: string;
  alt: string;
  caption: string;
  objectPosition?: string;
  secondarySrc?: string;
  secondaryAlt?: string;
  learnMore?: {
    label: string;
    href: string;
  };
  /** Full-viewport snap panel (experimental) */
  panelScroll?: boolean;
  isLastPanel?: boolean;
  /** Extra bottom inset for the fixed add-to-bag bar */
  reserveBottomCta?: boolean;
};

/** Inset editorial break — narrowed image + caption with generous margins */
export function PdpGalleryEditorialSlide({
  src,
  alt,
  caption,
  objectPosition = "center top",
  secondarySrc,
  secondaryAlt,
  learnMore,
  panelScroll = false,
  isLastPanel = false,
  reserveBottomCta = false,
}: PdpGalleryEditorialSlideProps) {
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
              panelScroll && "max-h-[calc(var(--pdp-screen-height,100dvh)-7rem)] justify-center",
            )}
          >
            <div
              className={cn(
                "relative w-full overflow-hidden bg-neutral-100",
                panelScroll ? "aspect-[4/5] max-h-[52dvh]" : "aspect-[4/5]",
              )}
            >
              <Image
                src={src}
                alt={alt}
                fill
                className="object-cover"
                style={{ objectPosition }}
                sizes="(max-width: 1023px) 78vw, 42vw"
              />
            </div>

            <div
              className={cn(
                "flex w-full flex-col items-start gap-3",
                learnMore && "pb-2 lg:pb-4",
              )}
            >
              <p className={`font-extended m-0 w-full text-black ${pdpType.caption}`}>
                {caption}
              </p>

              {learnMore ? (
                <a
                  href={learnMore.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full bg-neutral-100 px-4 py-2.5 text-sm tracking-[0.2px] text-black transition-colors active:bg-neutral-200/80"
                >
                  <span className="font-extended translate-y-px">{learnMore.label}</span>
                </a>
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
