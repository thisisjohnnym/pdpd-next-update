"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

import { MaterialIcon } from "@/components/icons/material-icon";

import {
  pdpBottomSheetBackdropClass,
  pdpBottomSheetOverlayClass,
  pdpBottomSheetPanelClass,
} from "./pdp-bottom-sheet";
import { PDP_GALLERY_MORE_PHOTOS } from "./pdp-data";
import { pdpSheetHeadingClass } from "./pdp-module-section";

type PdpGalleryPhotosSheetProps = {
  open: boolean;
  onClose: () => void;
};

/** Bottom sheet — full product photo grid */
export function PdpGalleryPhotosSheet({ open, onClose }: PdpGalleryPhotosSheetProps) {
  const titleId = useId();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div
      className={pdpBottomSheetOverlayClass({ open })}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close media gallery"
        className={pdpBottomSheetBackdropClass()}
        onClick={onClose}
        tabIndex={open ? 0 : -1}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={pdpBottomSheetPanelClass({ open, maxHeight: "88dvh" })}
      >
        <div className="shrink-0 px-2.5 pb-0 pt-2.5">
          <div className="mx-auto mb-4 h-[3px] w-[50px] rounded-full bg-black/70" />
        </div>

        <div className="flex shrink-0 items-center justify-between px-3 pb-4">
          <h2 id={titleId} className={pdpSheetHeadingClass()}>
            All media
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

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-[max(24px,var(--pdp-safe-area-bottom))]">
          <ul className="m-0 grid list-none grid-cols-2 gap-1.5 p-0">
            {PDP_GALLERY_MORE_PHOTOS.map((photo) => (
              <li key={photo.id} className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover object-center"
                  sizes="50vw"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>,
    document.body,
  );
}
