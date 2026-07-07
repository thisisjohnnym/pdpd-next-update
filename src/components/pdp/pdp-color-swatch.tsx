"use client";

import Image from "next/image";

import { cn } from "@/lib/cn";

/** Coach.com $desktopSwatchImage$ — C clasp centered in the square crop */
const COACH_SWATCH_FOCAL = "50% 90%";
const COACH_SWATCH_ZOOM = 3.25;

/** Hero color row — square tiles need extra zoom vs circular chips */
export const SQUARE_SWATCH_TILE_ZOOM = 4.5;
/** Anchor on clasp — centered in the hero square crop */
export const SQUARE_SWATCH_TILE_FOCAL = "50% 72%";

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

// fallow-ignore-next-line complexity
export function ColorSwatchTile({
  src,
  fill,
  widthClass = "w-10",
  sizes = "40px",
  dimmed = false,
  objectPosition,
  zoom,
  fillParent = false,
}: {
  /** Product image — legacy photo swatch */
  src?: string;
  /** Solid fill — simple color chip (color drawer rows) */
  fill?: string;
  widthClass?: string;
  sizes?: string;
  dimmed?: boolean;
  objectPosition?: string;
  zoom?: number;
  /** Fill a relative square parent (hero collapsed swatch row). */
  fillParent?: boolean;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "overflow-hidden transition-opacity duration-200 ease-out",
        fillParent
          ? "absolute inset-0 size-full border-0"
          : cn(
              "relative block border border-black/10",
              cn("aspect-square shrink-0", widthClass),
            ),
        dimmed && "opacity-40",
        !fill && !fillParent && "border-black/5 bg-neutral-100",
      )}
      style={fill ? { backgroundColor: fill } : undefined}
    >
      {src && !fill ? (
        <ColorSwatchImage
          src={src}
          sizes={sizes}
          objectPosition={objectPosition}
          zoom={zoom}
        />
      ) : null}
    </span>
  );
}

export function ColorSwatchCircle({
  src,
  fill,
  sizeClass,
  sizes = "40px",
  dimmed = false,
  objectPosition,
  zoom,
}: {
  /** Product image — legacy photo swatch */
  src?: string;
  /** Solid fill — simple color chip (color drawer rows) */
  fill?: string;
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
        "relative block shrink-0 overflow-hidden rounded-full border border-black/10 transition-opacity duration-200 ease-out",
        sizeClass,
        dimmed && "opacity-40",
        !fill && "border-black/5 bg-neutral-100",
      )}
      style={fill ? { backgroundColor: fill } : undefined}
    >
      {src && !fill ? (
        <ColorSwatchImage
          src={src}
          sizes={sizes}
          objectPosition={objectPosition}
          zoom={zoom}
        />
      ) : null}
    </span>
  );
}
