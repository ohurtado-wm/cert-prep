import { z } from 'zod'

export const ApiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
})

export const HealthResponseSchema = z.object({
  status: z.literal('ok'),
})

export const CurrentUserResponseSchema = z.object({
  user: z.object({
    id: z.string().min(1),
    email: z.string().email().optional(),
    avatar: z.string().url().optional(),
  }),
})

export type ApiError = z.infer<typeof ApiErrorSchema>
export type CurrentUserResponse = z.infer<typeof CurrentUserResponseSchema>
