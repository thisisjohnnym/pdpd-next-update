"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { HERO_CHROME_COLOR_TRANSITION_CLASS } from "../pdp-hero-chrome-surface";
import {
  formatHeroGalleryCategoryLabel,
  PDP_HERO_GALLERY_CATEGORIES,
  readHeroGalleryActiveCategory,
  resolveHeroGalleryCategoryIndices,
  type PdpHeroGalleryCategoryDef,
  type PdpHeroGalleryCategoryId,
} from "../pdp-hero-gallery-categories";
import type { PdpHeroGalleryCategory } from "../pdp-hero-gallery-data";
import { usePdpHeroGallery } from "../pdp-hero-gallery-context";
import {
  PDP_HERO_GALLERY_CONTROL_ACTIVATE_CLASS,
  PDP_HERO_GALLERY_CONTROL_ICON_SIZE,
  PDP_HERO_GALLERY_CONTROL_SHELL_CLASS,
} from "../pdp-hero-gallery-control-shell";
import { pdpPressableClass } from "../pdp-type";
import { useMountTransition } from "../use-mount-transition";
import {
  useHeroGalleryIdleOnSleep,
  useHeroGalleryIdlePin,
  useHeroGalleryIdleVisible,
} from "../use-hero-gallery-idle-visible";
import { useReducedMotion } from "../use-reduced-motion";

const MENU_TRANSITION_MS = 220;

// fallow-ignore-next-line complexity
function CategoryRow({
  category,
  label,
  active,
  disabled,
  chromeTransitionClass,
  onSelect,
}: {
  category: PdpHeroGalleryCategoryDef;
  label: string;
  active: boolean;
  disabled: boolean;
  chromeTransitionClass?: string;
  onSelect: (id: PdpHeroGalleryCategoryId) => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-current={active ? "true" : undefined}
      aria-label={
        category.action === "ar"
          ? "Try on with AR"
          : `Jump to ${label} in gallery`
      }
      onClick={() => onSelect(category.id)}
      className={cn(
        "pointer-events-auto flex w-full items-center border-b border-l-2 border-b-white/10 border-l-transparent px-3 py-2.5 text-left transition-[opacity,transform,border-color] duration-200 ease-out last:border-b-0",
        "disabled:pointer-events-none disabled:opacity-35",
        !disabled && "active:scale-[0.99]",
        active && "border-l-white pl-[calc(0.75rem-2px)]",
        chromeTransitionClass,
        pdpPressableClass,
      )}
    >
      <span
        className={cn(
          "font-extended block text-[11px] tracking-[0.35px] transition-[color,opacity] duration-200 ease-out",
          category.showCommunityCount && "tabular-nums",
          chromeTransitionClass,
          active ? "text-white opacity-100" : "text-white/40",
        )}
      >
        {label}
      </span>
    </button>
  );
}

/**
 * Two-step hero gallery wayfinding — bottom-left of the media frame.
 *
 * 1. Collapsed: a single glass activate control (not exposed 24/7).
 * 2. Expanded: vertical section list above the close control.
 */
// fallow-ignore-next-line complexity
export function PdpHeroGalleryCategoryRail({
  onOpenArTryOn,
  chromeVisible = true,
}: {
  onOpenArTryOn?: () => void;
  /** Collapse when hero UI chrome fades on scroll. */
  chromeVisible?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const { activeIndex, slides, scrollToIndex } = usePdpHeroGallery();
  const menu = useMountTransition(expanded, MENU_TRANSITION_MS);
  const reducedMotion = useReducedMotion();
  const chromeTransitionClass = reducedMotion
    ? undefined
    : HERO_CHROME_COLOR_TRANSITION_CLASS;

  const categoryIndices = useMemo(
    () => resolveHeroGalleryCategoryIndices(slides),
    [slides],
  );

  const activeCategory = useMemo(
    () => readHeroGalleryActiveCategory(slides, activeIndex),
    [slides, activeIndex],
  );

  const categories = useMemo(
    () =>
      PDP_HERO_GALLERY_CATEGORIES.filter((category) => {
        if (category.id === "ar") {
          return Boolean(onOpenArTryOn);
        }
        return (
          categoryIndices[category.id as PdpHeroGalleryCategory] !== undefined
        );
      }),
    [categoryIndices, onOpenArTryOn],
  );

  const collapse = useCallback(() => {
    setExpanded(false);
  }, []);

  useHeroGalleryIdlePin(expanded);
  useHeroGalleryIdleOnSleep(collapse);
  const idleVisible = useHeroGalleryIdleVisible();
  const chromeAwake = chromeVisible && idleVisible;

  // fallow-ignore-next-line complexity
  const handleSelect = useCallback(
    // fallow-ignore-next-line complexity
    (id: PdpHeroGalleryCategoryId) => {
      if (id === "ar") {
        onOpenArTryOn?.();
      } else {
        const targetIndex = categoryIndices[id as PdpHeroGalleryCategory];
        if (targetIndex !== undefined && targetIndex >= 0) {
          scrollToIndex(targetIndex);
        }
      }
      collapse();
    },
    [categoryIndices, collapse, onOpenArTryOn, scrollToIndex],
  );

  useEffect(() => {
    if (!chromeVisible) {
      setExpanded(false);
    }
  }, [chromeVisible]);

  useEffect(() => {
    if (!expanded) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      const root = rootRef.current;
      if (!root || root.contains(event.target as Node)) {
        return;
      }
      collapse();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        collapse();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [collapse, expanded]);

  if (categories.length <= 1) {
    return null;
  }

  return (
    <div
      ref={rootRef}
      className={cn(
        "pointer-events-auto flex flex-col-reverse items-start gap-2 pdp-video-controls-pop",
        !chromeAwake && "pointer-events-none",
      )}
      data-state={chromeAwake ? "open" : "closed"}
    >
      <button
        type="button"
        aria-expanded={expanded}
        aria-haspopup="true"
        aria-controls="pdp-hero-gallery-category-menu"
        aria-label={expanded ? "Close gallery sections" : "Explore gallery sections"}
        onClick={() => setExpanded((open) => !open)}
        className={cn(
          PDP_HERO_GALLERY_CONTROL_ACTIVATE_CLASS,
          chromeTransitionClass,
          pdpPressableClass,
        )}
      >
        <MaterialIcon
          name={expanded ? "close" : "apps"}
          size={PDP_HERO_GALLERY_CONTROL_ICON_SIZE}
          className={cn("text-white", chromeTransitionClass)}
        />
      </button>

      {menu.mounted ? (
        <nav
          id="pdp-hero-gallery-category-menu"
          aria-label="Gallery categories"
          className={cn(
            "pdp-pop-up flex min-w-[11.5rem] flex-col rounded-none py-0.5",
            PDP_HERO_GALLERY_CONTROL_SHELL_CLASS,
            chromeTransitionClass,
          )}
          data-state={menu.state}
        >
          {categories.map((category) => {
            const scrollCategory =
              category.id === "ar" ? null : (category.id as PdpHeroGalleryCategory);
            const disabled =
              category.action === "scroll" &&
              (scrollCategory === null ||
                categoryIndices[scrollCategory] === undefined);
            const label = formatHeroGalleryCategoryLabel(category);

            return (
              <CategoryRow
                key={category.id}
                category={category}
                label={label}
                active={activeCategory === category.id}
                disabled={disabled}
                chromeTransitionClass={chromeTransitionClass}
                onSelect={handleSelect}
              />
            );
          })}
        </nav>
      ) : null}
    </div>
  );
}
