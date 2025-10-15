import { HeaderSection } from '@/components/resume/HeaderSection'
import { SkillsSection } from '@/components/resume/SkillsSection'
import { ExperienceSection } from '@/components/resume/ExperienceSection'
import { EducationSection } from '@/components/resume/EducationSection'

export function ResumePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <HeaderSection />
        <div className="divide-y divide-gray-200 space-y-8 md:space-y-12">
          <div className="pt-8">
            <SkillsSection />
          </div>
          <div className="pt-8">
            <ExperienceSection />
          </div>
          <div className="pt-8">
            <EducationSection />
          </div>
        </div>
      </div>
    </div>
  )
}