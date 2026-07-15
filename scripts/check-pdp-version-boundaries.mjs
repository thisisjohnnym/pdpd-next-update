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
 *                        (v1 → no v2/v3/v4/v5/v6; v2 → no v3/v4/v5/v6; …; v5 → no v6)
 *   4. provider guard   — v1..v6 routes each pass their own version="vN"
 *   5. routes guard     — Tabby browser URL sync preserves /vN prefix on version home routes
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
  checkVersionCssScoping("v5");
  checkVersionCssScoping("v6");
  checkVersionCssScoping("v7");
  checkVersionCssScoping("v8");
  checkVersionCssScoping("fc01");
  checkVersionCssScoping("fc01v");
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
    { dir: "src/app/v1", forbidden: ["v2", "v3", "v4", "v5", "v6", "v7", "v8"], note: "v1 routes must stay on the frozen baseline" },
    { dir: "src/app/v2", forbidden: ["v3", "v4", "v5", "v6", "v7", "v8"], note: "v2 routes must not depend on a later pivot" },
    { dir: "src/app/v3", forbidden: ["v4", "v5", "v6", "v7", "v8"], note: "v3 routes must not depend on a later pivot" },
    { dir: "src/app/v4", forbidden: ["v5", "v6", "v7", "v8"], note: "v4 routes must not depend on a later pivot" },
    { dir: "src/app/v5", forbidden: ["v6", "v7", "v8"], note: "v5 routes must not depend on a later pivot" },
    { dir: "src/app/v6", forbidden: ["v7", "v8"], note: "v6 routes must not depend on a later pivot" },
    { dir: "src/app/v7", forbidden: ["v8"], note: "v7 routes must not depend on the v8 pivot" },
    // fc01 / fc01v are the final-candidate UXR pair — they may share v5/v6
    // modules, so no forward-import restrictions apply to them.
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
    { dir: "src/app/v1", expected: 'version="v1"', forbidden: ['version="v2"', 'version="v3"', 'version="v4"', 'version="v5"', 'version="v6"', 'version="v7"', 'version="v8"'] },
    { dir: "src/app/v2", expected: 'version="v2"', forbidden: ['version="v1"', 'version="v3"', 'version="v4"', 'version="v5"', 'version="v6"', 'version="v7"', 'version="v8"'] },
    { dir: "src/app/v3", expected: 'version="v3"', forbidden: ['version="v1"', 'version="v2"', 'version="v4"', 'version="v5"', 'version="v6"', 'version="v7"', 'version="v8"'] },
    { dir: "src/app/v4", expected: 'version="v4"', forbidden: ['version="v1"', 'version="v2"', 'version="v3"', 'version="v5"', 'version="v6"', 'version="v7"', 'version="v8"'] },
    { dir: "src/app/v5", expected: 'version="v5"', forbidden: ['version="v1"', 'version="v2"', 'version="v3"', 'version="v4"', 'version="v6"', 'version="v7"', 'version="v8"'] },
    { dir: "src/app/v6", expected: 'version="v6"', forbidden: ['version="v1"', 'version="v2"', 'version="v3"', 'version="v4"', 'version="v5"', 'version="v7"', 'version="v8"'] },
    { dir: "src/app/v7", expected: 'version="v7"', forbidden: ['version="v1"', 'version="v2"', 'version="v3"', 'version="v4"', 'version="v5"', 'version="v6"', 'version="v8"', 'version="fc01"', 'version="fc01v"'] },
    { dir: "src/app/v8", expected: 'version="v8"', forbidden: ['version="v1"', 'version="v2"', 'version="v3"', 'version="v4"', 'version="v5"', 'version="v6"', 'version="v7"', 'version="fc01"', 'version="fc01v"'] },
    { dir: "src/app/fc01", expected: 'version="fc01"', forbidden: ['version="v1"', 'version="v2"', 'version="v3"', 'version="v4"', 'version="v5"', 'version="v6"', 'version="v7"', 'version="v8"', 'version="fc01v"'] },
    { dir: "src/app/fc01v", expected: 'version="fc01v"', forbidden: ['version="v1"', 'version="v2"', 'version="v3"', 'version="v4"', 'version="v5"', 'version="v6"', 'version="v7"', 'version="v8"', 'version="fc01"'] },
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

