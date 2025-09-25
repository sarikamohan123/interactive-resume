import { useExperiences } from '@/hooks/useExperiences'
import { formatDateRange } from '@/utils/dateHelpers'

export function ExperienceSection() {
  const { data: experiences, isLoading, error } = useExperiences()

  if (isLoading) {
    return (
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Experience</h2>
        <div aria-live="polite" className="text-gray-600">Loading experience...</div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Experience</h2>
        <div className="text-red-600">Error loading experience: {error.message}</div>
      </section>
    )
  }

  if (!experiences || experiences.length === 0) {
    return (
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Experience</h2>
        <p className="text-gray-500 italic">No experience yet.</p>
      </section>
    )
  }

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Experience</h2>
      <div className="space-y-6">
        {experiences.map((exp) => (
          <div key={exp.id} className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{exp.role}</h3>
                <p className="text-gray-700">{exp.company}</p>
              </div>
              <span className="text-sm text-gray-500 mt-1 sm:mt-0">
                {formatDateRange(exp.start_date, exp.end_date)}
              </span>
            </div>
            {Array.isArray(exp.bullets) && exp.bullets.length > 0 && (
              <ul className="mt-4 space-y-2">
                {exp.bullets.map((bullet, index) => (
                  <li key={index} className="text-gray-700 flex items-start">
                    <span className="text-gray-400 mr-3">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}