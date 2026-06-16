"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { PDP_COMMENTS_SUMMARY, PDP_LIKE_SUMMARY, PDP_SAVE_SUMMARY } from "./pdp-data";
import { BOTTOM_CTA_OFFSET } from "./pdp-gallery-view";
import { pdpPressableIconClass } from "./pdp-type";
import { PdpToast } from "./pdp-toast";
import {
  isHeroOverlayVisible,
  useHeroScrollOpacity,
} from "./use-hero-scroll-opacity";

const LIKE_RED = "#FE2C55";
const BURST_DURATION_MS = 1050;
const RAIL_ICON_SIZE = 26;

/** Upward-floating hearts — rise distance, horizontal sway, spin, stagger */
const HEART_BURST_PARTICLES = [
  { rise: 78, sway: -12, size: 14, delay: 0, spin: -14 },
  { rise: 96, sway: 14, size: 12, delay: 40, spin: 16 },
  { rise: 64, sway: -8, size: 11, delay: 70, spin: -10 },
  { rise: 108, sway: 10, size: 10, delay: 25, spin: 12 },
  { rise: 88, sway: -18, size: 12, delay: 95, spin: -16 },
  { rise: 72, sway: 8, size: 9, delay: 55, spin: 10 },
  { rise: 112, sway: -6, size: 10, delay: 115, spin: -8 },
  { rise: 58, sway: 16, size: 8, delay: 130, spin: 18 },
  { rise: 102, sway: -14, size: 11, delay: 85, spin: -12 },
  { rise: 84, sway: 6, size: 9, delay: 150, spin: 8 },
] as const;

function railIconStyle(filled = false): CSSProperties {
  return {
    fontSize: RAIL_ICON_SIZE,
    fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' ${RAIL_ICON_SIZE}`,
  };
}

type HeartBurstParticleProps = {
  rise: number;
  sway: number;
  size: number;
  delay: number;
  spin: number;
};

function HeartBurstParticle({ rise, sway, size, delay, spin }: HeartBurstParticleProps) {
  const particleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const particle = particleRef.current;
    if (!particle) {
      return;
    }

    const animation = particle.animate(
      [
        {
          transform: "translate(-50%, -50%) scale(0.2) rotate(0deg)",
          opacity: 0,
        },
        {
          transform: `translate(calc(-50% + ${sway * 0.35}px), calc(-50% - 10px)) scale(1.25) rotate(${spin * 0.25}deg)`,
          opacity: 1,
        },
        {
          transform: `translate(calc(-50% + ${sway}px), calc(-50% - ${rise}px)) scale(0.55) rotate(${spin}deg)`,
          opacity: 0,
        },
      ],
      {
        duration: BURST_DURATION_MS,
        delay,
        easing: "cubic-bezier(0.18, 1.05, 0.32, 1)",
        fill: "forwards",
      },
    );

    return () => {
      animation.cancel();
    };
  }, [delay, rise, sway, spin]);

  return (
    <span
      ref={particleRef}
      className="pointer-events-none absolute left-1/2 top-1/2 will-change-transform"
      style={{ color: LIKE_RED } as CSSProperties}
    >
      <MaterialIcon
        name="favorite"
        size={18}
        filled
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
  className?: string;
};

function RailAction({
  icon,
  label,
  ariaLabel,
  filled = false,
  iconClassName,
  onClick,
  pressed,
  className,
}: RailActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel ?? label}
      aria-pressed={pressed}
      className={cn(
        "flex flex-col items-center gap-1 text-white",
        pdpPressableIconClass,
        className,
      )}
    >
      <MaterialIcon
        name={icon}
        size={RAIL_ICON_SIZE}
        filled={filled}
        style={railIconStyle(filled)}
        className={cn("text-white", iconClassName)}
      />
      <span className="font-extended text-[11px] leading-none tracking-[0.2px] text-white">
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
  className?: string;
};

function LikeRailAction({
  label,
  ariaLabel,
  liked,
  onToggle,
  className,
}: LikeRailActionProps) {
  const [bursting, setBursting] = useState(false);
  const [burstKey, setBurstKey] = useState(0);

  useEffect(() => {
    if (!bursting) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setBursting(false);
    }, BURST_DURATION_MS + 200);

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
      className={cn(
        "flex flex-col items-center gap-1 text-white",
        pdpPressableIconClass,
        className,
      )}
    >
      <span className="relative flex size-8 items-center justify-center overflow-visible">
        {bursting ? (
          <span
            key={burstKey}
            aria-hidden
            className="pointer-events-none absolute bottom-2 left-1/2 h-36 w-28 -translate-x-1/2 overflow-visible"
          >
            {HEART_BURST_PARTICLES.map((particle, index) => (
              <HeartBurstParticle
                key={`${burstKey}-${index}`}
                rise={particle.rise}
                sway={particle.sway}
                size={particle.size}
                delay={particle.delay}
                spin={particle.spin}
              />
            ))}
          </span>
        ) : null}
        <MaterialIcon
          name="favorite"
          size={RAIL_ICON_SIZE}
          filled={liked}
          style={railIconStyle(liked)}
          className={cn(
            "relative z-10 transition-colors duration-200",
            liked ? "text-[#FE2C55]" : "text-white",
            bursting && "animate-heart-pop",
          )}
        />
      </span>
      <span className="font-extended text-[11px] leading-none tracking-[0.2px] text-white">
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
      className="absolute right-2 z-20 flex flex-col items-center gap-4 [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.45))]"
      style={{
        bottom: `calc(${BOTTOM_CTA_OFFSET} + 5.5rem)`,
        opacity,
        visibility: visible ? "visible" : "hidden",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <LikeRailAction
        className="pdp-social-rail-item"
        label={PDP_LIKE_SUMMARY.label}
        ariaLabel={`Like, ${PDP_LIKE_SUMMARY.label} likes`}
        liked={liked}
        onToggle={() => setLiked((prev) => !prev)}
      />
      <RailAction
        className="pdp-social-rail-item"
        icon="chat_bubble"
        label={PDP_COMMENTS_SUMMARY.label}
        ariaLabel={`Comments, ${PDP_COMMENTS_SUMMARY.label} comments`}
        onClick={onOpenReviews}
      />
      <RailAction
        className="pdp-social-rail-item"
        icon="bookmark"
        label={PDP_SAVE_SUMMARY.label}
        ariaLabel={`Save, ${PDP_SAVE_SUMMARY.label} saves`}
        filled={saved}
        pressed={saved}
        onClick={handleSave}
      />
    </div>
    <PdpToast
      message="Saved to your bookmarks"
      open={saveToastOpen}
      onClose={() => setSaveToastOpen(false)}
    />
    </>
  );
}
