# Phase 27: Certifications Admin Management

## Overview
Add complete CRUD (Create, Read, Update, Delete) management for Professional Certifications in the admin dashboard, mirroring the pattern used for Skills, Experiences, and Education.

## Current Status
✅ **Phase 26 Complete**: Professional Certifications section is public-facing and working
- Dedicated `certifications` table in Supabase
- `useCertifications()` React Query hook
- `CertificationsSection` component with timeline layout
- Integrated into resume page with sticky nav
- Education section title updated to exclude "& Certifications"

❌ **Phase 27 Not Started**: Admin management for certifications missing
- No admin CRUD page for managing certifications
- No mutation hooks for create/update/delete
- No admin dashboard stats for certifications
- No admin navigation button for certifications management

## Implementation Tasks

### Task 1: Add Certification Types to Database Types File
**File**: `src/types/database.ts`

Add certification types alongside other entity types:
```typescript
// Certifications
export interface Certification {
  id: string
  name: string
  issuing_organization: string
  issued_at: string
  credential_id: string | null
  credential_url: string | null
  sort_order: number
  created_at: string
}

export interface CertificationInsert {
  id?: string
  name: string
  issuing_organization: string
  issued_at: string
  credential_id?: string | null
  credential_url?: string | null
  sort_order?: number
  created_at?: string
}

export interface CertificationUpdate {
  name?: string
  issuing_organization?: string
  issued_at?: string
  credential_id?: string | null
  credential_url?: string | null
  sort_order?: number
}
```

Also update the Database interface to include:
```typescript
certifications: {
  Row: Certification
  Insert: CertificationInsert
  Update: CertificationUpdate
}
```

### Task 2: Create Certification Schema with Zod
**File**: `src/schemas/certification.ts` (new file)

Create validation schema for certification forms:
```typescript
import { z } from 'zod'

export const certificationSchema = z.object({
  name: z.string().min(1, 'Certification name is required').max(200, 'Name must be less than 200 characters'),
  issuing_organization: z.string().min(1, 'Organization is required').max(100, 'Organization must be less than 100 characters'),
  issued_at: z.string().min(1, 'Issue date is required'),
  credential_id: z.string().max(100, 'Credential ID must be less than 100 characters').nullable().optional(),
  credential_url: z.string().url('Must be valid URL').max(500, 'URL must be less than 500 characters').nullable().optional(),
  sort_order: z.number().min(0, 'Sort order must be 0 or greater').default(0),
})

export type CertificationFormData = z.infer<typeof certificationSchema>
```

### Task 3: Create Certification Mutations Hook
**File**: `src/hooks/mutations/useCertificationMutations.ts` (new file)

Create mutations for create, update, and delete operations:
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import type { CertificationInsert, CertificationUpdate } from '@/types/database'

export function useCertificationMutations() {
  const queryClient = useQueryClient()

  const createCertification = useMutation({
    mutationFn: async (data: CertificationInsert) => {
      const { data: certification, error } = await supabase
        .from('certifications')
        .insert(data)
        .select()
        .single()
      if (error) throw error
      return certification
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications'] })
      toast.success('Certification created successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to create certification: ${error.message}`)
    },
  })

  const updateCertification = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CertificationUpdate }) => {
      const { data: certification, error } = await supabase
        .from('certifications')
        .update(data)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return certification
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications'] })
      toast.success('Certification updated successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to update certification: ${error.message}`)
    },
  })

  const deleteCertification = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('certifications').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications'] })
      toast.success('Certification deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete certification: ${error.message}`)
    },
  })

  return {
    createCertification,
    updateCertification,
    deleteCertification,
  }
}
```

### Task 4: Create Certifications Admin Page
**File**: `src/routes/admin/certifications.index.tsx` (new file)

Create a complete CRUD admin page following the pattern from education.index.tsx:
- Use Dialog for create/edit forms
- Display table with certification list
- Show name, organization, issued date, sort order
- Include optional credential ID and URL fields
- Add edit and delete buttons
- Include delete confirmation modal
- Use react-hook-form + Zod validation

### Task 5: Update Admin Dashboard
**File**: `src/routes/admin/index.tsx`

Add certifications to the admin dashboard:
1. Import `Award` icon from lucide-react (if not already imported)
2. Add certifications stats query (count, last updated, most recent)
3. Add certifications card to the stats grid
4. Add "Manage Certifications" quick action button to the actions grid

Example stats query pattern:
```typescript
const { data: certificationsStats, isLoading: certificationsLoading } = useQuery({
  queryKey: ['certifications-stats'],
  queryFn: async (): Promise<EntityStats> => {
    const { count } = await supabase
      .from('certifications')
      .select('*', { count: 'exact', head: true })

    const { data: recent } = await supabase
      .from('certifications')
      .select('name, issuing_organization, created_at')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    return {
      count: count ?? 0,
      lastUpdated: recent?.created_at ?? null,
      mostRecent: recent ? `${recent.name} - ${recent.issuing_organization}` : null,
    }
  },
})
```

## Implementation Order
1. ✅ Add types to `database.ts`
2. ✅ Create `certification.ts` schema file
3. ✅ Create `useCertificationMutations.ts` hook
4. ✅ Create `certifications.index.tsx` admin page
5. ✅ Update admin `index.tsx` dashboard

## Expected Outcomes
- ✅ Fully functional admin page for managing certifications
- ✅ Dashboard stats showing certification count and recent additions
- ✅ Quick action button to access certifications management
- ✅ Complete form validation with Zod
- ✅ Toast notifications for all CRUD operations
- ✅ Type-safe operations with full TypeScript support
- ✅ Consistent with existing admin module patterns

## Testing Checklist
- [ ] Admin can create new certification
- [ ] Admin can edit existing certification
- [ ] Admin can delete certification with confirmation
- [ ] Certifications appear immediately in dashboard stats
- [ ] Form validation works (required fields, date format, URL format)
- [ ] Toast notifications appear on success/error
- [ ] Changes reflect immediately in public resume
- [ ] Sort order affects display order in resume
- [ ] All optional fields (credential_id, credential_url) work correctly
- [ ] Admin navigation includes certifications management link
- [ ] No TypeScript errors or build warnings

## Files to Create
- `src/schemas/certification.ts` - Zod validation schema
- `src/hooks/mutations/useCertificationMutations.ts` - Mutation hooks
- `src/routes/admin/certifications.index.tsx` - Admin CRUD page

## Files to Modify
- `src/types/database.ts` - Add Certification types
- `src/routes/admin/index.tsx` - Add certifications stats and quick action button

## Notes
- The `useCertifications` hook already exists (created in Phase 26)
- RLS policies already configured for certifications table (public read, admin write)
- Follow the exact same pattern as education and experiences CRUD pages
- Ensure sort_order defaults to 0 for new certifications
- Optional credential fields should allow null/empty values
