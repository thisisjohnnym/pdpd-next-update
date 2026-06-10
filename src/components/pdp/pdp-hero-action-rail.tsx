"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { PDP_COMMENTS_SUMMARY, PDP_LIKE_SUMMARY, PDP_SAVE_SUMMARY } from "./pdp-data";
import { BOTTOM_CTA_OFFSET } from "./pdp-gallery-view";
import { PdpToast } from "./pdp-toast";
import {
  isHeroOverlayVisible,
  useHeroScrollOpacity,
} from "./use-hero-scroll-opacity";

const LIKE_RED = "#FE2C55";
const BURST_DURATION_MS = 650;
const RAIL_ICON_SIZE = 28;

function railIconStyle(filled = false): CSSProperties {
  return {
    fontSize: RAIL_ICON_SIZE,
    fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' ${RAIL_ICON_SIZE}`,
  };
}

const HEART_BURST_PARTICLES = [
  { angle: -90, distance: 32, size: 13, delay: 0 },
  { angle: -135, distance: 36, size: 11, delay: 30 },
  { angle: -45, distance: 36, size: 11, delay: 50 },
  { angle: 180, distance: 30, size: 10, delay: 20 },
  { angle: 0, distance: 30, size: 10, delay: 40 },
  { angle: -110, distance: 40, size: 9, delay: 60 },
  { angle: -70, distance: 40, size: 9, delay: 70 },
  { angle: -160, distance: 34, size: 8, delay: 80 },
] as const;

type HeartBurstParticleProps = {
  x: number;
  y: number;
  size: number;
  delay: number;
};

function HeartBurstParticle({ x, y, size, delay }: HeartBurstParticleProps) {
  const particleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const particle = particleRef.current;
    if (!particle) {
      return;
    }

    const animation = particle.animate(
      [
        {
          transform: "translate(-50%, -50%) scale(0.35)",
          opacity: 1,
        },
        {
          transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1)`,
          opacity: 0,
        },
      ],
      {
        duration: BURST_DURATION_MS,
        delay,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "forwards",
      },
    );

    return () => {
      animation.cancel();
    };
  }, [delay, x, y]);

  return (
    <span
      ref={particleRef}
      className="pointer-events-none absolute left-1/2 top-1/2"
      style={{ color: LIKE_RED } as CSSProperties}
    >
      <MaterialIcon
        name="favorite"
        size={18}
        className="text-[#FE2C55]"
        style={{ fontSize: size }}
      />
    </span>
  );
}

type RailActionProps = {
  icon: string;
  label: string;
  ariaLabel?: string;
  filled?: boolean;
  iconClassName?: string;
  onClick?: () => void;
  pressed?: boolean;
};

function RailAction({
  icon,
  label,
  ariaLabel,
  filled = false,
  iconClassName,
  onClick,
  pressed,
}: RailActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel ?? label}
      aria-pressed={pressed}
      className="flex flex-col items-center gap-1 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)]"
    >
      <MaterialIcon
        name={icon}
        size={26}
        filled={filled}
        style={railIconStyle(filled)}
        className={cn("text-white", iconClassName)}
      />
      <span className="font-extended text-[11px] leading-none tracking-[0.2px]">
        {label}
      </span>
    </button>
  );
}

type LikeRailActionProps = {
  label: string;
  ariaLabel: string;
  liked: boolean;
  onToggle: () => void;
};

function LikeRailAction({ label, ariaLabel, liked, onToggle }: LikeRailActionProps) {
  const [bursting, setBursting] = useState(false);
  const [burstKey, setBurstKey] = useState(0);

  useEffect(() => {
    if (!bursting) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setBursting(false);
    }, BURST_DURATION_MS + 120);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [bursting]);

  const handleClick = () => {
    if (!liked) {
      setBurstKey((key) => key + 1);
      setBursting(true);
    }
    onToggle();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={ariaLabel}
      aria-pressed={liked}
      className="flex flex-col items-center gap-1 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)]"
    >
      <span className="relative flex size-7 items-center justify-center overflow-visible">
        {bursting ? (
          <span
            key={burstKey}
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-visible"
          >
            {HEART_BURST_PARTICLES.map((particle, index) => {
              const rad = (particle.angle * Math.PI) / 180;
              const x = Math.cos(rad) * particle.distance;
              const y = Math.sin(rad) * particle.distance;

              return (
                <HeartBurstParticle
                  key={`${burstKey}-${index}`}
                  x={x}
                  y={y}
                  size={particle.size}
                  delay={particle.delay}
                />
              );
            })}
          </span>
        ) : null}
        <MaterialIcon
          name="favorite"
          size={26}
          filled={liked}
          style={railIconStyle(liked)}
          className={cn(
            "relative z-10 transition-colors duration-200",
            liked ? "text-[#FE2C55]" : "text-white",
            bursting && "animate-heart-pop",
          )}
        />
      </span>
      <span className="font-extended text-[11px] leading-none tracking-[0.2px]">
        {label}
      </span>
    </button>
  );
}

/** TikTok-style action rail — hero image only */
export function PdpHeroActionRail({ onOpenReviews }: { onOpenReviews?: () => void }) {
  const opacity = useHeroScrollOpacity();
  const visible = isHeroOverlayVisible(opacity);
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saveToastOpen, setSaveToastOpen] = useState(false);

  const handleSave = () => {
    setSaved((prev) => {
      if (!prev) {
        setSaveToastOpen(true);
      }
      return !prev;
    });
  };

  return (
    <>
    <div
      className="absolute right-3 z-20 flex flex-col items-center gap-5"
      style={{
        bottom: `calc(${BOTTOM_CTA_OFFSET} + 5.5rem)`,
        opacity,
        visibility: visible ? "visible" : "hidden",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <LikeRailAction
        label={PDP_LIKE_SUMMARY.label}
        ariaLabel={`Like, ${PDP_LIKE_SUMMARY.label} likes`}
        liked={liked}
        onToggle={() => setLiked((prev) => !prev)}
      />
      <RailAction
        icon="chat_bubble"
        label={PDP_COMMENTS_SUMMARY.label}
        ariaLabel={`Comments, ${PDP_COMMENTS_SUMMARY.label} comments`}
        onClick={onOpenReviews}
      />
      <RailAction
        icon="bookmark"
        label={PDP_SAVE_SUMMARY.label}
        ariaLabel={`Save, ${PDP_SAVE_SUMMARY.label} saves`}
        filled={saved}
        pressed={saved}
        onClick={handleSave}
      />
    </div>
    <PdpToast
      message="Saved to your wishlist"
      open={saveToastOpen}
      onClose={() => setSaveToastOpen(false)}
    />
    </>
  );
}
