import { HeaderSection } from '@/components/resume/HeaderSection'
import { SkillsSection } from '@/components/resume/SkillsSection'
import { ExperienceSection } from '@/components/resume/ExperienceSection'
import { EducationSection } from '@/components/resume/EducationSection'
import { BackToTop } from '@/components/BackToTop'
import { StickyResumeNav } from '@/components/StickyResumeNav'

export function ResumePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section - Full Width Gradient */}
      <HeaderSection />

      {/* Sticky Navigation - Appears after hero scroll */}
      <StickyResumeNav />

      {/* Content Sections - Clean Backgrounds with Smooth Gradients */}

      {/* Skills Section - White with Subtle Gradient */}
      <section className="bg-gradient-to-br from-white via-gray-50/30 to-white py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div id="skills" className="scroll-mt-24">
            <SkillsSection />
          </div>
        </div>
      </section>

      {/* Experience Section - Soft Blue-Purple Gradient */}
      <section className="bg-gradient-to-br from-blue-50/60 via-purple-50/40 to-blue-50/30 py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div id="experience" className="scroll-mt-24">
            <ExperienceSection />
          </div>
        </div>
      </section>

      {/* Education Section - Soft Green Gradient */}
      <section className="bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-teal-50/40 py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div id="education" className="scroll-mt-24">
            <EducationSection />
          </div>
        </div>
      </section>

      {/* Footer Spacing */}
      <div className="h-24 bg-gradient-to-b from-teal-50/20 to-white" />

      {/* Back to Top Button */}
      <BackToTop />
    </div>
  )
}