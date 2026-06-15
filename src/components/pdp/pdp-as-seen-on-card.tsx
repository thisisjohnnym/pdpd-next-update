import Image from "next/image";

import { cn } from "@/lib/cn";

import type { PdpAsSeenOnCelebrity } from "./pdp-data";
import { pdpType } from "./pdp-type";

type PdpAsSeenOnCardProps = {
  celebrity: PdpAsSeenOnCelebrity;
  className?: string;
  imageSizes?: string;
  variant?: "default" | "compact";
};

/** Celebrity sighting — portrait photo with name and context overlay */
export function PdpAsSeenOnCard({
  celebrity,
  className,
  imageSizes = "48vw",
  variant = "default",
}: PdpAsSeenOnCardProps) {
  const compact = variant === "compact";

  return (
    <figure
      className={cn(
        "relative overflow-hidden bg-neutral-100",
        compact ? "aspect-[3/4] rounded-lg" : "aspect-[4/5]",
        className,
      )}
    >
      <Image
        src={celebrity.src}
        alt={celebrity.alt}
        fill
        className="object-cover object-center"
        style={{ objectPosition: celebrity.objectPosition ?? "center" }}
        sizes={compact ? "32vw" : imageSizes}
      />
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t to-transparent",
          compact
            ? "from-black/55 via-black/20 px-2 pb-2 pt-10"
            : "from-black/70 via-black/30 px-3 pb-3 pt-14",
        )}
      >
        <p
          className={cn(
            "font-extended tracking-[0.2px] text-white",
            compact ? "text-xs" : "text-sm",
          )}
        >
          {celebrity.name}
        </p>
        <p
          className={cn(
            "text-white/75",
            pdpType.micro,
            compact ? "mt-0" : "mt-0.5",
          )}
        >
          {celebrity.context}
        </p>
      </div>
    </figure>
  );
}
