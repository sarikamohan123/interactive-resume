import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { supabase } from '@/lib/supabase'
import type { CategoryInsert, CategoryUpdate } from '@/types/database'

export function useCategoryMutations() {
  const queryClient = useQueryClient()

  const createCategory = useMutation({
    mutationFn: async (data: CategoryInsert) => {
      const { data: category, error } = await supabase
        .from('categories')
        .insert(data)
        .select()
        .single()

      if (error) throw error
      return category
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Category created successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to create category: ${error.message}`)
    },
  })

  const updateCategory = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CategoryUpdate }) => {
      const { data: category, error } = await supabase
        .from('categories')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return category
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Category updated successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to update category: ${error.message}`)
    },
  })

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      // Check if category has linked subcategories
      const { data: subcategories, error: subCheckError } = await supabase
        .from('subcategories')
        .select('id, name')
        .eq('category_id', id)

      if (subCheckError) throw subCheckError

      if (subcategories && subcategories.length > 0) {
        // Check if any subcategories have linked skills
        for (const subcategory of subcategories) {
          const { data: skills, error: skillCheckError } = await supabase
            .from('skills')
            .select('id')
            .eq('subcategory_id', subcategory.id)
            .limit(1)

          if (skillCheckError) throw skillCheckError

          if (skills && skills.length > 0) {
            throw new Error(
              `Cannot delete category. Subcategory "${subcategory.name}" has ${skills.length} linked skill(s).`
            )
          }
        }

        throw new Error('Cannot delete category with linked subcategories')
      }

      const { error } = await supabase.from('categories').delete().eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Category deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete category: ${error.message}`)
    },
  })

  return {
    createCategory,
    updateCategory,
    deleteCategory,
  }
}
