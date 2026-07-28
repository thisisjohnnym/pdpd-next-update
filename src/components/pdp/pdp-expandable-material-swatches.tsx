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
   * Wrap mode (uxr3): how many extra chips spill onto the next line after a
   * full-width row. Default 3 — “jump one line below” without packing a second
   * full row.
   */
  wrapOverflowCount?: number;
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
/** Wrap expand: one full row + this many chips on the line below. */
const DEFAULT_WRAP_OVERFLOW_COUNT = 3;
/** Expanded See more — uxr2 inline horizontal scroll. */
const EXPANDED_SWATCH_COUNT = 10;
/** Stagger between newly revealed swatches on expand. */
const ENTER_STAGGER_MS = 28;
const ENTER_DURATION_MS = 280;

/** How many swatches pack into a wrap row (1px safety for subpixel wrap). */
function chipsThatFitWidth(
  widthPx: number,
  swatchPx: number,
  gapPx: number,
): number {
  if (widthPx <= 0 || swatchPx <= 0) {
    return DEFAULT_PREVIEW_COUNT;
  }
  // N*swatch + (N-1)*gap <= width - 1  →  N <= (width - 1 + gap) / (swatch + gap)
  return Math.max(
    1,
    Math.floor((widthPx - 1 + gapPx) / (swatchPx + gapPx)),
  );
}

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
 * seeMore without inline (uxr3): “See more colorways” below; expand fills one
 * row, then a few chips (wrapOverflowCount) jump to the line below.
 * Without seeMore: single horizontal row (~7 visible), scroll for the rest.
 */
export function PdpExpandableMaterialSwatches({
  options,
  leadMaterial,
  selectedId,
  onSelect,
  previewCount = DEFAULT_PREVIEW_COUNT,
  wrapOverflowCount = DEFAULT_WRAP_OVERFLOW_COUNT,
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
  const wrapRef = useRef<HTMLDivElement>(null);
  useDragToScroll(scrollRef);
  const [chipsPerRow, setChipsPerRow] = useState(previewCount);

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
  const wrapMode = seeMore && !seeMoreInline;

  // Measure how many size-7 chips fill the wrap row so expand can pack the
  // width before spilling to the next line (uxr3).
  useEffect(() => {
    if (!wrapMode) {
      return;
    }
    const el = wrapRef.current;
    if (!el) {
      return;
    }
    const measure = () => {
      const styles = getComputedStyle(el);
      const padX =
        (parseFloat(styles.paddingLeft) || 0) +
        (parseFloat(styles.paddingRight) || 0);
      const gap = parseFloat(styles.columnGap || styles.gap) || 8;
      const first = el.querySelector<HTMLElement>('button[role="option"]');
      const swatchPx = first?.getBoundingClientRect().width || 28;
      setChipsPerRow(chipsThatFitWidth(el.clientWidth - padX, swatchPx, gap));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [wrapMode]);

  // Inline (uxr2): fixed expand count + horizontal scroll.
  // Wrap (uxr3): one full-width row + a short spill onto the next line.
  const expandedCount = seeMoreInline
    ? Math.min(EXPANDED_SWATCH_COUNT, ordered.length)
    : Math.min(ordered.length, chipsPerRow + wrapOverflowCount);
  const visible = ordered.slice(0, expanded ? expandedCount : previewCount);
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
      Math.max(0, expandedCount - previewCount) * ENTER_STAGGER_MS +
      40;
    const timer = window.setTimeout(() => setEnterFromIndex(null), clearAfter);
    return () => window.clearTimeout(timer);
  }, [expanded, expandedCount, previewCount, seeMore]);

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

  const renderSwatch = (option: MaterialSwatchOption, index: number) => {
    const entering = enterFromIndex != null && index >= enterFromIndex;
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
  };

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
        {visible.map((option, index) => renderSwatch(option, index))}
        {expandToggle}
      </div>
    );
  }

  // uxr3: wrapping grid — pack each row to the container width, then wrap.
  return (
    <div className={cn("flex min-w-0 w-full flex-col gap-2", className)}>
      <div
        ref={wrapRef}
        role="listbox"
        aria-label="Choose color"
        className="flex min-w-0 w-full max-w-full flex-wrap items-center gap-2 py-1 pl-1"
      >
        {visible.map((option, index) => renderSwatch(option, index))}
      </div>
      {expandToggle}
    </div>
  );
}
