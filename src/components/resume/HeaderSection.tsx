import { Mail, Phone, MapPin, Github, Linkedin } from 'lucide-react'

export function HeaderSection() {
  return (
    <header className="relative -mx-4 sm:-mx-6 lg:-mx-8 mb-12 overflow-hidden">
      {/* Gradient Background Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Name and Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight">
            Sarika Srivastava
          </h1>
          <p className="text-xl sm:text-2xl text-white/90 mb-6 font-light">
            Full-Stack Engineer | Power BI Developer | AWS Solutions Architect Associate
          </p>

          {/* Contact Information with Icons */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-white/80 text-sm sm:text-base mb-8">
            <a
              href="mailto:sarikasrivastava2005@gmail.com"
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">sarikasrivastava2005@gmail.com</span>
              <span className="sm:hidden">Email</span>
            </a>
            <a
              href="tel:+18592069173"
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>(859) 206-9173</span>
            </a>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Cincinnati Metro Area</span>
            </span>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-3">
            <a
              href="https://github.com/sarikamohan123"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/30 font-medium text-sm motion-safe:transform motion-safe:hover:scale-105"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/sarika-srivastava-38a82b2b0/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/30 font-medium text-sm motion-safe:transform motion-safe:hover:scale-105"
            >
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>

        {/* Decorative gradient orbs */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 motion-safe:animate-blob -z-10" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 motion-safe:animate-blob motion-safe:animation-delay-2000 -z-10" />
      </div>
    </header>
  )
}