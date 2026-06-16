"use client";

import { useEffect } from "react";

import { cn } from "@/lib/cn";

type PdpToastProps = {
  message: string;
  open: boolean;
  onClose: () => void;
  durationMs?: number;
};

export function PdpToast({
  message,
  open,
  onClose,
  durationMs = 2400,
}: PdpToastProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const timeoutId = window.setTimeout(onClose, durationMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [durationMs, onClose, open]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed inset-x-0 top-[calc(var(--pdp-safe-area-top)+3.5rem)] z-40 flex justify-center px-4"
    >
      <p
        className={cn(
          "font-extended rounded-full px-4 py-2.5 text-xs tracking-[0.2px] pdp-glass-light--cta pdp-toast",
          "transition-[opacity,transform] duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform",
          open
            ? "translate-y-0 opacity-100"
            : "-translate-y-[140%] opacity-0",
        )}
      >
        {message}
      </p>
    </div>
  );
}
