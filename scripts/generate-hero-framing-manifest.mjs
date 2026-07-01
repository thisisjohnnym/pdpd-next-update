// Optional helper: suggest hero-gallery shot types for new colorway stills.
//
// This is a *review aid*, not a build step. The source of truth stays in
// src/components/pdp/pdp-hero-gallery-data.ts after one visual pass in Safari.
//
// Usage:
//   pnpm add -D sharp        # one-time, opt-in (not a runtime dependency)
//   node scripts/generate-hero-framing-manifest.mjs [dir]
//
// It scans a folder of stills and writes hero-framing.manifest.json with, per file:
//   - width / height
//   - whether the corners sit on the studio #f0f0f0 ground
//   - a coarse suggested shotType (studio | product | lifestyle)
//
// The coarse suggestion cannot tell `detail` (macro) from `product`, nor
// `on-model` from `lifestyle` — a human confirms those. It mainly flags which
// frames are full-bleed scenes vs studio shots that want `contain`.

import { readdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const STUDIO_GROUND = { r: 240, g: 240, b: 240 };
const STUDIO_TOLERANCE = 8;
const DEFAULT_DIR = "public/images/hero/tabby26";

async function loadSharp() {
  try {
    const mod = await import("sharp");
    return mod.default ?? mod;
  } catch {
    console.error(
      "This script needs sharp. Install it opt-in with:\n  pnpm add -D sharp",
    );
    process.exit(1);
  }
}

function isStudioGround({ r, g, b }) {
  return (
    Math.abs(r - STUDIO_GROUND.r) <= STUDIO_TOLERANCE &&
    Math.abs(g - STUDIO_GROUND.g) <= STUDIO_TOLERANCE &&
    Math.abs(b - STUDIO_GROUND.b) <= STUDIO_TOLERANCE
  );
}

async function sampleColor(sharp, file, left, top) {
  const { data } = await sharp(file)
    .extract({ left, top, width: 2, height: 2 })
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { r: data[0], g: data[1], b: data[2] };
}

async function classify(sharp, file) {
  const image = sharp(file);
  const { width, height } = await image.metadata();
  const corners = await Promise.all([
    sampleColor(sharp, file, 2, 2),
    sampleColor(sharp, file, width - 4, 2),
    sampleColor(sharp, file, 2, height - 4),
    sampleColor(sharp, file, width - 4, height - 4),
  ]);
  const studioCorners = corners.filter(isStudioGround).length;
  const onStudioGround = studioCorners >= 3;

  // Coarse only — full-bleed scenes (few studio corners) read as lifestyle;
  // otherwise default to product/studio and let a human refine to detail/on-model.
  let suggestedShotType;
  if (!onStudioGround) {
    suggestedShotType = "lifestyle";
  } else {
    suggestedShotType = "product";
  }

  return {
    width,
    height,
    onStudioGround,
    studioCorners,
    suggestedShotType,
    note: "Confirm detail (macro) vs product and on-model vs lifestyle by eye.",
  };
}

async function main() {
  const dir = resolve(process.argv[2] ?? DEFAULT_DIR);
  const sharp = await loadSharp();
  const entries = (await readdir(dir)).filter((name) =>
    /\.(webp|jpe?g|png)$/i.test(name),
  );

  const manifest = {};
  for (const name of entries.sort()) {
    manifest[name] = await classify(sharp, join(dir, name));
  }

  const out = join(dir, "hero-framing.manifest.json");
  await writeFile(out, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`Wrote ${out} (${entries.length} files).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
