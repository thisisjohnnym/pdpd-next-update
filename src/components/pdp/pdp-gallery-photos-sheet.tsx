"use client";

import Image from "next/image";
import { useId } from "react";
import { createPortal } from "react-dom";

import { MaterialIcon } from "@/components/icons/material-icon";

import {
  pdpBottomSheetBackdropClass,
  pdpBottomSheetCloseButtonClass,
  pdpBottomSheetGrabHandleClass,
  pdpBottomSheetHeaderClass,
  pdpBottomSheetOverlayClass,
  pdpBottomSheetPanelClass,
  pdpBottomSheetScrollRegionClass,
  PDP_BOTTOM_SHEET_CLOSE_ICON_SIZE,
} from "./pdp-bottom-sheet";
import { PDP_GALLERY_MORE_PHOTOS, type PdpGalleryPhoto } from "./pdp-data";
import { pdpSheetHeadingClass } from "./pdp-module-section";
import { useOverlayDismiss } from "./use-overlay-dismiss";

type PdpGalleryPhotosSheetProps = {
  photos?: PdpGalleryPhoto[];
  open: boolean;
  onClose: () => void;
};

/** Bottom sheet — full product photo grid */
export function PdpGalleryPhotosSheet({
  photos = PDP_GALLERY_MORE_PHOTOS,
  open,
  onClose,
}: PdpGalleryPhotosSheetProps) {
  const titleId = useId();
  const mounted = useOverlayDismiss(open, onClose);

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
        <div className={pdpBottomSheetHeaderClass}>
          <div className={pdpBottomSheetGrabHandleClass} />
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className={pdpBottomSheetCloseButtonClass}
          >
            <MaterialIcon name="close" size={PDP_BOTTOM_SHEET_CLOSE_ICON_SIZE} />
          </button>
        </div>

        <div className="flex shrink-0 px-3 pb-4">
          <h2 id={titleId} className={pdpSheetHeadingClass()}>
            All media
          </h2>
        </div>

        <div
          data-pdp-sheet-scroll
          className={pdpBottomSheetScrollRegionClass(
            "px-3 pb-[max(24px,var(--pdp-safe-area-bottom))]",
          )}
        >
          <ul className="m-0 grid list-none grid-cols-2 gap-1.5 p-0">
            {photos.map((photo) => (
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
