#!/usr/bin/env bash
set -euo pipefail

# Builds client and server images and saves them (and mongo base image) to tar files for offline use.

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
OUT_DIR="$ROOT_DIR/deploy/offline/bundle"
mkdir -p "$OUT_DIR"

echo "[1/6] Building server image (schedule-viewer-server:prod)"
docker build -t schedule-viewer-server:prod "$ROOT_DIR/server"

echo "[2/6] Building client image (schedule-viewer-client:prod)"
docker build -t schedule-viewer-client:prod "$ROOT_DIR/client"

echo "[3/6] Pulling mongo:7 base image"
docker pull mongo:7

echo "[4/6] Saving images to tar files"
docker save -o "$OUT_DIR/server-image.tar" schedule-viewer-server:prod
docker save -o "$OUT_DIR/client-image.tar" schedule-viewer-client:prod
docker save -o "$OUT_DIR/mongo-image.tar" mongo:7

echo "[5/6] Copy production compose and scripts"
cp "$ROOT_DIR/deploy/offline/docker-compose.prod.yml" "$OUT_DIR/"
cp "$ROOT_DIR/deploy/offline/run_offline.sh" "$OUT_DIR/" 2>/dev/null || true
cp "$ROOT_DIR/deploy/offline/stop_offline.sh" "$OUT_DIR/" 2>/dev/null || true
cp "$ROOT_DIR/deploy/offline/README_OFFLINE.md" "$OUT_DIR/" 2>/dev/null || true

echo "[6/6] Bundle is ready at: $OUT_DIR"
ls -lh "$OUT_DIR"

