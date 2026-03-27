"use client";

import { forwardRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { TimelineEvent } from "@/data/timeline";
import { PHASE_COLORS, PHASE_LABELS } from "@/lib/constants";

// Phase-specific glow colors for active cards
const PHASE_GLOW: Record<string, string> = {
  gathering: "shadow-[0_0_20px_rgba(38,113,99,0.4)]",
  escalation: "shadow-[0_0_20px_rgba(245,158,11,0.4)]",
  curfew: "shadow-[0_0_20px_rgba(220,38,38,0.4)]",
  aftermath: "shadow-[0_0_20px_rgba(113,113,122,0.3)]",
};

interface TimelineCardProps {
  event: TimelineEvent;
  isActive: boolean;
  index: number;
}

const TimelineCard = forwardRef<HTMLDivElement, TimelineCardProps>(
  ({ event, isActive, index }, ref) => {
    const colors = PHASE_COLORS[event.phase];
    const phaseLabel = PHASE_LABELS[event.phase];
    const [imgError, setImgError] = useState(false);
    const glow = PHASE_GLOW[event.phase];

    const hasMedia = event.media && !imgError;

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.6, delay: 0.05, ease: "easeOut" }}
        className="relative"
        data-index={index}
      >
        {/* Active indicator dot on left */}
        <motion.div
          animate={{
            scale: isActive ? 1 : 0,
            opacity: isActive ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="absolute -left-3 top-6 z-10 flex items-center md:-left-4"
        >
          <div className={`h-3 w-3 rounded-full ${isActive ? colors.accent.replace("border-", "bg-") : "bg-transparent"}`} />
          <div className={`h-px w-3 ${isActive ? colors.accent.replace("border-", "bg-") : "bg-transparent"}`} />
        </motion.div>

        <motion.div
          animate={{
            opacity: isActive ? 1 : 0.25,
            scale: isActive ? 1 : 0.95,
            y: isActive ? 0 : 4,
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={`
            overflow-hidden rounded-lg border-l-4 transition-shadow duration-500
            ${colors.accent}
            ${isActive
              ? `${colors.bg} bg-white/90 backdrop-blur-md ${glow} ring-1 ring-black/5`
              : "bg-white/40 backdrop-blur-sm"
            }
          `}
        >
          {/* Image section */}
          {hasMedia && (
            <div className="relative w-full overflow-hidden bg-zinc-100">
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src={event.media!.url}
                  alt={event.media!.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className={`
                    object-cover transition-all duration-700
                    ${isActive ? "scale-100 brightness-100" : "scale-105 brightness-50 grayscale-[60%]"}
                  `}
                  onError={() => setImgError(true)}
                />
                {/* CCTV badge */}
                {event.media!.type === "cctv" && (
                  <div className="absolute top-2 left-2 flex items-center gap-1.5 rounded bg-black/70 px-2 py-0.5 text-[10px] font-mono text-red-400 uppercase tracking-wider">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                    CCTV
                  </div>
                )}
                {/* Gradient overlay for text readability */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />
                {/* Caption */}
                <div className="absolute inset-x-0 bottom-0 px-3 pb-2">
                  <p className="text-[11px] leading-tight text-white/90">
                    {event.media!.captionEn}
                  </p>
                  {event.media!.credit && (
                    <p className="mt-0.5 text-[9px] text-white/60">
                      Source: {event.media!.credit}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Placeholder for major events without images loaded yet */}
          {event.isMajor && !hasMedia && (
            <div className={`
              relative aspect-[16/7] w-full overflow-hidden
              ${event.phase === "curfew"
                ? "bg-gradient-to-br from-red-900/20 via-red-800/10 to-zinc-900/20"
                : event.phase === "aftermath"
                ? "bg-gradient-to-br from-zinc-800/20 via-zinc-700/10 to-zinc-600/20"
                : event.phase === "escalation"
                ? "bg-gradient-to-br from-amber-900/20 via-amber-800/10 to-zinc-800/20"
                : "bg-gradient-to-br from-[#267163]/20 via-[#267163]/10 to-zinc-700/15"
              }
            `}>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400">
                <svg className="mb-1 h-6 w-6 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                </svg>
                <span className="text-[10px] uppercase tracking-wider opacity-40">Image pending</span>
              </div>
            </div>
          )}

          {/* Text content */}
          <div className="px-6 py-5">
            {/* Time badge + location */}
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span
                className={`
                  inline-flex items-center rounded-full px-3 py-0.5 font-mono text-sm font-semibold
                  ${isActive ? colors.bg + " " + colors.text : "bg-zinc-100 text-zinc-400"}
                `}
              >
                {event.timeDisplay}
              </span>
              <span
                className={`text-[10px] font-medium uppercase tracking-widest ${
                  isActive ? colors.text : "text-zinc-300"
                }`}
              >
                {phaseLabel.np} · {phaseLabel.en}
              </span>
              {event.isMajor && (
                <span className="ml-auto h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </div>

            {/* Location label */}
            {event.locationEn && (
              <p className={`mb-2 text-[11px] font-medium uppercase tracking-wider ${isActive ? "text-zinc-500" : "text-zinc-300"}`}>
                📍 {event.locationNp} · {event.locationEn}
              </p>
            )}

            {/* Nepali text (primary) */}
            <p
              className={`
                font-serif text-base leading-relaxed transition-colors duration-300
                ${isActive ? "text-zinc-900" : "text-zinc-400"}
              `}
              lang="ne"
            >
              {event.descriptionNp}
            </p>

            {/* English subtitle */}
            <p
              className={`
                mt-2 font-sans text-sm italic leading-relaxed transition-colors duration-300
                ${isActive ? "text-zinc-600" : "text-zinc-300"}
              `}
            >
              {event.descriptionEn}
            </p>
          </div>
        </motion.div>
      </motion.div>
    );
  }
);

TimelineCard.displayName = "TimelineCard";
export default TimelineCard;
