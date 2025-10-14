import { z } from 'zod'

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  sort_order: z.number().int().min(0),
})

export type CategoryFormData = z.infer<typeof categorySchema>
