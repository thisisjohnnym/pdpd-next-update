"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { PdpRevealItem } from "../pdp-reveal-item";
import { pdpPressableClass, pdpType } from "../pdp-type";
import { useReducedMotion } from "../use-reduced-motion";
import { revealStaggerDelay } from "../use-pdp-element-reveal";

import type { PdpWaysToWearStyle } from "./pdp-data-v2";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

const LEFT_POSITION = 72;
const RIGHT_POSITION = 28;

/** Drag-to-reveal compare — left vs right still (aging New / 2 years on v5). */
export function PdpV5WaysToWearCompareSlider({
  styles,
  leftAlign,
  tablistLabel = "Compare options",
  sliderLabel = "Compare left and right views",
}: {
  styles: [PdpWaysToWearStyle, PdpWaysToWearStyle];
  leftAlign: boolean;
  tablistLabel?: string;
  sliderLabel?: string;
}) {
  const [leftStyle, rightStyle] = styles;
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);

  const activeStyle = position >= 50 ? leftStyle : rightStyle;

  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const rect = container.getBoundingClientRect();
    if (rect.width <= 0) {
      return;
    }

    const next = clamp(((clientX - rect.left) / rect.width) * 100, 4, 96);
    setPosition(next);
  }, []);

  const snapToStyle = (styleId: string) => {
    setPosition(styleId === leftStyle.id ? LEFT_POSITION : RIGHT_POSITION);
  };

  return (
    <PdpRevealItem delay={revealStaggerDelay(2)} className="flex w-full flex-col gap-3">
      <div
        role="tablist"
        aria-label={tablistLabel}
        className={cn(
          "flex flex-wrap gap-x-4 gap-y-2",
          leftAlign ? "justify-start" : "justify-center",
        )}
      >
        {styles.map((style) => {
          const active = activeStyle.id === style.id;

          return (
            <button
              key={style.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => snapToStyle(style.id)}
              className={cn(
                "font-extended m-0 border-0 bg-transparent p-0 transition-colors",
                pdpType.label,
                pdpPressableClass,
                active
                  ? "text-black underline decoration-black underline-offset-[3px]"
                  : "text-neutral-400 active:text-neutral-600",
              )}
            >
              {style.label}
            </button>
          );
        })}
      </div>

      <div
        ref={containerRef}
        role="slider"
        tabIndex={0}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        aria-valuetext={activeStyle.label}
        aria-label={sliderLabel}
        className={cn(
          "relative aspect-[4/5] w-full touch-none select-none overflow-hidden bg-neutral-100",
          dragging ? "cursor-ew-resize" : "cursor-col-resize",
        )}
        onPointerDown={(event) => {
          event.preventDefault();
          containerRef.current?.setPointerCapture(event.pointerId);
          setDragging(true);
          updatePosition(event.clientX);
        }}
        onPointerMove={(event) => {
          if (!dragging) {
            return;
          }

          updatePosition(event.clientX);
        }}
        onPointerUp={(event) => {
          setDragging(false);
          if (containerRef.current?.hasPointerCapture(event.pointerId)) {
            containerRef.current.releasePointerCapture(event.pointerId);
          }
        }}
        onPointerCancel={(event) => {
          setDragging(false);
          if (containerRef.current?.hasPointerCapture(event.pointerId)) {
            containerRef.current.releasePointerCapture(event.pointerId);
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
            event.preventDefault();
            setPosition((current) => clamp(current - 5, 4, 96));
          }

          if (event.key === "ArrowRight" || event.key === "ArrowUp") {
            event.preventDefault();
            setPosition((current) => clamp(current + 5, 4, 96));
          }

          if (event.key === "Home") {
            event.preventDefault();
            snapToStyle(leftStyle.id);
          }

          if (event.key === "End") {
            event.preventDefault();
            snapToStyle(rightStyle.id);
          }
        }}
      >
        <Image
          src={rightStyle.src}
          alt={rightStyle.alt}
          fill
          className="object-cover object-center"
          sizes="(min-width: 1024px) 960px, 100vw"
          draggable={false}
        />

        <div
          className={cn(
            "absolute inset-0",
            !dragging &&
              !reducedMotion &&
              "transition-[clip-path] duration-300 ease-out",
          )}
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <Image
            src={leftStyle.src}
            alt={leftStyle.alt}
            fill
            className="object-cover object-center"
            sizes="(min-width: 1024px) 960px, 100vw"
            draggable={false}
          />
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 z-[2] w-px -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)]"
          style={{ left: `${position}%` }}
        >
          <div className="absolute top-1/2 left-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.12)]">
            <MaterialIcon
              name="drag_indicator"
              size={18}
              className="text-neutral-700"
            />
          </div>
        </div>
      </div>

      <p
        className={cn(
          "font-extended m-0 whitespace-nowrap text-neutral-500",
          pdpType.micro,
          leftAlign ? "text-left" : "text-center",
          !dragging && !reducedMotion && "transition-opacity duration-200",
        )}
      >
        {activeStyle.caption}
      </p>
    </PdpRevealItem>
  );
}
