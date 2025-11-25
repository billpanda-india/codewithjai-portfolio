import Link from 'next/link'
import { ArrowRight, Sparkles, TrendingUp, Users, Award, ChevronDown } from 'lucide-react'

interface HeroSectionProps {
  title?: string
  titleHighlight?: string
  subtitle?: string
  ctaLabel?: string
  ctaUrl?: string
  backgroundImage?: string
}

export default function HeroSection({ title, titleHighlight, subtitle, ctaLabel, ctaUrl }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen bg-white dark:bg-black overflow-hidden flex items-center">
      {/* Animated Grid Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-black via-transparent to-transparent" />
      </div>

      {/* Floating Orbs - Pure CSS */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 dark:bg-emerald-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 dark:bg-blue-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center space-y-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500/10 dark:bg-emerald-500/10 border border-emerald-500/30 dark:border-emerald-500/20 rounded-full backdrop-blur-sm animate-fade-in">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Available for Freelance</span>
          </div>

          {/* Main Heading */}
          <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-none">
              <span className="block text-black dark:text-white mb-4">
                {title || "Building Digital"}
              </span>
              <span className="block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 dark:from-emerald-400 dark:via-blue-400 dark:to-purple-400 animate-gradient">
                  {titleHighlight || "Excellence"}
                </span>
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              {subtitle || "Senior Full-Stack Developer crafting exceptional digital experiences with cutting-edge technologies"}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            {ctaLabel && ctaUrl && (
              <Link href={ctaUrl}>
                <button className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-full font-bold text-lg shadow-2xl shadow-emerald-500/30 dark:shadow-emerald-500/50 flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform">
                  {ctaLabel}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            )}
            <Link href="/contact">
              <button className="px-8 py-4 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-black dark:text-white rounded-full font-bold text-lg backdrop-blur-sm border border-gray-300 dark:border-white/10 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all">
                Let's Connect
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto pt-16 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            {[
              { icon: TrendingUp, value: '50+', label: 'Projects Delivered' },
              { icon: Users, value: '30+', label: 'Happy Clients' },
              { icon: Award, value: '5.0', label: 'Average Rating' },
            ].map((stat, i) => (
              <div key={i} className="relative group hover:scale-105 hover:-translate-y-1 transition-transform">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                <div className="relative p-6 bg-white dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-2xl">
                  <stat.icon className="w-8 h-8 text-emerald-500 dark:text-emerald-400 mx-auto mb-3" />
                  <div className="text-4xl font-black text-black dark:text-white mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-fade-in" style={{ animationDelay: '1s' }}>
            <div className="flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500 animate-bounce">
              <span className="text-sm font-medium">Scroll to explore</span>
              <ChevronDown className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
