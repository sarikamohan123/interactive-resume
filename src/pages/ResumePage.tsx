import { HeaderSection } from '@/components/resume/HeaderSection'
import { SkillsSection } from '@/components/resume/SkillsSection'
import { ExperienceSection } from '@/components/resume/ExperienceSection'
import { EducationSection } from '@/components/resume/EducationSection'

export function ResumePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <HeaderSection />
        <SkillsSection />
        <ExperienceSection />
        <EducationSection />
      </div>
    </div>
  )
}