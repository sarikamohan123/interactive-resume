import { useState, useMemo } from 'react'
import { Fade, Slide } from 'react-awesome-reveal'
import { Filter, X } from 'lucide-react'
import { useProjects, type ProjectWithDetails } from '@/hooks/useProjects'
import { useProjectTags } from '@/hooks/useProjectTags'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ProjectCard } from './ProjectCard'
import { ProjectDetailModal } from './ProjectDetailModal'

export function ShowcaseGrid() {
  const { data: projects, isLoading, error } = useProjects()
  const { data: allTags = [] } = useProjectTags()

  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedProject, setSelectedProject] = useState<ProjectWithDetails | null>(null)

  // Derive unique categories from projects
  const categories = useMemo(() => {
    if (!projects) return []
    return [...new Set(projects.map((p) => p.category).filter(Boolean))] as string[]
  }, [projects])

  // Filter logic: AND between category and tags
  const filteredProjects = useMemo(() => {
    if (!projects) return []
    return projects.filter((project) => {
      const matchesCategory = !selectedCategory || project.category === selectedCategory
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => project.project_tags.some((pt) => pt.tag === tag))
      return matchesCategory && matchesTags
    })
  }, [projects, selectedCategory, selectedTags])

  const activeFilterCount = (selectedCategory ? 1 : 0) + selectedTags.length

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    )
  }

  const clearFilters = () => {
    setSelectedCategory(null)
    setSelectedTags([])
  }

  // Loading state
  if (isLoading) {
    return (
      <div>
        <div className="mb-8">
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border-2 border-gray-100 overflow-hidden">
              <Skeleton className="aspect-video w-full" />
              <CardHeader>
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-5 w-14 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Projects</h2>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          Error loading projects: {error.message}
        </div>
      </div>
    )
  }

  // Empty state
  if (!projects || projects.length === 0) {
    return (
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Projects</h2>
        <p className="text-gray-500 italic">No projects yet. Check back soon!</p>
      </div>
    )
  }

  return (
    <>
      {/* Section Header */}
      <Slide triggerOnce direction="up" duration={700}>
        <div>
          <h2 className="text-4xl font-bold mb-3 tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Projects
          </h2>
          <Fade triggerOnce duration={700} delay={100}>
            <div className="h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full w-20 mb-4" />
          </Fade>
          <Fade triggerOnce duration={700} delay={200}>
            <p className="mt-4 text-lg text-gray-600">
              Explore featured projects with live demos, tech stack details, and measurable impact
            </p>
          </Fade>
        </div>
      </Slide>

      {/* Filter Bar */}
      <div className="mt-8 mb-8 space-y-4">
        {/* Category Pills */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <Filter className="w-4 h-4 text-gray-500 mr-1" />
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                !selectedCategory
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-200/50'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-200/50'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Tech Tag Filter Pills */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-300 ${
                  selectedTags.includes(tag)
                    ? 'bg-purple-100 text-purple-700 border-purple-300'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Active Filters */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
            </Badge>
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-3 h-3" />
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Card Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <Slide
              key={project.id}
              triggerOnce
              direction="up"
              duration={700}
              delay={300 + index * 150}
            >
              <ProjectCard project={project} onClick={() => setSelectedProject(project)} />
            </Slide>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500 italic mb-4">No projects match the selected filters.</p>
          <button
            onClick={clearFilters}
            className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        open={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  )
}
