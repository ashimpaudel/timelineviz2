"use client";

import { useEffect, useRef, useCallback } from "react";

export function useActiveCard(
  count: number,
  onChange: (index: number) => void
) {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const setCardRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      cardRefs.current[index] = el;
    },
    []
  );

  // Programmatic scroll-to-card — IntersectionObserver will fire and sync the map
  const scrollToCard = useCallback((index: number) => {
    const el = cardRefs.current[index];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        let bestEntry: IntersectionObserverEntry | null = null;
        let bestRatio = 0;

        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            bestEntry = entry;
          }
        }

        if (bestEntry) {
          const index = cardRefs.current.indexOf(
            bestEntry.target as HTMLDivElement
          );
          if (index !== -1) {
            onChange(index);
          }
        }
      },
      {
        root: null,
        rootMargin: "-35% 0px -35% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observerRef.current!.observe(ref);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [count, onChange]);

  return { setCardRef, scrollToCard };
}
