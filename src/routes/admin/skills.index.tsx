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
import { Textarea } from '@/components/ui/textarea'
import { useCategories } from '@/hooks/useCategories'
import { useSubcategories } from '@/hooks/useSubcategories'
import { useSkills } from '@/hooks/useSkills'
import { useSkillMutations } from '@/hooks/mutations/useSkillMutations'
import { skillSchema, type SkillFormData } from '@/schemas/skill'
import type { Skill } from '@/types/database'

export const Route = createFileRoute('/admin/skills/')({
  component: SkillsPage,
})

function SkillsPage() {
  const { data: categories = [] } = useCategories()
  const { data: subcategories = [], isLoading: subcategoriesLoading } = useSubcategories()
  const { data: skills = [], isLoading, error } = useSkills()
  const { createSkill, updateSkill, deleteSkill } = useSkillMutations()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<Skill | null>(null)

  const form = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      subcategory_id: '',
      name: '',
      level: '',
      years: 0,
      description: '',
      links: null,
      sort_order: 0,
    },
  })

  const handleCreate = () => {
    setEditingSkill(null)
    form.reset({
      subcategory_id: '',
      name: '',
      level: '',
      years: 0,
      description: '',
      links: null,
      sort_order: 0,
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill)
    form.reset({
      subcategory_id: skill.subcategory_id,
      name: skill.name,
      level: skill.level || '',
      years: skill.years || 0,
      description: skill.description || '',
      links: skill.links,
      sort_order: skill.sort_order,
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = (data: SkillFormData) => {
    // Convert empty strings to null for optional fields
    const sanitizedData = {
      ...data,
      level: data.level || null,
      years: data.years || null,
      description: data.description || null,
    }

    if (editingSkill) {
      updateSkill.mutate(
        { id: editingSkill.id, data: sanitizedData },
        {
          onSuccess: () => {
            setIsDialogOpen(false)
            form.reset()
          },
        }
      )
    } else {
      createSkill.mutate(sanitizedData, {
        onSuccess: () => {
          setIsDialogOpen(false)
          form.reset()
        },
      })
    }
  }

  const handleDelete = (skill: Skill) => {
    setDeleteConfirm(skill)
  }

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteSkill.mutate(deleteConfirm.id, {
        onSuccess: () => setDeleteConfirm(null),
      })
    }
  }

  // Get subcategory and category names
  const getSubcategoryInfo = (subcategoryId: string) => {
    const subcategory = subcategories.find((s) => s.id === subcategoryId)
    if (!subcategory) return { subcategoryName: 'Unknown', categoryName: 'Unknown' }

    const category = categories.find((c) => c.id === subcategory.category_id)
    return {
      subcategoryName: subcategory.name,
      categoryName: category?.name || 'Unknown',
    }
  }

  if (isLoading || subcategoriesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading skills...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">Error loading skills: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Skills</h1>
          <p className="text-gray-600 mt-1">Manage your technical skills</p>
        </div>
        <Button onClick={handleCreate} disabled={subcategories.length === 0}>
          Create Skill
        </Button>
      </div>

      {/* Warning if no subcategories */}
      {subcategories.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            You need to create at least one subcategory before you can add skills.
          </p>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Subcategory</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Years</TableHead>
              <TableHead>Sort Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {skills.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                  No skills found. Create your first skill to get started.
                </TableCell>
              </TableRow>
            ) : (
              skills.map((skill) => {
                const { subcategoryName, categoryName } = getSubcategoryInfo(skill.subcategory_id)
                return (
                  <TableRow key={skill.id}>
                    <TableCell className="font-medium">{categoryName}</TableCell>
                    <TableCell>{subcategoryName}</TableCell>
                    <TableCell>{skill.name}</TableCell>
                    <TableCell>{skill.level || '-'}</TableCell>
                    <TableCell>{skill.years !== null ? skill.years : '-'}</TableCell>
                    <TableCell>{skill.sort_order}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(skill)}>
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(skill)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingSkill ? 'Edit Skill' : 'Create Skill'}</DialogTitle>
            <DialogDescription>
              {editingSkill ? 'Update the skill details below.' : 'Add a new technical skill.'}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="subcategory_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subcategory</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subcategory" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subcategories.map((subcategory) => {
                          const category = categories.find((c) => c.id === subcategory.category_id)
                          return (
                            <SelectItem key={subcategory.id} value={subcategory.id}>
                              {category?.name} → {subcategory.name}
                            </SelectItem>
                          )
                        })}
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
                      <Input placeholder="e.g. React, TypeScript, Node.js" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Level (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || undefined}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Expert">Expert</SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                          <SelectItem value="Intermediate">Intermediate</SelectItem>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="years"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of your experience with this skill..."
                        className="resize-none"
                        rows={3}
                        {...field}
                        value={field.value || ''}
                      />
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
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value) || 0)}
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
                  disabled={createSkill.isPending || updateSkill.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createSkill.isPending || updateSkill.isPending}>
                  {createSkill.isPending || updateSkill.isPending
                    ? 'Saving...'
                    : editingSkill
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
            <DialogTitle>Delete Skill</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteConfirm?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteSkill.isPending}
            >
              {deleteSkill.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
