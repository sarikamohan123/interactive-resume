import { useQuery } from '@tanstack/react-query'

import { supabase } from '@/lib/supabase'

interface Education {
  id: string
  school: string
  degree: string
  start_date: string
  end_date: string | null
  details: Record<string, unknown> | null
  created_at: string
}

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