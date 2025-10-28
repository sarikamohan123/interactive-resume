import { useExperiences } from '@/hooks/useExperiences'
import { formatDateRange } from '@/utils/dateHelpers'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Briefcase, CheckCircle2 } from 'lucide-react'
import { Fade, Slide } from 'react-awesome-reveal'

export function ExperienceSection() {
  const { data: experiences, isLoading, error } = useExperiences()

  if (isLoading) {
    return (
      <section className="mb-12">
        <div className="mb-8">
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="space-y-8">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-6">
              <div className="flex flex-col items-center">
                <Skeleton className="w-12 h-12 rounded-full" />
                {i < 1 && <Skeleton className="w-0.5 h-32 mt-4" />}
              </div>
              <Card className="flex-1 border-2">
                <CardHeader>
                  <Skeleton className="h-6 w-2/3 mb-2" />
                  <Skeleton className="h-5 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6" />
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Experience</h2>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          Error loading experience: {error.message}
        </div>
      </section>
    )
  }

  if (!experiences || experiences.length === 0) {
    return (
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Experience</h2>
        <p className="text-gray-500 italic">No experience yet.</p>
      </section>
    )
  }

  return (
    <section className="mb-12">
      {/* Section Header - Slide + Fade animations */}
      <Slide triggerOnce direction="up" duration={700}>
        <div>
          <h2 className="text-4xl font-bold mb-3 tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Professional Experience
          </h2>
          <Fade triggerOnce duration={700} delay={100}>
            <div className="h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full w-20 mb-4" />
          </Fade>
          <Fade triggerOnce duration={700} delay={200}>
            <p className="mt-4 text-lg text-gray-600">
              Career journey and professional accomplishments
            </p>
          </Fade>
        </div>
      </Slide>

      {/* Timeline */}
      <div className="space-y-8 mt-8">
        {experiences.map((exp, index) => (
          <Slide
            key={exp.id}
            triggerOnce
            direction="up"
            duration={700}
            delay={300 + index * 150}
          >
            <div className="flex gap-6 group">
              {/* Timeline Connector */}
              <div className="flex flex-col items-center flex-shrink-0">
                {/* Timeline Icon */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-300/50 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-purple-400/60 transition-all duration-300">
                  <Briefcase className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                </div>

                {/* Timeline Line */}
                {index < experiences.length - 1 && (
                  <div className="w-0.5 h-full min-h-[4rem] bg-gradient-to-b from-purple-300 to-transparent mt-4" />
                )}
              </div>

              {/* Experience Card */}
              <Card className="flex-1 border-2 border-purple-200 hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-300/50 transition-all duration-300 motion-safe:hover:-translate-y-2 bg-white">
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                        {exp.role}
                      </h3>
                      <p className="text-base font-medium text-gray-700 mb-2">{exp.company}</p>
                      <Badge className="bg-purple-100 text-purple-700 border-purple-200 border hover:bg-purple-50 transition-colors">
                        {formatDateRange(exp.start_date, exp.end_date)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                {Array.isArray(exp.bullets) && exp.bullets.length > 0 && (
                  <CardContent className="pt-0">
                    <ul className="space-y-3">
                      {exp.bullets.map((bullet, bulletIndex) => (
                        <li key={bulletIndex} className="text-gray-700 flex items-start gap-3 group/item">
                          <CheckCircle2 className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform" />
                          <span className="leading-relaxed">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                )}
              </Card>
            </div>
          </Slide>
        ))}
      </div>
    </section>
  )
}
