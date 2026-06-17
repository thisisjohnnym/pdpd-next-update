export type VideoTelemetryEvent =
  | "autoplay_attempt"
  | "autoplay_blocked"
  | "first_frame_rendered"
  | "first_frame_timeout"
  | "video_error"
  | "video_stalled"
  | "fallback_shown"
  | "user_tap_play";

type VideoTelemetryDetail = {
  src?: string;
  readyState?: number;
  networkState?: number;
  reason?: string;
};

type DataLayerWindow = Window & {
  dataLayer?: Array<Record<string, unknown>>;
};

/**
 * Lightweight client-side video instrumentation. Logs to the console in
 * development and forwards to the analytics dataLayer when present. Safe to call
 * on the server (no-op) and never throws.
 */
export function logVideoTelemetry(
  event: VideoTelemetryEvent,
  detail: VideoTelemetryDetail = {},
): void {
  if (typeof window === "undefined") {
    return;
  }

  const payload = { videoEvent: event, ...detail, ts: Date.now() };

  if (process.env.NODE_ENV !== "production") {
    console.info(`[pdp-video] ${event}`, payload);
  }

  try {
    const layer = (window as DataLayerWindow).dataLayer;
    layer?.push({ event: "pdp_video", ...payload });
  } catch {
    // Analytics sink is best-effort — never let it break playback UX.
  }
}
