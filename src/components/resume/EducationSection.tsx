import { useEducation } from '@/hooks/useEducation'
import { formatDateRange } from '@/utils/dateHelpers'

export function EducationSection() {
  const { data: education, isLoading, error } = useEducation()

  if (isLoading) {
    return (
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Education</h2>
        <div aria-live="polite" className="text-gray-600">Loading education...</div>
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
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Education</h2>
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