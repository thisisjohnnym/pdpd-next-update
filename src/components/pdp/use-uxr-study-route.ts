"use client";

import { usePathname } from "next/navigation";

import { isUxrStudyPathname } from "./pdp-uxr-study";

/** Whether the current App Router location is an UXR study route. */
export function useIsUxrStudyRoute(): boolean {
  const pathname = usePathname() ?? "";
  return isUxrStudyPathname(pathname);
}
