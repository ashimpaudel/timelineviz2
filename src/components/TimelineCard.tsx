"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import type { TimelineEvent } from "@/data/timeline";
import { PHASE_COLORS, PHASE_LABELS } from "@/lib/constants";

interface TimelineCardProps {
  event: TimelineEvent;
  isActive: boolean;
  index: number;
}

const TimelineCard = forwardRef<HTMLDivElement, TimelineCardProps>(
  ({ event, isActive, index }, ref) => {
    const colors = PHASE_COLORS[event.phase];
    const phaseLabel = PHASE_LABELS[event.phase];

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.6, delay: 0.05, ease: "easeOut" }}
        className={`
          relative rounded-lg border-l-4 px-6 py-5 transition-all duration-500
          ${colors.accent}
          ${isActive
            ? `${colors.bg} shadow-lg scale-[1.02] backdrop-blur-md bg-white/80`
            : "bg-white/60 backdrop-blur-sm shadow-sm scale-100 opacity-60"
          }
        `}
        data-index={index}
      >
        {/* Time badge */}
        <div className="mb-3 flex items-center gap-3">
          <span
            className={`
              inline-flex items-center rounded-full px-3 py-0.5 font-mono text-sm font-semibold
              ${isActive ? colors.bg + " " + colors.text : "bg-zinc-100 text-zinc-500"}
            `}
          >
            {event.timeDisplay}
          </span>
          <span
            className={`text-[10px] font-medium uppercase tracking-widest ${
              isActive ? colors.text : "text-zinc-400"
            }`}
          >
            {phaseLabel.np} · {phaseLabel.en}
          </span>
          {event.isMajor && (
            <span className="ml-auto h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          )}
        </div>

        {/* Nepali text (primary) */}
        <p
          className={`
            font-serif text-base leading-relaxed transition-colors duration-300
            ${isActive ? "text-zinc-900" : "text-zinc-600"}
          `}
          lang="ne"
        >
          {event.descriptionNp}
        </p>

        {/* English subtitle */}
        <p
          className={`
            mt-2 font-sans text-sm italic leading-relaxed transition-colors duration-300
            ${isActive ? "text-zinc-600" : "text-zinc-400"}
          `}
        >
          {event.descriptionEn}
        </p>
      </motion.div>
    );
  }
);

TimelineCard.displayName = "TimelineCard";
export default TimelineCard;
