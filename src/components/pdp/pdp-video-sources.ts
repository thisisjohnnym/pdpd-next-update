export type VideoSource = {
  src: string;
  type: "video/webm" | "video/mp4";
};

/** Dual-source tags — WebM first for Chrome, MP4 fallback for Safari */
export function resolveVideoSources(src: string): VideoSource[] {
  if (src.endsWith(".webm")) {
    return [
      { src, type: "video/webm" },
      { src: src.replace(/\.webm$/, ".mp4"), type: "video/mp4" },
    ];
  }

  return [{ src, type: "video/mp4" }];
}

/** WebM assets that require MP4 counterparts for Safari */
const WEBM_ASSETS = [
  "/videos/gallery-360.webm",
  "/videos/soft-tabby-360.webm",
  "/videos/soft-tabby-showcase.webm",
  "/videos/what-fits-inside.webm",
] as const;

/** v6 one-shot 360° hero intro (MP4 only). */
export const HERO_360_INTRO_VIDEO_SRC = "/videos/tabby26-360-intro.mp4";
