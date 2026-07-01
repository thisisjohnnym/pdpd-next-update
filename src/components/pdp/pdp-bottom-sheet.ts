import { cn } from "@/lib/cn";

type PdpBottomSheetOpen = {
  open: boolean;
};

/** Full-viewport overlay — tray panels anchor to the bottom edge */
export function pdpBottomSheetOverlayClass({ open }: PdpBottomSheetOpen) {
  return cn(
    "fixed inset-0 z-50 flex items-end overscroll-none transition-opacity duration-300",
    open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
  );
}

export function pdpBottomSheetBackdropClass() {
  return "absolute inset-0 bg-black/45 transition-opacity";
}

type PdpBottomSheetPanelOptions = PdpBottomSheetOpen & {
  maxHeight?: "85dvh" | "88dvh" | "92dvh";
  /** Cap to parent height — for sheets inside a visual-viewport frame (keyboard-safe) */
  fitViewportFrame?: boolean;
};

const PDP_BOTTOM_SHEET_MAX_HEIGHT_CLASS = {
  "85dvh": "max-h-[85dvh]",
  "88dvh": "max-h-[88dvh]",
  "92dvh": "max-h-[92dvh]",
} as const;

const PDP_BOTTOM_SHEET_VIEWPORT_FRAME_MAX_HEIGHT_CLASS = {
  "85dvh": "max-h-[min(85dvh,100%)]",
  "88dvh": "max-h-[min(88dvh,100%)]",
  "92dvh": "max-h-[min(92dvh,100%)]",
} as const;

/** Soft upward lift — spread keeps the top edge from reading as a hairline stroke */
const PDP_BOTTOM_SHEET_PANEL_SHADOW =
  "shadow-[0_-4px_6px_-2px_rgba(0,0,0,0.05),0_-12px_28px_-4px_rgba(0,0,0,0.08)]";

/** Edge-to-edge on mobile; capped and centered from lg */
export function pdpBottomSheetPanelClass({
  open,
  maxHeight = "85dvh",
  fitViewportFrame = false,
}: PdpBottomSheetPanelOptions) {
  return cn(
    "font-extended relative flex min-h-0 w-full max-w-none flex-col overflow-hidden rounded-t-[20px] bg-white transition-transform duration-300 ease-out lg:mx-auto lg:max-w-[430px]",
    PDP_BOTTOM_SHEET_PANEL_SHADOW,
    fitViewportFrame
      ? PDP_BOTTOM_SHEET_VIEWPORT_FRAME_MAX_HEIGHT_CLASS[maxHeight]
      : PDP_BOTTOM_SHEET_MAX_HEIGHT_CLASS[maxHeight],
    open ? "translate-y-0" : "translate-y-full",
  );
}

/** Visual-viewport wrapper — keeps a visible gap above the tray */
export const pdpBottomSheetViewportFrameClass =
  "absolute flex flex-col justify-end pt-10";

/** Shared tray chrome — grab handle + close button placement */
export const pdpBottomSheetHeaderClass = "relative shrink-0 px-2.5 pb-0 pt-2.5";

export const pdpBottomSheetGrabHandleClass =
  "mx-auto mb-6 h-[3px] w-[50px] rounded-full bg-black/70";

export const pdpBottomSheetCloseButtonClass =
  "absolute right-2.5 top-2.5 flex size-8 items-center justify-center rounded-full text-neutral-900 pdp-pressable";

export const PDP_BOTTOM_SHEET_CLOSE_ICON_SIZE = 24;

/** Flex body between header and pinned footer — required for inner scroll regions */
export const pdpBottomSheetBodyClass = "flex min-h-0 flex-1 flex-col";

/**
 * Scrollable tray content — marked for overlay touch routing so drawer scroll
 * does not chain to the page behind.
 */
export function pdpBottomSheetScrollRegionClass(className?: string) {
  return cn(
    "min-h-0 flex-1 overflow-y-auto overscroll-y-contain touch-pan-y [-webkit-overflow-scrolling:touch]",
    className,
  );
}
