"use client";

import { useMemo, useRef, useState } from "react";

import { cn } from "@/lib/cn";

import type { PdpColor } from "./pdp-data";
import { pdpColorAvailabilityLabel, pdpColorIsSelectable } from "./pdp-data";
import type { TabbyColorOption } from "./pdp-tabby-colors";
import {
  pdpPressableIconClass,
  pdpTextLinkCtaMutedClass,
  pdpTextLinkCtaMutedLabelClass,
  pdpType,
} from "./pdp-type";

type MaterialSwatchOption = (PdpColor | TabbyColorOption) & {
  selectionId: string;
  selectionLabel: string;
  groupLabel: string;
  styleId: string;
};

type PdpExpandableMaterialSwatchesProps = {
  options: MaterialSwatchOption[];
  /** Material that lands first (matches the buy-box subtitle). */
  leadMaterial: string;
  selectedId: string;
  onSelect: (selectionId: string) => void;
  /** How many swatches show before “See more” (~one row). */
  previewCount?: number;
  /** Max rows when expanded (collapsed is always one preview row). */
  maxExpandedRows?: number;
  /** When false, all swatches are always visible (no See more). */
  seeMore?: boolean;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  className?: string;
};

/** ~one mobile row of size-7 swatches with gap-2. */
const DEFAULT_PREVIEW_COUNT = 8;
/** See more reveals at most one more row (2 rows total). */
const DEFAULT_MAX_EXPANDED_ROWS = 2;

function isSelectable(option: MaterialSwatchOption): boolean {
  const combinationOk =
    !("combinationAvailable" in option) || option.combinationAvailable;
  return combinationOk && pdpColorIsSelectable(option.availability);
}

/**
 * Stable kitchen-sink order: land material first, then the rest.
 * Selection must not reshuffle the grid.
 */
function orderOptions(
  options: MaterialSwatchOption[],
  leadMaterial: string,
): MaterialSwatchOption[] {
  if (!leadMaterial) return options;
  const lead = options.filter((option) => option.groupLabel === leadMaterial);
  const rest = options.filter((option) => option.groupLabel !== leadMaterial);
  return [...lead, ...rest];
}

/**
 * Color options with optional See more / See less.
 * With seeMore: collapsed ~one row, expanded at most two wrapping rows.
 * Without seeMore: all swatches always visible (no toggle).
 */
export function PdpExpandableMaterialSwatches({
  options,
  leadMaterial,
  selectedId,
  onSelect,
  previewCount = DEFAULT_PREVIEW_COUNT,
  maxExpandedRows = DEFAULT_MAX_EXPANDED_ROWS,
  seeMore = true,
  expanded: expandedProp,
  onExpandedChange,
  className,
}: PdpExpandableMaterialSwatchesProps) {
  const [uncontrolledExpanded, setUncontrolledExpanded] = useState(false);
  const expanded = seeMore ? (expandedProp ?? uncontrolledExpanded) : true;
  const setExpanded = (next: boolean) => {
    if (onExpandedChange) onExpandedChange(next);
    else setUncontrolledExpanded(next);
  };

  /** Pin lead material once so picking Soft Leather doesn’t reshuffle the grid. */
  const pinnedLeadRef = useRef(leadMaterial);
  if (!pinnedLeadRef.current && leadMaterial) {
    pinnedLeadRef.current = leadMaterial;
  }

  const ordered = useMemo(
    () => orderOptions(options, pinnedLeadRef.current || leadMaterial),
    [options, leadMaterial],
  );
  const expandedCount = seeMore
    ? previewCount * Math.max(1, maxExpandedRows)
    : ordered.length;
  const visible = ordered.slice(0, expanded ? expandedCount : previewCount);
  const canExpand = seeMore && ordered.length > previewCount;

  if (ordered.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex min-w-0 w-full flex-col gap-2", className)}>
      <div
        role="listbox"
        aria-label="Choose color"
        className="flex min-w-0 w-full flex-wrap items-center gap-2 py-1 pl-1"
      >
        {visible.map((option) => {
          const isSelected = option.selectionId === selectedId;
          const selectable = isSelectable(option);

          return (
            <button
              key={option.selectionId}
              type="button"
              role="option"
              aria-selected={isSelected}
              aria-disabled={!selectable}
              disabled={!selectable}
              onClick={() => {
                if (selectable) onSelect(option.selectionId);
              }}
              aria-label={
                selectable
                  ? `Select ${option.selectionLabel}`
                  : `${option.selectionLabel}, ${pdpColorAvailabilityLabel(option.availability)}`
              }
              className={cn(
                "relative size-7 shrink-0 rounded-full transition-[box-shadow,opacity] duration-200 ease-out",
                "before:absolute before:inset-[-8px] before:content-['']",
                "shadow-[0_0_0_1px_rgba(0,0,0,0.1)]",
                isSelected && "shadow-[0_0_0_2px_#fff,0_0_0_3px_#0a0a0a]",
                selectable && pdpPressableIconClass,
                !selectable && "cursor-not-allowed opacity-40",
              )}
              style={{ backgroundColor: option.chromeSample ?? "#d4d4d4" }}
            />
          );
        })}
      </div>

      {canExpand ? (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          className={cn(
            "group self-start",
            pdpTextLinkCtaMutedClass,
            pdpType.label,
            "leading-none",
          )}
        >
          <span className={pdpTextLinkCtaMutedLabelClass}>
            {expanded ? "See less" : "See more colorways"}
          </span>
        </button>
      ) : null}
    </div>
  );
}
