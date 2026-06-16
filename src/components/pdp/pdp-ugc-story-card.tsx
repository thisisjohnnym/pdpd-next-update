import Image from "next/image";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import type { PdpUgcStory } from "./pdp-data";
import { pdpCarouselImageClass } from "./pdp-carousel";
import { pdpType } from "./pdp-type";

function parseWearer(wearer: string) {
  const separator = wearer.indexOf(" · ");
  if (separator === -1) {
    return { name: wearer, location: null as string | null };
  }

  return {
    name: wearer.slice(0, separator),
    location: wearer.slice(separator + 3),
  };
}

type PdpUgcStoryCardProps = {
  story: PdpUgcStory;
  variant?: "carousel" | "overlay";
  /** Smaller square tiles — reviews “In real life” rail */
  size?: "default" | "compact";
  className?: string;
  imageSizes?: string;
};

/** UGC photo with lifestyle context — not a random customer snap */
export function PdpUgcStoryCard({
  story,
  variant = "carousel",
  size = "default",
  className,
  imageSizes = "48vw",
}: PdpUgcStoryCardProps) {
  if (variant === "overlay") {
    return (
      <figure className={cn("relative min-h-0 w-full overflow-hidden bg-neutral-100", className)}>
        <Image
          src={story.src}
          alt={story.alt}
          fill
          className={cn("object-cover object-center", pdpCarouselImageClass)}
          style={{ objectPosition: story.objectPosition ?? "center" }}
          sizes={imageSizes}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent px-3 pb-3 pt-16">
          <p className="font-extended text-sm tracking-[0.2px] text-white">
            {story.context}
          </p>
          <p className={`mt-1 text-white/85 ${pdpType.micro}`}>
            {story.wearer}
            {story.verified ? " · Verified" : ""}
          </p>
          <p className={`mt-1 text-white/75 ${pdpType.micro}`}>
            {story.colorway} · {story.carry}
          </p>
        </div>
      </figure>
    );
  }

  return (
    <article
      className={cn(
        "flex shrink-0 snap-start snap-always flex-col overflow-hidden bg-white",
        className,
      )}
    >
      <div
        className={cn(
          "relative w-full bg-neutral-100",
          size === "compact" ? "aspect-square" : "aspect-[4/5]",
        )}
      >
        <Image
          src={story.src}
          alt={story.alt}
          fill
          className={cn("object-cover object-center", pdpCarouselImageClass)}
          style={{ objectPosition: story.objectPosition ?? "center" }}
          sizes={imageSizes}
        />
      </div>

      {size === "compact" ? (
        <CompactStoryCaption story={story} />
      ) : (
        <div className="flex flex-col gap-1 p-2">
          <p className="font-extended text-xs tracking-[0.2px] text-black">
            {story.wearer}
            {story.verified ? (
              <MaterialIcon
                name="verified"
                size={18}
                filled
                className="ml-1 inline-block align-middle text-[#0095F6]"
                style={{ fontSize: 11 }}
              />
            ) : null}
          </p>
          <p className={`text-neutral-600 ${pdpType.micro}`}>
            {story.colorway} · {story.carry}
          </p>
          {story.quote ? (
            <p className={`text-neutral-800 ${pdpType.micro}`}>&ldquo;{story.quote}&rdquo;</p>
          ) : null}
        </div>
      )}
    </article>
  );
}

function CompactStoryCaption({ story }: { story: PdpUgcStory }) {
  const { name, location } = parseWearer(story.wearer);

  return (
    <div className="flex flex-col gap-1 p-2 pt-2.5">
      <div className="flex items-center gap-1">
        <p className={`text-black ${pdpType.label}`}>{name}</p>
        {story.verified ? (
          <MaterialIcon
            name="verified"
            size={18}
            filled
            className="shrink-0 text-[#0095F6]"
            style={{ fontSize: 11 }}
            aria-label="Verified buyer"
          />
        ) : null}
      </div>
      {location ? (
        <p className={`text-neutral-500 ${pdpType.micro}`}>{location}</p>
      ) : null}
      <p className={`leading-snug text-neutral-600 ${pdpType.micro}`}>
        {story.colorway}
        <span className="text-neutral-400"> · </span>
        {story.carry}
      </p>
    </div>
  );
}
