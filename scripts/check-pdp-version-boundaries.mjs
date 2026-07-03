#!/usr/bin/env node
/**
 * PDP version boundary checks (see docs/pdp-versions.md).
 *
 * Guards against the changes most likely to break the frozen /v1 baseline while
 * working on the v2 pivot:
 *   1. v1 data guard   — pdp-data.ts / pdp-section-chapters.ts must not change vs the v1 baseline
 *   2. CSS scope guard — every rule in src/app/v2/pdp-v2.css, v3/pdp-v3.css, and v4/pdp-v4.css must be
 *                        scoped to its [data-pdp-version="..."], and globals.css must not contain that scoping
 *   3. import guard     — a route folder must not import a higher version's *-vN modules
 *                        (v1 → no v2/v3/v4; v2 → no v3/v4; v3 → no v4)
 *   4. provider guard   — v1..v4 routes each pass their own version="vN"
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

function checkVersionCssScoping(version) {
  const cssPath = join(ROOT, `src/app/${version}/pdp-${version}.css`);
  const css = read(cssPath);
  const scope = `[data-pdp-version="${version}"]`;
  if (css) {
    const body = stripCssComments(css);
    for (const chunk of body.split("}")) {
      const selector = chunk.split("{")[0]?.trim();
      if (!selector || !chunk.includes("{")) continue;
      if (selector.startsWith("@")) continue; // at-rules (media/keyframes) are fine
      if (!selector.includes(scope)) {
        fail(
          "css-scope",
          `Unscoped selector in src/app/${version}/pdp-${version}.css: "${selector}". ` +
            `Prefix every ${version} rule with ${scope}.`,
        );
      }
    }
  }

  const globalsPath = join(ROOT, "src/app/globals.css");
  const globals = read(globalsPath);
  if (globals && stripCssComments(globals).includes(scope)) {
    fail(
      "css-scope",
      `globals.css references ${scope}. Move ${version}-only styling to src/app/${version}/pdp-${version}.css.`,
    );
  }
}

function checkCssScoping() {
  checkVersionCssScoping("v2");
  checkVersionCssScoping("v3");
  checkVersionCssScoping("v4");
}

// ── Guard 3: lower versions must not import higher-version modules ───────────
function importsVersionModule(src, version) {
  return (
    new RegExp(`from\\s+["'][^"']*-${version}["']`).test(src) ||
    new RegExp(`from\\s+["'][^"']*/version/pdp-data-${version}["']`).test(src)
  );
}

function checkVersionImports() {
  // A route folder must never reach forward into a higher version's modules.
  const forbiddenByRoute = [
    { dir: "src/app/v1", forbidden: ["v2", "v3", "v4"], note: "v1 routes must stay on the frozen baseline" },
    { dir: "src/app/v2", forbidden: ["v3", "v4"], note: "v2 routes must not depend on a later pivot" },
    { dir: "src/app/v3", forbidden: ["v4"], note: "v3 routes must not depend on the v4 pivot" },
  ];

  for (const { dir, forbidden, note } of forbiddenByRoute) {
    for (const file of walk(join(ROOT, dir))) {
      if (!/\.(tsx?|mjs|js)$/.test(file)) continue;
      const src = read(file);
      if (!src) continue;
      for (const version of forbidden) {
        if (importsVersionModule(src, version)) {
          fail(
            "import",
            `${relative(ROOT, file)} imports a *-${version} module. ${note}.`,
          );
        }
      }
    }
  }
}

// ── Guard 4: route version props ─────────────────────────────────────────────
function checkRouteVersionProps() {
  const checks = [
    { dir: "src/app/v1", expected: 'version="v1"', forbidden: ['version="v2"', 'version="v3"', 'version="v4"'] },
    { dir: "src/app/v2", expected: 'version="v2"', forbidden: ['version="v1"', 'version="v3"', 'version="v4"'] },
    { dir: "src/app/v3", expected: 'version="v3"', forbidden: ['version="v1"', 'version="v2"', 'version="v4"'] },
    { dir: "src/app/v4", expected: 'version="v4"', forbidden: ['version="v1"', 'version="v2"', 'version="v3"'] },
  ];
  for (const { dir, expected, forbidden } of checks) {
    for (const file of walk(join(ROOT, dir))) {
      if (!/page\.tsx$/.test(file)) continue;
      const src = read(file);
      if (!src || !src.includes("PdpProductPageView")) continue;
      for (const bad of forbidden) {
        if (src.includes(bad)) {
          fail("provider", `${relative(ROOT, file)} passes ${bad} (expected ${expected}).`);
        }
      }
      if (!src.includes(expected)) {
        fail("provider", `${relative(ROOT, file)} is missing ${expected} on PdpProductPageView.`);
      }
    }
  }
}

checkFrozenV1Data();
checkCssScoping();
checkVersionImports();
checkRouteVersionProps();

if (failures.length > 0) {
  console.error("\nPDP version boundary check failed:\n");
  for (const line of failures) console.error(`  - ${line}`);
  console.error("");
  process.exit(1);
}

console.log("PDP version boundaries OK");
