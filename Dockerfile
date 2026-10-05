FROM oven/bun:1.3.14 AS build

WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM oven/bun:1.3.14

WORKDIR /app
ENV NODE_ENV=production PORT=3000
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production
COPY --from=build /app/dist ./dist
COPY --from=build /app/server ./server
COPY --from=build /app/drizzle/postgresql ./drizzle/postgresql

USER bun
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 CMD bun -e "fetch('http://127.0.0.1:3000/api/healthz').then((response) => { if (!response.ok) process.exit(1) }).catch(() => process.exit(1))"
CMD ["bun", "dist/server/index.mjs"]
