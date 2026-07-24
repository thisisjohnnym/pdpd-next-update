"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";

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
import { useDragToScroll } from "./use-infinite-centered-carousel";

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
  /**
   * When true: collapse + See more (wrap).
   * When false: one horizontal scroll rail (~7 visible left-to-right).
   */
  seeMore?: boolean;
  /**
   * Inline after the last swatch (uxr2). Off = classic link below the row (uxr3).
   */
  seeMoreInline?: boolean;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  className?: string;
};

/** ~one mobile row of size-7 swatches with gap-2. */
const DEFAULT_PREVIEW_COUNT = 8;
/** See more reveals at most one more row (2 rows total). */
const DEFAULT_MAX_EXPANDED_ROWS = 2;
/** Expanded See more — keep the rail to ~8 chips (uxr2 + uxr3). */
const EXPANDED_SWATCH_COUNT = 8;
/** Stagger between newly revealed swatches on expand. */
const ENTER_STAGGER_MS = 28;
const ENTER_DURATION_MS = 280;

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

function SwatchButton({
  option,
  isSelected,
  onSelect,
  className,
  style,
}: {
  option: MaterialSwatchOption;
  isSelected: boolean;
  onSelect: (selectionId: string) => void;
  className?: string;
  style?: CSSProperties;
}) {
  const selectable = isSelectable(option);

  return (
    <button
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
        className,
      )}
      style={{ backgroundColor: option.chromeSample ?? "#d4d4d4", ...style }}
    />
  );
}

/**
 * Color options with optional See more / See less, or a horizontal scroll rail.
 * seeMore + seeMoreInline (uxr2): one row always; expand reveals the rest via
 * horizontal scroll so height never jumps. Control sits after the last swatch.
 * seeMore without inline (uxr3): classic “See more colorways” below a wrapping row.
 * Without seeMore: single horizontal row (~7 visible), scroll for the rest.
 */
export function PdpExpandableMaterialSwatches({
  options,
  leadMaterial,
  selectedId,
  onSelect,
  previewCount = DEFAULT_PREVIEW_COUNT,
  maxExpandedRows = DEFAULT_MAX_EXPANDED_ROWS,
  seeMore = true,
  seeMoreInline = false,
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
  const scrollRef = useRef<HTMLDivElement>(null);
  useDragToScroll(scrollRef);

  /** Pin lead material once so picking Soft Leather doesn’t reshuffle the grid. */
  const pinnedLeadRef = useRef(leadMaterial);
  if (!pinnedLeadRef.current && leadMaterial) {
    pinnedLeadRef.current = leadMaterial;
  }

  const ordered = useMemo(
    () => orderOptions(options, pinnedLeadRef.current || leadMaterial),
    [options, leadMaterial],
  );
  const horizontal = !seeMore;
  // Cap expanded chips at 8 (uxr2 inline + uxr3 below).
  const expandedCount = Math.min(EXPANDED_SWATCH_COUNT, ordered.length);
  const visible = ordered.slice(0, expanded ? expandedCount : previewCount);
  const canExpand = seeMore && ordered.length > previewCount;

  /** Index from which newly revealed swatches should enter-animate (inline only). */
  const [enterFromIndex, setEnterFromIndex] = useState<number | null>(null);
  const wasExpandedRef = useRef(expanded);

  useEffect(() => {
    const wasExpanded = wasExpandedRef.current;
    wasExpandedRef.current = expanded;

    if (!seeMore || !seeMoreInline || wasExpanded || !expanded) {
      return;
    }

    setEnterFromIndex(previewCount);
    const clearAfter =
      ENTER_DURATION_MS +
      Math.max(0, expandedCount - previewCount) * ENTER_STAGGER_MS +
      40;
    const timer = window.setTimeout(() => setEnterFromIndex(null), clearAfter);
    return () => window.clearTimeout(timer);
  }, [expanded, expandedCount, previewCount, seeMore, seeMoreInline]);

  if (ordered.length === 0) {
    return null;
  }

  if (horizontal) {
    return (
      <div
        ref={scrollRef}
        role="listbox"
        aria-label="Choose color"
        className={cn(
          "flex min-w-0 w-full max-w-full items-center gap-2",
          "overflow-x-auto overflow-y-clip overscroll-x-contain overscroll-y-none touch-pan-x",
          "pl-1 py-1",
          "pdp-carousel-draggable [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          className,
        )}
      >
        {ordered.map((option) => (
          <SwatchButton
            key={option.selectionId}
            option={option}
            isSelected={option.selectionId === selectedId}
            onSelect={onSelect}
          />
        ))}
      </div>
    );
  }

  const expandToggle = canExpand ? (
    <button
      type="button"
      onClick={() => setExpanded(!expanded)}
      aria-expanded={expanded}
      className={cn(
        "group shrink-0",
        seeMoreInline ? "self-center" : "self-start",
        pdpTextLinkCtaMutedClass,
        pdpType.label,
        "leading-none",
      )}
    >
      <span className={pdpTextLinkCtaMutedLabelClass}>
        {seeMoreInline
          ? expanded
            ? "View less"
            : "See more"
          : expanded
            ? "See less"
            : "See more colorways"}
      </span>
    </button>
  ) : null;

  const swatches = visible.map((option, index) => {
    const entering =
      seeMoreInline && enterFromIndex != null && index >= enterFromIndex;
    return (
      <SwatchButton
        key={option.selectionId}
        option={option}
        isSelected={option.selectionId === selectedId}
        onSelect={onSelect}
        className={entering ? "pdp-material-swatch-enter" : undefined}
        style={
          entering
            ? {
                animationDelay: `${(index - enterFromIndex) * ENTER_STAGGER_MS}ms`,
              }
            : undefined
        }
      />
    );
  });

  // uxr2: always one row — collapsed fits preview + See more; expanded scrolls.
  if (seeMoreInline) {
    return (
      <div
        ref={scrollRef}
        role="listbox"
        aria-label="Choose color"
        className={cn(
          "flex min-w-0 w-full max-w-full flex-nowrap items-center gap-2",
          "overflow-x-auto overflow-y-clip overscroll-x-contain overscroll-y-none touch-pan-x",
          "pl-1 py-1",
          "pdp-carousel-draggable [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          className,
        )}
      >
        {swatches}
        {expandToggle}
      </div>
    );
  }

  // uxr3: swatches always one row (scroll when expanded); link stays below.
  return (
    <div className={cn("flex min-w-0 w-full flex-col gap-2", className)}>
      <div
        ref={scrollRef}
        role="listbox"
        aria-label="Choose color"
        className={cn(
          "flex min-w-0 w-full max-w-full flex-nowrap items-center gap-2",
          "overflow-x-auto overflow-y-clip overscroll-x-contain overscroll-y-none touch-pan-x",
          "py-1 pl-1",
          "pdp-carousel-draggable [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
      >
        {swatches}
      </div>
      {expandToggle}
    </div>
  );
}
