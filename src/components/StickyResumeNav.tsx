import { useEffect, useState } from 'react'
import { Code2, Award, Briefcase, GraduationCap, Download } from 'lucide-react'

export function StickyResumeNav() {
  const [activeSection, setActiveSection] = useState('skills')
  const [isFixed, setIsFixed] = useState(false)
  const [navOffsetTop, setNavOffsetTop] = useState(0)

  useEffect(() => {
    // Get the nav's offset position on mount
    const navElement = document.getElementById('resume-nav')
    if (navElement) {
      setNavOffsetTop(navElement.offsetTop)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      // Simple scroll position check - no layout-shifting bounding rect
      setIsFixed(window.scrollY > navOffsetTop)

      // Determine active section based on scroll position
      const sections = ['skills', 'certifications', 'experience', 'education']
      const sectionElements = sections.map(id => document.getElementById(id))

      const scrollPosition = window.scrollY + 200 // Offset for better UX

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const section = sectionElements[i]
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i])
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check initial state

    return () => window.removeEventListener('scroll', handleScroll)
  }, [navOffsetTop])

  const handleDownloadResume = () => {
    // TODO: Replace with actual resume PDF URL when available
    window.print()
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const navHeight = 60 // Height of the sticky nav
      const yOffset = -navHeight - 20 // Offset for sticky nav + extra spacing
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <>
      <nav
        id="resume-nav"
        className={`${
          isFixed
            ? 'fixed top-0 left-0 right-0 z-50 shadow-md'
            : 'relative z-40 shadow-sm'
        } bg-white/90 backdrop-blur-lg border-b border-gray-200/50 motion-safe:animate-fade-in`}
      >

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 py-3">
          {/* Section Navigation Pills - Horizontally scrollable on mobile */}
          <div className="relative flex-1 overflow-x-auto scrollbar-hide">
            {/* Fade indicators for mobile scroll */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white/90 to-transparent pointer-events-none z-10 md:hidden" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/90 to-transparent pointer-events-none z-10 md:hidden" />

            <div className="flex items-center gap-2 sm:gap-3 min-w-max md:justify-center">
              <button
                onClick={() => scrollToSection('skills')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                  activeSection === 'skills'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-200/50'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Code2 className="w-4 h-4" />
                <span>Skills</span>
              </button>

              <button
                onClick={() => scrollToSection('certifications')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                  activeSection === 'certifications'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-200/50'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Certifications</span>
              </button>

              <button
                onClick={() => scrollToSection('experience')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                  activeSection === 'experience'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-200/50'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Experience</span>
              </button>

              <button
                onClick={() => scrollToSection('education')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                  activeSection === 'education'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-200/50'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Education</span>
              </button>
            </div>
          </div>

          {/* Download Resume Button */}
          <button
            onClick={handleDownloadResume}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-5 py-2 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl motion-safe:transform motion-safe:hover:scale-105 font-semibold text-sm flex-shrink-0"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </div>
    </nav>

    {/* Placeholder to prevent layout shift when nav becomes fixed */}
    {isFixed && <div className="h-[60px]" />}
    </>
  )
}
