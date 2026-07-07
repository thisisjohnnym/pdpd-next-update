"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { usePdpHeroGallery } from "./pdp-hero-gallery-context";
import { isHeroUiChromeVisible, useHeroUiChrome } from "./use-hero-ui-chrome";
import { useReducedMotion } from "./use-reduced-motion";

/** Gallery wayfinding chrome fades out after this pause — rewakes on swipe or tap. */
const HERO_GALLERY_IDLE_MS = 5_000;

/** Shared fade duration — keep in sync with `.pdp-video-controls-pop` in globals.css */
const HERO_GALLERY_IDLE_FADE_MS = 280;

function isHeroGalleryInteractionTarget(target: EventTarget | null): boolean {
  return (
    target instanceof Element &&
    Boolean(target.closest("[data-hero-section]"))
  );
}

type HeroGalleryIdleContextValue = {
  idleVisible: boolean;
  setPinned: (pinned: boolean) => void;
  registerOnSleep: (callback: () => void) => () => void;
};

const defaultContext: HeroGalleryIdleContextValue = {
  idleVisible: true,
  setPinned: () => {},
  registerOnSleep: () => () => {},
};

const HeroGalleryIdleContext =
  createContext<HeroGalleryIdleContextValue>(defaultContext);

/**
 * Single idle timer for all hero gallery overlay chrome — progress bar, video
 * pill, category rail — so they fade out and back in together.
 */
// fallow-ignore-next-line complexity
export function HeroGalleryIdleProvider({
  enabled: featureEnabled = true,
  idleMs = HERO_GALLERY_IDLE_MS,
  children,
}: {
  enabled?: boolean;
  idleMs?: number;
  children: ReactNode;
}) {
  const { activeIndex } = usePdpHeroGallery();
  const { opacity } = useHeroUiChrome();
  const scrollVisible = isHeroUiChromeVisible(opacity);
  const reducedMotion = useReducedMotion();
  const enabled = featureEnabled && scrollVisible;
  const [pinned, setPinnedState] = useState(false);
  const [awake, setAwake] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const prevIndexRef = useRef(activeIndex);
  const sleepCallbacksRef = useRef(new Set<() => void>());

  const setPinned = useCallback((value: boolean) => {
    setPinnedState(value);
  }, []);

  const registerOnSleep = useCallback((callback: () => void) => {
    sleepCallbacksRef.current.add(callback);
    return () => {
      sleepCallbacksRef.current.delete(callback);
    };
  }, []);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }
  }, []);

  const scheduleSleep = useCallback(() => {
    clearTimer();
    if (!enabled || reducedMotion || pinned) {
      return;
    }
    timerRef.current = setTimeout(() => {
      timerRef.current = undefined;
      setAwake(false);
      sleepCallbacksRef.current.forEach((callback) => callback());
    }, idleMs);
  }, [clearTimer, enabled, idleMs, pinned, reducedMotion]);

  const bump = useCallback(() => {
    if (!enabled || reducedMotion) {
      return;
    }
    setAwake(true);
  }, [enabled, reducedMotion]);

  useEffect(() => {
    if (prevIndexRef.current !== activeIndex) {
      prevIndexRef.current = activeIndex;
      bump();
    }
  }, [activeIndex, bump]);

  // fallow-ignore-next-line complexity
  useEffect(() => {
    if (!enabled || reducedMotion) {
      clearTimer();
      setAwake(true);
      return;
    }

    if (pinned) {
      clearTimer();
      setAwake(true);
      return;
    }

    if (awake) {
      scheduleSleep();
    }
  }, [awake, clearTimer, enabled, pinned, reducedMotion, scheduleSleep]);

  useEffect(() => {
    if (!enabled || reducedMotion) {
      return;
    }

    const section = document.querySelector("[data-hero-section]");
    if (!section) {
      return;
    }

    const onInteraction = (event: Event) => {
      if (!isHeroGalleryInteractionTarget(event.target)) {
        return;
      }
      bump();
    };

    section.addEventListener("pointerdown", onInteraction, { passive: true });
    const track = section.querySelector("[data-hero-gallery-track]");
    track?.addEventListener("scroll", onInteraction, { passive: true });

    bump();

    return () => {
      clearTimer();
      section.removeEventListener("pointerdown", onInteraction);
      track?.removeEventListener("scroll", onInteraction);
    };
  }, [bump, clearTimer, enabled, reducedMotion]);

  const idleVisible = !featureEnabled || reducedMotion || awake;

  const value = useMemo(
    () => ({
      idleVisible,
      setPinned,
      registerOnSleep,
    }),
    [idleVisible, registerOnSleep, setPinned],
  );

  return (
    <HeroGalleryIdleContext.Provider value={value}>
      {children}
    </HeroGalleryIdleContext.Provider>
  );
}

/** Shared idle visibility — true while chrome should stay awake. */
export function useHeroGalleryIdleVisible() {
  return useContext(HeroGalleryIdleContext).idleVisible;
}

/** Pin idle chrome awake while a menu is open. */
export function useHeroGalleryIdlePin(pinned: boolean) {
  const { setPinned } = useContext(HeroGalleryIdleContext);

  useEffect(() => {
    setPinned(pinned);
    return () => setPinned(false);
  }, [pinned, setPinned]);
}

/** Run when the shared idle timer elapses (e.g. collapse menus). */
export function useHeroGalleryIdleOnSleep(onIdle: () => void) {
  const { registerOnSleep } = useContext(HeroGalleryIdleContext);
  const onIdleRef = useRef(onIdle);

  useEffect(() => {
    onIdleRef.current = onIdle;
  }, [onIdle]);

  useEffect(
    () =>
      registerOnSleep(() => {
        onIdleRef.current();
      }),
    [registerOnSleep],
  );
}