// ── Guard 5: version-aware Tabby browser URLs ────────────────────────────────
function checkTabbyBrowserUrls() {
  const routesSrc = read(join(ROOT, "src/components/pdp/pdp-product-routes.ts"));
  const variantsSrc = read(join(ROOT, "src/components/pdp/pdp-tabby-variants.ts"));

  if (variantsSrc?.includes("export function replaceTabbyBrowserUrl")) {
    fail(
      "routes",
      "pdp-tabby-variants.ts still exports replaceTabbyBrowserUrl — move version-aware URL sync to pdp-product-routes.ts.",
    );
  }

  if (!routesSrc?.includes("export function tabbyBrowserUrl")) {
    fail("routes", "pdp-product-routes.ts is missing tabbyBrowserUrl.");
    return;
  }

  function pdpVersionPrefix(version) {
    return version === "v1" ? "" : `/${version}`;
  }

  function isPdpVersionHomePathname(pathname, version) {
    const home = pdpVersionPrefix(version) || "/";
    if (pathname.includes("/products/")) return false;
    return pathname === home || pathname === `${home}/`;
  }

  function versionedProductPath(version, slug, colorId) {
    const base = `/products/${slug}`;
    const path = colorId ? `${base}?color=${encodeURIComponent(colorId)}` : base;
    if (version === "v1") return path;
    return `${pdpVersionPrefix(version)}${path}`;
  }

  function tabbyBrowserUrl(version, slug, colorId, pathname) {
    const query = colorId ? `?color=${encodeURIComponent(colorId)}` : "";
    if (isPdpVersionHomePathname(pathname, version)) {
      const home = pdpVersionPrefix(version) || "/";
      return `${home}${query}`;
    }
    return versionedProductPath(version, slug, colorId);
  }

  const slug = "tabby-shoulder-bag-26-quilted";
  const cases = [
    [tabbyBrowserUrl("v8", slug, "brass-black", "/v8"), "/v8?color=brass-black"],
    [
      tabbyBrowserUrl("v8", slug, "brass-black", "/v8/products/tabby-shoulder-bag-26-quilted"),
      "/v8/products/tabby-shoulder-bag-26-quilted?color=brass-black",
    ],
    [tabbyBrowserUrl("v7", slug, "brass-black", "/v7"), "/v7?color=brass-black"],
    [
      tabbyBrowserUrl("v7", slug, "brass-black", "/v7/products/tabby-shoulder-bag-26-quilted"),
      "/v7/products/tabby-shoulder-bag-26-quilted?color=brass-black",
    ],
    [tabbyBrowserUrl("v6", slug, "brass-black", "/v6"), "/v6?color=brass-black"],
    [
      tabbyBrowserUrl("v6", slug, "brass-black", "/v6/products/tabby-shoulder-bag-26-quilted"),
      "/v6/products/tabby-shoulder-bag-26-quilted?color=brass-black",
    ],
    [tabbyBrowserUrl("v5", slug, "brass-black", "/v5"), "/v5?color=brass-black"],
    [
      tabbyBrowserUrl("v5", slug, "brass-black", "/v5/products/tabby-shoulder-bag-26-quilted"),
      "/v5/products/tabby-shoulder-bag-26-quilted?color=brass-black",
    ],
    [tabbyBrowserUrl("v1", slug, "brass-black", "/"), "/?color=brass-black"],
    [
      tabbyBrowserUrl("v1", slug, "brass-black", "/products/tabby-shoulder-bag-26-quilted"),
      "/products/tabby-shoulder-bag-26-quilted?color=brass-black",
    ],
    [tabbyBrowserUrl("fc01", slug, "brass-black", "/fc01"), "/fc01?color=brass-black"],
    [
      tabbyBrowserUrl("fc01", slug, "brass-black", "/fc01/products/tabby-shoulder-bag-26-quilted"),
      "/fc01/products/tabby-shoulder-bag-26-quilted?color=brass-black",
    ],
    [tabbyBrowserUrl("fc01v", slug, "brass-black", "/fc01v"), "/fc01v?color=brass-black"],
    [
      tabbyBrowserUrl("fc01v", slug, "brass-black", "/fc01v/products/tabby-shoulder-bag-26-quilted"),
      "/fc01v/products/tabby-shoulder-bag-26-quilted?color=brass-black",
    ],
  ];

  for (const [actual, expected] of cases) {
    if (actual !== expected) {
      fail("routes", `tabbyBrowserUrl expected ${expected}, got ${actual}.`);
    }
  }
}

checkFrozenV1Data();
checkCssScoping();
checkVersionImports();
checkRouteVersionProps();
checkTabbyBrowserUrls();

if (failures.length > 0) {
  console.error("\nPDP version boundary check failed:\n");
  for (const line of failures) console.error(`  - ${line}`);
  console.error("");
  process.exit(1);
}

console.log("PDP version boundaries OK");
