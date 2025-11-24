import { useQuery } from '@tanstack/react-query'

import { supabase } from '@/lib/supabase'

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

export function useCertifications() {
  return useQuery({
    queryKey: ['certifications'],
    queryFn: async (): Promise<Certification[]> => {
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) {
        throw new Error(`Failed to fetch certifications: ${error.message}`)
      }

      return data || []
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
