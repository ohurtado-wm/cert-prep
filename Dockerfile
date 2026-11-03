FROM oven/bun:1.3.14 AS build

WORKDIR /app
COPY package.json bun.lock ./
COPY apps/api/package.json ./apps/api/package.json
COPY apps/web/package.json ./apps/web/package.json
COPY packages/contracts/package.json ./packages/contracts/package.json
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM oven/bun:1.3.14

WORKDIR /app
ENV NODE_ENV=production PORT=3000
COPY package.json bun.lock ./
COPY apps/api/package.json ./apps/api/package.json
COPY apps/web/package.json ./apps/web/package.json
COPY packages/contracts/package.json ./packages/contracts/package.json
RUN bun install --frozen-lockfile --production
COPY --from=build /app/apps ./apps
COPY --from=build /app/packages ./packages

USER bun
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 CMD bun -e "fetch('http://127.0.0.1:3000/api/healthz').then((response) => { if (!response.ok) process.exit(1) }).catch(() => process.exit(1))"
CMD ["bun", "apps/web/dist/server/index.mjs"]
