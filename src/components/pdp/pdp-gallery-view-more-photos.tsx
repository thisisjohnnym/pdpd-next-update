"use client";

import Image from "next/image";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { PDP_GALLERY_MORE_PHOTOS } from "./pdp-data";
import { pdpBodyRhythm, pdpPressableClass } from "./pdp-type";

const PREVIEW_COUNT = 3;

type PdpGalleryViewMorePhotosProps = {
  onOpen: () => void;
};

/** Flush against the last gallery frame — full-bleed extension of the photo stack */
export function PdpGalleryViewMorePhotos({ onOpen }: PdpGalleryViewMorePhotosProps) {
  const previews = PDP_GALLERY_MORE_PHOTOS.slice(0, PREVIEW_COUNT);
  const remaining = PDP_GALLERY_MORE_PHOTOS.length - PREVIEW_COUNT;

  return (
    <section
      data-header-surface="light"
      className="relative mt-4 w-full shrink-0 bg-neutral-100"
    >
      <button
        type="button"
        onClick={onOpen}
        className={cn(
          "font-extended flex w-full items-center gap-3 px-3 py-3 text-left tracking-[0.2px] text-neutral-900 transition-colors active:bg-neutral-200/80",
          pdpPressableClass,
        )}
      >
        <span className="flex shrink-0 items-center pl-1">
          {previews.map((photo, index) => (
            <span
              key={photo.id}
              className="relative size-11 overflow-hidden border-2 border-white bg-neutral-200 shadow-sm"
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
          <span className={`block text-sm text-neutral-900 ${pdpBodyRhythm}`}>
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
    </section>
  );
}
