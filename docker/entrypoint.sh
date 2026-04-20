#!/bin/sh
set -eu

PRISMA_BIN="./node_modules/.bin/prisma"
APP_ENTRY="dist/src/main.js"

if [ ! -f "$APP_ENTRY" ]; then
  echo "Application entrypoint not found: $APP_ENTRY" >&2
  exit 1
fi

if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
  echo "Running Prisma migrations..."

  if ! "$PRISMA_BIN" migrate deploy; then
    if [ -n "${PRISMA_BASELINE_MIGRATIONS:-}" ]; then
      echo "Prisma migrate deploy failed. Applying baseline markers: ${PRISMA_BASELINE_MIGRATIONS}"

      for migration in $(echo "$PRISMA_BASELINE_MIGRATIONS" | tr ',' ' '); do
        "$PRISMA_BIN" migrate resolve --applied "$migration"
      done

      "$PRISMA_BIN" migrate deploy
    else
      echo "Prisma migrate deploy failed." >&2
      echo "If the target database already contains schema objects, set PRISMA_BASELINE_MIGRATIONS." >&2
      exit 1
    fi
  fi
fi

exec node "$APP_ENTRY"
