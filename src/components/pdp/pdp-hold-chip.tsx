"use client";

import {
  useEffect,
  useState,
  type ComponentPropsWithoutRef,
  type ElementType,
} from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

/** Shared "press & hold to X" affordance — one pill, two surfaces (dark photo / light studio). */
type PdpHoldTone = "dark" | "light";

const RING_SIZE = 34;
const RING_STROKE = 2.5;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const RING_TONE = {
  dark: { track: "rgba(255,255,255,0.3)", arc: "#ffffff", icon: "text-white" },
  light: { track: "rgba(17,17,17,0.18)", arc: "#111111", icon: "text-neutral-900" },
} as const;

const CHIP_TONE = {
  dark: "border border-white/15 bg-black/45 text-white/95 backdrop-blur-md",
  light: "border border-black/10 bg-white/80 text-neutral-900 shadow-sm backdrop-blur-md",
} as const;

type HoldRingProps = {
  icon: string;
  tone: PdpHoldTone;
  /** Continuous fill 0..1 (e.g. weight lift). Takes precedence over `active`. */
  progress?: number;
  /** Time-based fill while held (e.g. zoom hold timer). Used when `progress` is undefined. */
  active: boolean;
  durationMs: number;
};

/** Circular progress ring with the gesture icon centered inside. */
// fallow-ignore-next-line complexity
function HoldRing({ icon, tone, progress, active, durationMs }: HoldRingProps) {
  const colors = RING_TONE[tone];
  const timed = progress === undefined;
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    if (!timed) {
      return;
    }
    if (!active) {
      setFilled(false);
      return;
    }
    const id = requestAnimationFrame(() => setFilled(true));
    return () => cancelAnimationFrame(id);
  }, [timed, active]);

  const clamped = Math.min(Math.max(progress ?? 0, 0), 1);
  const offset = timed
    ? filled
      ? 0
      : RING_CIRCUMFERENCE
    : RING_CIRCUMFERENCE * (1 - clamped);
  const engaged = timed ? active : clamped > 0;

  return (
    <span
      className="relative flex shrink-0 items-center justify-center"
      style={{ width: RING_SIZE, height: RING_SIZE }}
    >
      <svg
        width={RING_SIZE}
        height={RING_SIZE}
        viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
        className="absolute inset-0 -rotate-90"
      >
        <circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RING_RADIUS}
          fill="none"
          stroke={colors.track}
          strokeWidth={RING_STROKE}
        />
        <circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RING_RADIUS}
          fill="none"
          stroke={colors.arc}
          strokeWidth={RING_STROKE}
          strokeLinecap="round"
          strokeDasharray={RING_CIRCUMFERENCE}
          strokeDashoffset={offset}
          style={{
            transition: timed
              ? filled
                ? `stroke-dashoffset ${durationMs}ms linear`
                : "none"
              : "stroke-dashoffset 75ms linear",
          }}
        />
      </svg>
      <MaterialIcon
        name={icon}
        size={18}
        filled={engaged}
        className={cn(colors.icon, "transition-transform duration-150")}
        style={{ transform: engaged ? "scale(0.96)" : "scale(1)" }}
      />
    </span>
  );
}

type PdpHoldChipOwnProps = {
  icon: string;
  label: string;
  tone?: PdpHoldTone;
  /** Continuous fill 0..1 — pass for progress-driven holds. */
  progress?: number;
  /** Time-based fill while held — pass with `durationMs` when there's no continuous progress. */
  active?: boolean;
  durationMs?: number;
  /** Subtle press-in scale while the gesture is engaged. */
  pressed?: boolean;
  className?: string;
};

type PdpHoldChipProps<T extends ElementType> = { as?: T } & PdpHoldChipOwnProps &
  Omit<ComponentPropsWithoutRef<T>, keyof PdpHoldChipOwnProps | "as">;

/**
 * The canonical "hold to X" control. Renders a glassy pill with a progress ring
 * (icon inside) and an inline label. Polymorphic so callers can render it as a
 * <button> (zoom) or an interactive <div role="button"> (lift) while keeping a
 * single, consistent look across every press-and-hold moment.
 */
export function PdpHoldChip<T extends ElementType = "button">({
  as,
  icon,
  label,
  tone = "dark",
  progress,
  active = false,
  durationMs = 0,
  pressed = false,
  className,
  ...rest
}: PdpHoldChipProps<T>) {
  const Tag = as ?? "button";

  return (
    <Tag
      className={cn(
        "inline-flex select-none items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3.5",
        "transition-transform duration-150 active:scale-[0.96]",
        CHIP_TONE[tone],
        pressed && "scale-[1.04]",
        className,
      )}
      {...rest}
    >
      <HoldRing
        icon={icon}
        tone={tone}
        progress={progress}
        active={active}
        durationMs={durationMs}
      />
      <span className="font-extended text-[11px] tracking-[0.2px]">{label}</span>
    </Tag>
  );
}
