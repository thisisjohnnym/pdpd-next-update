"use client";

import { createContext, useContext } from "react";

type ScrollRevealSectionContextValue = {
  /** Section scroll reveal has started (used for media priority, etc.) */
  sectionVisible: boolean;
};

export const ScrollRevealSectionContext =
  createContext<ScrollRevealSectionContextValue | null>(null);

export function useScrollRevealSection() {
  return useContext(ScrollRevealSectionContext);
}
