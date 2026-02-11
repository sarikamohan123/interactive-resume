import { ShowcaseHero } from '@/components/showcase/ShowcaseHero'
import { ShowcaseGrid } from '@/components/showcase/ShowcaseGrid'
import { BackToTop } from '@/components/BackToTop'

export function ShowcasePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <ShowcaseHero />

      {/* Projects Grid Section */}
      <section className="bg-gradient-to-br from-gray-50/60 via-blue-50/40 to-purple-50/30 py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ShowcaseGrid />
        </div>
      </section>

      {/* Footer Spacing */}
      <div className="h-24 bg-gradient-to-b from-purple-50/20 to-white" />

      {/* Back to Top Button */}
      <BackToTop />
    </div>
  )
}
