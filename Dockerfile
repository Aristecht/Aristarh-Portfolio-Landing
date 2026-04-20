# syntax=docker/dockerfile:1.7

FROM oven/bun:1.2.21-alpine AS deps
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile 

FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN mkdir -p public

ENV NEXT_TELEMETRY_DISABLED=1
# Build with Node.js to avoid Bun worker_threads limitations in Next 16/Turbopack.
RUN node node_modules/next/dist/bin/next build

FROM oven/bun:1.2.21-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["bun", "run", "start", "--", "-H", "0.0.0.0", "-p", "3000"]
