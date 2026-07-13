"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";

let heroLandEnterPlayed = false;

const HeroEnterContext = createContext(false);

/** Shares one enter-animation gate across hero chrome (HUD, header, bottom bar, rail). */
export function PdpHeroEnterProvider({ children }: { children: ReactNode }) {
  const [playEnter, setPlayEnter] = useState(false);

  // Defer the once-per-session gate to the client so SSR and hydration agree
  // (no enter class on the server HTML; applied before first paint via layout effect).
  useLayoutEffect(() => {
    if (heroLandEnterPlayed) {
      return;
    }
    heroLandEnterPlayed = true;
    setPlayEnter(true);
  }, []);

  return (
    <HeroEnterContext.Provider value={playEnter}>
      {children}
    </HeroEnterContext.Provider>
  );
}

export function useHeroEnterOnce(): boolean {
  return useContext(HeroEnterContext);
}
