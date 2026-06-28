"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import {
  PdpHeroArGlyph,
  PdpHeroBookmarkGlyph,
  PdpHeroCommentGlyph,
  PdpHeroLikeGlyph,
} from "@/components/icons/pdp-hero-glyphs";
import { cn } from "@/lib/cn";

import { PDP_COMMENTS_SUMMARY, PDP_LIKE_SUMMARY, PDP_SAVE_SUMMARY } from "./pdp-data";
import { heroActionRailOffset } from "./pdp-viewport-chrome";
import { pdpPressableIconClass } from "./pdp-type";
import { PdpToast } from "./pdp-toast";
import { PdpIconSwap } from "./pdp-icon-swap";
import {
  isHeroUiChromeVisible,
  useHeroUiChrome,
} from "./use-hero-ui-chrome";
import { useHeroEnterOnce } from "./use-hero-enter-once";
import { useReducedMotion } from "./use-reduced-motion";

const LIKE_RED = "#FE2C55";

/**
 * Tight dark halo around each white glyph — first line of defense so the icons
 * read even before the soft rail scrim. A hard 1px + a small blur keeps edges
 * crisp on busy or bright media.
 */
const RAIL_GLYPH_SHADOW =
  "[filter:drop-shadow(0_0_1px_rgba(0,0,0,0.55))_drop-shadow(0_1px_3px_rgba(0,0,0,0.45))]";

const BURST_DURATION_MS = 1700;
const BURST_EASING = "cubic-bezier(0.22, 0.92, 0.24, 1)";
const RAIL_ICON_SIZE = 26;
const STATIC_PILL_ICON_SIZE = 20;

const STATIC_SOCIAL_PILL_CLASS = cn(
  "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-[#f5f5f5] px-3.5 text-neutral-900 transition-colors active:bg-[#ececec]",
  pdpPressableIconClass,
);

const STATIC_SOCIAL_PILL_LABEL_CLASS =
  "font-extended text-[13px] font-normal leading-none tracking-[0.2px]";

/** Upward-floating hearts — rise distance, horizontal sway, spin, stagger */
const HEART_BURST_PARTICLES = [
  { rise: 78, sway: -12, size: 14, delay: 0, spin: -14 },
  { rise: 96, sway: 14, size: 12, delay: 60, spin: 16 },
  { rise: 64, sway: -8, size: 11, delay: 105, spin: -10 },
  { rise: 108, sway: 10, size: 10, delay: 40, spin: 12 },
  { rise: 88, sway: -18, size: 12, delay: 140, spin: -16 },
  { rise: 72, sway: 8, size: 9, delay: 85, spin: 10 },
  { rise: 112, sway: -6, size: 10, delay: 170, spin: -8 },
  { rise: 58, sway: 16, size: 8, delay: 195, spin: 18 },
  { rise: 102, sway: -14, size: 11, delay: 125, spin: -12 },
  { rise: 84, sway: 6, size: 9, delay: 220, spin: 8 },
] as const;

type HeartBurstParticleProps = {
  rise: number;
  sway: number;
  size: number;
  delay: number;
  spin: number;
};

function HeartBurstParticle({ rise, sway, size, delay, spin }: HeartBurstParticleProps) {
  const particleRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const particle = particleRef.current;
    if (!particle || reducedMotion) {
      return;
    }

    const animation = particle.animate(
      [
        {
          transform: "translate(-50%, -50%) scale(0.35) rotate(0deg)",
          opacity: 0.85,
          offset: 0,
        },
        {
          transform: `translate(calc(-50% + ${sway * 0.35}px), calc(-50% + 2px)) scale(1.15) rotate(${spin * 0.25}deg)`,
          opacity: 1,
          offset: 0.18,
        },
        {
          transform: `translate(calc(-50% + ${sway}px), calc(-50% - ${rise}px)) scale(0.55) rotate(${spin}deg)`,
          opacity: 0,
          offset: 1,
        },
      ],
      {
        duration: BURST_DURATION_MS,
        delay,
        easing: BURST_EASING,
        fill: "forwards",
      },
    );

    return () => {
      animation.cancel();
    };
  }, [delay, rise, sway, spin, reducedMotion]);

  return (
    <span
      ref={particleRef}
      className="pointer-events-none absolute left-1/2 top-[54%] will-change-transform"
      style={{ color: LIKE_RED } as React.CSSProperties}
    >
      <PdpHeroLikeGlyph
        filled
        size={size}
        className="text-[#FE2C55]"
      />
    </span>
  );
}

