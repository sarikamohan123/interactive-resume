import { useQuery } from '@tanstack/react-query'

import { supabase } from '@/lib/supabase'

export interface Skill {
  id: string
  subcategory_id: string
  name: string
  level: string | null
  years: number | null
  description: string | null
  links: Record<string, string> | null
  sort_order: number
  created_at: string
  subcategory: {
    id: string
    name: string
    sort_order: number
    category: {
      id: string
      name: string
      sort_order: number
    }
  }
}

export function useSkills() {
  return useQuery({
    queryKey: ['skills'],
    queryFn: async (): Promise<Skill[]> => {
      const { data, error } = await supabase
        .from('skills')
        .select(`
          *,
          subcategory:subcategories(
            id,
            name,
            sort_order,
            category:categories(
              id,
              name,
              sort_order
            )
          )
        `)
        .order('sort_order', { ascending: true })

      if (error) {
        throw new Error(`Failed to fetch skills: ${error.message}`)
      }

      return data || []
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}