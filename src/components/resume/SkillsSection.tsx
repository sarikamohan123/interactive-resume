import { useSkills, type Skill } from '@/hooks/useSkills'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Award, TrendingUp, Zap, CheckCircle2 } from 'lucide-react'
import { Fade, Slide } from 'react-awesome-reveal'

const getLevelConfig = (level: string) => {
  const normalizedLevel = level?.toLowerCase() || ''

  switch (normalizedLevel) {
    case 'expert':
      return {
        color: 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-50 transition-colors',
        icon: Award,
        iconColor: 'text-blue-600',
        gradientFrom: 'from-blue-500',
        gradientTo: 'to-blue-600',
        shadowColor: 'shadow-blue-200/50',
        shadowHover: 'group-hover:shadow-blue-300/60'
      }
    case 'advanced':
      return {
        color: 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-50 transition-colors',
        icon: TrendingUp,
        iconColor: 'text-blue-600',
        gradientFrom: 'from-blue-500',
        gradientTo: 'to-purple-500',
        shadowColor: 'shadow-blue-200/50',
        shadowHover: 'group-hover:shadow-purple-300/50'
      }
    case 'intermediate':
      return {
        color: 'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-50 transition-colors',
        icon: Zap,
        iconColor: 'text-purple-600',
        gradientFrom: 'from-purple-500',
        gradientTo: 'to-purple-600',
        shadowColor: 'shadow-purple-200/50',
        shadowHover: 'group-hover:shadow-purple-400/60'
      }
    case 'certified':
      return {
        color: 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-50 transition-colors',
        icon: Award,
        iconColor: 'text-amber-600',
        gradientFrom: 'from-amber-500',
        gradientTo: 'to-amber-600',
        shadowColor: 'shadow-amber-200/50',
        shadowHover: 'group-hover:shadow-amber-400/60'
      }
    default:
      return {
        color: 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-50 transition-colors',
        icon: Zap,
        iconColor: 'text-gray-600',
        gradientFrom: 'from-gray-500',
        gradientTo: 'to-gray-600',
        shadowColor: 'shadow-gray-200/50',
        shadowHover: 'group-hover:shadow-gray-400/60'
      }
  }
}

const getLevelPriority = (level: string | null): number => {
  const normalized = level?.toLowerCase() || ''
  switch (normalized) {
    case 'expert': return 4
    case 'advanced': return 3
    case 'intermediate': return 2
    case 'certified': return 1
    default: return 0
  }
}

const groupAndSortSkills = (skills: Skill[]) => {
  const sortedSkills = [...skills].sort((a, b) => {
    const levelDiff = getLevelPriority(b.level) - getLevelPriority(a.level)
    if (levelDiff !== 0) return levelDiff

    const yearsA = a.years || 0
    const yearsB = b.years || 0
    return yearsB - yearsA
  })

  const grouped = sortedSkills.reduce((acc, skill) => {
    const subcategoryName = skill.subcategory?.name || 'Other'
    const subcategorySort = skill.subcategory?.sort_order || 999

    if (!acc[subcategoryName]) {
      acc[subcategoryName] = {
        name: subcategoryName,
        sortOrder: subcategorySort,
        skills: []
      }
    }

    acc[subcategoryName].skills.push(skill)
    return acc
  }, {} as Record<string, { name: string; sortOrder: number; skills: Skill[] }>)

  return Object.values(grouped).sort((a, b) => a.sortOrder - b.sortOrder)
}

const formatDescription = (description: string | null): string[] => {
  if (!description) return []

  const points = description
    .split(/[.;]/)
    .map(point => point.trim())
    .filter(point => point.length > 0)

  return points.length > 0 ? points : [description]
}

