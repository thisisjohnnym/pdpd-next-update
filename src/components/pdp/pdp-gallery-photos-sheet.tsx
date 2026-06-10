"use client";

import Image from "next/image";
import { useEffect, useId } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { PDP_GALLERY_MORE_PHOTOS } from "./pdp-data";

type PdpGalleryPhotosSheetProps = {
  open: boolean;
  onClose: () => void;
};

/** Bottom sheet — full product photo grid */
export function PdpGalleryPhotosSheet({ open, onClose }: PdpGalleryPhotosSheetProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-end justify-center transition-opacity duration-300",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      )}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close photo gallery"
        className="absolute inset-0 bg-black/45 transition-opacity"
        onClick={onClose}
        tabIndex={open ? 0 : -1}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "relative flex max-h-[88dvh] w-full max-w-[430px] flex-col overflow-hidden rounded-t-[20px] bg-white shadow-[0_-8px_40px_rgba(0,0,0,0.18)] transition-transform duration-300 ease-out",
          open ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="shrink-0 px-2.5 pb-0 pt-2.5">
          <div className="mx-auto mb-4 h-[3px] w-[50px] rounded-full bg-black/70" />
        </div>

        <div className="flex shrink-0 items-center justify-between px-3 pb-4">
          <h2
            id={titleId}
            className="font-extended m-0 text-xl tracking-[0.4px] text-black"
          >
            All photos
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full text-neutral-900"
          >
            <MaterialIcon name="close" size={24} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-[max(24px,env(safe-area-inset-bottom))]">
          <ul className="m-0 grid list-none grid-cols-2 gap-1.5 p-0">
            {PDP_GALLERY_MORE_PHOTOS.map((photo) => (
              <li key={photo.id} className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 430px) 50vw, 215px"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
