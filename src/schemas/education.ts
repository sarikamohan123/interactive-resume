import { z } from 'zod'

export const educationSchema = z.object({
  school: z.string().min(1, 'School is required').max(200, 'School must be less than 200 characters'),
  degree: z.string().min(1, 'Degree is required').max(200, 'Degree must be less than 200 characters'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().optional().nullable(),
  details: z.record(z.unknown()).optional().nullable(),
})

export type EducationFormData = z.infer<typeof educationSchema>
