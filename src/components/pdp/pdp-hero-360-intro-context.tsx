"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { usePdpRuntime } from "./pdp-runtime-context";

export type Hero360IntroPhase = "playing" | "settling" | "revealing" | "ready";

type Hero360IntroContextValue = {
  enabled: boolean;
  phase: Hero360IntroPhase;
  isUiVisible: boolean;
  isGalleryScrollReady: boolean;
  onVideoEnded: () => void;
  onSettleComplete: () => void;
  onRevealComplete: () => void;
};

const Hero360IntroContext = createContext<Hero360IntroContextValue | null>(null);

const SETTLE_CROSSFADE_MS = 420;

export function PdpHero360IntroProvider({
  enabled,
  children,
}: {
  enabled: boolean;
  children: ReactNode;
}) {
  const { reducedMotion } = usePdpRuntime();
  const skipIntro = !enabled || reducedMotion;
  const [phase, setPhase] = useState<Hero360IntroPhase>(
    skipIntro ? "ready" : "playing",
  );

  useEffect(() => {
    if (skipIntro) {
      setPhase("ready");
    }
  }, [skipIntro]);

  useEffect(() => {
    if (!enabled) {
      document.documentElement.removeAttribute("data-hero-intro-phase");
      document.documentElement.style.removeProperty("--hero-intro-ui-opacity");
      return;
    }

    document.documentElement.setAttribute("data-hero-intro-phase", phase);

    if (phase === "playing" || phase === "settling") {
      document.documentElement.style.setProperty("--hero-intro-ui-opacity", "0");
      return;
    }

    if (phase === "ready") {
      document.documentElement.style.setProperty("--hero-intro-ui-opacity", "1");
    }
  }, [enabled, phase]);

  useEffect(() => {
    return () => {
      document.documentElement.removeAttribute("data-hero-intro-phase");
      document.documentElement.style.removeProperty("--hero-intro-ui-opacity");
    };
  }, []);

  const onVideoEnded = useCallback(() => {
    if (!enabled || skipIntro) {
      return;
    }
    setPhase("settling");
  }, [enabled, skipIntro]);

  const onSettleComplete = useCallback(() => {
    if (!enabled || skipIntro) {
      return;
    }
    setPhase("revealing");
  }, [enabled, skipIntro]);

  const onRevealComplete = useCallback(() => {
    setPhase("ready");
  }, []);

  useEffect(() => {
    if (phase !== "settling") {
      return;
    }

    const timer = window.setTimeout(onSettleComplete, SETTLE_CROSSFADE_MS);
    return () => {
      window.clearTimeout(timer);
    };
  }, [phase, onSettleComplete]);

  const value = useMemo(
    (): Hero360IntroContextValue => ({
      enabled,
      phase,
      isUiVisible: !enabled || phase === "revealing" || phase === "ready",
      isGalleryScrollReady: !enabled || phase === "ready",
      onVideoEnded,
      onSettleComplete,
      onRevealComplete,
    }),
    [enabled, phase, onVideoEnded, onSettleComplete, onRevealComplete],
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
      onVideoEnded: () => {},
      onSettleComplete: () => {},
      onRevealComplete: () => {},
    };
  }
  return context;
}
