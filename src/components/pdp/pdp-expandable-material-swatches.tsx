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
  /**
   * When true: collapse + See more on one horizontal row.
   * Expand reveals the rest via horizontal scroll (height never grows).
   * When false: one horizontal scroll rail of all swatches.
   */
  seeMore?: boolean;
  /**
   * @deprecated Always inline + horizontal scroll — kept for call-site compat.
   */
  seeMoreInline?: boolean;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  className?: string;
};

/** ~one mobile row of size-7 swatches with gap-2. */
const DEFAULT_PREVIEW_COUNT = 8;
/** Stagger between newly revealed swatches on expand. */
const ENTER_STAGGER_MS = 28;
const ENTER_DURATION_MS = 280;

const SCROLL_ROW_CLASS = cn(
  "flex min-w-0 w-full max-w-full flex-nowrap items-center gap-2",
  "overflow-x-auto overflow-y-clip overscroll-x-contain overscroll-y-none touch-pan-x",
  "pl-1 py-1",
  "pdp-carousel-draggable [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
);

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
 * Color options on a single horizontal row (never wraps / grows the layout).
 * With seeMore: collapsed preview + inline “See more”; expand scrolls the full rail
 * with “View less” after the last swatch.
 * Without seeMore: full rail, scroll for the rest.
 */
export function PdpExpandableMaterialSwatches({
  options,
  leadMaterial,
  selectedId,
  onSelect,
  previewCount = DEFAULT_PREVIEW_COUNT,
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
  const visible = ordered.slice(
    0,
    seeMore && !expanded ? previewCount : ordered.length,
  );
  const canExpand = seeMore && ordered.length > previewCount;

  /** Index from which newly revealed swatches should enter-animate. */
  const [enterFromIndex, setEnterFromIndex] = useState<number | null>(null);
  const wasExpandedRef = useRef(expanded);

  useEffect(() => {
    const wasExpanded = wasExpandedRef.current;
    wasExpandedRef.current = expanded;

    if (!seeMore || wasExpanded || !expanded) {
      return;
    }

    setEnterFromIndex(previewCount);
    const clearAfter =
      ENTER_DURATION_MS +
      Math.max(0, ordered.length - previewCount) * ENTER_STAGGER_MS +
      40;
    const timer = window.setTimeout(() => setEnterFromIndex(null), clearAfter);
    return () => window.clearTimeout(timer);
  }, [expanded, ordered.length, previewCount, seeMore]);

  if (ordered.length === 0) {
    return null;
  }

  return (
    <div
      ref={scrollRef}
      role="listbox"
      aria-label="Choose color"
      className={cn(SCROLL_ROW_CLASS, className)}
    >
      {visible.map((option, index) => {
        const entering =
          enterFromIndex != null && index >= enterFromIndex;
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
      })}

      {canExpand ? (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          className={cn(
            "group shrink-0 self-center",
            pdpTextLinkCtaMutedClass,
            pdpType.label,
            "leading-none",
          )}
        >
          <span className={pdpTextLinkCtaMutedLabelClass}>
            {expanded ? "View less" : "See more"}
          </span>
        </button>
      ) : null}
    </div>
  );
}
