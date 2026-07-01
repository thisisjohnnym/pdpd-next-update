"use client";

import { useRef, useState } from "react";

import { cn } from "@/lib/cn";

import type { PdpProductHotspot } from "./pdp-data";
import { pdpBodyRhythm } from "./pdp-type";
import { useMountTransition } from "./use-mount-transition";

type PdpProductHotspotsProps = {
  hotspots: PdpProductHotspot[];
};

const CARD_OFFSET = "1.75rem";
/** Hotspots above this line flip the card downward so it stays in frame */
const CARD_FLIP_BELOW_THRESHOLD = 28;

/** Keep the info card inside the image frame */
function getCardLeftPercent(x: number) {
  const cardHalfWidth = 34;
  const inset = 4;

  return Math.max(
    inset,
    Math.min(x - cardHalfWidth, 100 - cardHalfWidth * 2 - inset),
  );
}

function getCardTransform(y: number) {
  if (y < CARD_FLIP_BELOW_THRESHOLD) {
    return `translateY(${CARD_OFFSET})`;
  }

  return `translateY(calc(-100% - ${CARD_OFFSET}))`;
}

const HOTSPOT_RING_COLORS = ["#FE2C55", "#F4C542", "#5BC8F5"] as const;

/** Tappable detail markers on product photography */
// fallow-ignore-next-line complexity
export function PdpProductHotspots({ hotspots }: PdpProductHotspotsProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeHotspot = hotspots.find((hotspot) => hotspot.id === activeId);
  const card = useMountTransition(Boolean(activeId), 220);
  // Retain the last hotspot while the card animates out (activeId is null then).
  const lastHotspotRef = useRef(activeHotspot);
  if (activeHotspot) {
    lastHotspotRef.current = activeHotspot;
  }
  const cardHotspot = activeHotspot ?? lastHotspotRef.current;

  const handleToggle = (id: string) => {
    setActiveId((current) => (current === id ? null : id));
  };

  return (
    <div className="absolute inset-0">
      {card.mounted ? (
        <button
          type="button"
          aria-label="Close detail"
          className={cn(
            "pdp-fade absolute inset-0 z-10",
            card.state === "open" ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setActiveId(null)}
        />
      ) : null}

      {hotspots.map((hotspot, index) => {
        const isActive = activeId === hotspot.id;
        const staggerDelay = `${index * 0.45}s`;
        const ringColor = HOTSPOT_RING_COLORS[index % HOTSPOT_RING_COLORS.length];

        return (
          <div
            key={hotspot.id}
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
          >
            <button
              type="button"
              aria-expanded={isActive}
              aria-label={`${hotspot.title} — tap for details`}
              onClick={(event) => {
                event.stopPropagation();
                handleToggle(hotspot.id);
              }}
              className={cn(
                "relative flex size-14 items-center justify-center transition-[opacity,scale] duration-200 ease-out",
                isActive && "pointer-events-none scale-75 opacity-0",
              )}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute size-10 rounded-full border-2 animate-hotspot-ring-ripple"
                style={{
                  borderColor: ringColor,
                  animationDelay: staggerDelay,
                }}
              />
              <span
                aria-hidden
                className="pointer-events-none absolute size-9 rounded-full border-2 animate-hotspot-pulse"
                style={{
                  borderColor: ringColor,
                  animationDelay: staggerDelay,
                }}
              />
              <span
                aria-hidden
                className="relative size-5 rounded-full border-2 border-white bg-white"
              />
            </button>
          </div>
        );
      })}

      {card.mounted && cardHotspot ? (
        <div
          className="pointer-events-none absolute z-30 w-[min(13.5rem,calc(100%-1.5rem))]"
          style={{
            left: `${getCardLeftPercent(cardHotspot.x)}%`,
            top: `${cardHotspot.y}%`,
            transform: getCardTransform(cardHotspot.y),
          }}
        >
          <div
            className="pdp-pop rounded-lg border border-white/50 bg-white/90 px-2.5 py-2 shadow-[0_4px_20px_rgba(0,0,0,0.1)] backdrop-blur-md"
            data-state={card.state}
          >
            <p className={`font-extended text-[13px] text-black ${pdpBodyRhythm}`}>
              {cardHotspot.title}
            </p>
            <p className={`mt-0.5 font-extended text-[11px] text-neutral-600 ${pdpBodyRhythm}`}>
              {cardHotspot.body}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
