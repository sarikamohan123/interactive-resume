import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { supabase } from '@/lib/supabase'
import type { EducationInsert, EducationUpdate } from '@/types/database'

export function useEducationMutations() {
  const queryClient = useQueryClient()

  const createEducation = useMutation({
    mutationFn: async (data: EducationInsert) => {
      const { data: education, error } = await supabase
        .from('education')
        .insert(data)
        .select()
        .single()

      if (error) throw error
      return education
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education'] })
      toast.success('Education created successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to create education: ${error.message}`)
    },
  })

  const updateEducation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: EducationUpdate }) => {
      const { data: education, error } = await supabase
        .from('education')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return education
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education'] })
      toast.success('Education updated successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to update education: ${error.message}`)
    },
  })

  const deleteEducation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('education').delete().eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education'] })
      toast.success('Education deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete education: ${error.message}`)
    },
  })

  return {
    createEducation,
    updateEducation,
    deleteEducation,
  }
}
