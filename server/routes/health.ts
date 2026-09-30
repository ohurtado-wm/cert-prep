import { Hono } from 'hono'

export const healthRoutes = new Hono().get('/healthz', (context) =>
  context.json({ status: 'ok' as const }))
