"use client";

import Image from "next/image";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";

import { PDP_GALLERY_MORE_PHOTOS } from "./pdp-data";

const PREVIEW_COUNT = 3;

type PdpGalleryViewMorePhotosProps = {
  onOpen: () => void;
};

/** Bottom gallery affordance — peek thumbnails + open full photo grid */
export function PdpGalleryViewMorePhotos({ onOpen }: PdpGalleryViewMorePhotosProps) {
  const previews = PDP_GALLERY_MORE_PHOTOS.slice(0, PREVIEW_COUNT);
  const remaining = PDP_GALLERY_MORE_PHOTOS.length - PREVIEW_COUNT;

  return (
    <section
      data-header-surface="light"
      className="relative w-full shrink-0 bg-white pt-5"
    >
      <PageGrid fullWidth>
        <GridItem mobile={12} desktop={24}>
          <button
            type="button"
            onClick={onOpen}
            className="font-extended flex w-full items-center gap-3 rounded-2xl bg-neutral-100 px-3 py-3 text-left tracking-[0.2px] text-neutral-900 transition-colors active:bg-neutral-200/80"
          >
            <span className="flex shrink-0 items-center pl-1">
              {previews.map((photo, index) => (
                <span
                  key={photo.id}
                  className="relative size-11 overflow-hidden rounded-lg border-2 border-white bg-neutral-200 shadow-sm"
                  style={{
                    zIndex: PREVIEW_COUNT - index,
                    marginLeft: index === 0 ? 0 : -10,
                  }}
                >
                  <Image
                    src={photo.src}
                    alt=""
                    fill
                    className="object-cover object-center"
                    sizes="44px"
                  />
                </span>
              ))}
            </span>

            <span className="min-w-0 flex-1">
              <span className="block text-sm leading-tight text-neutral-900">
                View more media
              </span>
              {remaining > 0 ? (
                <span className="mt-0.5 block text-xs text-neutral-500">
                  +{remaining} more
                </span>
              ) : null}
            </span>

            <MaterialIcon
              name="chevron_right"
              size={20}
              className="shrink-0 text-neutral-500"
            />
          </button>
        </GridItem>
      </PageGrid>
    </section>
  );
}
