import { useQuery } from '@tanstack/react-query'

import { supabase } from '@/lib/supabase'
import type { Experience } from '@/types/database'

export function useExperiences() {
  return useQuery({
    queryKey: ['experiences'],
    queryFn: async (): Promise<Experience[]> => {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .order('start_date', { ascending: false }) // Most recent first

      if (error) {
        throw new Error(`Failed to fetch experiences: ${error.message}`)
      }

      return data || []
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}