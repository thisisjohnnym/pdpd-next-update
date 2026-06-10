import { cn } from "@/lib/cn";

/** Cancels right grid margin so carousel peeks flush to the viewport edge */
export const pdpCarouselBleedClass =
  "-mr-3 pr-3 lg:-mr-5 lg:pr-5";

export const pdpCarouselScrollClass = cn(
  "overflow-x-auto overscroll-x-contain pb-1",
  pdpCarouselBleedClass,
  "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  "snap-x snap-mandatory",
);

/** 1.5 cards visible — gap-3 (12px) */
export const pdpCarouselCard15Class =
  "w-[calc((100vw-1.5rem)/1.5)] shrink-0 snap-start snap-always lg:w-[calc((100vw-2.75rem)/3)]";

/** 1.5 cards visible — gap-2 (8px) */
export const pdpCarouselCard15Gap2Class =
  "w-[calc((100vw-1.25rem)/1.5)] shrink-0 snap-start snap-always lg:w-[calc((100vw-2.25rem)/3)]";

/** Compare rail — slightly narrower than 1.5-up (more spec columns on screen) */
export const pdpCompareCarouselCardClass =
  "w-[calc((100vw-1.25rem)/1.85)] shrink-0 snap-start snap-always lg:w-[calc((100vw-2.25rem)/3.5)]";
