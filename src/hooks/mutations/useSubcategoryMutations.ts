import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { supabase } from '@/lib/supabase'
import type { SubcategoryInsert, SubcategoryUpdate } from '@/types/database'

export function useSubcategoryMutations() {
  const queryClient = useQueryClient()

  const createSubcategory = useMutation({
    mutationFn: async (data: SubcategoryInsert) => {
      const { data: subcategory, error } = await supabase
        .from('subcategories')
        .insert(data)
        .select()
        .single()

      if (error) throw error
      return subcategory
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subcategories'] })
      toast.success('Subcategory created successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to create subcategory: ${error.message}`)
    },
  })

  const updateSubcategory = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: SubcategoryUpdate }) => {
      const { data: subcategory, error } = await supabase
        .from('subcategories')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return subcategory
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subcategories'] })
      toast.success('Subcategory updated successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to update subcategory: ${error.message}`)
    },
  })

  const deleteSubcategory = useMutation({
    mutationFn: async (id: string) => {
      // Check if subcategory has linked skills
      const { data: skills, error: checkError } = await supabase
        .from('skills')
        .select('id')
        .eq('subcategory_id', id)
        .limit(1)

      if (checkError) throw checkError

      if (skills && skills.length > 0) {
        throw new Error('Cannot delete subcategory with linked skills')
      }

      const { error } = await supabase.from('subcategories').delete().eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subcategories'] })
      toast.success('Subcategory deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete subcategory: ${error.message}`)
    },
  })

  return {
    createSubcategory,
    updateSubcategory,
    deleteSubcategory,
  }
}