type RailActionProps = {
  label: string;
  ariaLabel?: string;
  onClick?: () => void;
  pressed?: boolean;
  className?: string;
  icon: ReactNode;
};

function RailAction({
  icon,
  label,
  ariaLabel,
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
      {icon}
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
  const reducedMotion = useReducedMotion();

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
    if (!liked && !reducedMotion) {
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
            className="pointer-events-none absolute inset-0 overflow-visible"
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
        <PdpIconSwap
          active={liked}
          activeIcon={
            <PdpHeroLikeGlyph
              filled
              size={RAIL_ICON_SIZE}
              className={cn(
                "relative z-10 text-[#FE2C55]",
                bursting && !reducedMotion && "motion-safe:animate-heart-pop",
              )}
            />
          }
          inactiveIcon={
            <PdpHeroLikeGlyph
              size={RAIL_ICON_SIZE}
              className="relative z-10 text-white"
            />
          }
        />
      </span>
      <span className="font-extended text-[11px] leading-none tracking-[0.2px] text-white">
        {label}
      </span>
    </button>
  );
}

/** TikTok-style action rail — hero image only */
export function PdpHeroActionRail({
  onOpenReviews,
  onOpenArTryOn,
}: {
  onOpenReviews?: () => void;
  onOpenArTryOn?: () => void;
}) {
  const { opacity } = useHeroUiChrome();
  const visible = isHeroUiChromeVisible(opacity);
  const playHeroEnter = useHeroEnterOnce();
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
      className={cn(
        "pdp-hero-ui-chrome absolute z-20 flex flex-col items-center gap-4",
        RAIL_GLYPH_SHADOW,
      )}
      style={{
        right: "calc(0.5rem + var(--hero-inset, calc(var(--hero-reveal, 0) * 8px)))",
        bottom: heroActionRailOffset(),
        visibility: visible ? "visible" : "hidden",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      {/* Soft contrast bed — guarantees the white glyphs read on any backdrop
          (bright photos, light video frames) without flipping colors. */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[118%] w-[150%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/22 blur-2xl"
      />
      <LikeRailAction
        className={cn(playHeroEnter && "pdp-social-rail-item")}
        label={PDP_LIKE_SUMMARY.label}
        ariaLabel={`Like, ${PDP_LIKE_SUMMARY.label} likes`}
        liked={liked}
        onToggle={() => setLiked((prev) => !prev)}
      />
      <RailAction
        className={cn(playHeroEnter && "pdp-social-rail-item")}
        icon={<PdpHeroCommentGlyph size={RAIL_ICON_SIZE} className="text-white" />}
        label={PDP_COMMENTS_SUMMARY.label}
        ariaLabel={`Reviews, ${PDP_COMMENTS_SUMMARY.label} reviews`}
        onClick={onOpenReviews}
      />
      <RailAction
        className={cn(playHeroEnter && "pdp-social-rail-item")}
        icon={
          <PdpIconSwap
            active={saved}
            activeIcon={
              <PdpHeroBookmarkGlyph
                saved
                size={RAIL_ICON_SIZE}
                className="text-white"
              />
            }
            inactiveIcon={
              <PdpHeroBookmarkGlyph size={RAIL_ICON_SIZE} className="text-white" />
            }
          />
        }
        label={PDP_SAVE_SUMMARY.label}
        ariaLabel={`Save, ${PDP_SAVE_SUMMARY.label} saves`}
        pressed={saved}
        onClick={handleSave}
      />
      {onOpenArTryOn ? (
        <RailAction
          className={cn("mt-4", playHeroEnter && "pdp-social-rail-item")}
          icon={<PdpHeroArGlyph size={RAIL_ICON_SIZE} className="text-white" />}
          label="Try On"
          ariaLabel="Try on with AI"
          onClick={onOpenArTryOn}
        />
      ) : null}
    </div>
    <PdpToast
      message="Saved to your bookmarks"
      open={saveToastOpen}
      onClose={() => setSaveToastOpen(false)}
    />
    </>
  );
}

/** Horizontal social row — static hero product summary */
function StaticActionRowTrack({
  liked,
  saved,
  onToggleLike,
  onOpenReviews,
  onToggleSave,
  onOpenArTryOn,
}: {
  liked: boolean;
  saved: boolean;
  onToggleLike: () => void;
  onOpenReviews?: () => void;
  onToggleSave: () => void;
  onOpenArTryOn?: () => void;
}) {
  return (
    <div className="-mx-3 overflow-x-auto px-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex w-max items-center gap-2">
        <button
          type="button"
          aria-label={`Like, ${PDP_LIKE_SUMMARY.label} likes`}
          aria-pressed={liked}
          onClick={onToggleLike}
          className={STATIC_SOCIAL_PILL_CLASS}
        >
          <PdpIconSwap
            active={liked}
            activeIcon={
              <PdpHeroLikeGlyph
                filled
                size={STATIC_PILL_ICON_SIZE}
                className="text-[#FE2C55]"
              />
            }
            inactiveIcon={
              <PdpHeroLikeGlyph size={STATIC_PILL_ICON_SIZE} />
            }
          />
          <span className={STATIC_SOCIAL_PILL_LABEL_CLASS}>
            {PDP_LIKE_SUMMARY.label}
          </span>
        </button>

        <button
          type="button"
          aria-label={`Reviews, ${PDP_COMMENTS_SUMMARY.label} reviews`}
          onClick={onOpenReviews}
          className={STATIC_SOCIAL_PILL_CLASS}
        >
          <PdpHeroCommentGlyph size={STATIC_PILL_ICON_SIZE} />
          <span className={STATIC_SOCIAL_PILL_LABEL_CLASS}>
            {PDP_COMMENTS_SUMMARY.label}
          </span>
        </button>

        <button
          type="button"
          aria-label={`Save, ${PDP_SAVE_SUMMARY.label} saves`}
          aria-pressed={saved}
          onClick={onToggleSave}
          className={STATIC_SOCIAL_PILL_CLASS}
        >
          <PdpIconSwap
            active={saved}
            activeIcon={
              <PdpHeroBookmarkGlyph saved size={STATIC_PILL_ICON_SIZE} />
            }
            inactiveIcon={<PdpHeroBookmarkGlyph size={STATIC_PILL_ICON_SIZE} />}
          />
          <span className={STATIC_SOCIAL_PILL_LABEL_CLASS}>
            {PDP_SAVE_SUMMARY.label}
          </span>
        </button>

        {onOpenArTryOn ? (
          <button
            type="button"
            aria-label="Try on with AI"
            onClick={onOpenArTryOn}
            className={STATIC_SOCIAL_PILL_CLASS}
          >
            <PdpHeroArGlyph size={STATIC_PILL_ICON_SIZE} />
            <span className={STATIC_SOCIAL_PILL_LABEL_CLASS}>Try On</span>
          </button>
        ) : null}
      </div>
    </div>
  );
}

/** Horizontal social row — static hero product summary */
export function PdpStaticActionRow({
  onOpenReviews,
  onOpenArTryOn,
}: {
  onOpenReviews?: () => void;
  onOpenArTryOn?: () => void;
}) {
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
      <StaticActionRowTrack
        liked={liked}
        saved={saved}
        onToggleLike={() => setLiked((prev) => !prev)}
        onOpenReviews={onOpenReviews}
        onToggleSave={handleSave}
        onOpenArTryOn={onOpenArTryOn}
      />
      <PdpToast
        message="Saved to your bookmarks"
        open={saveToastOpen}
        onClose={() => setSaveToastOpen(false)}
      />
    </>
  );
}
