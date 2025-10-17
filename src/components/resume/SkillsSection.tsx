import { useSkills } from '@/hooks/useSkills'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Award, TrendingUp, Zap } from 'lucide-react'

const getLevelConfig = (level: string) => {
  const normalizedLevel = level?.toLowerCase() || ''

  switch (normalizedLevel) {
    case 'expert':
      return {
        color: 'bg-green-100 text-green-700 border-green-200 hover:bg-green-50 transition-colors',
        icon: Award,
        iconColor: 'text-green-600'
      }
    case 'advanced':
      return {
        color: 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-50 transition-colors',
        icon: TrendingUp,
        iconColor: 'text-blue-600'
      }
    case 'intermediate':
      return {
        color: 'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-50 transition-colors',
        icon: Zap,
        iconColor: 'text-purple-600'
      }
    case 'certified':
      return {
        color: 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-50 transition-colors',
        icon: Award,
        iconColor: 'text-amber-600'
      }
    default:
      return {
        color: 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-50 transition-colors',
        icon: Zap,
        iconColor: 'text-gray-600'
      }
  }
}

export function SkillsSection() {
  const { data: skills, isLoading, error } = useSkills()
  const { elementRef, isVisible } = useScrollAnimation()

  if (isLoading) {
    return (
      <section className="mb-12">
        <div className="mb-8">
          <Skeleton className="h-10 w-40 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border-2">
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-20 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-1/3 mb-2" />
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Skills</h2>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          Error loading skills: {error.message}
        </div>
      </section>
    )
  }

  if (!skills || skills.length === 0) {
    return (
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Skills</h2>
        <p className="text-gray-500 italic">No skills yet.</p>
      </section>
    )
  }

  return (
    <section className="mb-12">
      {/* Section Header with Gradient Accent */}
      <div
        ref={elementRef}
        className={`mb-8 transition-all duration-1000 ${
          isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-8'
        }`}
      >
        <h2 className="text-4xl font-bold mb-3 tracking-tight text-gradient">
          Technical Skills
        </h2>
        <div className={`h-1 w-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-1000 delay-300 ${
          isVisible ? 'w-20' : 'w-0'
        }`} />
        <p className="mt-4 text-lg text-gray-600">
          Expertise across programming languages, frameworks, and modern technologies
        </p>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill, index) => {
          const levelConfig = skill.level ? getLevelConfig(skill.level) : null
          const LevelIcon = levelConfig?.icon

          return (
            <Card
              key={skill.id}
              className={`group border-2 border-gray-200 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-300/40 transition-all duration-500 motion-safe:hover:-translate-y-2 hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-purple-50/30 bg-white ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: `${index * 50}ms`
              }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {skill.name}
                  </h3>
                  {levelConfig && LevelIcon && (
                    <LevelIcon className={`w-5 h-5 ${levelConfig.iconColor} flex-shrink-0`} />
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {skill.level && levelConfig && (
                    <Badge className={`${levelConfig.color} border text-xs font-semibold`}>
                      {skill.level}
                    </Badge>
                  )}
                  {skill.years && (
                    <Badge variant="outline" className="text-xs font-medium border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                      {skill.years} {skill.years === 1 ? 'year' : 'years'}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              {skill.description && (
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {skill.description}
                  </p>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>
    </section>
  )
}
