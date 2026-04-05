# Map Tiles Setup

The map requires a local PMTiles archive to function. This file is not checked into git because it's a binary artifact.

## Download Instructions

Run the following command from the project root:

```bash
bash scripts/download-tiles.sh
```

This will create `kathmandu.pmtiles` in this directory (~5–15 MB).

## What if the file is missing?

If `kathmandu.pmtiles` is missing, the map will not load and you'll see a blank map area.

## Technical Details

- The app uses MapLibre GL with the PMTiles protocol
- Tile data covers Kathmandu (bbox: 85.27,27.66,85.38,27.72)
- Zoom levels: 0-16
- Source: Protomaps daily OSM builds
