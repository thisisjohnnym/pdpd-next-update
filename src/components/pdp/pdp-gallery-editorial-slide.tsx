import Image from "next/image";

import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { BOTTOM_CTA_OFFSET } from "./pdp-gallery-view";
import { pdpType } from "./pdp-type";

type PdpGalleryEditorialSlideProps = {
  src: string;
  alt: string;
  caption: string;
  secondarySrc?: string;
  secondaryAlt?: string;
  learnMore?: {
    label: string;
    href: string;
  };
  /** Extra bottom inset for the fixed add-to-bag bar */
  reserveBottomCta?: boolean;
};

/** Inset 4:5 editorial break — image, caption, optional second image */
export function PdpGalleryEditorialSlide({
  src,
  alt,
  caption,
  secondarySrc,
  secondaryAlt,
  learnMore,
  reserveBottomCta = false,
}: PdpGalleryEditorialSlideProps) {
  return (
    <section
      data-header-surface="light"
      className="relative flex w-full shrink-0 flex-col bg-white py-3 lg:py-5"
      style={reserveBottomCta ? { paddingBottom: BOTTOM_CTA_OFFSET } : undefined}
    >
      <PageGrid fullWidth>
        <GridItem mobile={12} desktop={24}>
          <div className="flex w-full flex-col gap-3 lg:gap-5">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">
              <Image
                src={src}
                alt={alt}
                fill
                className="object-cover object-top"
                sizes="100vw"
              />
            </div>

            <div
              className={cn(
                "flex w-full flex-col items-start gap-3",
                learnMore && "pb-6 lg:pb-8",
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

            {secondarySrc ? (
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">
                <Image
                  src={secondarySrc}
                  alt={secondaryAlt ?? ""}
                  fill
                  className="object-cover object-top scale-[1.12]"
                  sizes="100vw"
                />
              </div>
            ) : null}
          </div>
        </GridItem>
      </PageGrid>
    </section>
  );
}
