"use client";

import Image from "next/image";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import {
  pdpBottomSheetBackdropClass,
  pdpBottomSheetBodyClass,
  pdpBottomSheetCloseButtonClass,
  pdpBottomSheetGrabHandleClass,
  pdpBottomSheetHeaderClass,
  pdpBottomSheetOverlayClass,
  pdpBottomSheetPanelClass,
  pdpBottomSheetScrollRegionClass,
  PDP_BOTTOM_SHEET_CLOSE_ICON_SIZE,
} from "./pdp-bottom-sheet";
import {
  pdpCarouselScrollWrapClass,
  pdpUgcVideoCardInfiniteV4Class,
  pdpUgcVideoInfiniteScrollV4Class,
} from "./pdp-carousel";
import { PDP_UGC_VIDEO_CAROUSEL } from "./pdp-data";
import { pdpSheetHeadingClass } from "./pdp-module-section";
import { pdpType } from "./pdp-type";
import { PdpUgcVideoCard } from "./pdp-ugc-video-card";
import {
  loopCarouselItems,
  useDragToScroll,
  useInfiniteCenteredCarousel,
} from "./use-infinite-centered-carousel";
import { useOverlayDismiss } from "./use-overlay-dismiss";
import { PdpUgcMediaToggle, type UgcMediaMode } from "./pdp-ugc-media-toggle";
import {
  PDP_UGC_COMMUNITY_COMPACT_SECTION,
  PDP_UGC_COMMUNITY_PHOTOS,
  type PdpUgcCommunityPhoto,
} from "./version/pdp-data-v2";

type PdpUgcCommunitySheetProps = {
  open: boolean;
  onClose: () => void;
  /** Which tab opens first — defaults to videos for the +N more affordance. */
  initialMediaMode?: UgcMediaMode;
};

function UgcSheetPhotoGrid({ photos }: { photos: readonly PdpUgcCommunityPhoto[] }) {
  return (
    <ul className="m-0 grid list-none grid-cols-2 gap-x-2 gap-y-4 p-0">
      {photos.map((photo) => (
        <li key={photo.id} className="flex min-w-0 flex-col gap-2">
          <div className="relative aspect-[9/16] overflow-hidden rounded-none bg-neutral-100">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="rounded-none object-cover object-center"
              sizes="50vw"
            />
          </div>
          {photo.quote || photo.caption || photo.handle ? (
            <div className="flex flex-col gap-1">
              {photo.caption ? (
                <p className={cn(pdpType.label, "m-0 text-neutral-500")}>{photo.caption}</p>
              ) : null}
              {photo.quote ? (
                <p className={cn(pdpType.caption, "m-0 text-pretty text-neutral-600")}>
                  &ldquo;{photo.quote}&rdquo;
                </p>
              ) : null}
              {photo.handle ? (
                <p className={cn(pdpType.micro, "m-0 text-neutral-400")}>{photo.handle}</p>
              ) : null}
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function UgcSheetVideoRail() {
  const { videos } = PDP_UGC_VIDEO_CAROUSEL;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollRoot, setScrollRoot] = useState<HTMLElement | null>(null);
  const loopedVideos = useMemo(() => loopCarouselItems(videos), [videos]);

  useInfiniteCenteredCarousel(scrollRef, videos.length);
  useDragToScroll(scrollRef);

  useEffect(() => {
    setScrollRoot(scrollRef.current);
  }, []);

  return (
    <div className={cn(pdpCarouselScrollWrapClass, "relative -mx-3")}>
      <div
        ref={scrollRef}
        className={cn(
          "flex gap-4 overflow-y-clip pdp-carousel-draggable pb-2",
          pdpUgcVideoInfiniteScrollV4Class,
        )}
        aria-label="Community videos"
      >
        {loopedVideos.map((video, index) => (
          <PdpUgcVideoCard
            key={`${video.id}-${index}`}
            video={video}
            scrollRoot={scrollRoot}
            className={pdpUgcVideoCardInfiniteV4Class}
          />
        ))}
      </div>
    </div>
  );
}

/** Bottom sheet — full community videos + photos on the Coach site. */
export function PdpUgcCommunitySheet({
  open,
  onClose,
  initialMediaMode = "videos",
}: PdpUgcCommunitySheetProps) {
  const titleId = useId();
  const mounted = useOverlayDismiss(open, onClose);
  const [mediaMode, setMediaMode] = useState<UgcMediaMode>(initialMediaMode);
  const [hasBeenOpen, setHasBeenOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setHasBeenOpen(true);
      setMediaMode(initialMediaMode);
    }
  }, [open, initialMediaMode]);

  if (!mounted) {
    return null;
  }

  const { headline } = PDP_UGC_COMMUNITY_COMPACT_SECTION;

  return createPortal(
    <div
      className={pdpBottomSheetOverlayClass({ open })}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close community media"
        className={pdpBottomSheetBackdropClass()}
        onClick={onClose}
        tabIndex={open ? 0 : -1}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={pdpBottomSheetPanelClass({ open, maxHeight: "92dvh", stableHeight: true })}
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

        <div className={pdpBottomSheetBodyClass}>
          <div className="shrink-0 px-3 pb-4">
            <h2 id={titleId} className={cn(pdpSheetHeadingClass(), "mb-3")}>
              {headline}
            </h2>
            <PdpUgcMediaToggle value={mediaMode} onChange={setMediaMode} />
          </div>

          <div
            data-pdp-sheet-scroll
            className={pdpBottomSheetScrollRegionClass(
              "min-h-0 flex-1 px-3 pt-4 pb-[max(24px,var(--pdp-safe-area-bottom))]",
            )}
          >
            {hasBeenOpen ? (
              mediaMode === "videos" ? (
                <UgcSheetVideoRail />
              ) : (
                <UgcSheetPhotoGrid photos={PDP_UGC_COMMUNITY_PHOTOS} />
              )
            ) : null}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
