import { useQuery } from '@tanstack/react-query'

import { supabase } from '@/lib/supabase'
import { useAuthContext } from '@/contexts/AuthContext'
import type { Experience } from '@/types/database'

export function useExperiences() {
  const { authReady } = useAuthContext()

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
    enabled: authReady, // Only query when session restoration is complete
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}