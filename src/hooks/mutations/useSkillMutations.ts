import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { supabase } from '@/lib/supabase'
import type { SkillInsert, SkillUpdate } from '@/types/database'

export function useSkillMutations() {
  const queryClient = useQueryClient()

  const createSkill = useMutation({
    mutationFn: async (data: SkillInsert) => {
      const { data: skill, error } = await supabase
        .from('skills')
        .insert(data)
        .select()
        .single()

      if (error) throw error
      return skill
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] })
      toast.success('Skill created successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to create skill: ${error.message}`)
    },
  })

  const updateSkill = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: SkillUpdate }) => {
      const { data: skill, error } = await supabase
        .from('skills')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return skill
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] })
      toast.success('Skill updated successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to update skill: ${error.message}`)
    },
  })

  const deleteSkill = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('skills').delete().eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] })
      toast.success('Skill deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete skill: ${error.message}`)
    },
  })

  return {
    createSkill,
    updateSkill,
    deleteSkill,
  }
}
