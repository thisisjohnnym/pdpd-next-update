import { cn } from "@/lib/cn";

import { BOTTOM_CTA_OFFSET } from "./pdp-gallery-view";
import { galleryPanelClassName } from "./pdp-gallery-panel";
import { PDP_PANEL_SCROLL } from "./pdp-panel-scroll";
import { SCREEN_HEIGHT_STYLE } from "./pdp-viewport-chrome";

/** Gallery experiential module section — full viewport in panel mode, 4:5 in scroll mode */
export function experiencePanelSectionProps(isLastPanel = false) {
  return {
    className: cn(
      "relative flex w-full shrink-0 flex-col overflow-hidden bg-white",
      galleryPanelClassName(isLastPanel),
    ),
    style: PDP_PANEL_SCROLL
      ? { ...SCREEN_HEIGHT_STYLE, paddingBottom: BOTTOM_CTA_OFFSET }
      : undefined,
  } as const;
}

export const EXPERIENCE_PANEL_GRID_CLASS = PDP_PANEL_SCROLL ? "h-full min-h-0" : undefined;

export const EXPERIENCE_PANEL_ITEM_CLASS = cn(
  "flex flex-col gap-3",
  PDP_PANEL_SCROLL && "h-full min-h-0 py-5 lg:py-6",
);

export const EXPERIENCE_PANEL_HEADER_CLASS = "shrink-0 flex flex-col gap-0.5";

export const EXPERIENCE_PANEL_BODY_CLASS = cn(
  "flex flex-col gap-2",
  PDP_PANEL_SCROLL && "min-h-0 flex-1",
);

/** Primary media — 4:5 in scroll mode; fills panel below controls in snap mode */
export const EXPERIENCE_PANEL_MEDIA_CLASS = cn(
  "relative w-full overflow-hidden",
  PDP_PANEL_SCROLL ? "min-h-0 flex-1" : "aspect-[4/5]",
);
