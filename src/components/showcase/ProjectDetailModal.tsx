import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Github, Star, TrendingUp, User } from 'lucide-react'
import type { ProjectWithDetails } from '@/hooks/useProjects'

interface ProjectDetailModalProps {
  project: ProjectWithDetails | null
  open: boolean
  onClose: () => void
}

export function ProjectDetailModal({ project, open, onClose }: ProjectDetailModalProps) {
  if (!project) return null

  const additionalImages = Array.isArray(project.additional_image_urls)
    ? project.additional_image_urls
    : []

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-3 pr-6">
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {project.title}
              </DialogTitle>
              <div className="flex flex-wrap gap-2 mt-2">
                {project.is_featured && (
                  <Badge className="bg-amber-100 text-amber-700 border-amber-200 border text-xs font-semibold">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
                {project.category && (
                  <Badge className="bg-purple-100 text-purple-700 border-purple-200 border text-xs">
                    {project.category}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Hero Image */}
        {project.hero_image_url && (
          <div className="rounded-lg overflow-hidden">
            <img
              src={project.hero_image_url}
              alt={project.title}
              className="w-full object-cover"
            />
          </div>
        )}

        {/* Additional Images */}
        {additionalImages.length > 0 && (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {additionalImages.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`${project.title} screenshot ${i + 1}`}
                className="h-32 rounded-lg object-cover flex-shrink-0 border border-gray-200"
              />
            ))}
          </div>
        )}

        {/* Role */}
        {project.role && (
          <div className="flex items-center gap-2 text-gray-700">
            <User className="w-4 h-4 text-purple-600 flex-shrink-0" />
            <span className="font-medium">Role:</span>
            <span>{project.role}</span>
          </div>
        )}

        {/* Summary */}
        <p className="text-gray-700 leading-relaxed">{project.summary}</p>

        {/* Description */}
        {project.description && (
          <div className="space-y-3">
            {project.description.split('\n').map((paragraph, i) => (
              <p key={i} className="text-gray-600 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        )}

        {/* Metrics */}
        {project.project_metrics.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Impact Metrics
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {project.project_metrics.map((metric) => (
                <div
                  key={metric.id}
                  className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 text-center"
                >
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                    {metric.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tech Tags */}
        {project.project_tags.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Technologies</h4>
            <div className="flex flex-wrap gap-2">
              {project.project_tags.map((pt) => (
                <Badge
                  key={pt.id}
                  variant="secondary"
                  className="bg-blue-100 text-blue-700 text-sm"
                >
                  {pt.tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Action Links */}
        {(project.live_url || project.repo_url) && (
          <div className="flex flex-wrap gap-3 pt-2">
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium text-sm motion-safe:transform motion-safe:hover:scale-105"
              >
                <ExternalLink className="w-4 h-4" />
                Live Demo
              </a>
            )}
            {project.repo_url && (
              <a
                href={project.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-all duration-300 font-medium text-sm motion-safe:transform motion-safe:hover:scale-105"
              >
                <Github className="w-4 h-4" />
                View Code
              </a>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
