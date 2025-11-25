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
import { useCertifications } from '@/hooks/useCertifications'
import { useCertificationMutations } from '@/hooks/mutations/useCertificationMutations'
import { certificationSchema, type CertificationFormData } from '@/schemas/certification'
import type { Certification } from '@/types/database'

export const Route = createFileRoute('/admin/certifications/')({
  component: CertificationsPage,
})

function CertificationsPage() {
  const { data: certifications = [], isLoading, error } = useCertifications()
  const { createCertification, updateCertification, deleteCertification } = useCertificationMutations()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<Certification | null>(null)

  const form = useForm<CertificationFormData>({
    resolver: zodResolver(certificationSchema),
    defaultValues: {
      name: '',
      issuing_organization: '',
      issued_at: '',
      credential_id: null,
      credential_url: null,
      sort_order: 0,
    },
  })

  const handleCreate = () => {
    setEditingCertification(null)
    form.reset({
      name: '',
      issuing_organization: '',
      issued_at: '',
      credential_id: null,
      credential_url: null,
      sort_order: 0,
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (certification: Certification) => {
    setEditingCertification(certification)
    form.reset({
      name: certification.name,
      issuing_organization: certification.issuing_organization,
      issued_at: certification.issued_at,
      credential_id: certification.credential_id,
      credential_url: certification.credential_url,
      sort_order: certification.sort_order,
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = (data: CertificationFormData) => {
    // Convert empty strings to null for optional fields
    const sanitizedData = {
      ...data,
      credential_id: data.credential_id || null,
      credential_url: data.credential_url || null,
    }

    if (editingCertification) {
      updateCertification.mutate(
        { id: editingCertification.id, data: sanitizedData },
        {
          onSuccess: () => {
            setIsDialogOpen(false)
            form.reset()
          },
        }
      )
    } else {
      createCertification.mutate(sanitizedData, {
        onSuccess: () => {
          setIsDialogOpen(false)
          form.reset()
        },
      })
    }
  }

  const handleDelete = (certification: Certification) => {
    setDeleteConfirm(certification)
  }

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteCertification.mutate(deleteConfirm.id, {
        onSuccess: () => setDeleteConfirm(null),
      })
    }
  }

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading certifications...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">Error loading certifications: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Certifications</h1>
          <p className="text-gray-600 mt-1">Manage your professional certifications</p>
        </div>
        <Button onClick={handleCreate}>Add Certification</Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Certification Name</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Issued Date</TableHead>
              <TableHead>Sort Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {certifications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                  No certifications found. Add your first certification to get started.
                </TableCell>
              </TableRow>
            ) : (
              certifications.map((cert) => (
                <TableRow key={cert.id}>
                  <TableCell className="font-medium">{cert.name}</TableCell>
                  <TableCell>{cert.issuing_organization}</TableCell>
                  <TableCell>{formatDate(cert.issued_at)}</TableCell>
                  <TableCell>{cert.sort_order}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(cert)}>
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(cert)}
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
              {editingCertification ? 'Edit Certification' : 'Add Certification'}
            </DialogTitle>
            <DialogDescription>
              {editingCertification
                ? 'Update the certification details below.'
                : 'Add a new professional certification.'}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certification Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. AWS Certified Solutions Architect" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="issuing_organization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issuing Organization</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Amazon Web Services" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="issued_at"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issue Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sort_order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sort Order</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="credential_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credential ID (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. AWS-12345678" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="credential_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credential URL (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="e.g. https://aws.amazon.com/verification"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={createCertification.isPending || updateCertification.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createCertification.isPending || updateCertification.isPending}
                >
                  {createCertification.isPending || updateCertification.isPending
                    ? 'Saving...'
                    : editingCertification
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
            <DialogTitle>Delete Certification</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the certification "{deleteConfirm?.name}"?
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
              disabled={deleteCertification.isPending}
            >
              {deleteCertification.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
