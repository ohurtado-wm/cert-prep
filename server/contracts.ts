import { z } from 'zod'

export const GatewayUserSchema = z.object({
  id: z.string().trim().min(1),
  email: z.string().email().optional(),
  avatar: z.string().url().optional(),
  permissions: z.array(z.string()).optional(),
})

export type GatewayUser = z.infer<typeof GatewayUserSchema>
