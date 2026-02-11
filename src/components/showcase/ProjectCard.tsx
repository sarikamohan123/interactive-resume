import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, TrendingUp } from 'lucide-react'
import type { ProjectWithDetails } from '@/hooks/useProjects'

interface ProjectCardProps {
  project: ProjectWithDetails
  onClick: () => void
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const firstMetric = project.project_metrics?.[0]

  return (
    <Card
      className="group cursor-pointer border-2 border-blue-200 hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-300/50 transition-all duration-300 motion-safe:hover:-translate-y-2 bg-white overflow-hidden active:scale-[0.98]"
      onClick={onClick}
    >
      {/* Hero Image */}
      {project.hero_image_url ? (
        <div className="aspect-video overflow-hidden">
          <img
            src={project.hero_image_url}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <span className="text-white text-5xl font-bold opacity-30">{project.title[0]}</span>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-1">
            {project.title}
          </h3>
          {project.is_featured && (
            <Badge className="bg-amber-100 text-amber-700 border-amber-200 border text-xs font-semibold flex-shrink-0">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          )}
        </div>
        <p className="text-sm text-gray-600 line-clamp-2 mt-1">{project.summary}</p>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Tech Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.project_tags.slice(0, 4).map((pt) => (
            <Badge key={pt.id} variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
              {pt.tag}
            </Badge>
          ))}
          {project.project_tags.length > 4 && (
            <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs">
              +{project.project_tags.length - 4}
            </Badge>
          )}
        </div>

        {/* Key Metric */}
        {firstMetric && (
          <div className="flex items-center gap-2 text-sm bg-green-50 rounded-lg px-3 py-2">
            <TrendingUp className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span className="font-medium text-green-700">{firstMetric.label}:</span>
            <span className="text-gray-700">{firstMetric.value}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
