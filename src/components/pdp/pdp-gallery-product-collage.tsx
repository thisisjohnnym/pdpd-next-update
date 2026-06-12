"use client";

import Image from "next/image";

import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { PDP_GALLERY_PRODUCT_DETAIL_COLLAGE, PDP_STUDIO_BACKDROP_CLASS } from "./pdp-data";
import { galleryPanelClassName } from "./pdp-gallery-panel";
import { PDP_PANEL_SCROLL } from "./pdp-panel-scroll";
import { BOTTOM_CTA_OFFSET } from "./pdp-viewport-chrome";
import { SCREEN_HEIGHT_STYLE } from "./pdp-viewport-chrome";

function CollageImage({
  src,
  alt,
  objectPosition,
  sizes,
  priority = false,
}: {
  src: string;
  alt: string;
  objectPosition?: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover"
      style={{ objectPosition: objectPosition ?? "center" }}
      sizes={sizes}
      priority={priority}
    />
  );
}

/**
 * Product detail collage — native 9:16 studio shots in a flush grid:
 * full-width hero, two matching portraits below (no square crop on portrait assets).
 */
export function PdpGalleryProductCollage({
  isLastPanel = false,
}: {
  isLastPanel?: boolean;
}) {
  const { hero, secondary } = PDP_GALLERY_PRODUCT_DETAIL_COLLAGE;

  const collageGrid = (
    <div className={cn("grid w-full grid-cols-2", PDP_STUDIO_BACKDROP_CLASS)}>
      <div
        className={cn(
          "relative col-span-2 aspect-[9/16] overflow-hidden",
          PDP_STUDIO_BACKDROP_CLASS,
        )}
      >
        <CollageImage
          src={hero.src}
          alt={hero.alt}
          objectPosition={hero.objectPosition}
          sizes="100vw"
          priority
        />
      </div>

      {secondary.map((tile) => (
        <div
          key={tile.src}
          className={cn("relative aspect-[9/16] overflow-hidden", PDP_STUDIO_BACKDROP_CLASS)}
        >
          <CollageImage
            src={tile.src}
            alt={tile.alt}
            objectPosition={tile.objectPosition}
            sizes="50vw"
          />
        </div>
      ))}
    </div>
  );

  if (!PDP_PANEL_SCROLL) {
    return (
      <section
        data-header-surface="light"
        className={cn(
          "relative w-full shrink-0 overflow-hidden",
          PDP_STUDIO_BACKDROP_CLASS,
          galleryPanelClassName(isLastPanel),
        )}
      >
        {collageGrid}
      </section>
    );
  }

  return (
    <section
      data-header-surface="light"
      className={cn(
        "relative flex w-full shrink-0 flex-col overflow-hidden",
        PDP_STUDIO_BACKDROP_CLASS,
        galleryPanelClassName(isLastPanel),
      )}
      style={{
        ...SCREEN_HEIGHT_STYLE,
        paddingBottom: BOTTOM_CTA_OFFSET,
      }}
    >
      <PageGrid fullWidth className="h-full min-h-0">
        <GridItem
          mobile={12}
          desktop={24}
          className="flex h-full min-h-0 flex-col"
        >
          <div className="flex h-full min-h-0 w-full flex-col">{collageGrid}</div>
        </GridItem>
      </PageGrid>
    </section>
  );
}
