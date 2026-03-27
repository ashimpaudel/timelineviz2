"use client";

import { useCallback } from "react";
import { timelineEvents } from "@/data/timeline";
import TimelineCard from "./TimelineCard";
import { useActiveCard } from "@/hooks/useActiveCard";

interface ScrollCardsProps {
  activeIndex: number;
  onActiveChange: (index: number) => void;
  onScrollToCardReady?: (scrollTo: (index: number) => void) => void;
}

export default function ScrollCards({
  activeIndex,
  onActiveChange,
  onScrollToCardReady,
}: ScrollCardsProps) {
  const stableOnChange = useCallback(
    (idx: number) => onActiveChange(idx),
    [onActiveChange]
  );
  const { setCardRef, scrollToCard } = useActiveCard(timelineEvents.length, stableOnChange);

  // Expose scrollToCard to parent (for timeline scrubber clicks)
  if (onScrollToCardReady) {
    onScrollToCardReady(scrollToCard);
  }

  return (
    <div className="relative z-20 flex flex-col gap-6 py-[50vh] px-4 md:px-8 md:pl-6">
      {/* Vertical timeline connector line */}
      <div className="absolute left-1 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-zinc-300 to-transparent md:left-2" />

      {timelineEvents.map((event, i) => (
        <TimelineCard
          key={event.id}
          ref={setCardRef(i)}
          event={event}
          isActive={i === activeIndex}
          index={i}
          onClick={() => scrollToCard(i)}
        />
      ))}
    </div>
  );
}
