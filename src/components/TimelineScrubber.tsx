"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { timelineEvents } from "@/data/timeline";
import type { Phase } from "@/lib/constants";

interface TimelineScrubberProps {
  activeIndex: number;
  visible: boolean;
  onJumpToIndex?: (index: number) => void;
}

const PHASE_BAR_COLORS: Record<Phase, string> = {
  gathering: "bg-[#267163]",
  escalation: "bg-amber-500",
  curfew: "bg-red-600",
  aftermath: "bg-zinc-500",
};

const PHASE_DOT_COLORS: Record<Phase, string> = {
  gathering: "bg-[#267163] shadow-[#267163]/50",
  escalation: "bg-amber-500 shadow-amber-500/50",
  curfew: "bg-red-600 shadow-red-600/50",
  aftermath: "bg-zinc-500 shadow-zinc-500/50",
};

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

const startMin = timeToMinutes(timelineEvents[0].time);
const endMin = timeToMinutes(timelineEvents[timelineEvents.length - 1].time);
const totalSpan = endMin - startMin;

// Key tick marks to display
const TICKS = [
  { time: "08:23", label: "८ः२३", labelEn: "8:23 AM" },
  { time: "10:00", label: "१०ः००", labelEn: "10 AM" },
  { time: "11:00", label: "११ः००", labelEn: "11 AM" },
  { time: "12:30", label: "१२ः३०", labelEn: "12:30 PM" },
  { time: "14:00", label: "१४ः००", labelEn: "2 PM" },
  { time: "16:00", label: "१६ः००", labelEn: "4 PM" },
  { time: "18:15", label: "१८ः१५", labelEn: "6:15 PM" },
];

// Build phase segments as percentage ranges
function buildPhaseSegments() {
  const phases: { phase: Phase; startPct: number; endPct: number }[] = [];
  let currentPhase = timelineEvents[0].phase;
  let segStart = 0;

  for (let i = 1; i < timelineEvents.length; i++) {
    if (timelineEvents[i].phase !== currentPhase) {
      const prevMin = timeToMinutes(timelineEvents[i - 1].time);
      const curMin = timeToMinutes(timelineEvents[i].time);
      const boundary = ((prevMin + curMin) / 2 - startMin) / totalSpan;
      phases.push({ phase: currentPhase, startPct: segStart, endPct: boundary });
      segStart = boundary;
      currentPhase = timelineEvents[i].phase;
    }
  }
  phases.push({ phase: currentPhase, startPct: segStart, endPct: 1 });
  return phases;
}

const phaseSegments = buildPhaseSegments();

export default function TimelineScrubber({
  activeIndex,
  visible,
  onJumpToIndex,
}: TimelineScrubberProps) {
  const activeEvent = timelineEvents[activeIndex] ?? timelineEvents[0];

  const progressPct = useMemo(() => {
    const min = timeToMinutes(activeEvent.time);
    return ((min - startMin) / totalSpan) * 100;
  }, [activeEvent.time]);

  // Click on timeline bar → find nearest event by time percentage
  const handleBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onJumpToIndex) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickPct = (e.clientX - rect.left) / rect.width;
    const clickMin = startMin + clickPct * totalSpan;

    // Find nearest event
    let bestIdx = 0;
    let bestDist = Infinity;
    for (let i = 0; i < timelineEvents.length; i++) {
      const evMin = timeToMinutes(timelineEvents[i].time);
      const dist = Math.abs(evMin - clickMin);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    }
    onJumpToIndex(bestIdx);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed top-0 left-0 z-50 w-full"
        >
          {/* Backdrop */}
          <div className="bg-white/80 backdrop-blur-md border-b border-zinc-200/60 shadow-sm">
            <div className="mx-auto max-w-screen-2xl px-4 py-2 md:px-8">
              {/* Current time display */}
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-400">
                  भदौ २३ · Bhadra 23
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-semibold text-zinc-800">
                    {activeEvent.timeDisplay}
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    ({activeEvent.time})
                  </span>
                </div>
              </div>

              {/* Timeline bar with indicator — clickable */}
              <div className="relative cursor-pointer" onClick={handleBarClick}>
                <div className="relative h-2 w-full rounded-full bg-zinc-100 overflow-hidden">
                  {/* Phase-colored segments */}
                  {phaseSegments.map((seg) => (
                    <div
                      key={seg.phase}
                      className={`absolute top-0 h-full ${PHASE_BAR_COLORS[seg.phase]} opacity-30`}
                      style={{
                        left: `${seg.startPct * 100}%`,
                        width: `${(seg.endPct - seg.startPct) * 100}%`,
                      }}
                    />
                  ))}

                  {/* Filled progress */}
                  <motion.div
                    className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-[#267163] via-amber-500 via-red-600 to-zinc-500"
                    style={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>

                {/* Moving indicator dot — positioned relative to the bar */}
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
                  animate={{ left: `${progressPct}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <div
                    className={`h-4 w-4 rounded-full border-2 border-white shadow-lg ${PHASE_DOT_COLORS[activeEvent.phase]}`}
                  />
                </motion.div>

                {/* Clickable event dots — major events shown as small circles */}
                {timelineEvents.map((ev, i) => {
                  if (!ev.isMajor) return null;
                  const evPct = ((timeToMinutes(ev.time) - startMin) / totalSpan) * 100;
                  const isCurrentEvent = i === activeIndex;
                  return (
                    <button
                      key={ev.id}
                      className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 transition-all duration-200 hover:scale-150 ${
                        isCurrentEvent ? "opacity-0" : ""
                      }`}
                      style={{ left: `${evPct}%` }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onJumpToIndex?.(i);
                      }}
                      title={`${ev.timeDisplay} — ${ev.descriptionEn?.slice(0, 50)}`}
                    >
                      <div className={`h-2 w-2 rounded-full ${PHASE_BAR_COLORS[ev.phase]} ring-1 ring-white cursor-pointer`} />
                    </button>
                  );
                })}
              </div>

              {/* Tick labels — clickable */}
              <div className="relative mt-1 h-4">
                {TICKS.map((tick, i) => {
                  const pct =
                    ((timeToMinutes(tick.time) - startMin) / totalSpan) * 100;
                  const showOnMobile = i === 0 || tick.time === "12:30" || i === TICKS.length - 1;

                  // Find nearest event to this tick time
                  const tickMin = timeToMinutes(tick.time);
                  let nearestIdx = 0;
                  let nearestDist = Infinity;
                  for (let j = 0; j < timelineEvents.length; j++) {
                    const d = Math.abs(timeToMinutes(timelineEvents[j].time) - tickMin);
                    if (d < nearestDist) { nearestDist = d; nearestIdx = j; }
                  }

                  return (
                    <button
                      key={tick.time}
                      className={`absolute -translate-x-1/2 flex flex-col items-center cursor-pointer hover:text-zinc-700 transition-colors ${showOnMobile ? "" : "hidden sm:flex"}`}
                      style={{ left: `${pct}%` }}
                      onClick={() => onJumpToIndex?.(nearestIdx)}
                    >
                      <span className="text-[9px] font-mono text-zinc-400 hover:text-zinc-700">
                        {tick.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
