"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { PdpHeroSurface } from "./pdp-hero-gallery-data";

/** White nav / HUD / rail on cinematic slides; dark chrome on studio stills */
export function heroUsesLightChrome(surface: PdpHeroSurface): boolean {
  return surface === "dark";
}

/** Interruptible cross-fade when hero slide surface changes (make-interfaces-feel-better) */
export const HERO_CHROME_COLOR_TRANSITION_CLASS =
  "transition-colors duration-300 ease-out";

export const HERO_SCRIM_TRANSITION_CLASS =
  "transition-opacity duration-300 ease-out";

type PdpHeroChromeSurfaceContextValue = {
  surface: PdpHeroSurface;
  setSurface: (surface: PdpHeroSurface) => void;
};

const PdpHeroChromeSurfaceContext =
  createContext<PdpHeroChromeSurfaceContextValue | null>(null);

/** Publishes active hero slide surface to overlay chrome outside the gallery tree */
export function PdpHeroChromeSurfaceProvider({ children }: { children: ReactNode }) {
  const [surface, setSurfaceState] = useState<PdpHeroSurface>("dark");

  const setSurface = useCallback((next: PdpHeroSurface) => {
    setSurfaceState((current) => (current === next ? current : next));
  }, []);

  const value = useMemo(
    () => ({ surface, setSurface }),
    [surface, setSurface],
  );

  return (
    <PdpHeroChromeSurfaceContext.Provider value={value}>
      {children}
    </PdpHeroChromeSurfaceContext.Provider>
  );
}

export function useHeroChromeSurface(): PdpHeroSurface {
  return useContext(PdpHeroChromeSurfaceContext)?.surface ?? "dark";
}

export function useSetHeroChromeSurface(): (surface: PdpHeroSurface) => void {
  const context = useContext(PdpHeroChromeSurfaceContext);
  return useCallback(
    (surface: PdpHeroSurface) => {
      context?.setSurface(surface);
    },
    [context],
  );
}
