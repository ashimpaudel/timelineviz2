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

// Phase-aware base speeds — more urgent during crisis
const PHASE_FLYTO: Record<Phase, { speed: number; curve: number }> = {
  gathering: { speed: 0.6, curve: 1.4 },
  escalation: { speed: 0.9, curve: 1.2 },
  curfew: { speed: 1.2, curve: 1.0 },
  aftermath: { speed: 0.7, curve: 1.3 },
};

// Haversine distance in meters between two [lng, lat] points
function distanceMeters(a: [number, number], b: [number, number]): number {
  const R = 6371000;
  const dLat = ((b[1] - a[1]) * Math.PI) / 180;
  const dLng = ((b[0] - a[0]) * Math.PI) / 180;
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h =
    sinDLat * sinDLat +
    Math.cos((a[1] * Math.PI) / 180) *
      Math.cos((b[1] * Math.PI) / 180) *
      sinDLng * sinDLng;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

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
  const prevIndexRef = useRef(0);

  const activeEvent = useMemo(
    () => timelineEvents[activeIndex] ?? timelineEvents[0],
    [activeIndex]
  );

  const isCurfew =
    activeEvent.phase === "curfew" || activeEvent.phase === "aftermath";

  // Distance-aware flyTo: slow down for short moves to avoid dizziness
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const prevEvent = timelineEvents[prevIndexRef.current] ?? timelineEvents[0];
    prevIndexRef.current = activeIndex;

    const dist = distanceMeters(prevEvent.coords, activeEvent.coords);
    const baseConfig = PHASE_FLYTO[activeEvent.phase];

    let speed = baseConfig.speed;
    let curve = baseConfig.curve;

    if (dist < 50) {
      // Same location or tiny move — ease gently
      speed = 0.3;
      curve = 1.6;
    } else if (dist < 300) {
      // Short move (Bijuli→BICC area) — slow and smooth
      speed = 0.4;
      curve = 1.5;
    } else if (dist < 600) {
      // Medium move — moderate speed
      speed = Math.min(speed, 0.6);
      curve = 1.3;
    }
    // Long moves (>600m) use the phase default speed

    map.flyTo({
      center: activeEvent.coords,
      zoom: activeEvent.zoom,
      bearing: activeEvent.bearing,
      pitch: activeEvent.pitch,
      speed,
      curve,
      essential: true,
    });
  }, [activeEvent, activeIndex]);

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
      <div className="absolute bottom-2 left-2 z-30 max-w-[200px] md:bottom-4 md:left-4 md:max-w-xs">
        <div className="rounded-lg bg-black/70 px-3 py-2 backdrop-blur-sm md:px-4 md:py-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-white md:text-lg">
              {activeEvent.timeDisplay}
            </span>
            <span className="hidden text-xs text-white/50 md:inline">
              ({activeEvent.time})
            </span>
          </div>
          {activeEvent.locationEn && (
            <p className="mt-0.5 text-[10px] font-medium text-[#2d8a78] md:mt-1 md:text-xs">
              📍 {activeEvent.locationNp ?? activeEvent.locationEn}
            </p>
          )}
          <p className="mt-0.5 hidden text-[11px] leading-snug text-white/70 line-clamp-2 md:block md:mt-1">
            {activeEvent.descriptionEn}
          </p>
        </div>
      </div>
    </div>
  );
}
