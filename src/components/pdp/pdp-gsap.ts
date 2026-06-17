import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let pluginsRegistered = false;

/** Register GSAP plugins once on the client */
export function ensureGsapPlugins() {
  if (typeof window === "undefined" || pluginsRegistered) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  pluginsRegistered = true;
}

/** Sync read — prefer `useReducedMotion()` in React components for live updates */
function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export const REVEAL_EASE = "power3.out";
const REVEAL_START = "top 90%";
export const REVEAL_MODULE_START = "top 92%";
const TEXT_STAGGER_S = 0.07;

export type RevealLayout = "stack" | "module";

function textRevealStagger(index: number, target: Element) {
  const customMs = Number((target as HTMLElement).dataset.pdpTextDelay ?? 0);
  return index * TEXT_STAGGER_S + customMs / 1000;
}

export function queryRevealTargets(root: ParentNode) {
  return root.querySelectorAll<HTMLElement>(
    "[data-pdp-text-reveal], [data-pdp-reveal-item]",
  );
}

function setRevealHidden(
  inner: HTMLElement,
  targets: NodeListOf<HTMLElement> | HTMLElement[],
  layout: RevealLayout,
) {
  if (layout === "module") {
    if (targets.length === 0) {
      gsap.set(inner, { opacity: 0, y: 16, filter: "blur(5px)" });
    } else {
      gsap.set(inner, { clearProps: "opacity,transform,scale,filter" });
      inner.classList.add("pdp-scroll-reveal__inner--revealed");
    }
  } else {
    gsap.set(inner, { clearProps: "opacity,transform,scale" });
    inner.classList.add("pdp-scroll-reveal__inner--revealed");
  }

  if (targets.length > 0) {
    gsap.set(targets, { opacity: 0, y: 16, filter: "blur(5px)" });
  }
}

export function markRevealComplete(inner: HTMLElement) {
  inner.classList.add("pdp-scroll-reveal__inner--revealed");
  gsap.set(inner, { clearProps: "opacity,transform,scale,filter" });
}

export function markTargetsComplete(targets: NodeListOf<HTMLElement> | HTMLElement[]) {
  for (const target of targets) {
    target.classList.add("pdp-reveal-target--revealed");
    gsap.set(target, { clearProps: "opacity,transform,filter" });
  }
}

export function clearRevealTargets(...targets: (Element | null | undefined)[]) {
  for (const target of targets) {
    if (target) {
      target.classList.add("pdp-reveal-target--revealed");
      if (target.classList.contains("pdp-scroll-reveal__inner")) {
        target.classList.add("pdp-scroll-reveal__inner--revealed");
      }
      gsap.set(target, { clearProps: "opacity,transform,scale,filter" });
    }
  }
}

type BuildRevealTimelineOptions = {
  trigger: HTMLElement;
  inner: HTMLElement;
  targets: NodeListOf<HTMLElement>;
  layout: RevealLayout;
  onRevealStart?: () => void;
  onRevealComplete?: () => void;
};

/** Section entrance — stack layout keeps media fixed, only copy/blocks animate */
export function buildRevealTimeline({
  trigger,
  inner,
  targets,
  layout,
  onRevealStart,
  onRevealComplete,
}: BuildRevealTimelineOptions) {
  setRevealHidden(inner, targets, layout);

  if (layout === "stack" && targets.length === 0) {
    onRevealStart?.();
    onRevealComplete?.();
    return gsap.timeline();
  }

  const timeline = gsap.timeline({
    paused: true,
    scrollTrigger: {
      trigger,
      start: layout === "stack" ? REVEAL_START : REVEAL_MODULE_START,
      toggleActions: "play none none none",
      once: true,
      invalidateOnRefresh: true,
      onEnter: () => onRevealStart?.(),
    },
  });

  if (layout === "module" && targets.length === 0) {
    timeline.to(inner, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.85,
      ease: REVEAL_EASE,
    });
  }

  if (targets.length > 0) {
    timeline.to(
      targets,
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.85,
        ease: REVEAL_EASE,
        stagger: textRevealStagger,
      },
      0,
    );
  }

  timeline.eventCallback("onComplete", () => onRevealComplete?.());

  return timeline;
}

let scrollTriggerRefreshRaf = 0;

/** Batch layout refreshes — one global pass per frame, not per lazy-mounted section */
export function scheduleScrollTriggerRefresh() {
  if (typeof window === "undefined" || scrollTriggerRefreshRaf) {
    return;
  }

  scrollTriggerRefreshRaf = window.requestAnimationFrame(() => {
    scrollTriggerRefreshRaf = 0;
    ScrollTrigger.refresh();
  });
}

export function syncRevealIfAlreadyInView(
  timeline: gsap.core.Timeline,
  onComplete?: () => void,
) {
  const scrollTrigger = timeline.scrollTrigger;
  if (!scrollTrigger) {
    onComplete?.();
    return;
  }

  const trigger = scrollTrigger.trigger as HTMLElement;
  const scrolledPast = trigger.getBoundingClientRect().bottom < 0;

  if (scrolledPast) {
    timeline.progress(1);
    onComplete?.();
    scrollTrigger.kill(false);
  }
}

export { gsap };
