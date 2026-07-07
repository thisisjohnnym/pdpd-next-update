"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

let heroLandEnterPlayed = false;

const HeroEnterContext = createContext(true);

/** Shares one enter-animation gate across hero chrome (HUD, header, bottom bar, rail). */
export function PdpHeroEnterProvider({ children }: { children: ReactNode }) {
  const playEnter = useState(() => {
    if (heroLandEnterPlayed) {
      return false;
    }
    heroLandEnterPlayed = true;
    return true;
  })[0];

  return (
    <HeroEnterContext.Provider value={playEnter}>
      {children}
    </HeroEnterContext.Provider>
  );
}

export function useHeroEnterOnce(): boolean {
  return useContext(HeroEnterContext);
}
