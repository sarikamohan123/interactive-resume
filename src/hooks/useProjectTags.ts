import { useQuery } from '@tanstack/react-query'

import { supabase } from '@/lib/supabase'

export function useProjectTags() {
  return useQuery({
    queryKey: ['project-tags-unique'],
    queryFn: async (): Promise<string[]> => {
      const { data, error } = await supabase.from('project_tags').select('tag')

      if (error) {
        throw new Error(`Failed to fetch project tags: ${error.message}`)
      }

      const uniqueTags = [...new Set((data || []).map((d) => d.tag))].sort()
      return uniqueTags
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
