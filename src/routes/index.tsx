import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowRight,
  Code2,
  Briefcase,
  GraduationCap,
  Award,
  TrendingUp,
  Sparkles,
  Mail,
  MapPin,
  Phone,
  Github,
  Linkedin
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export const Route = createFileRoute('/')({
  component: IndexComponent,
})

function IndexComponent() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Professional blue to purple gradient */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px] -z-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent -z-20" />

        <div className="relative max-w-5xl mx-auto z-10">
          {/* Status badge */}
          <div className="flex justify-center mb-8 motion-safe:animate-fade-in">
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-4 py-2 text-sm font-medium hover:bg-white/30 transition-all">
              <Sparkles className="w-4 h-4 mr-2 inline" />
              Available for Opportunities
            </Badge>
          </div>

          <div className="text-center text-white motion-safe:animate-fade-in-up">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
              Sarika Srivastava
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl mb-6 font-light text-white/90 leading-relaxed max-w-5xl mx-auto px-4">
              Full-Stack Engineer | Power BI Developer | AWS Solutions Architect Associate
            </p>

            {/* Quick Contact Info */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-10 text-white/80 text-sm sm:text-base">
              <span className="flex items-center gap-2 hover:text-white transition-colors">
                <MapPin className="w-4 h-4" />
                Cincinnati Metro Area
              </span>
              <a
                href="mailto:sarikasrivastava2005@gmail.com"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
                sarikasrivastava2005@gmail.com
              </a>
              <a
                href="tel:+18592069173"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4" />
                (859) 206-9173
              </a>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                to="/resume"
                className="group inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-2xl hover:shadow-white/20 font-semibold text-lg motion-safe:transform motion-safe:hover:scale-105"
              >
                View Resume
                <ArrowRight className="w-5 h-5 motion-safe:group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#about"
                className="inline-flex items-center gap-2 bg-white/10 text-white px-8 py-4 rounded-xl hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/30 font-semibold text-lg motion-safe:transform motion-safe:hover:scale-105"
              >
                Learn More
              </a>
            </div>

            {/* Social Links */}
            <div className="flex justify-center gap-4">
              <a
                href="https://github.com/sarikamohan123"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/30 font-medium motion-safe:transform motion-safe:hover:scale-105"
              >
                <Github className="w-5 h-5" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/sarika-srivastava-38a82b2b0/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/30 font-medium motion-safe:transform motion-safe:hover:scale-105"
              >
                <Linkedin className="w-5 h-5" />
                <span className="hidden sm:inline">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>

        {/* Decorative gradient orbs - blue and purple only */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 motion-safe:animate-blob -z-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 motion-safe:animate-blob motion-safe:animation-delay-2000 -z-10" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 motion-safe:animate-blob motion-safe:animation-delay-4000 -z-10" />
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              About Me
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Passionate full-stack engineer with expertise in building scalable applications,
              creating insightful data visualizations, and architecting cloud solutions.
              I transform complex business requirements into elegant technical solutions.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Card className="text-center border-2 hover:border-blue-500 hover:shadow-lg transition-all duration-300 motion-safe:transform motion-safe:hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">2+</div>
                <div className="text-sm text-gray-600 font-medium">Years Experience</div>
              </CardContent>
            </Card>
            <Card className="text-center border-2 hover:border-purple-500 hover:shadow-lg transition-all duration-300 motion-safe:transform motion-safe:hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-purple-600 mb-2">31+</div>
                <div className="text-sm text-gray-600 font-medium">Technical Skills</div>
              </CardContent>
            </Card>
            <Card className="text-center border-2 hover:border-green-500 hover:shadow-lg transition-all duration-300 motion-safe:transform motion-safe:hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-green-600 mb-2">3</div>
                <div className="text-sm text-gray-600 font-medium">Certifications</div>
              </CardContent>
            </Card>
            <Card className="text-center border-2 hover:border-indigo-500 hover:shadow-lg transition-all duration-300 motion-safe:transform motion-safe:hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-indigo-600 mb-2">10+</div>
                <div className="text-sm text-gray-600 font-medium">Technologies</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What I Do Section - Feature Cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              What I Do
            </h2>
            <p className="text-xl text-gray-600">
              Explore my expertise across different domains
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Technical Skills Card */}
            <Link to="/resume" hash="skills">
              <Card className="h-full group cursor-pointer border-2 hover:border-blue-500 transition-all duration-300 hover:shadow-2xl motion-safe:transform motion-safe:hover:-translate-y-2 bg-white">
                <CardHeader>
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 motion-safe:group-hover:scale-110 transition-transform shadow-lg">
                    <Code2 className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Technical Skills</CardTitle>
                  <CardDescription className="text-base">
                    Comprehensive overview of programming languages, frameworks, and tools
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">JavaScript</Badge>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">TypeScript</Badge>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">React</Badge>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">+28 more</Badge>
                  </div>
                  <div className="mt-6 flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all">
                    View All Skills
                    <ArrowRight className="w-4 h-4 ml-1 motion-safe:group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Experience Card */}
            <Link to="/resume" hash="experience">
              <Card className="h-full group cursor-pointer border-2 hover:border-purple-500 transition-all duration-300 hover:shadow-2xl motion-safe:transform motion-safe:hover:-translate-y-2 bg-white">
                <CardHeader>
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 motion-safe:group-hover:scale-110 transition-transform shadow-lg">
                    <Briefcase className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Experience</CardTitle>
                  <CardDescription className="text-base">
                    Professional work history with detailed project descriptions and achievements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                      <p className="text-sm text-gray-600">Associate Software Engineer</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Award className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                      <p className="text-sm text-gray-600">Red Hawk Technologies</p>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center text-purple-600 font-semibold group-hover:gap-2 transition-all">
                    View Experience
                    <ArrowRight className="w-4 h-4 ml-1 motion-safe:group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Education Card */}
            <Link to="/resume" hash="education">
              <Card className="h-full group cursor-pointer border-2 hover:border-green-500 transition-all duration-300 hover:shadow-2xl motion-safe:transform motion-safe:hover:-translate-y-2 bg-white">
                <CardHeader>
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 motion-safe:group-hover:scale-110 transition-transform shadow-lg">
                    <GraduationCap className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Education</CardTitle>
                  <CardDescription className="text-base">
                    Academic background and professional certifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-2">
                      <Award className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                      <p className="text-sm text-gray-600">Full-Stack Boot Camp</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Award className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                      <p className="text-sm text-gray-600">AWS Certifications</p>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center text-green-600 font-semibold group-hover:gap-2 transition-all">
                    View Education
                    <ArrowRight className="w-4 h-4 ml-1 motion-safe:group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Tech Stack Section - Enhanced */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Built with Modern Technologies
            </h3>
            <p className="text-gray-600">
              This portfolio showcases the latest web development stack
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {[
              { name: 'React 19', color: 'from-cyan-500 to-blue-500', url: 'https://react.dev' },
              { name: 'TypeScript', color: 'from-blue-600 to-blue-700', url: 'https://www.typescriptlang.org' },
              { name: 'TanStack Router', color: 'from-red-500 to-orange-500', url: 'https://tanstack.com/router/latest' },
              { name: 'TanStack Query', color: 'from-orange-500 to-amber-500', url: 'https://tanstack.com/query/latest' },
              { name: 'Tailwind CSS', color: 'from-teal-500 to-cyan-500', url: 'https://tailwindcss.com' },
              { name: 'Supabase', color: 'from-green-500 to-emerald-600', url: 'https://supabase.com' },
              { name: 'shadcn/ui', color: 'from-gray-700 to-gray-900', url: 'https://ui.shadcn.com' },
            ].map((tech) => (
              <a
                key={tech.name}
                href={tech.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group px-5 py-3 bg-gradient-to-r ${tech.color} rounded-full text-white font-medium shadow-lg hover:shadow-xl motion-safe:transform motion-safe:hover:scale-110 transition-all duration-300 cursor-pointer`}
              >
                {tech.name}
              </a>
            ))}
          </div>

          <Separator className="my-12" />

          {/* CTA Footer */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to see my work?
            </h3>
            <Link
              to="/resume"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-lg motion-safe:transform motion-safe:hover:scale-105"
            >
              Explore My Resume
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
