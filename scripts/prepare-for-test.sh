#!/bin/bash

# Script to prepare extension for testing in Chrome

echo "🔨 Preparing extension for testing..."

# Compile TypeScript
echo "📦 Compiling TypeScript..."
npx tsc

# Create directory structure
mkdir -p dist/icons
mkdir -p dist/content
mkdir -p dist/background

# Copy manifest and assets
echo "📋 Copying manifest and assets..."
cp public/manifest.json dist/manifest.json
cp -r public/icons/* dist/icons/ 2>/dev/null || echo "⚠️  Icons not found (using placeholders)"

# Copy CSS
cp src/content/overlay.css dist/content/overlay.css 2>/dev/null || echo "⚠️  overlay.css not found"

# Check if JS files were compiled
if [ ! -f "dist/background/service-worker.js" ]; then
    echo "❌ Error: service-worker.js was not compiled"
    exit 1
fi

if [ ! -f "dist/content/inspector.js" ]; then
    echo "❌ Error: inspector.js was not compiled"
    exit 1
fi

echo "✅ Extension prepared in dist/"
echo ""
echo "📝 Next steps:"
echo "1. Open Chrome and go to chrome://extensions/"
echo "2. Enable 'Developer mode'"
echo "3. Click 'Load unpacked'"
echo "4. Select the 'dist' folder from this project"
echo ""
echo "🎯 To test:"
echo "- Click the extension icon to activate inspection mode"
echo "- Hover over elements to see the overlay"
echo "- Click an element to see CSS properties"
