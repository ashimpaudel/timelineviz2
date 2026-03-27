"use client";

import { useCallback } from "react";
import { timelineEvents } from "@/data/timeline";
import TimelineCard from "./TimelineCard";
import { useActiveCard } from "@/hooks/useActiveCard";

interface ScrollCardsProps {
  activeIndex: number;
  onActiveChange: (index: number) => void;
}

export default function ScrollCards({
  activeIndex,
  onActiveChange,
}: ScrollCardsProps) {
  const stableOnChange = useCallback(
    (idx: number) => onActiveChange(idx),
    [onActiveChange]
  );
  const { setCardRef } = useActiveCard(timelineEvents.length, stableOnChange);

  return (
    <div className="relative z-20 flex flex-col gap-6 py-[50vh] px-4 md:px-8">
      {timelineEvents.map((event, i) => (
        <TimelineCard
          key={event.id}
          ref={setCardRef(i)}
          event={event}
          isActive={i === activeIndex}
          index={i}
        />
      ))}
    </div>
  );
}
