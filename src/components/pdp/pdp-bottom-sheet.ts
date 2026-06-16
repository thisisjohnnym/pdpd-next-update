import { cn } from "@/lib/cn";

type PdpBottomSheetOpen = {
  open: boolean;
};

/** Full-viewport overlay — tray panels anchor to the bottom edge */
export function pdpBottomSheetOverlayClass({ open }: PdpBottomSheetOpen) {
  return cn(
    "fixed inset-0 z-50 flex items-end transition-opacity duration-300",
    open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
  );
}

export function pdpBottomSheetBackdropClass() {
  return "absolute inset-0 bg-black/45 transition-opacity";
}

type PdpBottomSheetPanelOptions = PdpBottomSheetOpen & {
  maxHeight?: "85dvh" | "88dvh" | "92dvh";
};

/** Edge-to-edge on mobile; capped and centered from lg */
export function pdpBottomSheetPanelClass({
  open,
  maxHeight = "85dvh",
}: PdpBottomSheetPanelOptions) {
  return cn(
    "font-extended relative flex w-full max-w-none flex-col overflow-hidden rounded-t-[20px] bg-white shadow-[0_-8px_40px_rgba(0,0,0,0.18)] transition-transform duration-300 ease-out lg:mx-auto lg:max-w-[430px]",
    maxHeight === "85dvh" && "max-h-[85dvh]",
    maxHeight === "88dvh" && "max-h-[88dvh]",
    maxHeight === "92dvh" && "max-h-[92dvh]",
    open ? "translate-y-0" : "translate-y-full",
  );
}
