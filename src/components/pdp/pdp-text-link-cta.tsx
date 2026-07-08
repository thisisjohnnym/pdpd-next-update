import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import {
  pdpTextLinkCtaClass,
  pdpTextLinkCtaLabelClass,
  pdpTextLinkCtaMutedClass,
  pdpTextLinkCtaMutedLabelClass,
} from "./pdp-type";

type PdpTextLinkCtaBaseProps = {
  children: ReactNode;
  variant?: "primary" | "muted";
  className?: string;
  iconSize?: 18 | 24 | 26 | 20;
  /** Material Symbols glyph for the trailing arrow */
  icon?: string;
  /** Hide the trailing arrow icon */
  hideIcon?: boolean;
};

type PdpTextLinkCtaButtonProps = PdpTextLinkCtaBaseProps & {
  as?: "button";
} & ComponentPropsWithoutRef<"button">;

type PdpTextLinkCtaAnchorProps = PdpTextLinkCtaBaseProps & {
  as: "a";
} & ComponentPropsWithoutRef<"a">;

// fallow-ignore-next-line complexity
export function PdpTextLinkCta({
  children,
  variant = "primary",
  className,
  iconSize = 18,
  icon = "arrow_forward",
  hideIcon = false,
  as = "button",
  ...props
}: PdpTextLinkCtaButtonProps | PdpTextLinkCtaAnchorProps) {
  const isMuted = variant === "muted";
  const rootClass = cn(
    "group",
    isMuted ? pdpTextLinkCtaMutedClass : pdpTextLinkCtaClass,
    className,
  );
  const labelClass = isMuted ? pdpTextLinkCtaMutedLabelClass : pdpTextLinkCtaLabelClass;

  const content = (
    <>
      <span className={labelClass}>{children}</span>
      {!hideIcon ? (
        <MaterialIcon name={icon} size={iconSize} className="shrink-0 text-current" />
      ) : null}
    </>
  );

  if (as === "a") {
    const anchorProps = props as ComponentPropsWithoutRef<"a">;

    return (
      <a className={rootClass} {...anchorProps}>
        {content}
      </a>
    );
  }

  const buttonProps = props as ComponentPropsWithoutRef<"button">;

  return (
    <button type="button" className={rootClass} {...buttonProps}>
      {content}
    </button>
  );
}
