"use client";

import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type ScrollDirection = "up" | "down";

export type ScrollSnapshot = {
  scrollY: number;
  viewportHeight: number;
  /** Last sustained scroll direction (deadzoned to avoid jitter) */
  direction: ScrollDirection;
};

type ScrollListener = (snapshot: ScrollSnapshot) => void;

/** Ignore sub-threshold scroll deltas when deciding direction */
const DIRECTION_THRESHOLD_PX = 4;

/** Stable SSR snapshot — must be referentially identical across calls */
const SERVER_SNAPSHOT: ScrollSnapshot = {
  scrollY: 0,
  viewportHeight: 0,
  direction: "down",
};

class ScrollBus {
  private listeners = new Set<() => void>();
  private frame = 0;
  private snapshot: ScrollSnapshot = SERVER_SNAPSHOT;
  private subscribed = false;
  /** Last position the direction was committed from — only advances past the deadzone */
  private directionAnchorY = 0;
  private direction: ScrollDirection = "down";

  /** Returns true when values changed — assigns a new object for useSyncExternalStore */
  // fallow-ignore-next-line complexity
  private commitSnapshot(scrollY: number, viewportHeight: number): boolean {
    const delta = scrollY - this.directionAnchorY;
    if (Math.abs(delta) >= DIRECTION_THRESHOLD_PX) {
      this.direction = delta > 0 ? "down" : "up";
      this.directionAnchorY = scrollY;
    }

    if (
      this.snapshot.scrollY === scrollY &&
      this.snapshot.viewportHeight === viewportHeight &&
      this.snapshot.direction === this.direction
    ) {
      return false;
    }

    this.snapshot = { scrollY, viewportHeight, direction: this.direction };
    return true;
  }

  private readAndCommitSnapshot(): boolean {
    if (typeof window === "undefined") {
      return false;
    }

    return this.commitSnapshot(window.scrollY, window.innerHeight);
  }

  private notifyIfChanged = () => {
    this.frame = 0;

    if (!this.readAndCommitSnapshot()) {
      return;
    }

    for (const listener of this.listeners) {
      listener();
    }
  };

  private handleScroll = () => {
    if (this.frame) {
      return;
    }

    this.frame = window.requestAnimationFrame(this.notifyIfChanged);
  };

  private handleResize = () => {
    this.notifyIfChanged();
  };

  private ensureSubscribed() {
    if (this.subscribed || typeof window === "undefined") {
      return;
    }

    this.subscribed = true;
    this.readAndCommitSnapshot();
    window.addEventListener("scroll", this.handleScroll, { passive: true });
    window.addEventListener("resize", this.handleResize, { passive: true });
  }

  private maybeUnsubscribe() {
    if (this.listeners.size > 0 || typeof window === "undefined") {
      return;
    }

    this.subscribed = false;
    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("resize", this.handleResize);

    if (this.frame) {
      window.cancelAnimationFrame(this.frame);
      this.frame = 0;
    }
  }

  subscribe(onStoreChange: () => void): () => void {
    const isFirstListener = this.listeners.size === 0;
    this.ensureSubscribed();
    this.listeners.add(onStoreChange);

    // Hydrate client scroll once — getSnapshot must stay pure during render.
    if (isFirstListener && typeof window !== "undefined") {
      if (
        this.snapshot.scrollY !== SERVER_SNAPSHOT.scrollY ||
        this.snapshot.viewportHeight !== SERVER_SNAPSHOT.viewportHeight
      ) {
        queueMicrotask(onStoreChange);
      }
    }

    return () => {
      this.listeners.delete(onStoreChange);
      this.maybeUnsubscribe();
    };
  }

  getSnapshot(): ScrollSnapshot {
    return this.snapshot;
  }

  getServerSnapshot(): ScrollSnapshot {
    return SERVER_SNAPSHOT;
  }
}

const scrollBus = new ScrollBus();
const ScrollBusContext = createContext(scrollBus);

export function PdpScrollProvider({ children }: { children: ReactNode }) {
  return (
    <ScrollBusContext.Provider value={scrollBus}>{children}</ScrollBusContext.Provider>
  );
}

function useScrollBus() {
  return useContext(ScrollBusContext);
}

export function useScrollSnapshot(): ScrollSnapshot {
  const bus = useScrollBus();

  return useSyncExternalStore(
    (onStoreChange) => bus.subscribe(onStoreChange),
    () => bus.getSnapshot(),
    () => bus.getServerSnapshot(),
  );
}

/** Imperative access for non-React chrome logic that shares the scroll bus */
export function subscribeScrollSnapshot(onStoreChange: () => void): () => void {
  return scrollBus.subscribe(onStoreChange);
}

export function getScrollSnapshot(): ScrollSnapshot {
  return scrollBus.getSnapshot();
}
