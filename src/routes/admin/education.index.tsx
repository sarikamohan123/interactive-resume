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
import { useEducation } from '@/hooks/useEducation'
import { useEducationMutations } from '@/hooks/mutations/useEducationMutations'
import { educationSchema, type EducationFormData } from '@/schemas/education'
import type { Education } from '@/types/database'

export const Route = createFileRoute('/admin/education/')({
  component: EducationPage,
})

function EducationPage() {
  const { data: education = [], isLoading, error } = useEducation()
  const { createEducation, updateEducation, deleteEducation } = useEducationMutations()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEducation, setEditingEducation] = useState<Education | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<Education | null>(null)

  const form = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      school: '',
      degree: '',
      start_date: '',
      end_date: '',
      details: null,
    },
  })

  const handleCreate = () => {
    setEditingEducation(null)
    form.reset({
      school: '',
      degree: '',
      start_date: '',
      end_date: '',
      details: null,
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (education: Education) => {
    setEditingEducation(education)
    form.reset({
      school: education.school,
      degree: education.degree,
      start_date: education.start_date,
      end_date: education.end_date || '',
      details: education.details,
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = (data: EducationFormData) => {
    // Convert empty strings to null for optional fields
    const sanitizedData = {
      ...data,
      end_date: data.end_date || null,
    }

    if (editingEducation) {
      updateEducation.mutate(
        { id: editingEducation.id, data: sanitizedData },
        {
          onSuccess: () => {
            setIsDialogOpen(false)
            form.reset()
          },
        }
      )
    } else {
      createEducation.mutate(sanitizedData, {
        onSuccess: () => {
          setIsDialogOpen(false)
          form.reset()
        },
      })
    }
  }

  const handleDelete = (education: Education) => {
    setDeleteConfirm(education)
  }

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteEducation.mutate(deleteConfirm.id, {
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
        <div className="text-gray-600">Loading education...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">Error loading education: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Education</h1>
          <p className="text-gray-600 mt-1">Manage your educational background</p>
        </div>
        <Button onClick={handleCreate}>Add Education</Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>School</TableHead>
              <TableHead>Degree</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {education.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                  No education records found. Add your first education record to get started.
                </TableCell>
              </TableRow>
            ) : (
              education.map((edu) => (
                <TableRow key={edu.id}>
                  <TableCell className="font-medium">{edu.school}</TableCell>
                  <TableCell>{edu.degree}</TableCell>
                  <TableCell>{formatDate(edu.start_date)}</TableCell>
                  <TableCell>{formatDate(edu.end_date)}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(edu)}>
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(edu)}
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
              {editingEducation ? 'Edit Education' : 'Add Education'}
            </DialogTitle>
            <DialogDescription>
              {editingEducation
                ? 'Update the education details below.'
                : 'Add a new education record.'}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="school"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Stanford University" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="degree"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Degree</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Bachelor of Science in Computer Science" {...field} />
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
                  disabled={createEducation.isPending || updateEducation.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createEducation.isPending || updateEducation.isPending}>
                  {createEducation.isPending || updateEducation.isPending
                    ? 'Saving...'
                    : editingEducation
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
            <DialogTitle>Delete Education</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the education record from "{deleteConfirm?.school}"?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteEducation.isPending}
            >
              {deleteEducation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
