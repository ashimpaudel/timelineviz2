"use client";

import { Marker } from "react-map-gl/mapbox";
import { CCTV_LOCATIONS } from "@/lib/constants";

export default function CctvMarkers() {
  return (
    <>
      {CCTV_LOCATIONS.map((loc) => (
        <Marker
          key={loc.id}
          longitude={loc.coords[0]}
          latitude={loc.coords[1]}
          anchor="center"
        >
          <div className="group relative cursor-pointer">
            {/* Pulsing ring */}
            <div className="absolute -inset-2 animate-ping rounded-full bg-red-500/30" />
            {/* Camera icon */}
            <div className="relative flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900/90 ring-2 ring-red-500/60 shadow-lg">
              <svg
                className="h-3.5 w-3.5 text-red-400"
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
          </div>
        </Marker>
      ))}
    </>
  );
}
