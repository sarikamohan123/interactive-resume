import { z } from 'zod'

export const subcategorySchema = z.object({
  category_id: z.string().uuid('Please select a valid category'),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  sort_order: z.coerce.number().int().min(0).default(0),
})

export type SubcategoryFormData = z.infer<typeof subcategorySchema>
