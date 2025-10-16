import { useEducation } from '@/hooks/useEducation'
import { formatDateRange } from '@/utils/dateHelpers'
import { Skeleton } from '@/components/ui/skeleton'

export function EducationSection() {
  const { data: education, isLoading, error } = useEducation()

  if (isLoading) {
    return (
      <section className="mb-8 space-y-4 md:space-y-6">
        <Skeleton className="h-8 w-36" />
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="space-y-3 p-6 border border-gray-200 rounded-lg">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-5 w-1/2" />
                </div>
                <Skeleton className="h-4 w-32 mt-2 sm:mt-0" />
              </div>
              <div className="space-y-2 mt-4">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Education</h2>
        <div className="text-red-600">Error loading education: {error.message}</div>
      </section>
    )
  }

  if (!education || education.length === 0) {
    return (
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Education</h2>
        <p className="text-gray-500 italic">No education yet.</p>
      </section>
    )
  }

  return (
    <section className="mb-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">Education</h2>
      <div className="space-y-4">
        {education.map((edu) => (
          <div key={edu.id} className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                <p className="text-gray-700">{edu.school}</p>
              </div>
              <span className="text-sm text-gray-500 mt-1 sm:mt-0">
                {formatDateRange(edu.start_date, edu.end_date)}
              </span>
            </div>
            {edu.details && typeof edu.details === 'object' && (
              <div className="mt-4 text-gray-700">
                {Object.entries(edu.details).map(([key, value]) => (
                  <p key={key} className="text-sm">
                    <span className="font-medium">{key}:</span> {String(value)}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}