"use client";

import { Marker } from "react-map-gl/maplibre";
import { motion, AnimatePresence } from "framer-motion";
import { CCTV_LOCATIONS } from "@/lib/constants";

interface CctvMarkersProps {
  revealedIds: Set<string>;
  activeEventId: string;
}

// Map CCTV IDs to the event IDs they're most associated with
const CCTV_ACTIVE_EVENTS: Record<string, string[]> = {
  "bijuli-bazaar": ["e05", "e06"],
  "everest-hotel": ["e07"],
  "bicc-gate": ["e09", "e12", "e13", "e14", "e18", "e20", "e21", "e25", "e30"],
  "parliament-west": ["e16", "e22", "e26", "e27"],
  "civil-hospital": ["e15", "e17", "e29", "e32"],
  "baneshwor-chowk": ["e11", "e33", "e35"],
  "nepal-commerce": ["e08"],
  "arabica-coffee": ["e19", "e28"],
};

export default function CctvMarkers({ revealedIds, activeEventId }: CctvMarkersProps) {
  return (
    <>
      <AnimatePresence>
        {CCTV_LOCATIONS.map((loc) => {
          const isRevealed = revealedIds.has(loc.id);
          if (!isRevealed) return null;

          const isActive = CCTV_ACTIVE_EVENTS[loc.id]?.includes(activeEventId) ?? false;

          return (
            <Marker
              key={loc.id}
              longitude={loc.coords[0]}
              latitude={loc.coords[1]}
              anchor="center"
            >
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                className="group relative cursor-pointer"
              >
                {/* Pulsing ring — always visible but brighter when active */}
                <div
                  className={`absolute -inset-2 animate-ping rounded-full ${
                    isActive ? "bg-red-500/50" : "bg-red-500/20"
                  }`}
                />
                {/* Extra bright pulse for active CCTV */}
                {isActive && (
                  <div className="absolute -inset-4 animate-ping rounded-full bg-red-400/30" style={{ animationDuration: "1.5s" }} />
                )}
                {/* Camera icon */}
                <div
                  className={`relative flex h-6 w-6 items-center justify-center rounded-full shadow-lg transition-all duration-300 ${
                    isActive
                      ? "bg-red-600 ring-2 ring-white shadow-red-500/50"
                      : "bg-zinc-900/90 ring-2 ring-red-500/60"
                  }`}
                >
                  <svg
                    className={`h-3.5 w-3.5 ${isActive ? "text-white" : "text-red-400"}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                    <circle cx="12" cy="13" r="3" />
                  </svg>
                </div>
                {/* Tooltip */}
                <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-zinc-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="font-medium">{loc.label}</span>
                  <br />
                  <span className="text-zinc-400 text-[10px]">{loc.labelNp}</span>
                </div>
              </motion.div>
            </Marker>
          );
        })}
      </AnimatePresence>
    </>
  );
}
