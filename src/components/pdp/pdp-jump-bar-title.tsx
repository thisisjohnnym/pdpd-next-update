"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";

import { useReducedMotion } from "./use-reduced-motion";

type PdpJumpBarTitleProps = {
  labels: string[];
  activeIndex: number;
  className?: string;
};

type AnimPhase = "idle" | "animating";

/**
 * Single-line section title with vertical push on chapter change.
 * Outgoing label fades/blurs as it exits the clip.
 */
export function PdpJumpBarTitle({
  labels,
  activeIndex,
  className,
}: PdpJumpBarTitleProps) {
  const reducedMotion = useReducedMotion();
  const [displayIndex, setDisplayIndex] = useState(activeIndex);
  const [phase, setPhase] = useState<AnimPhase>("idle");
  const [offsetPercent, setOffsetPercent] = useState(0);
  const [motionActive, setMotionActive] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const hasMountedRef = useRef(false);

  const animating = phase === "animating";
  const pushDown = activeIndex > displayIndex;

  const outgoingLabel = labels[displayIndex] ?? "";
  const incomingLabel = labels[activeIndex] ?? outgoingLabel;

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      setDisplayIndex(activeIndex);
      return;
    }

    if (activeIndex === displayIndex) {
      return;
    }

    if (reducedMotion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- snap label when motion is off
      setDisplayIndex(activeIndex);
      setPhase("idle");
      setOffsetPercent(0);
      setMotionActive(false);
      return;
    }

    const goingDown = activeIndex > displayIndex;
    setPhase("animating");
    setMotionActive(false);
    setOffsetPercent(goingDown ? -100 : 0);

    const startFrame = requestAnimationFrame(() => {
      setMotionActive(true);
      setOffsetPercent(goingDown ? 0 : -100);
    });

    return () => {
      cancelAnimationFrame(startFrame);
    };
  }, [activeIndex, displayIndex, reducedMotion]);

  const handleTransitionEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
    if (event.target !== trackRef.current || event.propertyName !== "transform") {
      return;
    }

    if (phase !== "animating") {
      return;
    }

    setDisplayIndex(activeIndex);
    setPhase("idle");
    setOffsetPercent(0);
    setMotionActive(false);
  };

  const currentLabel = labels[displayIndex] ?? "";

  return (
    <span
      className={cn("pdp-jump-bar-title", className)}
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="pdp-jump-bar-title__clip">
        <span
          ref={trackRef}
          className={cn(
            "pdp-jump-bar-title__track",
            animating && motionActive && "pdp-jump-bar-title__track--animating",
          )}
          style={{ transform: `translateY(${offsetPercent}%)` }}
          onTransitionEnd={handleTransitionEnd}
        >
          {animating ? (
            pushDown ? (
              <>
                <span
                  className={cn(
                    "pdp-jump-bar-title__label font-extended text-[13px] font-normal tracking-[0.2px] text-black",
                    "pdp-jump-bar-title__label--incoming",
                    motionActive && "pdp-jump-bar-title__label--incoming-active",
                  )}
                >
                  {incomingLabel}
                </span>
                <span
                  className={cn(
                    "pdp-jump-bar-title__label font-extended text-[13px] font-normal tracking-[0.2px] text-black",
                    "pdp-jump-bar-title__label--outgoing",
                    motionActive && "pdp-jump-bar-title__label--outgoing-active",
                  )}
                >
                  {outgoingLabel}
                </span>
              </>
            ) : (
              <>
                <span
                  className={cn(
                    "pdp-jump-bar-title__label font-extended text-[13px] font-normal tracking-[0.2px] text-black",
                    "pdp-jump-bar-title__label--outgoing",
                    motionActive && "pdp-jump-bar-title__label--outgoing-active",
                  )}
                >
                  {outgoingLabel}
                </span>
                <span
                  className={cn(
                    "pdp-jump-bar-title__label font-extended text-[13px] font-normal tracking-[0.2px] text-black",
                    "pdp-jump-bar-title__label--incoming",
                    motionActive && "pdp-jump-bar-title__label--incoming-active",
                  )}
                >
                  {incomingLabel}
                </span>
              </>
            )
          ) : (
            <span className="pdp-jump-bar-title__label font-extended text-[13px] font-normal tracking-[0.2px] text-black">
              {currentLabel}
            </span>
          )}
        </span>
      </span>
      <span className="sr-only">{labels[activeIndex]}</span>
    </span>
  );
}
