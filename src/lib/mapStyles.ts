import { noLabels } from "protomaps-themes-base";
import type { StyleSpecification } from "maplibre-gl";

/**
 * Build a MapLibre GL style that uses a locally stored PMTiles archive.
 * Place the downloaded kathmandu.pmtiles file in the /public directory
 * (see scripts/download-tiles.sh for how to obtain it).
 */
export function buildLocalStyle(
  tilesPath = "/kathmandu.pmtiles"
): StyleSpecification {
  return {
    version: 8,
    // No external glyph server needed — noLabels layers have no text rendering
    sources: {
      protomaps: {
        type: "vector",
        url: `pmtiles://${tilesPath}`,
        attribution:
          '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
      },
    },
    layers: [
      ...noLabels("protomaps", "light"),
      // 3D buildings using OSM height/levels data
      {
        id: "buildings-3d",
        type: "fill-extrusion",
        source: "protomaps",
        "source-layer": "buildings",
        paint: {
          "fill-extrusion-color": "#d6d3cd",
          "fill-extrusion-height": [
            "coalesce",
            ["get", "height"],
            ["*", ["coalesce", ["get", "levels"], 2], 4],
          ],
          "fill-extrusion-base": 0,
          "fill-extrusion-opacity": 0.75,
        },
      },
    ],
  } as StyleSpecification;
}

export const MAP_STYLE_STANDARD = buildLocalStyle();

// Legacy aliases kept for API compatibility
export const MAP_STYLE_NORMAL = MAP_STYLE_STANDARD;
export const MAP_STYLE_CURFEW = MAP_STYLE_STANDARD;
