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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useCategories } from '@/hooks/useCategories'
import { useSubcategories } from '@/hooks/useSubcategories'
import { useSubcategoryMutations } from '@/hooks/mutations/useSubcategoryMutations'
import { subcategorySchema, type SubcategoryFormData } from '@/schemas/subcategory'
import type { Subcategory } from '@/types/database'

export const Route = createFileRoute('/admin/subcategories/')({
  component: SubcategoriesPage,
})

function SubcategoriesPage() {
  const { data: categories = [], isLoading: categoriesLoading } = useCategories()
  const { data: subcategories = [], isLoading, error } = useSubcategories()
  const { createSubcategory, updateSubcategory, deleteSubcategory } =
    useSubcategoryMutations()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<Subcategory | null>(null)

  const form = useForm<SubcategoryFormData>({
    resolver: zodResolver(subcategorySchema),
    defaultValues: {
      category_id: '',
      name: '',
      sort_order: 0,
    },
  })

  const handleCreate = () => {
    setEditingSubcategory(null)
    form.reset({ category_id: '', name: '', sort_order: 0 })
    setIsDialogOpen(true)
  }

  const handleEdit = (subcategory: Subcategory) => {
    setEditingSubcategory(subcategory)
    form.reset({
      category_id: subcategory.category_id,
      name: subcategory.name,
      sort_order: subcategory.sort_order,
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = (data: SubcategoryFormData) => {
    if (editingSubcategory) {
      updateSubcategory.mutate(
        { id: editingSubcategory.id, data },
        {
          onSuccess: () => {
            setIsDialogOpen(false)
            form.reset()
          },
        }
      )
    } else {
      createSubcategory.mutate(data, {
        onSuccess: () => {
          setIsDialogOpen(false)
          form.reset()
        },
      })
    }
  }

  const handleDelete = (subcategory: Subcategory) => {
    setDeleteConfirm(subcategory)
  }

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteSubcategory.mutate(deleteConfirm.id, {
        onSuccess: () => setDeleteConfirm(null),
      })
    }
  }

  // Get category name by ID
  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    return category?.name || 'Unknown'
  }

  if (isLoading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading subcategories...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">Error loading subcategories: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subcategories</h1>
          <p className="text-gray-600 mt-1">Manage skill subcategories</p>
        </div>
        <Button onClick={handleCreate} disabled={categories.length === 0}>
          Create Subcategory
        </Button>
      </div>

      {/* Warning if no categories */}
      {categories.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            You need to create at least one category before you can add subcategories.
          </p>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Sort Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subcategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                  No subcategories found. Create your first subcategory to get started.
                </TableCell>
              </TableRow>
            ) : (
              subcategories.map((subcategory) => (
                <TableRow key={subcategory.id}>
                  <TableCell className="font-medium">
                    {getCategoryName(subcategory.category_id)}
                  </TableCell>
                  <TableCell>{subcategory.name}</TableCell>
                  <TableCell>{subcategory.sort_order}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(subcategory)}>
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(subcategory)}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSubcategory ? 'Edit Subcategory' : 'Create Subcategory'}
            </DialogTitle>
            <DialogDescription>
              {editingSubcategory
                ? 'Update the subcategory details below.'
                : 'Add a new skill subcategory.'}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. React" {...field} />
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
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
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
                  disabled={createSubcategory.isPending || updateSubcategory.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createSubcategory.isPending || updateSubcategory.isPending}
                >
                  {createSubcategory.isPending || updateSubcategory.isPending
                    ? 'Saving...'
                    : editingSubcategory
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
            <DialogTitle>Delete Subcategory</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteConfirm?.name}"? This will fail if there are
              skills linked to this subcategory.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteSubcategory.isPending}
            >
              {deleteSubcategory.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
