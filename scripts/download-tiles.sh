#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Download a Kathmandu vector-tile extract (PMTiles) for local offline use.
#
# This script uses the `pmtiles extract` command, which downloads only the
# tiles inside the bounding box using HTTP range requests — it does NOT
# download the entire planet file.
#
# Prerequisites:
#   npm install -g @protomaps/cli    # or use npx (see below)
#
# Usage:
#   bash scripts/download-tiles.sh
#
# Output:
#   public/kathmandu.pmtiles   (~5–15 MB depending on zoom depth)
# ---------------------------------------------------------------------------

set -euo pipefail

# Bounding box covering the full protest area plus camera padding:
#   West: Maitighar / Tripureshwor area
#   East: Baneshwor / Koteshwor
#   South/North: enough margin for 3D pitch views
BBOX="85.27,27.66,85.38,27.72"
ZOOM_MIN=0
ZOOM_MAX=16

# Source: Protomaps daily OSM build (uses HTTP range requests — only the
# tiles for our bbox are transferred).  Update the date for a fresher build:
#   https://build.protomaps.com/
SOURCE="https://build.protomaps.com/20250101.pmtiles"

OUTPUT="public/kathmandu.pmtiles"

echo "Downloading Kathmandu tile extract..."
echo "  bbox     : $BBOX"
echo "  zoom     : $ZOOM_MIN – $ZOOM_MAX"
echo "  source   : $SOURCE"
echo "  output   : $OUTPUT"
echo ""

npx --yes @protomaps/cli extract "$SOURCE" "$OUTPUT" \
  --bbox="$BBOX" \
  --zoom-min="$ZOOM_MIN" \
  --zoom-max="$ZOOM_MAX"

echo ""
echo "Done! Place $OUTPUT in the project root's public/ directory."
echo "The map will load tiles from /kathmandu.pmtiles automatically."
