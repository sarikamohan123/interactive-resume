import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, Code2, Briefcase, GraduationCap } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: IndexComponent,
})

function IndexComponent() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            Sarika Srivastava
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Full-Stack Engineer | Power BI Developer | AWS Solutions Architect Associate
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/resume"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold text-lg"
            >
              View Resume
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Feature Highlights */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <Link
              to="/resume"
              hash="skills"
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Code2 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Technical Skills</h3>
              <p className="text-gray-600 text-sm">
                Comprehensive overview of programming languages, frameworks, and tools
              </p>
            </Link>

            <Link
              to="/resume"
              hash="experience"
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Experience</h3>
              <p className="text-gray-600 text-sm">
                Professional work history with detailed project descriptions
              </p>
            </Link>

            <Link
              to="/resume"
              hash="education"
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Education</h3>
              <p className="text-gray-600 text-sm">
                Academic background and professional certifications
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Tech Stack Badge */}
      <section className="py-12 px-4 bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-gray-500 mb-4">Built with modern technologies</p>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
              React 19
            </span>
            <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
              TypeScript
            </span>
            <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
              TanStack Router
            </span>
            <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
              Tailwind CSS
            </span>
            <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
              Supabase
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}
