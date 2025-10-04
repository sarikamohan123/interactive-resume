import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { supabase } from '@/lib/supabase'
import type { ExperienceInsert, ExperienceUpdate } from '@/types/database'

export function useExperienceMutations() {
  const queryClient = useQueryClient()

  const createExperience = useMutation({
    mutationFn: async (data: ExperienceInsert) => {
      const { data: experience, error } = await supabase
        .from('experiences')
        .insert(data)
        .select()
        .single()

      if (error) throw error
      return experience
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] })
      toast.success('Experience created successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to create experience: ${error.message}`)
    },
  })

  const updateExperience = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ExperienceUpdate }) => {
      const { data: experience, error } = await supabase
        .from('experiences')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return experience
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] })
      toast.success('Experience updated successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to update experience: ${error.message}`)
    },
  })

  const deleteExperience = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('experiences').delete().eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] })
      toast.success('Experience deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete experience: ${error.message}`)
    },
  })

  return {
    createExperience,
    updateExperience,
    deleteExperience,
  }
}
