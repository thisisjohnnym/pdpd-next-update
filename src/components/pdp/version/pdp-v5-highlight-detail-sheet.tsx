"use client";

import { useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import {
  PDP_BOTTOM_SHEET_CLOSE_ICON_SIZE,
  pdpBottomSheetBackdropClass,
  pdpBottomSheetCloseButtonClass,
  pdpBottomSheetGrabHandleClass,
  pdpBottomSheetHeaderClass,
  pdpBottomSheetOverlayClass,
  pdpBottomSheetPanelClass,
} from "../pdp-bottom-sheet";
import { pdpSheetHeadingClass } from "../pdp-module-section";
import { pdpType } from "../pdp-type";
import { useMountTransition } from "../use-mount-transition";
import { useOverlayDismiss } from "../use-overlay-dismiss";

type PdpV5HighlightDetailSheetCard = {
  title: string;
  trayBody: string;
  traySections?: readonly {
    label: string;
    detail: string;
  }[];
  trayNote?: string;
};

type PdpV5HighlightDetailSheetProps = {
  card: PdpV5HighlightDetailSheetCard | null;
  open: boolean;
  onClose: () => void;
  /** Optional dialog id — defaults to the highlights sheet id. */
  id?: string;
  /** Optional content below the body copy (e.g. Colors visual list). */
  children?: ReactNode;
  /** Taller panel when the tray carries a scrollable list. */
  maxHeight?: "85dvh" | "88dvh" | "92dvh";
};

/** Compact bottom tray — expanded copy for a highlight or closer-look feature. */
export function PdpV5HighlightDetailSheet({
  card,
  open,
  onClose,
  id = "pdp-v5-highlight-detail-sheet",
  children,
  maxHeight,
}: PdpV5HighlightDetailSheetProps) {
  const titleId = useId();
  const overlayReady = useOverlayDismiss(open, onClose);
  const transition = useMountTransition(open, 300);
  const lastCardRef = useRef(card);
  if (card) {
    lastCardRef.current = card;
  }
  const displayCard = card ?? lastCardRef.current;
  const hasExtraContent =
    Boolean(children) ||
    Boolean(displayCard?.traySections?.length) ||
    Boolean(displayCard?.trayNote);

  if (!overlayReady || !transition.mounted || !displayCard) {
    return null;
  }

  return createPortal(
    <div
      className={pdpBottomSheetOverlayClass({ open })}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close details"
        className={pdpBottomSheetBackdropClass()}
        onClick={onClose}
        tabIndex={open ? 0 : -1}
      />

      <div
        id={id}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={pdpBottomSheetPanelClass({
          open,
          maxHeight: maxHeight ?? (hasExtraContent ? "85dvh" : undefined),
        })}
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

        <div
          className={cn(
            "px-3 pb-[max(24px,var(--pdp-safe-area-bottom))] pt-0.5",
            hasExtraContent && "flex min-h-0 flex-1 flex-col overflow-y-auto",
          )}
        >
          <h2 id={titleId} className={cn(pdpSheetHeadingClass(), "mb-2")}>
            {displayCard.title}
          </h2>
          <p className={cn(pdpType.body, "m-0 text-pretty text-neutral-600")}>
            {displayCard.trayBody}
          </p>

          {displayCard.traySections?.length ? (
            <ul className="mt-5 flex list-none flex-col gap-4 border-t border-neutral-100 p-0 pt-5">
              {displayCard.traySections.map((section) => (
                <li key={section.label} className="flex flex-col gap-1">
                  <p className={cn(pdpType.label, "m-0 font-medium text-black")}>
                    {section.label}
                  </p>
                  <p className={cn(pdpType.body, "m-0 text-pretty text-neutral-600")}>
                    {section.detail}
                  </p>
                </li>
              ))}
            </ul>
          ) : null}

          {displayCard.trayNote ? (
            <p
              className={cn(
                pdpType.label,
                "m-0 mt-5 border-t border-neutral-100 pt-4 text-pretty text-neutral-500",
              )}
            >
              {displayCard.trayNote}
            </p>
          ) : null}

          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
