import { z } from 'zod'

export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters').trim(),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(100, 'Slug must be less than 100 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase letters, numbers, and hyphens only')
    .trim(),
  summary: z.string().min(1, 'Summary is required').max(300, 'Summary must be less than 300 characters').trim(),
  description: z
    .string()
    .max(2000, 'Description must be less than 2000 characters')
    .trim()
    .optional()
    .nullable(),
  role: z.string().max(200, 'Role must be less than 200 characters').trim().optional().nullable(),
  hero_image_url: z
    .string()
    .url('Must be a valid URL')
    .max(500, 'URL must be less than 500 characters')
    .or(z.literal(''))
    .nullable()
    .optional(),
  additional_image_urls: z
    .string()
    .max(2000, 'URLs must be less than 2000 characters total')
    .optional()
    .nullable(),
  live_url: z
    .string()
    .url('Must be a valid URL')
    .max(500, 'URL must be less than 500 characters')
    .or(z.literal(''))
    .nullable()
    .optional(),
  repo_url: z
    .string()
    .url('Must be a valid URL')
    .max(500, 'URL must be less than 500 characters')
    .or(z.literal(''))
    .nullable()
    .optional(),
  is_featured: z.boolean(),
  category: z.string().max(100, 'Category must be less than 100 characters').trim().optional().nullable(),
  sort_order: z.number().min(0, 'Sort order must be 0 or greater'),
  tags: z.string().max(500, 'Tags must be less than 500 characters').optional().nullable(),
  metrics: z
    .array(
      z.object({
        label: z.string().min(1, 'Label is required').max(100).trim(),
        value: z.string().min(1, 'Value is required').max(100).trim(),
      }),
    )
    .optional()
    .nullable(),
})

export type ProjectFormData = z.infer<typeof projectSchema>
