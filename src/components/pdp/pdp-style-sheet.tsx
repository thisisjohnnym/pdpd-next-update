"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import {
  pdpBottomSheetBackdropClass,
  pdpBottomSheetCloseButtonClass,
  pdpBottomSheetGrabHandleClass,
  pdpBottomSheetHeaderClass,
  pdpBottomSheetOverlayClass,
  pdpBottomSheetPanelClass,
  PDP_BOTTOM_SHEET_CLOSE_ICON_SIZE,
} from "./pdp-bottom-sheet";
import { pdpSheetHeadingClass } from "./pdp-module-section";
import { PdpTabbyStyleOption } from "./pdp-tabby-style-option";
import { getTabbyStyleGroups, type TabbyStyleId } from "./pdp-tabby-variants";
import { pdpType } from "./pdp-type";

type PdpStyleSheetProps = {
  selectedId: TabbyStyleId;
  open: boolean;
  onClose: () => void;
  onSelect: (id: TabbyStyleId) => void;
};

/** Bottom tray — choose a Tabby style (experiment buy bar) */
export function PdpStyleSheet({
  selectedId,
  open,
  onClose,
  onSelect,
}: PdpStyleSheetProps) {
  const titleId = useId();
  const [mounted, setMounted] = useState(false);
  const styleGroups = getTabbyStyleGroups();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!mounted) {
    return null;
  }

  const handleSelect = (id: TabbyStyleId) => {
    onSelect(id);
    onClose();
  };

  return createPortal(
    <div className={pdpBottomSheetOverlayClass({ open })} aria-hidden={!open}>
      <button
        type="button"
        aria-label="Close style picker"
        className={pdpBottomSheetBackdropClass()}
        onClick={onClose}
        tabIndex={open ? 0 : -1}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={pdpBottomSheetPanelClass({ open, maxHeight: "88dvh" })}
      >
        <div className={pdpBottomSheetHeaderClass}>
          <div className={pdpBottomSheetGrabHandleClass} />
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className={pdpBottomSheetCloseButtonClass}
          >
            <MaterialIcon name="close" size={PDP_BOTTOM_SHEET_CLOSE_ICON_SIZE} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-[max(20px,var(--pdp-safe-area-bottom))]">
          <h2 id={titleId} className={cn(pdpSheetHeadingClass(), "mb-4")}>
            Select a style
          </h2>

          <div className="flex flex-col gap-5">
            {styleGroups.map(({ group, styles }) => (
              <section key={group.id} aria-label={group.label}>
                <h3 className={cn("mb-2 text-neutral-500", pdpType.micro)}>
                  {group.label}
                </h3>
                <ul
                  role="listbox"
                  aria-label={group.label}
                  className="m-0 grid list-none grid-cols-2 items-stretch gap-2"
                >
                  {styles.map((style) => (
                    <li key={style.id} role="presentation" className="h-full">
                      <PdpTabbyStyleOption
                        style={style}
                        selected={style.id === selectedId}
                        onSelect={handleSelect}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
