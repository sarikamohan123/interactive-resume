import { z } from 'zod'

export const experienceSchema = z.object({
  company: z.string().min(1, 'Company is required').max(200, 'Company must be less than 200 characters'),
  role: z.string().min(1, 'Role is required').max(200, 'Role must be less than 200 characters'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().optional().nullable(),
  bullets: z.record(z.unknown()).optional().nullable(),
})

export type ExperienceFormData = z.infer<typeof experienceSchema>
