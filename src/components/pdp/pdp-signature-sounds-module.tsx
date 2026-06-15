"use client";

import Image from "next/image";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { PDP_SIGNATURE_SOUNDS, type PdpSignatureSound } from "./pdp-data";
import { pdpModuleHeadingClass, pdpModuleSectionClass, pdpModuleHeadingLeadClass } from "./pdp-module-section";
import { pdpType } from "./pdp-type";
import { useSignatureSound } from "./use-signature-sound";

function SignatureSoundRow({
  sound,
  active,
  onToggle,
}: {
  sound: PdpSignatureSound;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      aria-label={active ? `Stop ${sound.label}` : sound.label}
      className={cn(
        "group flex w-full min-h-[4.75rem] items-center gap-3 border-0 px-3 py-4 text-left transition-colors duration-200",
        active ? "bg-neutral-100" : "bg-white active:bg-neutral-50",
      )}
    >
      <span className="relative size-12 shrink-0 overflow-hidden bg-neutral-100">
        <Image
          src={sound.imageSrc}
          alt=""
          fill
          className="object-cover object-center"
          sizes="48px"
        />
        <span
          aria-hidden
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-black/25 transition-opacity",
            active ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          )}
        >
          <MaterialIcon
            name={active ? "graphic_eq" : "volume_up"}
            size={18}
            className={cn("text-white", active && "animate-pulse")}
          />
        </span>
      </span>

      <span className="min-w-0 flex-1">
        <span className="font-extended flex items-center gap-1 text-sm tracking-[0.2px] text-black">
          <span className="-translate-y-px">{sound.label}</span>
        </span>
        <span className={`mt-0.5 block text-neutral-600 ${pdpType.micro}`}>
          {active ? sound.playingHint : sound.hint}
        </span>
      </span>

      <MaterialIcon
        name={active ? "pause" : "play_arrow"}
        size={24}
        className={cn(
          "shrink-0 transition-colors",
          active ? "text-black" : "text-neutral-400",
        )}
      />
    </button>
  );
}

/** Tap-to-hear product sounds — turnlock, zipper, bag opening */
export function PdpSignatureSoundsModule() {
  const { title, sounds } = PDP_SIGNATURE_SOUNDS;
  const { toggle, isActive } = useSignatureSound();

  return (
    <section
      data-header-surface="light"
      className={cn(
        pdpModuleSectionClass({ variant: "muted", rhythm: "roomy" }),
        "pb-20",
      )}
    >
      <PageGrid fullWidth>
        <GridItem mobile={12} desktop={24}>
          <h2
            className={cn(
              pdpModuleHeadingClass({ lead: false }),
              pdpModuleHeadingLeadClass(),
            )}
          >
            {title}
          </h2>

          <ul className="flex flex-col gap-3">
            {sounds.map((sound) => (
              <li key={sound.id}>
                <SignatureSoundRow
                  sound={sound}
                  active={isActive(sound.id)}
                  onToggle={() => toggle(sound.id, sound.audioSrc)}
                />
              </li>
            ))}
          </ul>
        </GridItem>
      </PageGrid>
    </section>
  );
}
