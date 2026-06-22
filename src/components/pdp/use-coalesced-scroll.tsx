"use client";

import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type ScrollSnapshot = {
  scrollY: number;
  viewportHeight: number;
};

type ScrollListener = (snapshot: ScrollSnapshot) => void;

/** Stable SSR snapshot — must be referentially identical across calls */
const SERVER_SNAPSHOT: ScrollSnapshot = { scrollY: 0, viewportHeight: 0 };

class ScrollBus {
  private listeners = new Set<() => void>();
  private frame = 0;
  private snapshot: ScrollSnapshot = SERVER_SNAPSHOT;
  private subscribed = false;

  /** Returns true when values changed — assigns a new object for useSyncExternalStore */
  private commitSnapshot(scrollY: number, viewportHeight: number): boolean {
    if (
      this.snapshot.scrollY === scrollY &&
      this.snapshot.viewportHeight === viewportHeight
    ) {
      return false;
    }

    this.snapshot = { scrollY, viewportHeight };
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

/** Shared RAF-coalesced scroll subscription — one listener for all consumers */
function useCoalescedScroll(listener: ScrollListener) {
  const bus = useScrollBus();

  useEffect(
    () =>
      bus.subscribe(() => {
        listener(bus.getSnapshot());
      }),
    [bus, listener],
  );
}

export function useScrollSnapshot(): ScrollSnapshot {
  const bus = useScrollBus();

  return useSyncExternalStore(
    (onStoreChange) => bus.subscribe(onStoreChange),
    () => bus.getSnapshot(),
    () => bus.getServerSnapshot(),
  );
}
