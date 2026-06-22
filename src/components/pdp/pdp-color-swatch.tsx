"use client";

import Image from "next/image";

import { cn } from "@/lib/cn";

/** Product-shot crop — legacy hero frames; C clasp sits ~58% from top */
const PRODUCT_SWATCH_FOCAL = "50% 58%";
const PRODUCT_SWATCH_ZOOM = 2.25;

function isCoachSwatchSrc(src: string): boolean {
  return src.includes("/images/colors/tabby/");
}

/** Coach.com $desktopSwatchImage$ crops — render as-is; product shots get a lighter zoom */
export function ColorSwatchImage({
  src,
  sizes,
  className,
  objectPosition = PRODUCT_SWATCH_FOCAL,
  zoom = PRODUCT_SWATCH_ZOOM,
  variant,
}: {
  src: string;
  sizes: string;
  className?: string;
  objectPosition?: string;
  zoom?: number;
  /** coach = pre-cropped Coach swatch; product = full hero crop */
  variant?: "coach" | "product";
}) {
  const coachMode = variant === "coach" || (variant !== "product" && isCoachSwatchSrc(src));

  if (coachMode) {
    return (
      <Image
        src={src}
        alt=""
        fill
        className={cn("object-cover object-center", className)}
        sizes={sizes}
      />
    );
  }

  return (
    <span
      aria-hidden
      className={cn("absolute inset-0", className)}
      style={{
        transform: `scale(${zoom})`,
        transformOrigin: objectPosition,
      }}
    >
      <Image
        src={src}
        alt=""
        fill
        className="object-cover"
        style={{ objectPosition }}
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
        "relative block shrink-0 overflow-hidden rounded-full border border-black/5 bg-neutral-100",
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
