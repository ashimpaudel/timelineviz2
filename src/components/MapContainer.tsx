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

/* eslint-disable @typescript-eslint/no-explicit-any */
function add3DBuildings(map: any, isDark: boolean) {
  if (map.getLayer("3d-buildings")) return;

  const labelLayerId = map
    .getStyle()
    ?.layers?.find(
      (layer: any) => layer.type === "symbol" && (layer.layout as Record<string, unknown>)?.["text-field"]
    )?.id;

  map.addLayer(
    {
      id: "3d-buildings",
      source: "composite",
      "source-layer": "building",
      filter: ["==", "extrude", "true"],
      type: "fill-extrusion",
      minzoom: 14,
      paint: {
        "fill-extrusion-color": isDark ? "#1a1a2e" : "#ddd",
        "fill-extrusion-height": [
          "interpolate",
          ["linear"],
          ["zoom"],
          14,
          0,
          14.5,
          ["get", "height"],
        ],
        "fill-extrusion-base": [
          "interpolate",
          ["linear"],
          ["zoom"],
          14,
          0,
          14.5,
          ["get", "min_height"],
        ],
        "fill-extrusion-opacity": isDark ? 0.7 : 0.6,
      },
    },
    labelLayerId
  );
}

function addTerrain(map: any) {
  if (map.getSource("mapbox-dem")) return;

  map.addSource("mapbox-dem", {
    type: "raster-dem",
    url: "mapbox://mapbox.mapbox-terrain-dem-v1",
    tileSize: 512,
    maxzoom: 14,
  });
  map.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });
}

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
        onLoad={(e) => {
          const map = e.target;
          add3DBuildings(map, false);
          addTerrain(map);
        }}
        onStyleData={() => {
          const map = mapRef.current?.getMap();
          if (!map) return;
          // Re-add 3D buildings after style switch (curfew ↔ normal)
          setTimeout(() => {
            add3DBuildings(map, isCurfew);
            if (!map.getSource("mapbox-dem")) addTerrain(map);
          }, 100);
        }}
      >
        <NavigationControl
          position="bottom-right"
          showCompass={false}
          visualizePitch={false}
        />
        <CctvMarkers />
      </Map>
      <CurfewOverlay active={isCurfew} />

      {/* Floating event info overlay */}
      <div className="absolute bottom-4 left-4 z-30 max-w-xs">
        <div className="rounded-lg bg-black/70 px-4 py-3 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg font-bold text-white">
              {activeEvent.timeDisplay}
            </span>
            <span className="text-xs text-white/50">
              ({activeEvent.time})
            </span>
          </div>
          {activeEvent.locationEn && (
            <p className="mt-1 text-xs font-medium text-[#2d8a78]">
              📍 {activeEvent.locationNp ?? activeEvent.locationEn}
            </p>
          )}
          <p className="mt-1 text-[11px] leading-snug text-white/70 line-clamp-2">
            {activeEvent.descriptionEn}
          </p>
        </div>
      </div>
    </div>
  );
}
