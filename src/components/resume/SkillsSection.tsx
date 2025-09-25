import { useSkills } from '@/hooks/useSkills'

export function SkillsSection() {
  const { data: skills, isLoading, error } = useSkills()

  if (isLoading) {
    return (
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Skills</h2>
        <div aria-live="polite" className="text-gray-600">Loading skills...</div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Skills</h2>
        <div className="text-red-600">Error loading skills: {error.message}</div>
      </section>
    )
  }

  if (!skills || skills.length === 0) {
    return (
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Skills</h2>
        <p className="text-gray-500 italic">No skills yet.</p>
      </section>
    )
  }

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Skills</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <div key={skill.id} className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-1">{skill.name}</h3>
            {skill.level && (
              <p className="text-sm text-gray-600 mb-2">Level: {skill.level}</p>
            )}
            {skill.years && (
              <p className="text-sm text-gray-600 mb-2">{skill.years} years</p>
            )}
            {skill.description && (
              <p className="text-sm text-gray-700">{skill.description}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}