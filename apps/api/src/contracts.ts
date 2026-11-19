import { z } from 'zod'

function optionalAvatar(value: unknown): string | undefined {
  if (typeof value !== 'string' || !value.trim()) return undefined
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:' ? value : undefined
  } catch {
    return undefined
  }
}

export const GatewayUserSchema = z.object({
  id: z.string().trim().min(1),
  email: z.string().email().optional(),
  avatar: z.preprocess(optionalAvatar, z.string().url().optional()),
  permissions: z.array(z.string()).optional(),
})

export type GatewayUser = z.infer<typeof GatewayUserSchema>
