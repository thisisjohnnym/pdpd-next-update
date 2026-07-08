/** Persist playback position across carousel clone swaps and remounts. */
type CachedPlayback = {
  currentTime: number;
  wasPlaying: boolean;
};

const playbackBySrc = new Map<string, CachedPlayback>();

export function readVideoPlaybackCache(src: string): CachedPlayback | undefined {
  return playbackBySrc.get(src);
}

export function writeVideoPlaybackCache(src: string, video: HTMLVideoElement) {
  if (!Number.isFinite(video.currentTime)) {
    return;
  }

  playbackBySrc.set(src, {
    currentTime: video.currentTime,
    wasPlaying: !video.paused && !video.ended,
  });
}
