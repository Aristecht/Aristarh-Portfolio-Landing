# ---------- BASE ----------
FROM node:22-slim AS base

WORKDIR /app
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
FROM node:22-slim AS runner

WORKDIR /app
RUN corepack enable

ENV NODE_ENV=production
ENV APPLICATION_PORT=3000
ENV RUN_MIGRATIONS=true

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

RUN yarn install --immutable --production

COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma/generated ./prisma/generated
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts

RUN mkdir -p uploads

RUN addgroup --system nodejs && adduser --system nestjs --ingroup nodejs
RUN chown -R nestjs:nodejs /app
USER nestjs

EXPOSE 3000

CMD ["sh", "-c", "if [ \"$RUN_MIGRATIONS\" = \"true\" ]; then yarn prisma migrate deploy; fi; node dist/main"]