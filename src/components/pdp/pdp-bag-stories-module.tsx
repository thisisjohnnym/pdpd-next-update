"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/cn";

import { PDP_BAG_STORIES } from "./pdp-data";
import {
  EXPERIENCE_PANEL_MEDIA_CLASS,
  experiencePanelSectionProps,
} from "./pdp-experience-panel";

/** What's in my bag — lifestyle carry stories, not inventory specs */
export function PdpBagStoriesModule({
  isLastPanel = false,
}: {
  isLastPanel?: boolean;
}) {
  const { stories } = PDP_BAG_STORIES;
  const panel = experiencePanelSectionProps(isLastPanel);
  const [activeId, setActiveId] = useState(stories[0]!.id);

  return (
    <section data-header-surface="light" className={panel.className} style={panel.style}>
      <div className={cn(EXPERIENCE_PANEL_MEDIA_CLASS, "bg-neutral-100")}>
        {stories.map((story) => (
          <Image
            key={story.id}
            src={story.image.src}
            alt={story.image.alt}
            fill
            className={cn(
              "object-cover scale-[1.06] transition-opacity duration-500 ease-out",
              story.id === activeId ? "opacity-100" : "opacity-0",
            )}
            style={{ objectPosition: story.image.objectPosition ?? "center" }}
            sizes="100vw"
            priority={story.id === stories[0]!.id}
          />
        ))}
      </div>

      <div className="shrink-0 px-3 pt-3">
        <div className="grid grid-cols-3 gap-1" aria-live="polite">
          {stories.map((story) => (
            <button
              key={story.id}
              type="button"
              onClick={() => setActiveId(story.id)}
              aria-pressed={activeId === story.id}
              className={cn(
                "font-extended rounded-lg px-1 py-2 text-center text-[10px] leading-tight tracking-[0.2px] transition-colors",
                activeId === story.id
                  ? "bg-black text-white"
                  : "text-neutral-500 hover:bg-neutral-100 hover:text-black",
              )}
            >
              {story.title}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
