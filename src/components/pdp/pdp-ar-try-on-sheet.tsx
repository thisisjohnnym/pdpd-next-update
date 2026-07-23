"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
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
  pdpBottomSheetScrollRegionClass,
  PDP_BOTTOM_SHEET_CLOSE_ICON_SIZE,
} from "./pdp-bottom-sheet";
import { pdpSheetHeadingClass } from "./pdp-module-section";
import { pdpPressableSolidClass, pdpType } from "./pdp-type";
import { useOverlayDismiss } from "./use-overlay-dismiss";

type PdpArTryOnSheetProps = {
  open: boolean;
  onClose: () => void;
  /** Adds the active product to the bag from within the preview */
  onAddToBag?: () => void;
};

type CameraPhase =
  | "idle"
  | "requesting"
  | "live"
  | "denied"
  | "unsupported"
  | "error";

type CameraFacing = "environment" | "user";

function ArStatusBadge({ live }: { live: boolean }) {
  return (
    <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 backdrop-blur-sm">
      <span
        className={cn(
          "size-1.5 rounded-full",
          live ? "animate-pulse bg-emerald-400" : "bg-white/50",
        )}
      />
      <span className="font-extended text-[10px] tracking-[0.2px] text-white/90">
        {live ? "Live" : "Preview"}
      </span>
    </div>
  );
}

/** Decorative AR grid + vignette used behind the product when no camera is available. */
function ArSceneDecor() {
  return (
    <>
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08)_0%,transparent_70%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          transform: "perspective(400px) rotateX(58deg) scale(1.4)",
          transformOrigin: "center 85%",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-5 rounded-xl border border-white/25"
        style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)" }}
      />
    </>
  );
}

/** UI-only AR try-on bottom sheet with optional live device camera feed. */
export function PdpArTryOnSheet({ open, onClose, onAddToBag }: PdpArTryOnSheetProps) {
  const titleId = useId();
  const mounted = useOverlayDismiss(open, onClose);
  const [phase, setPhase] = useState<CameraPhase>("idle");
  const [facing, setFacing] = useState<CameraFacing>("environment");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop();
      }
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const startCamera = useCallback(
    async (mode: CameraFacing = "environment") => {
      if (
        typeof navigator === "undefined" ||
        !navigator.mediaDevices?.getUserMedia
      ) {
        setPhase("unsupported");
        return;
      }

      stopStream();
      setFacing(mode);
      setPhase("requesting");

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: mode } },
          audio: false,
        });

        streamRef.current = stream;
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          await video.play().catch(() => {
            // Autoplay can reject; the feed still renders muted/inline.
          });
        }
        setPhase("live");
      } catch (err) {
        const name = err instanceof DOMException ? err.name : "";
        if (name === "NotAllowedError" || name === "SecurityError") {
          setPhase("denied");
        } else if (name === "NotFoundError" || name === "OverconstrainedError") {
          setPhase("unsupported");
        } else {
          setPhase("error");
        }
      }
    },
    [stopStream],
  );

  const flipCamera = useCallback(() => {
    void startCamera(facing === "environment" ? "user" : "environment");
  }, [facing, startCamera]);

  useEffect(() => {
    if (!open) {
      stopStream();
      setPhase("idle");
      return;
    }

    void startCamera("environment");

    return () => {
      stopStream();
    };
  }, [open, startCamera, stopStream]);

  if (!mounted) {
    return null;
  }

  const isLive = phase === "live";
  const showFallbackScene = phase !== "live";

  const stageStatus: string =
    phase === "denied"
      ? "Camera access blocked — showing prototype preview."
      : phase === "unsupported"
        ? "No camera available — showing prototype preview."
        : phase === "error"
          ? "Couldn’t start the camera — showing prototype preview."
          : phase === "requesting"
            ? "Requesting camera access…"
            : "";

  return createPortal(
    <div className={pdpBottomSheetOverlayClass({ open })} aria-hidden={!open}>
      <button
        type="button"
        aria-label="Close AR try-on preview"
        className={pdpBottomSheetBackdropClass()}
        onClick={onClose}
        tabIndex={open ? 0 : -1}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={pdpBottomSheetPanelClass({ open, maxHeight: "92dvh" })}
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
          data-pdp-sheet-scroll
          className={pdpBottomSheetScrollRegionClass(
            "px-3 pb-[max(24px,var(--pdp-safe-area-bottom))]",
          )}
        >
          <h2 id={titleId} className={cn(pdpSheetHeadingClass(), "mb-1")}>
            Try On in AR
          </h2>
          <p className={`mb-4 text-neutral-600 ${pdpType.caption}`}>
            See how this style looks in your space.
          </p>

          <div className="mb-5">
            <div
              className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-neutral-900"
              role="img"
              aria-label={
                isLive
                  ? "Live camera augmented reality preview"
                  : "Augmented reality preview placeholder"
              }
            >
              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                className={cn(
                  "absolute inset-0 size-full object-cover transition-opacity duration-500",
                  isLive ? "opacity-100" : "opacity-0",
                  facing === "user" && "-scale-x-100",
                )}
              />

              {showFallbackScene ? <ArSceneDecor /> : null}

              {phase === "requesting" ? (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                  role="status"
                  aria-live="polite"
                >
                  <span className="flex size-14 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                    <MaterialIcon
                      name="photo_camera"
                      size={26}
                      className="animate-pulse text-white"
                    />
                  </span>
                  <p className="font-extended text-center text-[11px] tracking-[0.2px] text-white/80">
                    Allow camera access to preview
                  </p>
                </div>
              ) : null}

              {showFallbackScene && phase !== "requesting" ? (
                <p className="font-extended pointer-events-none absolute inset-x-0 bottom-3 text-center text-[11px] tracking-[0.2px] text-white/70">
                  {stageStatus || "Prototype preview"}
                </p>
              ) : null}

              {(phase === "denied" || phase === "error") && (
                <button
                  type="button"
                  onClick={() => void startCamera(facing)}
                  className="font-extended absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] tracking-[0.2px] text-black"
                >
                  Retry camera
                </button>
              )}

              {isLive && (
                <button
                  type="button"
                  aria-label="Flip camera"
                  onClick={flipCamera}
                  className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/65 active:bg-black/75"
                >
                  <MaterialIcon name="cameraswitch" size={20} />
                </button>
              )}

              <ArStatusBadge live={isLive} />
            </div>
          </div>

          {onAddToBag ? (
            <button
              type="button"
              onClick={onAddToBag}
              className={cn(
                "font-extended flex h-12 w-full items-center justify-center gap-2 rounded-full bg-black text-[12px] text-white",
                pdpPressableSolidClass,
              )}
            >
              <MaterialIcon
                name="shopping_bag"
                size={18}
                className="shrink-0 -translate-y-px"
                aria-hidden
              />
              <span className="translate-y-px">Add to bag</span>
            </button>
          ) : null}
        </div>
      </div>
    </div>,
    document.body,
  );
}
