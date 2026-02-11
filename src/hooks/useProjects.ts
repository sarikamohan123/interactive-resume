import { useQuery } from '@tanstack/react-query'

import { supabase } from '@/lib/supabase'
import type { Project, ProjectTag, ProjectMetric } from '@/types/database'

export interface ProjectWithDetails extends Project {
  project_tags: ProjectTag[]
  project_metrics: ProjectMetric[]
}

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async (): Promise<ProjectWithDetails[]> => {
      const { data, error } = await supabase
        .from('projects')
        .select('*, project_tags(*), project_metrics(*)')
        .order('sort_order', { ascending: true })

      if (error) {
        throw new Error(`Failed to fetch projects: ${error.message}`)
      }

      return (data as unknown as ProjectWithDetails[]) || []
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
