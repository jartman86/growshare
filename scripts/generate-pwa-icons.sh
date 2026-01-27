#!/bin/bash
# PWA Icon Generation Script for GrowShare
# This script generates all required PWA icons from the source icon
#
# Requirements:
# - macOS with sips command (built-in)
# - OR ImageMagick (convert command)
#
# Usage: ./scripts/generate-pwa-icons.sh

SOURCE_ICON="public/growshare app icon.png"
OUTPUT_DIR="public/icons"

# Check if source icon exists
if [ ! -f "$SOURCE_ICON" ]; then
    echo "Error: Source icon not found at '$SOURCE_ICON'"
    exit 1
fi

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Generate icons using sips (macOS built-in)
if command -v sips &> /dev/null; then
    echo "Using sips to generate icons..."

    # PWA icons
    sips -z 192 192 "$SOURCE_ICON" --out "$OUTPUT_DIR/icon-192x192.png"
    sips -z 512 512 "$SOURCE_ICON" --out "$OUTPUT_DIR/icon-512x512.png"

    # Apple touch icon
    sips -z 180 180 "$SOURCE_ICON" --out "$OUTPUT_DIR/apple-touch-icon.png"

    # Favicon sizes
    sips -z 32 32 "$SOURCE_ICON" --out "$OUTPUT_DIR/favicon-32x32.png"
    sips -z 16 16 "$SOURCE_ICON" --out "$OUTPUT_DIR/favicon-16x16.png"

    echo "Icons generated successfully in $OUTPUT_DIR/"

# Alternative: Use ImageMagick if available
elif command -v convert &> /dev/null; then
    echo "Using ImageMagick to generate icons..."

    convert "$SOURCE_ICON" -resize 192x192 "$OUTPUT_DIR/icon-192x192.png"
    convert "$SOURCE_ICON" -resize 512x512 "$OUTPUT_DIR/icon-512x512.png"
    convert "$SOURCE_ICON" -resize 180x180 "$OUTPUT_DIR/apple-touch-icon.png"
    convert "$SOURCE_ICON" -resize 32x32 "$OUTPUT_DIR/favicon-32x32.png"
    convert "$SOURCE_ICON" -resize 16x16 "$OUTPUT_DIR/favicon-16x16.png"

    echo "Icons generated successfully in $OUTPUT_DIR/"

else
    echo "Error: Neither sips (macOS) nor ImageMagick (convert) found."
    echo "Please install ImageMagick or run this script on macOS."
    exit 1
fi

# List generated files
echo ""
echo "Generated icons:"
ls -la "$OUTPUT_DIR/"
