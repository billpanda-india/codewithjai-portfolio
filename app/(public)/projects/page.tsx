import { getAllProjects, getPageBySlug } from '@/lib/supabase/queries'
import ProjectsClient from '@/components/ProjectsClient'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { generatePageMetadata } from '@/lib/metadata'

export const revalidate = 0

export async function generateMetadata() {
  return generatePageMetadata('projects')
}

export default async function ProjectsPage() {
  const [projects, pageData] = await Promise.all([
    getAllProjects(),
    getPageBySlug('projects')
  ])

  return (
    <main className="min-h-screen bg-white dark:bg-black relative">
      {/* Animated Grid Background - Full Page */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-50" />
      </div>

      {/* Floating Orbs - Full Page */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-7xl font-black text-black dark:text-white mb-6">
                {pageData?.hero_title || 'All'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-500">{pageData?.hero_title_highlight || 'Projects'}</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                {pageData?.hero_subtitle || 'Explore my portfolio of web applications, mobile apps, and digital experiences'}
              </p>
            </div>
          </div>
        </section>

        {/* Projects Grid with Search */}
        <ProjectsClient projects={projects} />

        {/* CTA Section */}
        <section className="relative py-32 bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-gray-900 dark:to-black overflow-hidden">
        {/* Gradient Blend at Top and Bottom */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white dark:from-black to-transparent z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-black to-transparent z-10" />
        
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full mb-8 shadow-lg">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Let's Work Together</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-black dark:text-white mb-6">
            {pageData?.projects_cta_title || 'Ready to Start Your Project?'}
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
            {pageData?.projects_cta_subtitle || "Let's collaborate and bring your ideas to life"}
          </p>

          <Link href={pageData?.projects_cta_button_url || '/contact'}>
            <button className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-full font-bold text-lg shadow-2xl hover:shadow-emerald-500/50 transition-all hover:scale-105 flex items-center gap-2 mx-auto">
              {pageData?.projects_cta_button_text || 'Get In Touch'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
        </section>
      </div>
    </main>
  )
}
