"use client";

import Image from "next/image";

import { cn } from "@/lib/cn";

/** Coach.com $desktopSwatchImage$ — bag sits in lower third of portrait frame */
const COACH_SWATCH_FOCAL = "50% 68%";
const COACH_SWATCH_ZOOM = 3.25;

/** Product-shot crop — legacy hero frames; C clasp sits ~58% from top */
const PRODUCT_SWATCH_FOCAL = "50% 58%";
const PRODUCT_SWATCH_ZOOM = 2.25;

function isCoachSwatchSrc(src: string): boolean {
  return src.includes("/images/colors/tabby/");
}

/** Coach.com swatches and legacy hero frames — zoomed to fill the circular clip */
export function ColorSwatchImage({
  src,
  sizes,
  className,
  objectPosition,
  zoom,
  variant,
}: {
  src: string;
  sizes: string;
  className?: string;
  objectPosition?: string;
  zoom?: number;
  /** coach = Coach.com swatch frame; product = full hero crop */
  variant?: "coach" | "product";
}) {
  const coachMode = variant === "coach" || (variant !== "product" && isCoachSwatchSrc(src));
  const focal = objectPosition ?? (coachMode ? COACH_SWATCH_FOCAL : PRODUCT_SWATCH_FOCAL);
  const scale = zoom ?? (coachMode ? COACH_SWATCH_ZOOM : PRODUCT_SWATCH_ZOOM);

  return (
    <span
      aria-hidden
      className={cn("absolute inset-0", className)}
      style={{
        transform: `scale(${scale})`,
        transformOrigin: focal,
      }}
    >
      <Image
        src={src}
        alt=""
        fill
        className="object-cover"
        style={{ objectPosition: focal }}
        sizes={sizes}
      />
    </span>
  );
}

export function ColorSwatchCircle({
  src,
  sizeClass,
  sizes = "40px",
  dimmed = false,
  objectPosition,
  zoom,
}: {
  src: string;
  sizeClass: string;
  sizes?: string;
  dimmed?: boolean;
  objectPosition?: string;
  zoom?: number;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative block shrink-0 overflow-hidden rounded-full bg-neutral-100",
        sizeClass,
        dimmed && "opacity-40",
      )}
    >
      <ColorSwatchImage
        src={src}
        sizes={sizes}
        objectPosition={objectPosition}
        zoom={zoom}
      />
    </span>
  );
}
