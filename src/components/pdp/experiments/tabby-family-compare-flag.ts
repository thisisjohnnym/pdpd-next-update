/** Query/env key for the Tabby family compare A/B test — used in URL + env wiring */
export const TABBY_FAMILY_COMPARE_EXPERIMENT_FLAG = "tabbyFamilyCompareExperiment";

const TRUTHY = new Set(["1", "true", "yes", "on"]);

function parseTruthy(value: string | null | undefined): boolean {
  if (!value) {
    return false;
  }

  return TRUTHY.has(value.toLowerCase());
}

/** Server-safe default — env only */
function isTabbyFamilyCompareExperimentEnabledFromEnv(): boolean {
  return parseTruthy(process.env.NEXT_PUBLIC_TABBY_FAMILY_COMPARE_EXPERIMENT);
}

/**
 * Client flag resolution:
 * 1. URL query `?tabbyFamilyCompareExperiment=1` (QA override)
 * 2. `NEXT_PUBLIC_TABBY_FAMILY_COMPARE_EXPERIMENT=true`
 */
export function resolveTabbyFamilyCompareExperiment(
  searchParam: string | null,
): boolean {
  if (searchParam !== null) {
    return parseTruthy(searchParam);
  }

  return isTabbyFamilyCompareExperimentEnabledFromEnv();
}
