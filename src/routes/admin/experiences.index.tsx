import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useExperiences } from '@/hooks/useExperiences'
import { useExperienceMutations } from '@/hooks/mutations/useExperienceMutations'
import { experienceSchema, type ExperienceFormData } from '@/schemas/experience'
import type { Experience } from '@/types/database'

export const Route = createFileRoute('/admin/experiences/')({
  component: ExperiencesPage,
})

function ExperiencesPage() {
  const { data: experiences = [], isLoading, error } = useExperiences()
  const { createExperience, updateExperience, deleteExperience } = useExperienceMutations()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<Experience | null>(null)

  const form = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      company: '',
      role: '',
      start_date: '',
      end_date: '',
      bullets: null,
    },
  })

  const handleCreate = () => {
    setEditingExperience(null)
    form.reset({
      company: '',
      role: '',
      start_date: '',
      end_date: '',
      bullets: null,
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience)
    form.reset({
      company: experience.company,
      role: experience.role,
      start_date: experience.start_date,
      end_date: experience.end_date || '',
      bullets: experience.bullets,
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = (data: ExperienceFormData) => {
    // Convert empty strings to null for optional fields
    const sanitizedData = {
      ...data,
      end_date: data.end_date || null,
    }

    if (editingExperience) {
      updateExperience.mutate(
        { id: editingExperience.id, data: sanitizedData },
        {
          onSuccess: () => {
            setIsDialogOpen(false)
            form.reset()
          },
        }
      )
    } else {
      createExperience.mutate(sanitizedData, {
        onSuccess: () => {
          setIsDialogOpen(false)
          form.reset()
        },
      })
    }
  }

  const handleDelete = (experience: Experience) => {
    setDeleteConfirm(experience)
  }

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteExperience.mutate(deleteConfirm.id, {
        onSuccess: () => setDeleteConfirm(null),
      })
    }
  }

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Present'
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading experiences...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">Error loading experiences: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Experiences</h1>
          <p className="text-gray-600 mt-1">Manage your work experience</p>
        </div>
        <Button onClick={handleCreate}>Create Experience</Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {experiences.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                  No experiences found. Create your first experience to get started.
                </TableCell>
              </TableRow>
            ) : (
              experiences.map((experience) => (
                <TableRow key={experience.id}>
                  <TableCell className="font-medium">{experience.company}</TableCell>
                  <TableCell>{experience.role}</TableCell>
                  <TableCell>{formatDate(experience.start_date)}</TableCell>
                  <TableCell>{formatDate(experience.end_date)}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(experience)}>
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(experience)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingExperience ? 'Edit Experience' : 'Create Experience'}
            </DialogTitle>
            <DialogDescription>
              {editingExperience
                ? 'Update the experience details below.'
                : 'Add a new work experience.'}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Acme Corporation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Senior Software Engineer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date (Optional)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={createExperience.isPending || updateExperience.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createExperience.isPending || updateExperience.isPending}>
                  {createExperience.isPending || updateExperience.isPending
                    ? 'Saving...'
                    : editingExperience
                      ? 'Update'
                      : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Experience</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the experience at "{deleteConfirm?.company}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteExperience.isPending}
            >
              {deleteExperience.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
