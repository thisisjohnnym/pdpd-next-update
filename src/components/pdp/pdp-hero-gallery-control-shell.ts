/** Shared frost shell — hero video pill controls + gallery category rail. */
const PDP_HERO_GALLERY_CONTROL_SHELL_CLASS =
  "pdp-frost-dark ring-1 ring-inset ring-white/20";

/** Horizontal video control pill (pause + mute) — py-2 + size-7 icons = 44px tall. */
export const PDP_HERO_GALLERY_CONTROL_PILL_CLASS =
  `flex items-center gap-3 px-3.5 py-2 ${PDP_HERO_GALLERY_CONTROL_SHELL_CLASS}`;

/** Square gallery activate control — same 44px height as the video pill. */
export const PDP_HERO_GALLERY_CONTROL_ACTIVATE_CLASS =
  `flex size-11 shrink-0 items-center justify-center rounded-none ${PDP_HERO_GALLERY_CONTROL_SHELL_CLASS}`;

/** Icon size shared by video pill + gallery activate control. */
export const PDP_HERO_GALLERY_CONTROL_ICON_SIZE = 18;

function resolveHeroGalleryControlBottomInset(
  useV4ModuleSpacing: boolean,
  clearProgressBar: boolean,
) {
  if (clearProgressBar) {
    return {
      padding: "pb-[calc(1rem+3px)]",
      absolute: "bottom-[calc(1rem+3px)]",
    };
  }

  if (useV4ModuleSpacing) {
    return { padding: "pb-4", absolute: "bottom-4" };
  }

  return { padding: "pb-2", absolute: "bottom-2" };
}

/** Overlay wrapper padding — keeps category rail aligned with elevated video controls. */
export function getHeroGalleryOverlayInsetClass({
  useV4ModuleSpacing,
  useHeroGalleryProgressBar,
  showHeroGalleryCategoryRail,
}: {
  useV4ModuleSpacing: boolean;
  useHeroGalleryProgressBar: boolean;
  showHeroGalleryCategoryRail: boolean;
}) {
  const horizontal = useV4ModuleSpacing ? "px-4" : "px-2";
  const bottom = resolveHeroGalleryControlBottomInset(
    useV4ModuleSpacing,
    showHeroGalleryCategoryRail && useHeroGalleryProgressBar,
  ).padding;

  return `${horizontal} ${bottom}`;
}

/** Absolute corner placement for elevated hero video controls. */
export function getHeroGalleryControlPositionClass({
  useV4ModuleSpacing,
  useHeroGalleryProgressBar,
  position,
}: {
  useV4ModuleSpacing: boolean;
  useHeroGalleryProgressBar: boolean;
  position: "bottom-left" | "bottom-right";
}) {
  const bottom = resolveHeroGalleryControlBottomInset(
    useV4ModuleSpacing,
    useHeroGalleryProgressBar,
  ).absolute;
  const side =
    position === "bottom-right"
      ? useV4ModuleSpacing
        ? "right-4"
        : "right-2"
      : useV4ModuleSpacing
        ? "left-4"
        : "left-2";

  return `${bottom} ${side}`;
}
