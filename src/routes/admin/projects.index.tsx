import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
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
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useProjects, type ProjectWithDetails } from '@/hooks/useProjects'
import { useProjectMutations } from '@/hooks/mutations/useProjectMutations'
import { projectSchema, type ProjectFormData } from '@/schemas/project'
import { CheckCircle2, Plus, Trash2, Wand2 } from 'lucide-react'

export const Route = createFileRoute('/admin/projects/')({
  component: ProjectsPage,
})

function ProjectsPage() {
  const { data: projects = [], isLoading, error } = useProjects()
  const { createProject, updateProject, deleteProject } = useProjectMutations()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<ProjectWithDetails | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<ProjectWithDetails | null>(null)

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      slug: '',
      summary: '',
      description: null,
      role: null,
      hero_image_url: null,
      additional_image_urls: null,
      live_url: null,
      repo_url: null,
      is_featured: false,
      category: null,
      sort_order: 0,
      tags: null,
      metrics: [],
    },
  })

  const {
    fields: metricFields,
    append: appendMetric,
    remove: removeMetric,
  } = useFieldArray({
    control: form.control,
    name: 'metrics',
  })

  const generateSlug = () => {
    const title = form.getValues('title')
    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      form.setValue('slug', slug)
    }
  }

  const handleCreate = () => {
    setEditingProject(null)
    form.reset({
      title: '',
      slug: '',
      summary: '',
      description: null,
      role: null,
      hero_image_url: null,
      additional_image_urls: null,
      live_url: null,
      repo_url: null,
      is_featured: false,
      category: null,
      sort_order: 0,
      tags: null,
      metrics: [],
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (project: ProjectWithDetails) => {
    setEditingProject(project)
    form.reset({
      title: project.title,
      slug: project.slug,
      summary: project.summary,
      description: project.description,
      role: project.role,
      hero_image_url: project.hero_image_url,
      additional_image_urls: project.additional_image_urls?.join('\n') || null,
      live_url: project.live_url,
      repo_url: project.repo_url,
      is_featured: project.is_featured,
      category: project.category,
      sort_order: project.sort_order,
      tags: project.project_tags.map((pt) => pt.tag).join(', '),
      metrics: project.project_metrics.map((m) => ({ label: m.label, value: m.value })),
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = (data: ProjectFormData) => {
    const tags = data.tags
      ? data.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : []

    const additionalImageUrls = data.additional_image_urls
      ? data.additional_image_urls
          .split('\n')
          .map((u) => u.trim())
          .filter(Boolean)
      : []

    const projectData = {
      title: data.title,
      slug: data.slug,
      summary: data.summary,
      description: data.description || null,
      role: data.role || null,
      hero_image_url: data.hero_image_url || null,
      additional_image_urls: additionalImageUrls.length > 0 ? additionalImageUrls : null,
      live_url: data.live_url || null,
      repo_url: data.repo_url || null,
      is_featured: data.is_featured,
      category: data.category || null,
      sort_order: data.sort_order,
    }

    const metrics = (data.metrics || []).map((m) => ({
      label: m.label,
      value: m.value,
    }))

    if (editingProject) {
      updateProject.mutate(
        { id: editingProject.id, project: projectData, tags, metrics },
        {
          onSuccess: () => {
            setIsDialogOpen(false)
            form.reset()
          },
        },
      )
    } else {
      createProject.mutate(
        { project: projectData, tags, metrics },
        {
          onSuccess: () => {
            setIsDialogOpen(false)
            form.reset()
          },
        },
      )
    }
  }

  const handleDelete = (project: ProjectWithDetails) => {
    setDeleteConfirm(project)
  }

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteProject.mutate(deleteConfirm.id, {
        onSuccess: () => setDeleteConfirm(null),
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading projects...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">Error loading projects: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">Manage your showcase projects</p>
        </div>
        <Button onClick={handleCreate}>Add Project</Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Sort Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                  No projects found. Add your first project to get started.
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell>{project.category || '—'}</TableCell>
                  <TableCell>
                    {project.is_featured ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {project.project_tags.slice(0, 3).map((pt) => (
                        <Badge key={pt.id} variant="secondary" className="text-xs">
                          {pt.tag}
                        </Badge>
                      ))}
                      {project.project_tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{project.project_tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{project.sort_order}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(project)}>
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(project)}
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProject ? 'Edit Project' : 'Add Project'}</DialogTitle>
            <DialogDescription>
              {editingProject
                ? 'Update the project details below.'
                : 'Add a new showcase project.'}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Basic Info
                </h3>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Interactive Resume" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input placeholder="e.g. interactive-resume" {...field} />
                        </FormControl>
                        <Button type="button" variant="outline" size="sm" onClick={generateSlug}>
                          <Wand2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Summary</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief one-line summary of the project"
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Details
                </h3>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Detailed description of the project"
                          rows={4}
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
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Role (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Lead Developer"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Images */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Images
                </h3>
                <FormField
                  control={form.control}
                  name="hero_image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hero Image URL (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="/images/screenshot.png or https://example.com/screenshot.png"
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
                  name="additional_image_urls"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Image URLs (Optional, one per line)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={"https://example.com/image1.png\nhttps://example.com/image2.png"}
                          rows={3}
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Links */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Links
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="live_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Live URL (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="url"
                            placeholder="https://myproject.vercel.app"
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
                    name="repo_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Repository URL (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="url"
                            placeholder="https://github.com/user/project"
                            {...field}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Categorization */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Categorization
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Full-Stack"
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
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_featured"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Featured</FormLabel>
                        <div className="flex items-center gap-2 pt-2">
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-600">Featured project</span>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Tags
                </h3>
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tech Stack Tags (comma-separated)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="React, TypeScript, Supabase, Tailwind CSS"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Metrics */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Impact Metrics
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendMetric({ label: '', value: '' })}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Metric
                  </Button>
                </div>

                {metricFields.length === 0 && (
                  <p className="text-sm text-gray-500 italic">
                    No metrics added. Click "Add Metric" to highlight impact numbers.
                  </p>
                )}

                {metricFields.map((field, index) => (
                  <div key={field.id} className="flex gap-3 items-start">
                    <FormField
                      control={form.control}
                      name={`metrics.${index}.label`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          {index === 0 && <FormLabel>Label</FormLabel>}
                          <FormControl>
                            <Input placeholder="e.g. Users" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`metrics.${index}.value`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          {index === 0 && <FormLabel>Value</FormLabel>}
                          <FormControl>
                            <Input placeholder="e.g. 50K+" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeMetric(index)}
                      className={`text-red-600 hover:text-red-700 flex-shrink-0 ${index === 0 ? 'mt-8' : ''}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={createProject.isPending || updateProject.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createProject.isPending || updateProject.isPending}
                >
                  {createProject.isPending || updateProject.isPending
                    ? 'Saving...'
                    : editingProject
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
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the project "{deleteConfirm?.title}"? This will also
              remove all associated tags and metrics. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteProject.isPending}
            >
              {deleteProject.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
