import type { NetworkQualityState } from "./pdp-runtime-context";

export type MediaPlaybackInput = {
  isActive: boolean;
  isVisible: boolean;
  isFrozen: boolean;
  lowPowerMode: boolean;
  saveData: boolean;
  autoplayAllowed: boolean;
  userPaused: boolean;
  autoplayRestricted: boolean;
};

/** Central playback policy — no component should decide playback independently */
export function computeShouldPlay(input: MediaPlaybackInput): boolean {
  return (
    input.isActive &&
    input.isVisible &&
    !input.isFrozen &&
    !input.lowPowerMode &&
    !input.saveData &&
    input.autoplayAllowed &&
    !input.userPaused &&
    !input.autoplayRestricted
  );
}

/** Above-the-fold hero — always attempt muted autoplay when the page is active */
export function computePriorityHeroShouldPlay(input: {
  isActive: boolean;
  isVisible: boolean;
  isFrozen: boolean;
  userPaused: boolean;
}): boolean {
  return input.isActive && input.isVisible && !input.isFrozen && !input.userPaused;
}

export function computeShouldRun(input: { isVisible: boolean; isFrozen: boolean }): boolean {
  return input.isVisible && !input.isFrozen;
}

/** Preload before intersection activation — metadata only */
export function getInactiveVideoPreload(
  network: Pick<NetworkQualityState, "videoPreload">,
): "none" | "metadata" {
  return network.videoPreload === "none" ? "none" : "metadata";
}

/** Preload after activation — upgrade to auto when network allows */
export function getActiveVideoPreload(
  network: Pick<NetworkQualityState, "videoPreload">,
): "none" | "metadata" | "auto" {
  return network.videoPreload;
}

/** Manual-play surfaces need auto preload once user intent is required */
export function getManualPlaybackPreload(
  network: Pick<NetworkQualityState, "videoPreload">,
): "none" | "metadata" | "auto" {
  return network.videoPreload === "none" ? "metadata" : "auto";
}
