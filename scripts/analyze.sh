#!/bin/sh
set -e

SITE_SPEED="scripts/node_modules/.bin/sitespeed.io"
PORT=8888
URL="http://localhost:$PORT"
RESULT_DIR="sitespeed-result"

cleanup() {
  if [ -n "$SERVER_PID" ]; then
    kill "$SERVER_PID" 2>/dev/null || true
    wait "$SERVER_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT

echo "Select browser:"
echo "  1) chrome"
echo "  2) firefox"
echo "  3) safari"
echo "  4) edge"
printf "Enter choice [1-4]: "
read -r CHOICE
case "$CHOICE" in
  1) BROWSER="chrome" ;;
  2) BROWSER="firefox" ;;
  3) BROWSER="safari" ;;
  4) BROWSER="edge" ;;
  *) echo "ERROR: Invalid choice"; exit 1 ;;
esac

echo "==> Building site..."
scripts/build.sh

echo "==> Minifying images..."
scripts/minify-images.js _site

echo "==> Starting local server on port $PORT..."
pnpx serve _site -l "$PORT" &
SERVER_PID=$!

echo "==> Waiting for server..."
for i in $(seq 1 30); do
  if curl -s -o /dev/null "$URL" 2>/dev/null; then
    break
  fi
  if [ "$i" -eq 30 ]; then
    echo "ERROR: Server did not start in time"
    exit 1
  fi
  sleep 1
done

echo "==> Running sitespeed.io..."
$SITE_SPEED "$URL" \
  --browsertime.browser "$BROWSER" \
  --crawler.depth 3 \
  --resultBaseURL="$URL" \
  --outputFolder "$RESULT_DIR"

echo ""
echo "==> Results Summary"
echo "================================================"

LATEST=$(ls -td "$RESULT_DIR"/*/ 2>/dev/null | head -1)

if [ -z "$LATEST" ]; then
  echo "No results found."
  exit 0
fi

echo "==> Done. Full report: $LATEST/index.html"
