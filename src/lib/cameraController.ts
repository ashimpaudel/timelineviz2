import { timelineEvents, type TimelineEvent } from "@/data/timeline";
import type { Phase } from "@/lib/constants";

// Default 3D perspective when event doesn't specify custom angles
const DEFAULT_PITCH = 70;
const DEFAULT_BEARING = -20;

// Phase-aware base speeds — more urgent during crisis
const PHASE_FLYTO: Record<Phase, { speed: number; curve: number }> = {
  gathering: { speed: 0.6, curve: 1.4 },
  escalation: { speed: 0.9, curve: 1.2 },
  curfew: { speed: 1.2, curve: 1.0 },
  aftermath: { speed: 0.7, curve: 1.3 },
};

// Phase → Mapbox Standard light preset (fallback)
export const PHASE_LIGHT_PRESET: Record<Phase, string> = {
  gathering: "day",
  escalation: "day",
  curfew: "dusk",
  aftermath: "night",
};

/**
 * Determine light preset from event timestamp for realistic time-of-day lighting.
 * - 08:00–12:29  → "day"     (bright morning/midday)
 * - 12:30–14:59  → "dusk"    (curfew begins — ominous dimming)
 * - 15:00–16:59  → "dusk"    (late afternoon)
 * - 17:00+       → "night"   (evening darkness)
 */
function getTimeBasedLightPreset(time: string, phase: Phase): string {
  const [h, m] = time.split(":").map(Number);
  const minutes = h * 60 + m;

  if (minutes < 750) return "day";       // before 12:30
  if (phase === "curfew") return "dusk";  // 12:30–13:59 curfew = ominous
  if (minutes < 1020) return "dusk";      // 15:00–16:59
  return "night";                          // 17:00+
}

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

interface CameraOptions {
  /** Previous event for distance-aware speed calculation */
  previousEvent?: TimelineEvent;
  /** Override speed (0.1–2.0) */
  speed?: number;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Reusable 3D camera controller.
 * Finds event by ID, applies distance-aware + phase-aware flyTo with 3D defaults.
 */
export function animateCameraToEvent(
  map: any,
  eventId: string,
  options?: CameraOptions
): void {
  const event = timelineEvents.find((e) => e.id === eventId);
  if (!event || !map) return;

  const pitch = event.pitch || DEFAULT_PITCH;
  const bearing = event.bearing ?? DEFAULT_BEARING;
  const baseConfig = PHASE_FLYTO[event.phase];

  let speed = options?.speed ?? baseConfig.speed;
  let curve = baseConfig.curve;

  // Distance-aware speed: slow down for short moves
  if (options?.previousEvent) {
    const dist = distanceMeters(options.previousEvent.coords, event.coords);
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
  }

  map.flyTo({
    center: event.coords,
    zoom: event.zoom,
    bearing,
    pitch,
    speed,
    curve,
    essential: true,
  });
}

/**
 * Animate to event by index (convenience wrapper).
 */
export function animateCameraToIndex(
  map: any,
  index: number,
  previousIndex?: number
): void {
  const event = timelineEvents[index];
  if (!event) return;

  const previousEvent =
    previousIndex !== undefined ? timelineEvents[previousIndex] : undefined;

  animateCameraToEvent(map, event.id, { previousEvent });
}

/**
 * Apply the time-aware light preset to a Mapbox Standard style map.
 * Uses event timestamp for realistic day→dusk→night progression.
 */
export function setLightPreset(map: any, phase: Phase, time?: string): void {
  const preset = time
    ? getTimeBasedLightPreset(time, phase)
    : PHASE_LIGHT_PRESET[phase];
  try {
    map.setConfigProperty("basemap", "lightPreset", preset);
  } catch {
    // Silently fail if style doesn't support config properties
  }
}

/**
 * Add terrain to the map.
 */
export function addTerrain(map: any): void {
  if (map.getSource("mapbox-dem")) return;

  map.addSource("mapbox-dem", {
    type: "raster-dem",
    url: "mapbox://mapbox.mapbox-terrain-dem-v1",
    tileSize: 512,
    maxzoom: 14,
  });
  map.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });
}
