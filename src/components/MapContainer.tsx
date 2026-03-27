"use client";

import { useRef, useEffect, useMemo } from "react";
import Map, { NavigationControl, type MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

import { timelineEvents } from "@/data/timeline";
import { MAPBOX_TOKEN, INITIAL_VIEW, FLYTO_DEFAULTS } from "@/lib/constants";
import { MAP_STYLE_NORMAL, MAP_STYLE_CURFEW } from "@/lib/mapStyles";
import CctvMarkers from "./CctvMarker";
import CurfewOverlay from "./CurfewOverlay";

interface MapContainerProps {
  activeIndex: number;
}

export default function MapContainer({ activeIndex }: MapContainerProps) {
  const mapRef = useRef<MapRef>(null);

  const activeEvent = useMemo(
    () => timelineEvents[activeIndex] ?? timelineEvents[0],
    [activeIndex]
  );

  const isCurfew =
    activeEvent.phase === "curfew" || activeEvent.phase === "aftermath";

  // Fly to active event
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    map.flyTo({
      center: activeEvent.coords,
      zoom: activeEvent.zoom,
      bearing: activeEvent.bearing,
      pitch: activeEvent.pitch,
      ...FLYTO_DEFAULTS,
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
        <NavigationControl position="bottom-right" showCompass={false} />
        <CctvMarkers />
      </Map>
      <CurfewOverlay active={isCurfew} />
    </div>
  );
}
