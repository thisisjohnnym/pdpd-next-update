"use client";

import { cn } from "@/lib/cn";

import { pdpType } from "./pdp-type";

export type UgcMediaMode = "videos" | "photos";

const UGC_MEDIA_MODES: { id: UgcMediaMode; label: string }[] = [
  { id: "videos", label: "Videos" },
  { id: "photos", label: "Photos" },
];

/** Videos / Photos switch — UGC community module + compact strip + sheet. */
export function PdpUgcMediaToggle({
  value,
  onChange,
  className,
}: {
  value: UgcMediaMode;
  onChange: (mode: UgcMediaMode) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      aria-label="Community media type"
      className={cn("flex gap-4", className)}
    >
      {UGC_MEDIA_MODES.map((mode) => {
        const active = value === mode.id;

        return (
          <button
            key={mode.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(mode.id)}
            className={cn(
              "font-extended m-0 border-0 bg-transparent p-0 transition-colors",
              pdpType.label,
              active
                ? "text-black underline decoration-black underline-offset-[3px]"
                : "text-neutral-400 active:text-neutral-600",
            )}
          >
            {mode.label}
          </button>
        );
      })}
    </div>
  );
}
