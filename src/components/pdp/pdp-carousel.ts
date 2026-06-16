import { cn } from "@/lib/cn";

/** Bleed scroll track to viewport edges without widening the document */
export const pdpCarouselBleedClass =
  "-mx-3 px-3 lg:-mx-5 lg:px-5";

/** Clips negative-margin bleed rails so they don't expand page scroll width */
export const pdpCarouselBleedWrapClass = "w-full min-w-0 overflow-x-clip";

/** Flex parents that contain a bleed carousel rail */
export const pdpCarouselBlockClass = "min-w-0 w-full";

export const pdpCarouselScrollClass = cn(
  "pdp-carousel-scroll w-full min-w-0 overflow-x-auto overscroll-x-contain pb-1",
  pdpCarouselBleedClass,
  "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  "snap-x snap-mandatory scroll-pl-3 lg:scroll-pl-5",
);

/** Outer wrapper for bleed carousels — pair with pdpCarouselScrollClass */
export const pdpCarouselScrollWrapClass = cn(
  pdpCarouselBleedWrapClass,
);

/** 1.5 cards visible — gap-3 (12px) */
export const pdpCarouselCard15Class =
  "w-[calc((100vw-1.5rem)/1.5)] shrink-0 snap-start snap-always lg:w-[calc((100vw-2.75rem)/3)]";

/** 1.5 cards visible — gap-2 (8px) */
export const pdpCarouselCard15Gap2Class =
  "w-[calc((100vw-1.25rem)/1.5)] shrink-0 snap-start snap-always lg:w-[calc((100vw-2.25rem)/3)]";

/** Compare rail — narrow columns with next-item peek */
export const pdpCompareCarouselCardClass =
  "w-[calc((100vw-1.25rem)/2.05)] shrink-0 snap-start snap-always lg:w-[calc((100vw-2.25rem)/4)]";

/** Customer photo strip — ~2 across with next-photo peek, gap-2 */
export const pdpReviewPhotoCardClass =
  "relative aspect-[4/5] w-[calc((100vw-1.25rem)/2.05)] shrink-0 snap-start snap-always overflow-hidden bg-neutral-100 lg:w-[calc((100vw-2.25rem)/3.5)]";

/** UGC story cards — ~1.35 across with context footer, gap-2 */
export const pdpUgcStoryCardClass =
  "w-[calc((100vw-1.25rem)/1.35)] shrink-0 snap-start snap-always lg:w-[calc((100vw-2.25rem)/2.8)]";

/** UGC story cards — compact rail for reviews (~3 across) */
export const pdpUgcStoryCardCompactClass =
  "w-[calc((100vw-1.25rem)/3.15)] shrink-0 snap-start snap-always lg:w-[calc((100vw-2.25rem)/5.5)]";

/** UGC video tiles (9:16) — ~1.1 across with next clip peek, gap-2 */
export const pdpUgcVideoCardClass =
  "w-[calc((100vw-1.25rem)/1.1)] shrink-0 snap-start snap-always lg:w-[calc((100vw-2.25rem)/2.2)]";

/** UGC video tiles — center snap, full viewport width */
export const pdpUgcVideoCardCenteredClass =
  "w-full shrink-0 snap-center snap-always flex-[0_0_100%]";

/** Infinite centered carousel — full-width tiles, edge-to-edge */
export const pdpCarouselInfiniteCenteredScrollClass = cn(
  "pdp-carousel-scroll w-full min-w-0 overflow-x-auto overscroll-x-contain pb-1",
  "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  "snap-x snap-mandatory",
);

/** Infinite centered carousel — symmetric padding so active tile sits mid-frame with peek */
export const pdpCarouselInfiniteCenteredPeekScrollClass = cn(
  "pdp-carousel-scroll w-full min-w-0 overflow-x-auto overscroll-x-contain pb-1",
  pdpCarouselBleedClass,
  "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  "snap-x snap-mandatory",
  "px-[calc((100%-((100%-1.25rem)/1.1))/2)]",
  "lg:px-[calc((100%-((100%-2.25rem)/2.2))/2)]",
);

/** As seen on celebrity tiles — ~1.2 across with name overlay, gap-2 */
export const pdpAsSeenOnCardClass =
  "w-[calc((100vw-1.25rem)/1.2)] shrink-0 snap-start snap-always lg:w-[calc((100vw-2.25rem)/2.4)]";

/** Deemphasized as seen on — ~2.2 across, smaller editorial rail */
export const pdpAsSeenOnCardCompactClass =
  "w-[calc((100vw-1.25rem)/2.2)] shrink-0 snap-start snap-always lg:w-[calc((100vw-2.25rem)/4)]";

/** Profile-style as seen on avatars — width follows name */
export const pdpAsSeenOnAvatarItemClass = "shrink-0 snap-start snap-always";

/** Inset rails inside grouped discovery card — ~2 across with peek */
export const pdpCarouselInsetScrollClass = cn(
  "pdp-carousel-scroll flex w-full min-w-0 gap-2 overflow-x-auto overscroll-x-contain",
  "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
);

export const pdpDiscoveryInnerScrollClass = cn(
  "pdp-carousel-scroll w-full min-w-0 overflow-x-auto overscroll-x-contain snap-x snap-mandatory",
  "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
);

export const pdpDiscoveryRailCardClass =
  "w-[calc((100%-0.5rem)/2.05)] shrink-0 snap-start snap-always";

export const pdpDiscoverySimilarCardClass =
  "w-[calc((100%-0.5rem)/2.2)] shrink-0 snap-start snap-always lg:w-[calc((100%-0.75rem)/3)]";

/** Carousel photos — don't intercept touch on the scroll track */
export const pdpCarouselImageClass = "pointer-events-none select-none";
