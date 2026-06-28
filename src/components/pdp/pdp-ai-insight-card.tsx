import type { ReactNode } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { PdpExpandableText } from "./pdp-expandable-text";
import { pdpPressableClass } from "./pdp-type";

export type PdpAiInsightContentProps = {
  title?: string;
  body: string;
  eyebrow?: string;
  /** Eyebrow placement — reviews attribution sits below the summary paragraph */
  eyebrowPosition?: "above" | "below";
  className?: string;
  showIcon?: boolean;
  iconVariant?: "default" | "compact";
  size?: "default" | "compact" | "xs";
  /** Collapse the body to this many lines with a Read more toggle */
  clampBodyLines?: number;
};

/** Shared icon + title + body row for AI insight callouts */
// fallow-ignore-next-line complexity
export function PdpAiInsightContent({
  title,
  body,
  eyebrow,
  eyebrowPosition = "above",
  className,
  showIcon = true,
  iconVariant = "default",
  size = "default",
  clampBodyLines,
}: PdpAiInsightContentProps) {
  const compact = size === "compact" || size === "xs";
  const extraSmall = size === "xs";
  const compactIcon = iconVariant === "compact" || extraSmall;

  const bodyClass = cn(
    "font-extended tracking-[0.2px] text-neutral-600",
    extraSmall
      ? "mt-1 text-[11px] leading-[1.35]"
      : compact
        ? "mt-1.5 text-sm leading-[1.35]"
        : "mt-2 text-base leading-[1.35]",
  );

  const eyebrowEl = eyebrow ? (
    <p
      className={cn(
        "font-extended tracking-[0.2px] text-neutral-500",
        extraSmall ? "text-[10px]" : "text-xs",
      )}
    >
      {eyebrow}
    </p>
  ) : null;

  return (
    <div
      className={cn(
        "flex items-start",
        showIcon ? (extraSmall ? "gap-2" : "gap-3") : "gap-0",
        className,
      )}
    >
      {showIcon ? (
        <span
          className={cn(
            "flex shrink-0 items-center justify-center rounded-full bg-black text-white",
            extraSmall ? "size-7" : compactIcon ? "size-8" : "size-10",
          )}
          aria-hidden
        >
          <MaterialIcon
            name="auto_awesome"
            size={compactIcon ? 18 : 20}
            className="text-white"
          />
        </span>
      ) : null}
      <div className="min-w-0 flex-1">
        {eyebrowPosition === "above" ? eyebrowEl : null}
        {title ? (
          <p
            className={cn(
              "font-extended leading-[1.35] tracking-[0.2px] text-black",
              extraSmall ? "text-xs" : compact ? "text-sm" : "text-base",
              eyebrow && eyebrowPosition === "above" && "mt-0.5",
            )}
          >
            {title}
          </p>
        ) : null}
        {clampBodyLines ? (
          <PdpExpandableText
            text={body}
            className={bodyClass}
            clampLines={clampBodyLines}
          />
        ) : (
          <p className={bodyClass}>{body}</p>
        )}
        {eyebrowPosition === "below" ? (
          <div className={cn(extraSmall ? "mt-1.5" : compact ? "mt-2" : "mt-2.5")}>
            {eyebrowEl}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export type PdpAiInsightCardProps = PdpAiInsightContentProps & {
  onDismiss?: () => void;
  dismissLabel?: string;
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
  /** polite for live recommendations */
  ariaLive?: "polite" | "off";
  variant?: "card" | "minimal";
  /** Minimal only — compact callout; pair with containedSurface for flat grey vs elevated white */
  contained?: boolean;
  containedSurface?: "elevated" | "flat";
};

/** White insight card — browsing nudges, compare tips, reviews summary, etc. */
// fallow-ignore-next-line complexity
export function PdpAiInsightCard({
  title,
  body,
  eyebrow,
  eyebrowPosition,
  onDismiss,
  dismissLabel = "Dismiss recommendation",
  footer,
  children,
  className,
  ariaLive = "off",
  showIcon = true,
  size = "default",
  variant = "card",
  contained = false,
  containedSurface = "elevated",
  clampBodyLines,
}: PdpAiInsightCardProps) {
  const minimal = variant === "minimal";
  const extraSmall = size === "xs";

  return (
    <div
      className={cn(
        "relative",
        minimal
          ? contained
            ? cn(
                "rounded-lg",
                containedSurface === "flat"
                  ? "bg-neutral-50"
                  : "bg-white shadow-sm",
                extraSmall ? "px-3 py-2.5" : "px-3.5 py-3",
                onDismiss && (extraSmall ? "pr-8" : "pr-9"),
              )
            : "px-0 py-0"
          : cn(
              "rounded-lg bg-white shadow-sm",
              extraSmall ? "px-3 py-2.5" : "rounded-xl px-4 py-4",
              onDismiss && (extraSmall ? "pr-8" : "pr-10"),
            ),
        className,
      )}
      aria-live={ariaLive === "polite" ? "polite" : undefined}
    >
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label={dismissLabel}
          className={cn(
            "absolute flex items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 active:bg-neutral-100",
            pdpPressableClass,
            minimal
              ? contained
                ? extraSmall
                  ? "right-1 top-1 size-6"
                  : "right-1.5 top-1.5 size-7"
                : "right-0 top-0 size-6"
              : extraSmall
                ? "right-1.5 top-1.5 size-6"
                : "right-2 top-2 size-8",
          )}
        >
          <MaterialIcon name="close" size={18} />
        </button>
      ) : null}

      <PdpAiInsightContent
        title={title}
        body={body}
        eyebrow={eyebrow}
        eyebrowPosition={eyebrowPosition}
        showIcon={minimal ? (contained ? showIcon : false) : showIcon}
        iconVariant={minimal && contained && !extraSmall ? "compact" : "default"}
        size={minimal ? (size === "default" ? "compact" : size) : size}
        clampBodyLines={clampBodyLines}
      />

      {footer ? (
        <div
          className={cn(
            extraSmall ? "mt-1.5" : minimal ? "mt-2" : "mt-3",
            showIcon && !minimal && !extraSmall && "pl-[calc(2.5rem+0.75rem)]",
            showIcon && !minimal && extraSmall && "pl-[calc(1.75rem+0.5rem)]",
          )}
        >
          {footer}
        </div>
      ) : null}

      {children}
    </div>
  );
}
