#!/usr/bin/env node
/**
 * PDP version boundary checks (see docs/pdp-versions.md).
 *
 * Guards against the changes most likely to break the frozen /v1 baseline while
 * working on the v2 pivot:
 *   1. v1 data guard   — pdp-data.ts / pdp-section-chapters.ts must not change vs the v1 baseline
 *   2. CSS scope guard — every rule in src/app/v2/pdp-v2.css must be scoped to [data-pdp-version="v2"],
 *                        and globals.css must not contain v2-only scoping
 *   3. import guard     — src/app/v1/** must not import any *-v2 module
 *   4. provider guard   — v1 routes pass version="v1"; v2 routes pass version="v2"
 *
 * Exit code 0 = clean, 1 = one or more violations.
 */
import { execSync } from "node:child_process";
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const failures = [];

function fail(guard, message) {
  failures.push(`[${guard}] ${message}`);
}

function read(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : null;
}

function walk(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

// ── Guard 1: v1 data must not change vs the v1 baseline ──────────────────────
function resolveBaseRef() {
  for (const ref of ["v1", "origin/v1", "main", "origin/main"]) {
    try {
      execSync(`git rev-parse --verify --quiet ${ref}`, { stdio: "ignore" });
      return ref;
    } catch {
      // try next
    }
  }
  return null;
}

const FROZEN_V1_FILES = [
  "src/components/pdp/pdp-data.ts",
  "src/components/pdp/pdp-section-chapters.ts",
];

function checkFrozenV1Data() {
  if (process.env.ALLOW_V1_DATA_EDIT === "1") {
    console.log("[v1-data] skipped (ALLOW_V1_DATA_EDIT=1)");
    return;
  }
  const base = resolveBaseRef();
  if (!base) {
    console.log("[v1-data] skipped (no v1/main ref available)");
    return;
  }
  for (const file of FROZEN_V1_FILES) {
    try {
      execSync(`git diff --quiet ${base} -- "${file}"`, { stdio: "ignore" });
    } catch {
      fail(
        "v1-data",
        `${file} differs from ${base}. v1 data is frozen — put v2 changes in components/pdp/version/. ` +
          `If this edit is intentional and v1-safe, re-run with ALLOW_V1_DATA_EDIT=1.`,
      );
    }
  }
}

// ── Guard 2: CSS scoping ─────────────────────────────────────────────────────
function stripCssComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

function checkCssScoping() {
  const v2CssPath = join(ROOT, "src/app/v2/pdp-v2.css");
  const v2Css = read(v2CssPath);
  if (v2Css) {
    const body = stripCssComments(v2Css);
    for (const chunk of body.split("}")) {
      const selector = chunk.split("{")[0]?.trim();
      if (!selector || !chunk.includes("{")) continue;
      if (selector.startsWith("@")) continue; // at-rules (media/keyframes) are fine
      if (!selector.includes('[data-pdp-version="v2"]')) {
        fail(
          "css-scope",
          `Unscoped selector in src/app/v2/pdp-v2.css: "${selector}". ` +
            `Prefix every v2 rule with [data-pdp-version="v2"].`,
        );
      }
    }
  }

  const globalsPath = join(ROOT, "src/app/globals.css");
  const globals = read(globalsPath);
  if (globals && stripCssComments(globals).includes('[data-pdp-version="v2"]')) {
    fail(
      "css-scope",
      "globals.css references [data-pdp-version=\"v2\"]. Move v2-only styling to src/app/v2/pdp-v2.css.",
    );
  }
}

// ── Guard 3: v1 routes must not import v2 modules ────────────────────────────
function checkV1Imports() {
  const v1Dir = join(ROOT, "src/app/v1");
  for (const file of walk(v1Dir)) {
    if (!/\.(tsx?|mjs|js)$/.test(file)) continue;
    const src = read(file);
    if (!src) continue;
    const importsV2 =
      /from\s+["'][^"']*-v2["']/.test(src) ||
      /from\s+["'][^"']*\/version\/pdp-data-v2["']/.test(src);
    if (importsV2) {
      fail(
        "import",
        `${relative(ROOT, file)} imports a *-v2 module. v1 routes must stay on the frozen baseline.`,
      );
    }
  }
}

// ── Guard 4: route version props ─────────────────────────────────────────────
function checkRouteVersionProps() {
  const checks = [
    { dir: "src/app/v1", expected: 'version="v1"', forbidden: 'version="v2"' },
    { dir: "src/app/v2", expected: 'version="v2"', forbidden: 'version="v1"' },
  ];
  for (const { dir, expected, forbidden } of checks) {
    for (const file of walk(join(ROOT, dir))) {
      if (!/page\.tsx$/.test(file)) continue;
      const src = read(file);
      if (!src || !src.includes("PdpProductPageView")) continue;
      if (src.includes(forbidden)) {
        fail("provider", `${relative(ROOT, file)} passes ${forbidden} (expected ${expected}).`);
      }
      if (!src.includes(expected)) {
        fail("provider", `${relative(ROOT, file)} is missing ${expected} on PdpProductPageView.`);
      }
    }
  }
}

checkFrozenV1Data();
checkCssScoping();
checkV1Imports();
checkRouteVersionProps();

if (failures.length > 0) {
  console.error("\nPDP version boundary check failed:\n");
  for (const line of failures) console.error(`  - ${line}`);
  console.error("");
  process.exit(1);
}

console.log("PDP version boundaries OK");
