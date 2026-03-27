"use client";

import { useRef, useEffect, useMemo, useState } from "react";
import Map, { NavigationControl, type MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

import { timelineEvents } from "@/data/timeline";
import {
  MAPBOX_TOKEN,
  INITIAL_VIEW,
  PROTEST_ROUTE,
  getRouteProgressIndex,
  PHASE_LINE_COLORS,
  CCTV_REVEAL_AT,
} from "@/lib/constants";
import type { Phase } from "@/lib/constants";
import { MAP_STYLE_STANDARD } from "@/lib/mapStyles";
import { animateCameraToIndex, setLightPreset, addTerrain } from "@/lib/cameraController";
import CctvMarkers from "./CctvMarker";
import CurfewOverlay from "./CurfewOverlay";

interface MapContainerProps {
  activeIndex: number;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

// Add the full route as a faint dashed background line
function addRouteLayers(map: any, progressCoords: [number, number][], lineColor: string) {
  if (!map.getSource("route-full")) {
    map.addSource("route-full", {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: { type: "LineString", coordinates: PROTEST_ROUTE },
      },
    });
  }
  if (!map.getLayer("route-full-line")) {
    map.addLayer({
      id: "route-full-line",
      type: "line",
      source: "route-full",
      layout: { "line-join": "round", "line-cap": "round" },
      paint: {
        "line-color": "#aaa",
        "line-width": 2,
        "line-opacity": 0.2,
        "line-dasharray": [2, 4],
      },
    });
  }

  if (!map.getSource("route-progress")) {
    map.addSource("route-progress", {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: { type: "LineString", coordinates: progressCoords },
      },
    });
  }
  if (!map.getLayer("route-progress-line")) {
    map.addLayer({
      id: "route-progress-line",
      type: "line",
      source: "route-progress",
      layout: { "line-join": "round", "line-cap": "round" },
      paint: {
        "line-color": lineColor,
        "line-width": 4,
        "line-opacity": 0.85,
      },
    });
  }

  if (!map.getSource("route-head")) {
    const lastCoord = progressCoords[progressCoords.length - 1] || PROTEST_ROUTE[0];
    map.addSource("route-head", {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: { type: "Point", coordinates: lastCoord },
      },
    });
  }
  if (!map.getLayer("route-head-dot")) {
    map.addLayer({
      id: "route-head-dot",
      type: "circle",
      source: "route-head",
      paint: {
        "circle-radius": 6,
        "circle-color": lineColor,
        "circle-stroke-width": 2,
        "circle-stroke-color": "#fff",
        "circle-opacity": 0.9,
      },
    });
  }
}

function updateRouteProgress(map: any, progressCoords: [number, number][], lineColor: string) {
  const src = map.getSource("route-progress");
  if (src) {
    src.setData({
      type: "Feature",
      properties: {},
      geometry: { type: "LineString", coordinates: progressCoords },
    });
  }

  const headSrc = map.getSource("route-head");
  if (headSrc) {
    const lastCoord = progressCoords[progressCoords.length - 1] || PROTEST_ROUTE[0];
    headSrc.setData({
      type: "Feature",
      properties: {},
      geometry: { type: "Point", coordinates: lastCoord },
    });
  }

  if (map.getLayer("route-progress-line")) {
    map.setPaintProperty("route-progress-line", "line-color", lineColor);
  }
  if (map.getLayer("route-head-dot")) {
    map.setPaintProperty("route-head-dot", "circle-color", lineColor);
  }
}

export default function MapContainer({ activeIndex }: MapContainerProps) {
  const mapRef = useRef<MapRef>(null);
  const prevIndexRef = useRef(0);
  const [revealedCCTVs, setRevealedCCTVs] = useState<Set<string>>(new Set());

  const activeEvent = useMemo(
    () => timelineEvents[activeIndex] ?? timelineEvents[0],
    [activeIndex]
  );

  const isCurfew =
    activeEvent.phase === "curfew" || activeEvent.phase === "aftermath";

  const routeProgressIdx = getRouteProgressIndex(activeIndex);
  const progressCoords = PROTEST_ROUTE.slice(0, routeProgressIdx + 1);
  const lineColor = PHASE_LINE_COLORS[activeEvent.phase];

  // Update revealed CCTVs (monotonic)
  useEffect(() => {
    setRevealedCCTVs((prev) => {
      const next = new Set(prev);
      for (const [cctvId, revealIdx] of Object.entries(CCTV_REVEAL_AT)) {
        if (activeIndex >= revealIdx) {
          next.add(cctvId);
        }
      }
      return next.size !== prev.size ? next : prev;
    });
  }, [activeIndex]);

  // Fly camera + update route + set light preset
  useEffect(() => {
    const mapWrapper = mapRef.current;
    if (!mapWrapper) return;

    const rawMap = mapWrapper.getMap();
    const prevIndex = prevIndexRef.current;
    prevIndexRef.current = activeIndex;

    // Use the reusable camera controller
    animateCameraToIndex(rawMap, activeIndex, prevIndex);

    // Update light preset for phase-aware atmosphere
    setLightPreset(rawMap, activeEvent.phase);

    // Update route line progress
    if (rawMap.getSource("route-progress")) {
      updateRouteProgress(rawMap, progressCoords, lineColor);
    }
  }, [activeEvent, activeIndex, progressCoords, lineColor]);

  return (
    <div className="relative h-full w-full">
      <Map
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={INITIAL_VIEW}
        mapStyle={MAP_STYLE_STANDARD}
        style={{ width: "100%", height: "100%" }}
        attributionControl={false}
        interactive={false}
        onLoad={(e) => {
          const map = e.target;
          addTerrain(map);
          addRouteLayers(map, progressCoords, lineColor);
          // Set initial light preset
          setLightPreset(map, activeEvent.phase);
        }}
        onStyleData={() => {
          const map = mapRef.current?.getMap();
          if (!map) return;
          setTimeout(() => {
            if (!map.getSource("mapbox-dem")) addTerrain(map);
            addRouteLayers(map, progressCoords, lineColor);
          }, 100);
        }}
      >
        <NavigationControl
          position="bottom-right"
          showCompass={false}
          visualizePitch={false}
        />
        <CctvMarkers
          revealedIds={revealedCCTVs}
          activeEventId={activeEvent.id}
        />
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
