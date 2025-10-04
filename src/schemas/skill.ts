import { z } from 'zod'

export const skillSchema = z.object({
  subcategory_id: z.string().uuid('Please select a valid subcategory'),
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  level: z.string().max(50, 'Level must be less than 50 characters').optional().nullable(),
  years: z.coerce.number().min(0, 'Years must be 0 or greater').max(50, 'Years must be 50 or less').optional().nullable(),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
    .nullable(),
  links: z.record(z.unknown()).optional().nullable(),
  sort_order: z.coerce.number().int(),
})

export type SkillFormData = z.infer<typeof skillSchema>
