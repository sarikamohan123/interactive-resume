import { useQuery } from '@tanstack/react-query'

import { supabase } from '@/lib/supabase'

interface Subcategory {
  id: string
  category_id: string
  name: string
  sort_order: number
  created_at: string
}

export function useSubcategories() {
  return useQuery({
    queryKey: ['subcategories'],
    queryFn: async (): Promise<Subcategory[]> => {
      const { data, error } = await supabase
        .from('subcategories')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) {
        throw new Error(`Failed to fetch subcategories: ${error.message}`)
      }

      return data || []
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}