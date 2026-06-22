export type AtbChrome = {
  background: string;
  foreground: string;
  glow: string;
  isDarkBackdrop: boolean;
};

/** Foreground on sampled color chrome — white on dark tones, black on light */
function getColorChromeForeground(hex: string): string {
  const normalized = hex.replace("#", "");
  if (normalized.length !== 6) {
    return "#ffffff";
  }

  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.62 ? "#0a0a0a" : "#ffffff";
}

function parseHexRgb(hex: string): { r: number; g: number; b: number } | null {
  const normalized = hex.replace("#", "");
  if (normalized.length !== 6) {
    return null;
  }

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  };
}

/** Outer glow for color-sampled Add to bag — lifts dark pills off the hero scrim */
function getColorChromeGlow(hex: string): string {
  const rgb = parseHexRgb(hex);
  const isDark = getColorChromeForeground(hex) === "#ffffff";

  if (!rgb) {
    return isDark
      ? "inset 0 0 0 1px rgba(255,255,255,0.18), 0 4px 16px rgba(0,0,0,0.4), 0 0 20px rgba(255,255,255,0.24), 0 0 40px rgba(255,255,255,0.12)"
      : "0 4px 16px rgba(0,0,0,0.18), 0 0 24px rgba(0,0,0,0.12)";
  }

  const { r, g, b } = rgb;

  if (isDark) {
    return "inset 0 0 0 1px rgba(255,255,255,0.18), 0 4px 16px rgba(0,0,0,0.4), 0 0 20px rgba(255,255,255,0.24), 0 0 40px rgba(255,255,255,0.12)";
  }

  return `0 4px 16px rgba(0,0,0,0.18), 0 0 24px rgba(${r},${g},${b},0.45), 0 0 48px rgba(${r},${g},${b},0.2)`;
}

/** Dark colorways need extra ATB separation from the hero scrim */
function isDarkColorChrome(hex: string): boolean {
  return getColorChromeForeground(hex) === "#ffffff";
}

/**
 * Near-black colorways read as pure black and disappear into the hero's black
 * gradient scrim. Floor the ATB background to an off-black so the pill stays
 * visible against the gradient.
 */
const ATB_DARK_FLOOR = 0x2a;

function liftDarkBackground(hex: string): string {
  const rgb = parseHexRgb(hex);
  if (!rgb) {
    return hex;
  }

  const { r, g, b } = rgb;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  if (luminance > 0.08) {
    return hex;
  }

  const lift = (channel: number) =>
    Math.max(channel, ATB_DARK_FLOOR).toString(16).padStart(2, "0");

  return `#${lift(r)}${lift(g)}${lift(b)}`;
}

/** Solid Add to bag chrome from the active colorway sample */
export function getAtbChromeFromColorSample(hex: string): AtbChrome {
  return {
    background: liftDarkBackground(hex),
    foreground: getColorChromeForeground(hex),
    glow: getColorChromeGlow(hex),
    isDarkBackdrop: isDarkColorChrome(hex),
  };
}

