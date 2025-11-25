import Link from 'next/link'
import { ArrowRight, Mail, Calendar } from 'lucide-react'

interface CTASectionProps {
  badgeText?: string
  title?: string
  titleHighlight?: string
  description?: string
  primaryButtonText?: string
  primaryButtonUrl?: string
  secondaryButtonText?: string
  secondaryButtonUrl?: string
  stat1Number?: string
  stat1Label?: string
  stat2Number?: string
  stat2Label?: string
  stat3Number?: string
  stat3Label?: string
}

export default function CTASection({
  badgeText = 'Available for new projects',
  title = "Let's Build Something",
  titleHighlight = 'Amazing Together',
  description = "Have a project in mind? Let's discuss how I can help bring your vision to life with cutting-edge technology and exceptional design.",
  primaryButtonText = 'Get In Touch',
  primaryButtonUrl = '/contact',
  secondaryButtonText = 'View My Work',
  secondaryButtonUrl = '/projects',
  stat1Number = '50+',
  stat1Label = 'Projects Completed',
  stat2Number = '30+',
  stat2Label = 'Happy Clients',
  stat3Number = '5.0',
  stat3Label = 'Average Rating',
}: CTASectionProps) {
  return (
    <section className="relative py-32 bg-gray-50 dark:bg-black overflow-hidden">
      {/* Animated Grid Background - Same as Hero */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 dark:from-black via-transparent to-gray-50 dark:to-black" />
      </div>

      {/* Floating Orbs - Same as Hero */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 dark:bg-emerald-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 dark:bg-blue-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8 animate-fade-in-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-100 dark:bg-emerald-500/10 backdrop-blur-sm border border-emerald-200 dark:border-emerald-500/30 rounded-full text-emerald-700 dark:text-emerald-400 font-medium shadow-lg dark:shadow-emerald-500/20">
            <Calendar className="w-4 h-4" />
            <span>{badgeText}</span>
          </div>

          {/* Heading */}
          <h2 className="text-5xl md:text-7xl font-black text-black dark:text-white leading-tight">
            {title}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600 dark:from-emerald-400 dark:via-blue-400 dark:to-purple-400 animate-gradient">
              {titleHighlight}
            </span>
          </h2>

          {/* Description */}
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {description}
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link href={primaryButtonUrl}>
              <button className="group px-8 py-4 bg-black dark:bg-gradient-to-r dark:from-emerald-500 dark:to-blue-500 text-white rounded-full font-bold text-lg shadow-2xl dark:shadow-emerald-500/50 flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform duration-200">
                <Mail className="w-5 h-5" />
                {primaryButtonText}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href={secondaryButtonUrl}>
              <button className="px-8 py-4 bg-white dark:bg-white/5 text-black dark:text-white rounded-full font-bold text-lg border-2 border-gray-300 dark:border-white/20 hover:border-black dark:hover:border-white/40 dark:backdrop-blur-sm flex items-center gap-2 transition-all hover:scale-105 active:scale-95 duration-200">
                {secondaryButtonText}
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-16">
            <div className="relative group p-6 bg-white dark:bg-gray-900/50 dark:backdrop-blur-sm rounded-2xl border-2 border-gray-200 dark:border-gray-800 dark:hover:border-emerald-500/50 transition-all hover:-translate-y-1 duration-300">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl blur opacity-0 dark:group-hover:opacity-30 transition-opacity -z-10" />
              <div className="text-4xl font-black text-black dark:text-white mb-2">{stat1Number}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{stat1Label}</div>
            </div>
            <div className="relative group p-6 bg-white dark:bg-gray-900/50 dark:backdrop-blur-sm rounded-2xl border-2 border-gray-200 dark:border-gray-800 dark:hover:border-blue-500/50 transition-all hover:-translate-y-1 duration-300">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-0 dark:group-hover:opacity-30 transition-opacity -z-10" />
              <div className="text-4xl font-black text-black dark:text-white mb-2">{stat2Number}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{stat2Label}</div>
            </div>
            <div className="relative group p-6 bg-white dark:bg-gray-900/50 dark:backdrop-blur-sm rounded-2xl border-2 border-gray-200 dark:border-gray-800 dark:hover:border-purple-500/50 transition-all hover:-translate-y-1 duration-300">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-0 dark:group-hover:opacity-30 transition-opacity -z-10" />
              <div className="text-4xl font-black text-black dark:text-white mb-2">{stat3Number}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{stat3Label}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
