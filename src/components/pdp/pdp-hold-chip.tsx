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
type PdpHoldChipSize = "default" | "compact";

const RING_SIZE_BY_CHIP = {
  default: 34,
  compact: 28,
} as const;

const RING_STROKE_BY_CHIP = {
  default: 2.5,
  compact: 2,
} as const;

const ICON_SIZE_BY_CHIP = {
  default: 18,
  compact: 15,
} as const;

const LABEL_CLASS_BY_CHIP = {
  default: "text-[11px]",
  compact: "text-[10px]",
} as const;

const PILL_CLASS_BY_CHIP = {
  default: "gap-2 py-1.5 pl-1.5 pr-3.5",
  compact: "gap-1.5 py-1 pl-1 pr-2.5",
} as const;

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
  size: PdpHoldChipSize;
  /** Continuous fill 0..1 (e.g. weight lift). Takes precedence over `active`. */
  progress?: number;
  /** Time-based fill while held (e.g. zoom hold timer). Used when `progress` is undefined. */
  active: boolean;
  durationMs: number;
};

/** Circular progress ring with the gesture icon centered inside. */
// fallow-ignore-next-line complexity
function HoldRing({ icon, tone, size, progress, active, durationMs }: HoldRingProps) {
  const colors = RING_TONE[tone];
  const ringSize = RING_SIZE_BY_CHIP[size];
  const ringStroke = RING_STROKE_BY_CHIP[size];
  const ringRadius = (ringSize - ringStroke) / 2;
  const ringCircumference = 2 * Math.PI * ringRadius;
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
      : ringCircumference
    : ringCircumference * (1 - clamped);
  const engaged = timed ? active : clamped > 0;

  return (
    <span
      className="relative flex shrink-0 items-center justify-center"
      style={{ width: ringSize, height: ringSize }}
    >
      <svg
        width={ringSize}
        height={ringSize}
        viewBox={`0 0 ${ringSize} ${ringSize}`}
        className="absolute inset-0 -rotate-90"
      >
        <circle
          cx={ringSize / 2}
          cy={ringSize / 2}
          r={ringRadius}
          fill="none"
          stroke={colors.track}
          strokeWidth={ringStroke}
        />
        <circle
          cx={ringSize / 2}
          cy={ringSize / 2}
          r={ringRadius}
          fill="none"
          stroke={colors.arc}
          strokeWidth={ringStroke}
          strokeLinecap="round"
          strokeDasharray={ringCircumference}
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
        size={ICON_SIZE_BY_CHIP[size]}
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
  size?: PdpHoldChipSize;
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
  size = "default",
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
        "inline-flex select-none items-center rounded-full",
        PILL_CLASS_BY_CHIP[size],
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
        size={size}
        progress={progress}
        active={active}
        durationMs={durationMs}
      />
      <span className={cn("font-extended tracking-[0.2px]", LABEL_CLASS_BY_CHIP[size])}>
        {label}
      </span>
    </Tag>
  );
}
