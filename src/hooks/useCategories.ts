import { useQuery } from '@tanstack/react-query'

import { supabase } from '@/lib/supabase'
import { useAuthContext } from '@/contexts/AuthContext'

interface Category {
  id: string
  name: string
  sort_order: number
  created_at: string
}

export function useCategories() {
  const { authReady } = useAuthContext()

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
    enabled: authReady, // Only query when session restoration is complete
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
