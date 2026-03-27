"use client";

import { useRef, useEffect, useMemo } from "react";
import Map, { NavigationControl, type MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

import { timelineEvents } from "@/data/timeline";
import { MAPBOX_TOKEN, INITIAL_VIEW } from "@/lib/constants";
import type { Phase } from "@/lib/constants";
import { MAP_STYLE_NORMAL, MAP_STYLE_CURFEW } from "@/lib/mapStyles";
import CctvMarkers from "./CctvMarker";
import CurfewOverlay from "./CurfewOverlay";

interface MapContainerProps {
  activeIndex: number;
}

// Phase-aware flyTo speeds — more urgent during crisis
const PHASE_FLYTO: Record<Phase, { speed: number; curve: number }> = {
  gathering: { speed: 0.6, curve: 1.4 },
  escalation: { speed: 0.9, curve: 1.2 },
  curfew: { speed: 1.2, curve: 1.0 },
  aftermath: { speed: 0.7, curve: 1.3 },
};

export default function MapContainer({ activeIndex }: MapContainerProps) {
  const mapRef = useRef<MapRef>(null);

  const activeEvent = useMemo(
    () => timelineEvents[activeIndex] ?? timelineEvents[0],
    [activeIndex]
  );

  const isCurfew =
    activeEvent.phase === "curfew" || activeEvent.phase === "aftermath";

  // Fly to active event with phase-aware speed
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const flyConfig = PHASE_FLYTO[activeEvent.phase];

    map.flyTo({
      center: activeEvent.coords,
      zoom: activeEvent.zoom,
      bearing: activeEvent.bearing,
      pitch: activeEvent.pitch,
      speed: flyConfig.speed,
      curve: flyConfig.curve,
      essential: true,
    });
  }, [activeEvent]);

  return (
    <div className="relative h-full w-full">
      <Map
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={INITIAL_VIEW}
        mapStyle={isCurfew ? MAP_STYLE_CURFEW : MAP_STYLE_NORMAL}
        style={{ width: "100%", height: "100%" }}
        attributionControl={false}
        interactive={false}
      >
        <NavigationControl
          position="bottom-right"
          showCompass={false}
          visualizePitch={false}
        />
        <CctvMarkers />
      </Map>
      <CurfewOverlay active={isCurfew} />
    </div>
  );
}
