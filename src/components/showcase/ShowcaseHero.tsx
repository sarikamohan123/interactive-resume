import { Fade, Slide } from 'react-awesome-reveal'
import { Rocket } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function ShowcaseHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-700 to-blue-700 py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px] -z-20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent -z-20" />

      <div className="relative max-w-5xl mx-auto z-10">
        <Slide triggerOnce direction="up" duration={700}>
          <div className="text-center text-white">
            {/* Status Badge */}
            <div className="flex justify-center mb-8 motion-safe:animate-fade-in">
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-4 py-2 text-sm font-medium hover:bg-white/30 transition-all">
                <Rocket className="w-4 h-4 mr-2 inline" />
                Featured Work
              </Badge>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight leading-tight motion-safe:animate-fade-in-up">
              Project Showcase
            </h1>

            <Fade triggerOnce duration={700} delay={200}>
              <p className="text-xl sm:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto px-4">
                A collection of projects demonstrating full-stack development, data visualization,
                and cloud architecture
              </p>
            </Fade>
          </div>
        </Slide>
      </div>

      {/* Decorative gradient orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 motion-safe:animate-blob -z-10" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 motion-safe:animate-blob motion-safe:animation-delay-2000 -z-10" />
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 motion-safe:animate-blob motion-safe:animation-delay-4000 -z-10" />
    </section>
  )
}
