"use client";

import Image from "next/image";

import { cn } from "@/lib/cn";

import { PDP_UGC_VIDEO_CAROUSEL } from "../pdp-data";
import { pdpType } from "../pdp-type";

/**
 * v2-only — "Carried by the community" section (Paper AFC-0).
 *
 * 3-card peek layout: left and right cards (280×392) peek at the edges;
 * center card (280×430) is the featured/active card and shows caption + @handle.
 * Container uses overflow-clip + justify-center so only center is fully visible.
 */

/** Featured center-card caption (Paper AFC-0 design constant — not a data field). */
const V2_FEATURED_CAPTION = "This front pocket fits more than you'd think";

type CardProps = {
  src: string;
  alt: string;
  height: 392 | 430;
  caption?: string;
  handle?: string;
  verified?: boolean;
};

function UgcCard({ src, alt, height, caption, handle, verified }: CardProps) {
  const isFeatured = height === 430;

  return (
    <div
      className="relative w-[280px] shrink-0 overflow-hidden rounded-lg"
      style={{ height }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover object-center"
        sizes="280px"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: isFeatured ? undefined : "rgba(0,0,0,0.18)" }}
      />

      {isFeatured && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0"
          style={{
            height: "55%",
            background:
              "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)",
          }}
        />
      )}

      {isFeatured && (caption || handle) ? (
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-[14px]">
          {caption ? (
            <p
              className={cn(
                "font-extended m-0 leading-snug text-white",
                pdpType.body,
              )}
            >
              {caption}
            </p>
          ) : null}
          {handle ? (
            <div className="flex items-center gap-[5px]">
              <span className={cn("font-extended text-white", pdpType.body)}>
                {handle}
              </span>
              {verified ? (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  aria-label="Verified creator"
                >
                  <circle cx="12" cy="12" r="10" fill="#1D9BF0" />
                  <path
                    d="M8 12.5l2.5 2.5 5-5.5"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function PdpV2UgcCommunity() {
  const { title, followCta, videos } = PDP_UGC_VIDEO_CAROUSEL;

  const left = videos[1]!;
  const center = videos[0]!;
  const right = videos[2]!;

  return (
    <section
      data-header-surface="light"
      className="w-full shrink-0 bg-white pt-14 pb-0"
    >
      <div className="mb-[14px] flex flex-col items-center gap-2 px-2">
        <h2 className="font-extended m-0 text-center text-xl font-normal leading-snug tracking-tight text-balance text-black">
          {title}
        </h2>

        <a
          href={followCta.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "font-extended inline-flex items-center gap-1 text-black underline underline-offset-[3px] transition-opacity active:opacity-60",
            pdpType.label,
          )}
          aria-label={`${followCta.label} (opens in new tab)`}
        >
          {followCta.label}
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            aria-hidden
            style={{ flexShrink: 0 }}
          >
            <path
              d="M7 17 17 7M9 7h8v8"
              fill="none"
              stroke="#171717"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>

      {/* 3-card peek: overflow-clip + justify-center matches Paper AFC-0 */}
      <div className="flex items-center justify-center gap-2 overflow-clip px-2">
        <UgcCard src={left.poster} alt={left.alt} height={392} />
        <UgcCard
          src={center.poster}
          alt={center.alt}
          height={430}
          caption={V2_FEATURED_CAPTION}
          handle={center.handle}
          verified={center.verified}
        />
        <UgcCard src={right.poster} alt={right.alt} height={392} />
      </div>
    </section>
  );
}
