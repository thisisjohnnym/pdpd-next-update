"use client";

import Image from "next/image";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { pdpCarouselImageClass } from "./pdp-carousel";
import type { PdpUgcStory } from "./pdp-data";
import type { PdpReviewCommentData } from "./pdp-review-comment";
import { pdpType } from "./pdp-type";

export type PdpUserPhotoListItem = {
  id: string;
  src: string;
  alt: string;
  author: string;
  verified?: boolean;
  caption?: string;
  meta?: string;
  likes?: number;
};

function isAnimatedPhoto(src: string) {
  return /\.(?:gif|webp)($|\?)/i.test(src);
}

export function collectUserPhotos(
  ugcStories: PdpUgcStory[],
  reviews: PdpReviewCommentData[],
  comments: PdpReviewCommentData[],
): PdpUserPhotoListItem[] {
  const items: PdpUserPhotoListItem[] = [];

  for (const story of ugcStories) {
    items.push({
      id: `ugc-${story.id}`,
      src: story.src,
      alt: story.alt,
      author: story.wearer,
      verified: story.verified,
      caption: story.quote ?? story.context,
      meta: `${story.colorway} · ${story.carry}`,
    });
  }

  for (const review of reviews) {
    const photo = review.photos?.[0];
    if (!photo) {
      continue;
    }

    items.push({
      id: `review-${review.id}`,
      src: photo.src,
      alt: photo.alt,
      author: review.author,
      verified: review.verified,
      caption: review.body ?? review.quote,
      meta: review.recommendTags?.slice(0, 2).join(" · "),
      likes: review.likes,
    });
  }

  for (const comment of comments) {
    for (const [index, photo] of (comment.photos ?? []).entries()) {
      items.push({
        id: `comment-${comment.id}-${index}`,
        src: photo.src,
        alt: photo.alt,
        author: comment.author,
        verified: comment.verified,
        caption: comment.quote,
        likes: comment.likes,
      });
    }
  }

  return items;
}

function PdpUserPhotoListItem({ item }: { item: PdpUserPhotoListItem }) {
  return (
    <article className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">
        {isAnimatedPhoto(item.src) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.src}
            alt={item.alt}
            loading="lazy"
            decoding="async"
            className={cn(
              "size-full object-cover object-center",
              pdpCarouselImageClass,
            )}
          />
        ) : (
          <Image
            src={item.src}
            alt={item.alt}
            fill
            className={cn("object-cover object-center", pdpCarouselImageClass)}
            sizes="100vw"
          />
        )}
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-x-1 gap-y-0.5">
            <span className={cn("text-black", pdpType.label)}>{item.author}</span>
            {item.verified ? (
              <MaterialIcon
                name="verified"
                size={18}
                filled
                className="shrink-0 text-[#0095F6]"
                style={{ fontSize: 11 }}
                aria-label="Verified buyer"
                ariaHidden={false}
              />
            ) : null}
          </p>
          {item.caption ? (
            <p className={cn("mt-1 line-clamp-2 text-black", pdpType.body)}>
              {item.caption}
            </p>
          ) : null}
          {item.meta ? (
            <p className={cn("mt-1 text-neutral-500", pdpType.micro)}>{item.meta}</p>
          ) : null}
        </div>

        {item.likes != null && item.likes > 0 ? (
          <p className={cn("shrink-0 text-neutral-500", pdpType.micro)}>
            {item.likes >= 1_000
              ? `${(item.likes / 1_000).toFixed(1).replace(/\.0$/, "")}k`
              : item.likes}{" "}
            likes
          </p>
        ) : null}
      </div>
    </article>
  );
}

/** Vertical stack of all customer photos */
export function PdpUserPhotoList({ items }: { items: PdpUserPhotoListItem[] }) {
  if (items.length === 0) {
    return (
      <p className={cn("py-6 text-neutral-500", pdpType.body)}>
        No customer photos yet.
      </p>
    );
  }

  return (
    <section className="divide-y divide-neutral-200">
      {items.map((item) => (
        <PdpUserPhotoListItem key={item.id} item={item} />
      ))}
    </section>
  );
}
