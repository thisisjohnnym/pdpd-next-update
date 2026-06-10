import Image from "next/image";

import { GridItem, PageGrid } from "@/components/grid/page-grid";

import { BOTTOM_CTA_OFFSET } from "./pdp-gallery-view";

type PdpGalleryEditorialSlideProps = {
  src: string;
  alt: string;
  caption: string;
  secondarySrc?: string;
  secondaryAlt?: string;
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
  reserveBottomCta = false,
}: PdpGalleryEditorialSlideProps) {
  return (
    <section
      data-header-surface="light"
      className="relative flex w-full shrink-0 flex-col bg-white pt-3 pb-3 lg:pt-5 lg:pb-5"
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

            <p className="font-extended m-0 w-full text-xs leading-[1.35] tracking-[0.2px] text-black">
              {caption}
            </p>

            {secondarySrc && (
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">
                <Image
                  src={secondarySrc}
                  alt={secondaryAlt ?? ""}
                  fill
                  className="object-cover object-top scale-[1.12]"
                  sizes="100vw"
                />
              </div>
            )}
          </div>
        </GridItem>
      </PageGrid>
    </section>
  );
}
