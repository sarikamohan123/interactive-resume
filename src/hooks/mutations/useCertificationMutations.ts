import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { supabase } from '@/lib/supabase'
import type { CertificationInsert, CertificationUpdate } from '@/types/database'

export function useCertificationMutations() {
  const queryClient = useQueryClient()

  const createCertification = useMutation({
    mutationFn: async (data: CertificationInsert) => {
      const { data: certification, error } = await supabase
        .from('certifications')
        .insert(data)
        .select()
        .single()

      if (error) throw error
      return certification
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications'] })
      toast.success('Certification created successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to create certification: ${error.message}`)
    },
  })

  const updateCertification = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CertificationUpdate }) => {
      const { data: certification, error } = await supabase
        .from('certifications')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return certification
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications'] })
      toast.success('Certification updated successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to update certification: ${error.message}`)
    },
  })

  const deleteCertification = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('certifications').delete().eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications'] })
      toast.success('Certification deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete certification: ${error.message}`)
    },
  })

  return {
    createCertification,
    updateCertification,
    deleteCertification,
  }
}
