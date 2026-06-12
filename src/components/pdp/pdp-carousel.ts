import { cn } from "@/lib/cn";

/** Bleed scroll track to viewport edges; first-item ml restores grid alignment at rest */
export const pdpCarouselBleedClass =
  "-ml-3 -mr-3 pr-3 lg:-ml-5 lg:-mr-5 lg:pr-5";

export const pdpCarouselTrackInsetClass =
  "[&>*:first-child]:ml-3 lg:[&>*:first-child]:ml-5";

export const pdpCarouselScrollClass = cn(
  "overflow-x-auto overscroll-x-contain touch-pan-y pb-1",
  pdpCarouselBleedClass,
  pdpCarouselTrackInsetClass,
  "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  "snap-x snap-mandatory scroll-pl-3 lg:scroll-pl-5",
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

/** UGC story cards — ~1.2 across with context footer, gap-2 */
export const pdpUgcStoryCardClass =
  "w-[calc((100vw-1.25rem)/1.2)] lg:w-[calc((100vw-2.25rem)/2.4)]";

/** TikTok-style UGC video tiles — ~1.1 across with next clip peek, gap-2 */
export const pdpUgcVideoCardClass =
  "w-[calc((100vw-1.25rem)/1.1)] shrink-0 snap-start snap-always lg:w-[calc((100vw-2.25rem)/2.2)]";
