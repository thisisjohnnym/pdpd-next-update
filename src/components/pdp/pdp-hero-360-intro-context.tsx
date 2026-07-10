"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { usePdpRuntime } from "./pdp-runtime-context";

export type Hero360IntroPhase = "playing" | "revealing" | "ready";

type Hero360IntroContextValue = {
  enabled: boolean;
  phase: Hero360IntroPhase;
  isUiVisible: boolean;
  isGalleryScrollReady: boolean;
  /** Soft UI cue mid-clip (~1.2s) — ad-vibe land while the fall continues. */
  onUiCue: () => void;
  onVideoEnded: () => void;
  onRevealComplete: () => void;
};

const Hero360IntroContext = createContext<Hero360IntroContextValue | null>(null);

function syncIntroPhaseAttr(enabled: boolean, phase: Hero360IntroPhase) {
  const root = document.documentElement;

  if (!enabled) {
    root.removeAttribute("data-hero-intro-phase");
    root.style.removeProperty("--hero-intro-ui-opacity");
    root.style.removeProperty("background-color");
    return;
  }

  root.setAttribute("data-hero-intro-phase", phase);
  // Stay at 0 through `revealing` — GSAP owns the fade. Jumping to 1 here
  // flashes chrome for a frame before the tween starts.
  root.style.setProperty(
    "--hero-intro-ui-opacity",
    phase === "ready" ? "1" : "0",
  );
  // Boot script paints studio ground inline; clear when intro is done.
  if (phase === "ready") {
    root.style.removeProperty("background-color");
  } else {
    root.style.backgroundColor = "#f0f0f0";
  }
}

function isMobileViewport(): boolean {
  if (typeof window === "undefined") {
    return true;
  }
  try {
    // Tailwind lg = 1024px — v5 desktop split hides the mobile hero above this.
    return window.matchMedia("(max-width: 1023px)").matches;
  } catch {
    return true;
  }
}

export function PdpHero360IntroProvider({
  enabled,
  children,
  /** When true (v5 desktop split), skip intro on lg+ so the header stays visible. */
  mobileOnly = false,
}: {
  enabled: boolean;
  children: ReactNode;
  mobileOnly?: boolean;
}) {
  const { reducedMotion } = usePdpRuntime();
  // Boot already stamps ready on v5 desktop — start ready when mobileOnly so we
  // never sync a `playing` phase (and GSAP-hide the desktop header) for a frame.
  const [desktopSkip] = useState(
    () => Boolean(mobileOnly && typeof window !== "undefined" && !isMobileViewport()),
  );
  const skipIntro = !enabled || reducedMotion || desktopSkip;
  const [phase, setPhase] = useState<Hero360IntroPhase>(
    skipIntro ? "ready" : "playing",
  );
  const uiCuedRef = useRef(skipIntro);
  const videoEndedRef = useRef(skipIntro);
  const revealDoneRef = useRef(skipIntro);

  const tryReady = useCallback(() => {
    if (videoEndedRef.current && revealDoneRef.current) {
      setPhase("ready");
    }
  }, []);

  useLayoutEffect(() => {
    if (skipIntro) {
      setPhase("ready");
      uiCuedRef.current = true;
      videoEndedRef.current = true;
      revealDoneRef.current = true;
    }
  }, [skipIntro]);

  // Before paint — avoids a one-frame flash of header/footer/ticks.
  // When skipped (desktop / reduced motion), clear phase attrs entirely so
  // hide CSS never applies and gallery treats intro as off.
  useLayoutEffect(() => {
    syncIntroPhaseAttr(enabled && !skipIntro, phase);
  }, [enabled, skipIntro, phase]);

  useEffect(() => {
    return () => {
      // Skip clear on Strict Mode remount (/v5|/v6) — removing the phase attr
      // for a frame is what flashes header/footer on reload.
      if (
        typeof location !== "undefined" &&
        /^\/v[56](\/|$)/.test(location.pathname)
      ) {
        return;
      }
      document.documentElement.removeAttribute("data-hero-intro-phase");
      document.documentElement.style.removeProperty("--hero-intro-ui-opacity");
      document.documentElement.style.removeProperty("background-color");
    };
  }, []);

  const onUiCue = useCallback(() => {
    if (!enabled || skipIntro || uiCuedRef.current) {
      return;
    }
    uiCuedRef.current = true;
    setPhase("revealing");
  }, [enabled, skipIntro]);

  const onVideoEnded = useCallback(() => {
    if (!enabled || skipIntro) {
      return;
    }
    videoEndedRef.current = true;

    // Late cue — clip ended before 1.2s (seek / short asset / fail-open).
    if (!uiCuedRef.current) {
      uiCuedRef.current = true;
      setPhase("revealing");
      // Reveal still needs to finish before ready — don't return without
      // scheduling tryReady once reveal completes.
      return;
    }

    tryReady();
  }, [enabled, skipIntro, tryReady]);

  const onRevealComplete = useCallback(() => {
    revealDoneRef.current = true;
    tryReady();
  }, [tryReady]);

  const introActive = enabled && !skipIntro;

  const value = useMemo(
    (): Hero360IntroContextValue => ({
      enabled: introActive,
      phase,
      isUiVisible: !introActive || phase === "revealing" || phase === "ready",
      isGalleryScrollReady: !introActive || phase === "ready",
      onUiCue,
      onVideoEnded,
      onRevealComplete,
    }),
    [introActive, phase, onUiCue, onVideoEnded, onRevealComplete],
  );

  return (
    <Hero360IntroContext.Provider value={value}>
      {children}
    </Hero360IntroContext.Provider>
  );
}

export function useHero360Intro(): Hero360IntroContextValue {
  const context = useContext(Hero360IntroContext);
  if (!context) {
    return {
      enabled: false,
      phase: "ready",
      isUiVisible: true,
      isGalleryScrollReady: true,
      onUiCue: () => {},
      onVideoEnded: () => {},
      onRevealComplete: () => {},
    };
  }
  return context;
}
