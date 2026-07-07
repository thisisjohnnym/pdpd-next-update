import {
  getTabbyColorOptionsForStyleSize,
  type TabbyColorOption,
} from "./pdp-tabby-colors";
import type { TabbyColorSwatchGroup } from "./pdp-tabby-color-swatch-groups";
import type { TabbySize, TabbyStyleId } from "./pdp-tabby-variants";

/** Prototype-only swatch ids — never drive variant selection */
const DEMO_COLOR_SWATCH_ID_PREFIX = "demo-swatch-";

const DEMO_ROW_MIN_COUNT = 8;

/** Indices that render as notify-me placeholders in the demo row */
const DEMO_NOTIFY_INDICES = new Set([4, 6]);

export function isDemoColorSwatchId(id: string): boolean {
  return id.startsWith(DEMO_COLOR_SWATCH_ID_PREFIX);
}

function demoTemplatesForStyle(styleId: TabbyStyleId): TabbyColorOption[] {
  return getTabbyColorOptionsForStyleSize(styleId, 26).filter(
    (color) => color.combinationAvailable,
  );
}

function padGroupColors(
  colors: TabbyColorOption[],
  templates: TabbyColorOption[],
  size: TabbySize,
): TabbyColorOption[] {
  if (colors.length >= DEMO_ROW_MIN_COUNT || templates.length === 0) {
    return colors;
  }

  const padded = [...colors];
  let templateIndex = 0;

  while (padded.length < DEMO_ROW_MIN_COUNT) {
    const template = templates[templateIndex % templates.length]!;
    const slot = padded.length;
    const notify = DEMO_NOTIFY_INDICES.has(slot);

    padded.push({
      ...template,
      id: `${DEMO_COLOR_SWATCH_ID_PREFIX}${size}-${slot}`,
      name: notify ? `${template.name} (demo)` : template.name,
      combinationAvailable: true,
      availability: notify ? "notify" : "in_stock",
    });

    templateIndex += 1;
  }

  return padded;
}

/** Fill sparse size tabs with visual-only swatches for v5 prototyping. */
export function withDemoHeroColorSwatchPlaceholders(
  groups: TabbyColorSwatchGroup[],
  styleId: TabbyStyleId,
): TabbyColorSwatchGroup[] {
  const templates = demoTemplatesForStyle(styleId);

  if (templates.length === 0) {
    return groups;
  }

  return groups.map((group) => ({
    ...group,
    colors: padGroupColors(group.colors, templates, group.size),
  }));
}
