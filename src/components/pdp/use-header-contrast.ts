"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

import {
  defaultHeaderBandRect,
  headerOverlapsHeroSection,
  headerSurfaceToForeground,
  luminanceZonesToForeground,
  sampleBackdropLuminanceZones,
  type HeaderContrastZones,
} from "@/lib/header-contrast";

import { useHeroChromeSurface } from "./pdp-hero-chrome-surface";
import { useScrollSnapshot } from "./use-coalesced-scroll";

const SCROLL_SAMPLE_MS = 120;
const VIDEO_SAMPLE_MS = 200;

const DEFAULT_ZONES: HeaderContrastZones = {
  menu: "light",
  logo: "light",
  bag: "light",
};

export function useHeaderContrast(
  headerRef: RefObject<HTMLElement | null>,
): HeaderContrastZones {
  const [zones, setZones] = useState<HeaderContrastZones>(DEFAULT_ZONES);
  const heroSurface = useHeroChromeSurface();
  const { scrollY } = useScrollSnapshot();
  const lastMeasureAt = useRef(0);

  const measure = useCallback(() => {
    const header = headerRef.current;
    const rect = header?.getBoundingClientRect() ?? defaultHeaderBandRect();
    if (rect.height <= 0 || rect.width <= 0) return;

    if (headerOverlapsHeroSection(rect)) {
      const foreground = headerSurfaceToForeground(heroSurface);
      setZones((current) => {
        if (
          current.menu === foreground &&
          current.logo === foreground &&
          current.bag === foreground
        ) {
          return current;
        }
        return { menu: foreground, logo: foreground, bag: foreground };
      });
      return;
    }

    const menuEl = header?.querySelector("button");
    const bagEl = header?.querySelector('[data-pdp-header-action="bag"]');
    const logoEl = header?.querySelector("[data-pdp-header-wordmark]") ?? null;

    const luminance = sampleBackdropLuminanceZones(rect, {
      menu: menuEl,
      logo: logoEl,
      bag: bagEl,
    });
    if (luminance === null) return;

    setZones((current) => {
      const next = luminanceZonesToForeground(luminance, current);
      if (
        next.menu === current.menu &&
        next.logo === current.logo &&
        next.bag === current.bag
      ) {
        return current;
      }
      return next;
    });
  }, [headerRef, heroSurface]);

  useEffect(() => {
    const now = performance.now();
    if (now - lastMeasureAt.current < SCROLL_SAMPLE_MS) {
      return;
    }

    lastMeasureAt.current = now;
    measure();
  }, [scrollY, measure]);

  useEffect(() => {
    measure();
  }, [heroSurface, measure]);

  useEffect(() => {
    const track = document.querySelector("[data-hero-gallery-track]");
    if (!track) return;

    let scrollTimer = 0;
    const onGalleryScroll = () => {
      if (scrollTimer) return;
      scrollTimer = window.setTimeout(() => {
        scrollTimer = 0;
        measure();
      }, SCROLL_SAMPLE_MS);
    };

    track.addEventListener("scroll", onGalleryScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onGalleryScroll);
      if (scrollTimer) window.clearTimeout(scrollTimer);
    };
  }, [measure]);

  useEffect(() => {
    const heroRegions = [
      document.querySelector("[data-hero-section]"),
      document.querySelector("[data-pdp-desktop-hero-media]"),
    ].filter((node): node is Element => node !== null);

    if (heroRegions.length === 0) {
      return;
    }

    const onHeroRegionResize = () => {
      measure();
    };

    const resizeObserver = new ResizeObserver(onHeroRegionResize);
    heroRegions.forEach((node) => resizeObserver.observe(node));

    return () => {
      resizeObserver.disconnect();
    };
  }, [measure]);

  useEffect(() => {
    let mutationTimer = 0;

    let lastVideoSampleAt = 0;

    const handleBackdropChange = () => {
      measure();
    };

    const handleVideoTimeUpdate = () => {
      const now = performance.now();
      if (now - lastVideoSampleAt < VIDEO_SAMPLE_MS) {
        return;
      }
      lastVideoSampleAt = now;
      measure();
    };

    const bindImageLoads = () => {
      document.querySelectorAll("img").forEach((img) => {
        if (!img.complete) {
          img.addEventListener("load", handleBackdropChange, { once: true });
        }
      });
    };

    const bindHeroVideos = () => {
      document
        .querySelectorAll<HTMLVideoElement>("[data-hero-section] video")
        .forEach((video) => {
          video.addEventListener("timeupdate", handleVideoTimeUpdate);
        });
    };

    const onResize = () => {
      measure();
    };

    measure();
    bindImageLoads();
    bindHeroVideos();
    window.addEventListener("resize", onResize);

    const observer = new MutationObserver(() => {
      if (mutationTimer) return;
      mutationTimer = window.setTimeout(() => {
        mutationTimer = 0;
        bindImageLoads();
        bindHeroVideos();
        measure();
      }, 400);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("resize", onResize);
      document
        .querySelectorAll<HTMLVideoElement>("[data-hero-section] video")
        .forEach((video) => {
          video.removeEventListener("timeupdate", handleVideoTimeUpdate);
        });
      observer.disconnect();
      if (mutationTimer) window.clearTimeout(mutationTimer);
    };
  }, [measure]);

  return zones;
}
