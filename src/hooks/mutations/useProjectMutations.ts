import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { supabase } from '@/lib/supabase'
import type { ProjectInsert, ProjectUpdate } from '@/types/database'

interface CreateProjectPayload {
  project: ProjectInsert
  tags: string[]
  metrics: { label: string; value: string }[]
}

interface UpdateProjectPayload {
  id: string
  project: ProjectUpdate
  tags: string[]
  metrics: { label: string; value: string }[]
}

export function useProjectMutations() {
  const queryClient = useQueryClient()

  const createProject = useMutation({
    mutationFn: async (payload: CreateProjectPayload) => {
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert(payload.project)
        .select()
        .single()

      if (projectError) throw projectError

      if (payload.tags.length > 0) {
        const tagRecords = payload.tags.map((tag) => ({
          project_id: project.id,
          tag,
        }))
        const { error: tagsError } = await supabase.from('project_tags').insert(tagRecords)
        if (tagsError) throw tagsError
      }

      if (payload.metrics.length > 0) {
        const metricRecords = payload.metrics.map((m, i) => ({
          project_id: project.id,
          label: m.label,
          value: m.value,
          sort_order: i,
        }))
        const { error: metricsError } = await supabase.from('project_metrics').insert(metricRecords)
        if (metricsError) throw metricsError
      }

      return project
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['project-tags-unique'] })
      toast.success('Project created successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to create project: ${error.message}`)
    },
  })

  const updateProject = useMutation({
    mutationFn: async (payload: UpdateProjectPayload) => {
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .update(payload.project)
        .eq('id', payload.id)
        .select()
        .single()

      if (projectError) throw projectError

      const { error: deleteTagsError } = await supabase
        .from('project_tags')
        .delete()
        .eq('project_id', payload.id)
      if (deleteTagsError) throw deleteTagsError

      if (payload.tags.length > 0) {
        const tagRecords = payload.tags.map((tag) => ({
          project_id: payload.id,
          tag,
        }))
        const { error: tagsError } = await supabase.from('project_tags').insert(tagRecords)
        if (tagsError) throw tagsError
      }

      const { error: deleteMetricsError } = await supabase
        .from('project_metrics')
        .delete()
        .eq('project_id', payload.id)
      if (deleteMetricsError) throw deleteMetricsError

      if (payload.metrics.length > 0) {
        const metricRecords = payload.metrics.map((m, i) => ({
          project_id: payload.id,
          label: m.label,
          value: m.value,
          sort_order: i,
        }))
        const { error: metricsError } = await supabase.from('project_metrics').insert(metricRecords)
        if (metricsError) throw metricsError
      }

      return project
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['project-tags-unique'] })
      toast.success('Project updated successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to update project: ${error.message}`)
    },
  })

  const deleteProject = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('projects').delete().eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['project-tags-unique'] })
      toast.success('Project deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete project: ${error.message}`)
    },
  })

  return {
    createProject,
    updateProject,
    deleteProject,
  }
}
