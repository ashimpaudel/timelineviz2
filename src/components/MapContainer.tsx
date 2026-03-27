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

// Add the full route as a faint dashed background line
function addRouteLayers(map: any, progressCoords: [number, number][], lineColor: string) {
  // Full route — faint dashed guide
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

  // Progress route — solid, bright
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

  // Animated head dot at the end of progress line
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

  // Update colors
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

  // Compute route progress coordinates
  const routeProgressIdx = getRouteProgressIndex(activeIndex);
  const progressCoords = PROTEST_ROUTE.slice(0, routeProgressIdx + 1);
  const lineColor = PHASE_LINE_COLORS[activeEvent.phase];

  // Update revealed CCTVs (monotonic — once shown, stays shown)
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

  // Distance-aware flyTo + route line update
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
      speed = 0.3;
      curve = 1.6;
    } else if (dist < 300) {
      speed = 0.4;
      curve = 1.5;
    } else if (dist < 600) {
      speed = Math.min(speed, 0.6);
      curve = 1.3;
    }

    map.flyTo({
      center: activeEvent.coords,
      zoom: activeEvent.zoom,
      bearing: activeEvent.bearing,
      pitch: activeEvent.pitch,
      speed,
      curve,
      essential: true,
    });

    // Update route line progress
    const rawMap = map.getMap();
    if (rawMap && rawMap.getSource("route-progress")) {
      updateRouteProgress(rawMap, progressCoords, lineColor);
    }
  }, [activeEvent, activeIndex, progressCoords, lineColor]);

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
          addRouteLayers(map, progressCoords, lineColor);
        }}
        onStyleData={() => {
          const map = mapRef.current?.getMap();
          if (!map) return;
          // Re-add all custom layers after style swap
          setTimeout(() => {
            add3DBuildings(map, isCurfew);
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
