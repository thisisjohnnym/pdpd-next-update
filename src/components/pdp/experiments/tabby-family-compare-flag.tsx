"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";

import {
  resolveTabbyFamilyCompareExperiment,
  TABBY_FAMILY_COMPARE_EXPERIMENT_FLAG,
} from "./tabby-family-compare-resolve";

const TabbyFamilyCompareExperimentContext = createContext(false);

/** Seeds experiment flag from the server page — keeps layout offsets stable on hydration */
export function TabbyFamilyCompareExperimentProvider({
  initialEnabled,
  children,
}: {
  initialEnabled: boolean;
  children: ReactNode;
}) {
  const searchParams = useSearchParams();
  const searchParam = searchParams.get(TABBY_FAMILY_COMPARE_EXPERIMENT_FLAG);
  const enabled =
    searchParam !== null
      ? resolveTabbyFamilyCompareExperiment(searchParam)
      : initialEnabled;

  return (
    <TabbyFamilyCompareExperimentContext.Provider value={enabled}>
      {children}
    </TabbyFamilyCompareExperimentContext.Provider>
  );
}

/** Hook for gating experiment UI (compare module + Style/Size/Color buy bar) */
export function useTabbyFamilyCompareExperiment(): boolean {
  return useContext(TabbyFamilyCompareExperimentContext);
}
