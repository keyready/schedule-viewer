#!/usr/bin/env bash
set -euo pipefail

# Loads images from bundle and starts services with docker-compose.prod.yml

BUNDLE_DIR="$(cd "$(dirname "$0")" && pwd)/bundle"
COMPOSE_FILE="$(cd "$(dirname "$0")" && pwd)/docker-compose.prod.yml"

if [ ! -d "$BUNDLE_DIR" ]; then
  echo "Bundle directory not found: $BUNDLE_DIR"
  exit 1
fi

echo "[1/4] Loading images from tar files"
docker load -i "$BUNDLE_DIR/mongo-image.tar"
docker load -i "$BUNDLE_DIR/server-image.tar"
docker load -i "$BUNDLE_DIR/client-image.tar"

echo "[2/4] Starting services"
docker compose -f "$COMPOSE_FILE" up -d

echo "[3/4] Services status"
docker compose -f "$COMPOSE_FILE" ps

echo "[4/4] Tailing logs (Ctrl+C to detach)"
docker compose -f "$COMPOSE_FILE" logs -f --tail=200

