"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** How long a quick-add button shows its "Added" confirmation before reverting. */
const ADDED_RESET_MS = 1400;

/**
 * Quick-add confirmation state for rails of small add buttons. Marking an id as
 * added flips it to its "Added" look, then auto-reverts after a short beat so the
 * same item can be added again and again — every tap is a real add to bag.
 */
export function useTransientAddedSet(resetMs: number = ADDED_RESET_MS) {
  const [addedIds, setAddedIds] = useState<Set<string>>(() => new Set());
  const timeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
      timeouts.clear();
    };
  }, []);

  const confirmAdd = useCallback(
    (id: string) => {
      setAddedIds((current) => new Set(current).add(id));

      const existing = timeoutsRef.current.get(id);
      if (existing) {
        clearTimeout(existing);
      }

      timeoutsRef.current.set(
        id,
        setTimeout(() => {
          timeoutsRef.current.delete(id);
          setAddedIds((current) => {
            const next = new Set(current);
            next.delete(id);
            return next;
          });
        }, resetMs),
      );
    },
    [resetMs],
  );

  const isAdded = useCallback((id: string) => addedIds.has(id), [addedIds]);

  return { isAdded, confirmAdd };
}
