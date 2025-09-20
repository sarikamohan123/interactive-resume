import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

interface Category {
  id: string
  name: string
  sort_order: number
  created_at: string
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async (): Promise<Category[]> => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) {
        throw new Error(`Failed to fetch categories: ${error.message}`)
      }

      return data || []
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}