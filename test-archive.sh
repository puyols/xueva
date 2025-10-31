#!/bin/bash

# Script to test the deployment archive

ARCHIVE="belka-flowers-deploy.tar.gz"

# Find the latest archive if multiple exist
if [ ! -f "$ARCHIVE" ]; then
  ARCHIVE=$(ls -t belka-flowers-deploy-*.tar.gz 2>/dev/null | head -1)
fi

if [ -z "$ARCHIVE" ] || [ ! -f "$ARCHIVE" ]; then
  echo "❌ Archive not found!"
  echo "Run ./pack-deploy.sh first to create the archive"
  exit 1
fi

echo "🧪 Testing archive: $ARCHIVE"
echo "📏 Size: $(du -h "$ARCHIVE" | cut -f1)"
echo ""

# Create test directory
TEST_DIR=$(mktemp -d)
echo "📂 Test directory: $TEST_DIR"

# Extract archive
echo "📦 Extracting archive..."
tar -xzf "$ARCHIVE" -C "$TEST_DIR" || {
  echo "❌ Failed to extract archive"
  rm -rf "$TEST_DIR"
  exit 1
}

# Check for required files
echo ""
echo "✅ Checking required files..."

REQUIRED_FILES=(
  "belka-flowers/server.js"
  "belka-flowers/package.json"
  "belka-flowers/index.html"
  "belka-flowers/.htaccess"
  "belka-flowers/manifest.json"
  "belka-flowers/robots.txt"
  "belka-flowers/sitemap.xml"
  "belka-flowers/README-DEPLOYMENT.txt"
  "belka-flowers/ecosystem.config.js"
  "belka-flowers/start.sh"
)

MISSING=0
for file in "${REQUIRED_FILES[@]}"; do
  if [ -f "$TEST_DIR/$file" ]; then
    echo "  ✓ $file"
  else
    echo "  ✗ $file - MISSING"
    MISSING=$((MISSING + 1))
  fi
done

# Check for directories
echo ""
echo "✅ Checking directories..."

REQUIRED_DIRS=(
  "belka-flowers/_next"
  "belka-flowers/images"
  "belka-flowers/api"
)

for dir in "${REQUIRED_DIRS[@]}"; do
  if [ -d "$TEST_DIR/$dir" ]; then
    FILE_COUNT=$(find "$TEST_DIR/$dir" -type f | wc -l)
    echo "  ✓ $dir ($FILE_COUNT files)"
  else
    echo "  ✗ $dir - MISSING"
    MISSING=$((MISSING + 1))
  fi
done

# Test server startup
echo ""
echo "🚀 Testing server startup..."
cd "$TEST_DIR/belka-flowers"

# Start server in background
PORT=19999 timeout 3 node server.js > /tmp/test-server.log 2>&1 &
SERVER_PID=$!

sleep 1

# Check if server is running
if ps -p $SERVER_PID > /dev/null 2>&1; then
  echo "  ✓ Server started successfully"
  
  # Try to fetch homepage
  if command -v curl > /dev/null; then
    if curl -s http://localhost:19999/ > /dev/null; then
      echo "  ✓ Homepage accessible"
    else
      echo "  ✗ Homepage not accessible"
      MISSING=$((MISSING + 1))
    fi
  fi
  
  # Kill server
  kill $SERVER_PID 2>/dev/null
  wait $SERVER_PID 2>/dev/null
else
  echo "  ✗ Server failed to start"
  cat /tmp/test-server.log
  MISSING=$((MISSING + 1))
fi

# Cleanup
rm -rf "$TEST_DIR"
rm -f /tmp/test-server.log

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $MISSING -eq 0 ]; then
  echo "✅ All tests passed!"
  echo "Archive is ready for deployment."
  exit 0
else
  echo "❌ $MISSING test(s) failed!"
  echo "Please check the archive and try again."
  exit 1
fi
