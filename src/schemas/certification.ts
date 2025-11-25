import { z } from 'zod'

export const certificationSchema = z.object({
  name: z.string().min(1, 'Certification name is required').max(200, 'Name must be less than 200 characters'),
  issuing_organization: z.string().min(1, 'Organization is required').max(100, 'Organization must be less than 100 characters'),
  issued_at: z.string().min(1, 'Issue date is required'),
  credential_id: z.string().max(100, 'Credential ID must be less than 100 characters').or(z.literal('')).nullable().optional(),
  credential_url: z.string().url('Must be valid URL').max(500, 'URL must be less than 500 characters').or(z.literal('')).nullable().optional(),
  sort_order: z.number().min(0, 'Sort order must be 0 or greater'),
})

export type CertificationFormData = z.infer<typeof certificationSchema>
