# ---------- BASE ----------
FROM node:22-slim AS base

WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*
RUN corepack enable

# ---------- DEPENDENCIES ----------
FROM base AS deps

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

RUN yarn install --immutable

# ---------- BUILD ----------
FROM deps AS build

COPY . .

RUN yarn prisma generate
RUN yarn build

# ---------- PRODUCTION ----------
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV APPLICATION_PORT=3000
ENV RUN_MIGRATIONS=true
ENV PRISMA_BASELINE_MIGRATIONS=
ENV HOME=/tmp

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

RUN yarn install --immutable --production

COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma/generated ./prisma/generated
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts
COPY --from=build /app/uploads ./uploads
COPY docker/entrypoint.sh ./docker/entrypoint.sh

RUN addgroup --system nodejs && adduser --system nestjs --ingroup nodejs
RUN chmod +x ./docker/entrypoint.sh
RUN mkdir -p uploads && chown -R nestjs:nodejs uploads
USER nestjs

EXPOSE 3000

ENTRYPOINT ["./docker/entrypoint.sh"]