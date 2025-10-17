import { useQuery } from '@tanstack/react-query'

import { supabase } from '@/lib/supabase'
import type { Education } from '@/types/database'

export function useEducation() {
  return useQuery({
    queryKey: ['education'],
    queryFn: async (): Promise<Education[]> => {
      const { data, error } = await supabase
        .from('education')
        .select('*')
        .order('start_date', { ascending: false }) // Most recent first

      if (error) {
        throw new Error(`Failed to fetch education: ${error.message}`)
      }

      return data || []
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}