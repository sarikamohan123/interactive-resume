import { useCertifications } from '@/hooks/useCertifications'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Award, CheckCircle2, ExternalLink } from 'lucide-react'
import { Fade, Slide } from 'react-awesome-reveal'

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
}

export function CertificationsSection() {
  const { data: certifications, isLoading, error } = useCertifications()

  if (isLoading) {
    return (
      <section className="mb-12">
        <div className="mb-8">
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="space-y-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-6">
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
          ))}
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Professional Certifications</h2>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          Error loading certifications: {error.message}
        </div>
      </section>
    )
  }

  if (!certifications || certifications.length === 0) {
    return (
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Professional Certifications</h2>
        <p className="text-gray-500 italic">No certifications yet.</p>
      </section>
    )
  }

  return (
    <section className="mb-12">
      {/* Section Header - Slide + Fade animations */}
      <Slide triggerOnce direction="up" duration={700}>
        <div>
          <h2 className="text-4xl font-bold mb-3 tracking-tight text-gradient">
            Professional Certifications
          </h2>
          <Fade triggerOnce duration={700} delay={100}>
            <div className="h-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full w-20 mb-4" />
          </Fade>
          <Fade triggerOnce duration={700} delay={200}>
            <p className="mt-4 text-lg text-gray-600">
              Industry-recognized credentials validating expertise and commitment to professional development
            </p>
          </Fade>
        </div>
      </Slide>

      {/* Certifications Timeline */}
      <div className="space-y-6 sm:space-y-8 mt-8">
        {certifications.map((cert, index) => {
          const isLastItem = index === certifications.length - 1

          return (
            <Slide
              key={cert.id}
              triggerOnce
              direction="up"
              duration={700}
              delay={300 + index * 150}
            >
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 group">
                {/* Timeline Connector */}
                <div className="flex sm:flex-col items-center sm:items-center flex-shrink-0">
                  {/* Timeline Icon - Amber/Gold for certifications */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-200/50 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-amber-300/60 transition-all duration-300">
                    <Award className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                  </div>

                  {/* Timeline Line - Hidden on mobile, visible on sm+ */}
                  {!isLastItem && (
                    <div className="hidden sm:block w-0.5 h-full min-h-[4rem] bg-gradient-to-b from-purple-300 to-transparent mt-4" />
                  )}
                </div>

                {/* Certification Card */}
                <Card className="flex-1 border-2 border-purple-200 hover:border-indigo-400 hover:shadow-2xl hover:shadow-purple-200/50 transition-all duration-300 motion-safe:hover:-translate-y-2 active:scale-[0.98] bg-white">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                          {cert.name}
                        </h3>

                        {/* Organization Badge and Date */}
                        <div className="flex flex-wrap gap-2 mt-3">
                          <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-50 transition-colors border text-xs font-semibold">
                            {cert.issuing_organization}
                          </Badge>
                          <Badge variant="outline" className="text-xs font-medium border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                            {formatDate(cert.issued_at)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Credential ID and URL */}
                  {(cert.credential_id || cert.credential_url) && (
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {cert.credential_id && (
                          <div className="flex items-start gap-3 group/item">
                            <CheckCircle2 className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform" />
                            <div className="flex-1">
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Credential ID</p>
                              <p className="text-sm text-gray-700 font-mono mt-1">{cert.credential_id}</p>
                            </div>
                          </div>
                        )}

                        {cert.credential_url && (
                          <div className="flex items-start gap-3 group/item">
                            <ExternalLink className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform" />
                            <div className="flex-1">
                              <a
                                href={cert.credential_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-purple-600 hover:text-purple-700 hover:underline transition-colors font-medium"
                              >
                                View Credential
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              </div>
            </Slide>
          )
        })}
      </div>
    </section>
  )
}
