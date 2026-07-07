/** Foreground color for overlay chrome — white on dark backdrops, black on light */
export type HeaderForeground = "light" | "dark";

/** Map `data-header-surface` / hero slide hints to nav foreground color. */
export function headerSurfaceToForeground(
  surface: "light" | "dark",
): HeaderForeground {
  return surface === "light" ? "dark" : "light";
}

/** Per-control contrast — menu, wordmark, and bag can sit on different backdrops. */
export type HeaderContrastZones = {
  menu: HeaderForeground;
  logo: HeaderForeground;
  bag: HeaderForeground;
};

const LUMINANCE_THRESHOLD = 0.58;
const HYSTERESIS = 0.05;

/** Horizontal probe fractions aligned to the hero header grid columns. */
const HEADER_ZONE_FRACTIONS: Record<keyof HeaderContrastZones, number> = {
  menu: 0.15,
  logo: 0.5,
  bag: 0.85,
};

function relativeLuminance(r: number, g: number, b: number): number {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function parseCssRgbLuminance(color: string): number | null {
  const match = color.match(
    /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+))?\s*\)/,
  );
  if (!match) return null;

  const r = Number(match[1]);
  const g = Number(match[2]);
  const b = Number(match[3]);
  const alpha = match[4] !== undefined ? Number(match[4]) : 1;
  if (alpha < 0.35) return null;

  return relativeLuminance(r, g, b);
}

function parseObjectPosition(value: string): { x: number; y: number } {
  const tokens = value.trim().split(/\s+/);
  const mapToken = (token: string, axis: "x" | "y"): number => {
    if (token.endsWith("%")) return Number(token) / 100;
    if (axis === "x") {
      if (token === "left") return 0;
      if (token === "right") return 1;
      return 0.5;
    }
    if (token === "top") return 0;
    if (token === "bottom") return 1;
    return 0.5;
  };

  if (tokens.length === 1) {
    const keyword = tokens[0];
    if (keyword === "top") return { x: 0.5, y: 0 };
    if (keyword === "bottom") return { x: 0.5, y: 1 };
    if (keyword === "left") return { x: 0, y: 0.5 };
    if (keyword === "right") return { x: 1, y: 0.5 };
    if (keyword === "center") return { x: 0.5, y: 0.5 };
    return { x: mapToken(keyword, "x"), y: 0.5 };
  }

  const first = tokens[0];
  const second = tokens[1];
  const firstIsY =
    second === undefined ||
    second.endsWith("%") ||
    ["top", "bottom", "center"].includes(second);

  if (firstIsY && ["top", "bottom", "center"].includes(first)) {
    return { x: mapToken(second ?? "center", "x"), y: mapToken(first, "y") };
  }

  return { x: mapToken(first, "x"), y: mapToken(second ?? "center", "y") };
}

function mapCoverPointToSource(
  media: HTMLImageElement | HTMLVideoElement,
  clientX: number,
  clientY: number,
): { sx: number; sy: number } | null {
  const rect = media.getBoundingClientRect();
  const nw =
    media instanceof HTMLVideoElement ? media.videoWidth : media.naturalWidth;
  const nh =
    media instanceof HTMLVideoElement ? media.videoHeight : media.naturalHeight;

  if (!nw || !nh) return null;

  const localX = clientX - rect.left;
  const localY = clientY - rect.top;
  if (localX < 0 || localY < 0 || localX > rect.width || localY > rect.height) {
    return null;
  }

  const scale = Math.max(rect.width / nw, rect.height / nh);
  const renderedW = nw * scale;
  const renderedH = nh * scale;
  const { x: posX, y: posY } = parseObjectPosition(
    getComputedStyle(media).objectPosition,
  );
  const offsetX = (rect.width - renderedW) * posX;
  const offsetY = (rect.height - renderedH) * posY;

  const sx = (localX - offsetX) / scale;
  const sy = (localY - offsetY) / scale;

  if (sx < 0 || sy < 0 || sx >= nw || sy >= nh) return null;

  return { sx, sy };
}

let sharedSampleCanvas: HTMLCanvasElement | null = null;
let sharedSampleContext: CanvasRenderingContext2D | null = null;

function getSampleContext(): CanvasRenderingContext2D | null {
  if (typeof document === "undefined") {
    return null;
  }

  if (!sharedSampleCanvas) {
    sharedSampleCanvas = document.createElement("canvas");
    sharedSampleCanvas.width = 1;
    sharedSampleCanvas.height = 1;
    sharedSampleContext = sharedSampleCanvas.getContext("2d", {
      willReadFrequently: true,
    });
  }

  return sharedSampleContext;
}