export function SkillsSection() {
  const { data: skills, isLoading, error } = useSkills()

  if (isLoading) {
    return (
      <section className="mb-12">
        <div className="mb-8">
          <Skeleton className="h-10 w-40 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="space-y-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="flex gap-6">
                <div className="flex flex-col items-center">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <Skeleton className="w-0.5 h-32 mt-4" />
                </div>
                <Card className="flex-1 border-2">
                  <CardHeader>
                    <Skeleton className="h-6 w-2/3 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </CardHeader>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Technical Skills</h2>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          Error loading skills: {error.message}
        </div>
      </section>
    )
  }

  if (!skills || skills.length === 0) {
    return (
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Technical Skills</h2>
        <p className="text-gray-500 italic">No skills yet.</p>
      </section>
    )
  }

  const groupedSkills = groupAndSortSkills(skills)

  return (
    <section className="mb-12">
      {/* Section Header - Slide + Fade animations */}
      <Slide triggerOnce direction="up" duration={700}>
        <div>
          <h2 className="text-4xl font-bold mb-3 tracking-tight text-gradient">
            Technical Skills
          </h2>
          <Fade triggerOnce duration={700} delay={100}>
            <div className="h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full w-20 mb-4" />
          </Fade>
          <Fade triggerOnce duration={700} delay={200}>
            <p className="mt-4 text-lg text-gray-600">
              Expertise across programming languages, frameworks, and modern technologies
            </p>
          </Fade>
        </div>
      </Slide>

      {/* Grouped Skills Timeline */}
      <div className="space-y-6 sm:space-y-10 mt-8">
        {groupedSkills.map((group, groupIndex) => (
          <div key={group.name} className="space-y-4 sm:space-y-6">
            {/* Subcategory Header - Fade animation */}
            <Fade triggerOnce duration={700} delay={300 + groupIndex * 200}>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {group.name}
              </h3>
            </Fade>

            {/* Skills in this subcategory */}
            <div className="space-y-5 sm:space-y-8">
              {group.skills.map((skill, skillIndex) => {
                const levelConfig = skill.level ? getLevelConfig(skill.level) : null
                const LevelIcon = levelConfig?.icon
                const descriptionPoints = formatDescription(skill.description)
                const isLastInGroup = skillIndex === group.skills.length - 1

                return (
                  <Slide
                    key={skill.id}
                    triggerOnce
                    direction="up"
                    duration={700}
                    delay={300 + (groupIndex * 200) + (skillIndex * 150)}
                  >
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 group">
                      {/* Timeline Connector */}
                      <div className="flex sm:flex-col items-center sm:items-center flex-shrink-0">
                        {/* Timeline Icon */}
                        {levelConfig && LevelIcon ? (
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${levelConfig.gradientFrom} ${levelConfig.gradientTo} flex items-center justify-center shadow-lg ${levelConfig.shadowColor} group-hover:scale-110 group-hover:shadow-xl ${levelConfig.shadowHover} transition-all duration-300`}>
                            <LevelIcon className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center shadow-lg shadow-gray-200/50">
                            <Zap className="w-6 h-6 text-white" />
                          </div>
                        )}

                        {/* Timeline Line - Hidden on mobile, visible on sm+ */}
                        {!isLastInGroup && (
                          <div className="hidden sm:block w-0.5 h-full min-h-[4rem] bg-gradient-to-b from-blue-300 to-transparent mt-4" />
                        )}
                      </div>

                      {/* Skill Card */}
                      <Card className="flex-1 border-2 border-blue-200 hover:border-purple-400 hover:shadow-2xl hover:shadow-blue-200/50 transition-all duration-300 motion-safe:hover:-translate-y-2 active:scale-[0.98] bg-white">
                        <CardHeader className="pb-4">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                            <div className="flex-1">
                              <h4 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                                {skill.name}
                              </h4>

                              {/* Badges Row */}
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
                            </div>
                          </div>
                        </CardHeader>

                        {/* Description as Bullet Points */}
                        {descriptionPoints.length > 0 && (
                          <CardContent className="pt-0">
                            <ul className="space-y-2">
                              {descriptionPoints.map((point, index) => (
                                <li key={index} className="text-gray-700 flex items-start gap-3 group/item">
                                  <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform" />
                                  <span className="leading-relaxed text-sm">{point}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        )}
                      </Card>
                    </div>
                  </Slide>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
