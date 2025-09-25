import { useQuery } from '@tanstack/react-query'

import { supabase } from '@/lib/supabase'

interface Skill {
  id: string
  subcategory_id: string
  name: string
  level: string | null
  years: number | null
  description: string | null
  links: Record<string, string> | null
  sort_order: number
  created_at: string
}

export function useSkills() {
  return useQuery({
    queryKey: ['skills'],
    queryFn: async (): Promise<Skill[]> => {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) {
        throw new Error(`Failed to fetch skills: ${error.message}`)
      }

      return data || []
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}