function readPixelLuminance(
  media: CanvasImageSource,
  sx: number,
  sy: number,
): number | null {
  const ctx = getSampleContext();
  if (!ctx) return null;

  try {
    ctx.drawImage(media, sx, sy, 1, 1, 0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return relativeLuminance(r, g, b);
  } catch {
    return null;
  }
}

function sampleMediaAtPoint(
  media: HTMLImageElement | HTMLVideoElement,
  clientX: number,
  clientY: number,
): number | null {
  if (media instanceof HTMLImageElement && (!media.complete || !media.naturalWidth)) {
    return null;
  }
  if (media instanceof HTMLVideoElement && media.readyState < 2) {
    return null;
  }

  const source = mapCoverPointToSource(media, clientX, clientY);
  if (!source) return null;

  return readPixelLuminance(media, source.sx, source.sy);
}

function readHeaderSurfaceLuminance(el: Element): number | null {
  const surface = el.closest<HTMLElement>("[data-header-surface]");
  if (surface?.dataset.headerSurface === "light") return 0.95;
  if (surface?.dataset.headerSurface === "dark") return 0.05;
  return null;
}

function sampleAtPoint(clientX: number, clientY: number): number | null {
  const stack = document.elementsFromPoint(clientX, clientY);

  // Section/slide hints are authoritative — a dark product on a light studio
  // ground still needs dark nav (docs/pdp-hero-chrome.md).
  for (const el of stack) {
    if (el.closest("[data-header-chrome]")) continue;

    const surfaceLum = readHeaderSurfaceLuminance(el);
    if (surfaceLum !== null) return surfaceLum;
  }

  // Fall back to media pixels for regions without an explicit surface hint.
  for (const el of stack) {
    if (el.closest("[data-header-chrome]")) continue;

    if (el instanceof HTMLImageElement || el instanceof HTMLVideoElement) {
      const lum = sampleMediaAtPoint(el, clientX, clientY);
      if (lum !== null) return lum;
    }
  }

  for (const el of stack) {
    if (el.closest("[data-header-chrome]")) continue;

    if (el instanceof HTMLElement) {
      const bg = getComputedStyle(el).backgroundColor;
      const lum = parseCssRgbLuminance(bg);
      if (lum !== null) return lum;
    }
  }

  return null;
}

/** True when the fixed header band overlaps the hero gallery section. */
export function headerOverlapsHeroSection(headerRect: DOMRect): boolean {
  if (typeof document === "undefined") {
    return false;
  }

  const heroSection = document.querySelector("[data-hero-section]");
  if (!heroSection) {
    return false;
  }

  const heroRect = heroSection.getBoundingClientRect();
  return heroRect.top < headerRect.bottom && heroRect.bottom > headerRect.top;
}

/** Default probe band when no header element is mounted yet. */
export function defaultHeaderBandRect(): DOMRect {
  const width = typeof window !== "undefined" ? window.innerWidth : 375;
  const top =
    typeof document !== "undefined"
      ? Number.parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--pdp-safe-area-top",
          ),
        ) || 0
      : 0;
  const height = 56;

  return new DOMRect(0, top, width, height);
}

function sampleBackdropLuminance(sampleRect: DOMRect): number | null {
  const zones = sampleBackdropLuminanceZones(sampleRect);
  if (!zones) return null;

  const samples = Object.values(zones).filter(
    (value): value is number => value !== null,
  );
  if (samples.length === 0) return null;
  return samples.reduce((sum, value) => sum + value, 0) / samples.length;
}

function sampleBackdropAtAnchor(
  anchor: Element,
  sampleY: number,
): number | null {
  const rect = anchor.getBoundingClientRect();
  if (rect.width <= 0) return null;

  // Probe on the icon's column but below the interactive hit target so
  // elementsFromPoint reaches the hero media behind the chrome.
  return sampleAtPoint(rect.left + rect.width / 2, sampleY);
}

export function sampleBackdropLuminanceZones(
  sampleRect: DOMRect,
  anchors?: Partial<Record<keyof HeaderContrastZones, Element | null>>,
): Record<keyof HeaderContrastZones, number | null> | null {
  if (sampleRect.height <= 0 || sampleRect.width <= 0) return null;

  const sampleY = sampleRect.top + sampleRect.height * 0.55;

  const fromAnchor = (key: keyof HeaderContrastZones) => {
    const anchor = anchors?.[key];
    if (anchor) {
      return sampleBackdropAtAnchor(anchor, sampleY);
    }
    return sampleAtPoint(
      sampleRect.left + sampleRect.width * HEADER_ZONE_FRACTIONS[key],
      sampleY,
    );
  };

  return {
    menu: fromAnchor("menu"),
    logo: fromAnchor("logo"),
    bag: fromAnchor("bag"),
  };
}

export function luminanceZonesToForeground(
  luminance: Record<keyof HeaderContrastZones, number | null>,
  current: HeaderContrastZones,
): HeaderContrastZones {
  return {
    menu: luminance.menu === null
      ? current.menu
      : luminanceToForeground(luminance.menu, current.menu),
    logo: luminance.logo === null
      ? current.logo
      : luminanceToForeground(luminance.logo, current.logo),
    bag: luminance.bag === null
      ? current.bag
      : luminanceToForeground(luminance.bag, current.bag),
  };
}

function luminanceToForeground(
  luminance: number,
  current: HeaderForeground,
): HeaderForeground {
  if (current === "light") {
    return luminance > LUMINANCE_THRESHOLD + HYSTERESIS ? "dark" : "light";
  }
  return luminance > LUMINANCE_THRESHOLD - HYSTERESIS ? "dark" : "light";
}
