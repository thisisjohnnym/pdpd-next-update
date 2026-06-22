"use client";

import { useEffect, useId, useRef, useState } from "react";
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
import {
  pdpPressableSolidClass,
  pdpStrokeCtaMutedClass,
  pdpType,
} from "./pdp-type";
import { useOverlayDismiss } from "./use-overlay-dismiss";

type PdpNotifySheetProps = {
  /** Name of the colorway the shopper wants restock alerts for */
  colorName?: string;
  open: boolean;
  onClose: () => void;
  /** Fired with the captured email once validation passes */
  onSubmit: (email: string) => void;
};

/** Lightweight RFC-ish check — enough to catch obvious typos client-side */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Bottom tray — capture an email for a back-in-stock alert */
export function PdpNotifySheet({
  colorName,
  open,
  onClose,
  onSubmit,
}: PdpNotifySheetProps) {
  const titleId = useId();
  const inputId = useId();
  const errorId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const mounted = useOverlayDismiss(open, onClose);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setEmail("");
      setError(null);
      return;
    }

    const focusId = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 250);

    return () => {
      window.clearTimeout(focusId);
    };
  }, [open]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = email.trim();

    if (!EMAIL_PATTERN.test(trimmed)) {
      setError("Enter a valid email address.");
      inputRef.current?.focus();
      return;
    }

    setError(null);
    onSubmit(trimmed);
  };

  if (!mounted || typeof document === "undefined" || !document.body) {
    return null;
  }

  return createPortal(
    <div className={pdpBottomSheetOverlayClass({ open })} aria-hidden={!open}>
      <button
        type="button"
        aria-label="Close notify form"
        className={pdpBottomSheetBackdropClass()}
        onClick={onClose}
        tabIndex={open ? 0 : -1}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={pdpBottomSheetPanelClass({ open })}
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

        <div className="flex min-h-0 flex-1 flex-col px-3 pb-6 pt-0.5">
          <h2 id={titleId} className={cn(pdpSheetHeadingClass(), "mb-1.5")}>
            Get notified
          </h2>
          <p className={cn(pdpType.body, "mb-5 text-neutral-600")}>
            {colorName
              ? `We'll email you when ${colorName} is back in stock.`
              : "We'll email you when this item is back in stock."}
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor={inputId} className="sr-only">
              Email address
            </label>
            <input
              ref={inputRef}
              id={inputId}
              type="email"
              inputMode="email"
              enterKeyHint="send"
              autoComplete="email"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              placeholder="Email address"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (error) {
                  setError(null);
                }
              }}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? errorId : undefined}
              className={cn(
                "min-h-12 w-full rounded-full border bg-[#f3f3f3] px-4 pt-3 pb-2.5",
                "font-extended text-base tracking-[0.2px] text-black outline-none",
                "placeholder:text-neutral-500 focus:bg-[#ececec]",
                "[touch-action:manipulation] [-webkit-tap-highlight-color:transparent]",
                error ? "border-red-500" : "border-transparent",
              )}
            />

            {error ? (
              <p
                id={errorId}
                role="alert"
                className={cn(pdpType.micro, "mt-2 px-1 text-red-600")}
              >
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={email.trim().length === 0}
              className={cn(
                "font-extended mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-4 text-sm tracking-[0.2px]",
                email.trim().length === 0
                  ? pdpStrokeCtaMutedClass
                  : cn(
                      "bg-black text-white transition-colors active:bg-neutral-800",
                      pdpPressableSolidClass,
                    ),
              )}
            >
              <MaterialIcon name="mail" size={18} className="shrink-0" aria-hidden />
              Notify me
            </button>
          </form>

          <p className={cn(pdpType.micro, "mt-3 text-center text-neutral-400")}>
            We'll only use your email for this restock alert.
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
