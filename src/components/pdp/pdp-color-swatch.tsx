"use client";

import Image from "next/image";

import { cn } from "@/lib/cn";

/** Full-bag studio shots — bag sits low in frame; anchor near the bottom */
const PRODUCT_SWATCH_FOCAL = "50% 82%";
const PRODUCT_SWATCH_ZOOM = 2.5;

/** Square tiles — crop into the bag body */
const SQUARE_SWATCH_TILE_ZOOM = 3;
/** Pull the bag up into the square (source focal near bottom of frame) */
const SQUARE_SWATCH_TILE_FOCAL = "50% 82%";

/** Square / circular swatch framing — zoomed into the bag */
export function resolveSquareSwatchFraming(_src?: string): {
  zoom: number;
  objectPosition: string;
} {
  return {
    zoom: SQUARE_SWATCH_TILE_ZOOM,
    objectPosition: SQUARE_SWATCH_TILE_FOCAL,
  };
}

/** Full bag photos — zoomed to fill the clip */
export function ColorSwatchImage({
  src,
  sizes,
  className,
  objectPosition,
  zoom,
}: {
  src: string;
  sizes: string;
  className?: string;
  objectPosition?: string;
  zoom?: number;
  /** @deprecated Ignored — framing comes from zoom / objectPosition */
  variant?: "coach" | "product";
}) {
  const focal = objectPosition ?? PRODUCT_SWATCH_FOCAL;
  const scale = zoom ?? PRODUCT_SWATCH_ZOOM;

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
