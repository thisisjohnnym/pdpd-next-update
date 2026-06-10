"use client";

import { useEffect, useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { PdpColorSelector } from "./pdp-color-selector";
import { PDP_COLORS } from "./pdp-data";

const HERO_TOP_SCROLL = 32;

function useIsScrollAtTop(threshold = HERO_TOP_SCROLL) {
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      setAtTop(window.scrollY <= threshold);
    };

    const handleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [threshold]);

  return atTop;
}

type PdpBottomActionsProps = {
  selectedColorId: string;
  onColorSelect: (id: string) => void;
  onAddToBag: () => void;
};

export function PdpBottomActions({
  selectedColorId,
  onColorSelect,
  onAddToBag,
}: PdpBottomActionsProps) {
  const isHeroTop = useIsScrollAtTop();

  return (
    <footer className="pointer-events-none fixed inset-x-0 bottom-0 z-30">
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 h-[calc(max(30px,env(safe-area-inset-bottom,0px))+6.5rem)] bg-gradient-to-t from-white/90 via-white/45 to-transparent backdrop-blur-lg transition-opacity duration-300",
          isHeroTop ? "opacity-0" : "opacity-100",
        )}
        style={{
          visibility: isHeroTop ? "hidden" : "visible",
          WebkitMaskImage:
            "linear-gradient(to top, black 35%, rgba(0,0,0,0.6) 62%, transparent 100%)",
          maskImage:
            "linear-gradient(to top, black 35%, rgba(0,0,0,0.6) 62%, transparent 100%)",
        }}
      />

      <div className="relative pb-[max(30px,env(safe-area-inset-bottom))] pt-2.5">
      <PageGrid fullWidth className="pointer-events-auto">
        <GridItem mobile={12} desktop={24}>
          <div className="flex gap-1.5">
            <PdpColorSelector
              colors={PDP_COLORS}
              selectedId={selectedColorId}
              onSelect={onColorSelect}
              inline
            />

            <button
              type="button"
              onClick={onAddToBag}
              className={cn(
                "font-extended flex h-[54px] min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full px-4 text-sm tracking-[0.2px] text-neutral-900 transition-colors duration-300",
                isHeroTop
                  ? "border border-white bg-white"
                  : "border border-white/50 bg-white/75 backdrop-blur-md",
              )}
            >
              <span className="translate-y-[1.5px]">Add to Bag</span>
              <MaterialIcon name="add" size={20} className="text-neutral-900" />
            </button>
          </div>
        </GridItem>
      </PageGrid>
      </div>
    </footer>
  );
}
