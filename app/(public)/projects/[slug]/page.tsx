import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProjectBySlug, getAllProjectSlugs, getTestimonialsByProject } from '@/lib/supabase/queries'
import ProjectDetailClient from '@/components/ProjectDetailClient'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const revalidate = 0

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug)
  
  if (!project) {
    return {
      title: 'Project Not Found - CodeWithJai',
      description: 'The requested project could not be found.',
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://codewithjai.in'

  return {
    title: project.seo_title || `${project.title} - Project Case Study | CodeWithJai`,
    description: project.seo_description || project.short_description || '',
    keywords: project.meta_keywords?.split(',').map((k: string) => k.trim()) || [],
    authors: project.meta_author ? [{ name: project.meta_author }] : [{ name: 'Jai - CodeWithJai' }],
    robots: project.meta_robots || 'index, follow',
    alternates: {
      canonical: project.canonical_url || `${siteUrl}/projects/${project.slug}`,
    },
    openGraph: {
      title: project.og_title || project.seo_title || project.title,
      description: project.og_description || project.seo_description || project.short_description || '',
      url: project.og_url || `${siteUrl}/projects/${project.slug}`,
      siteName: project.og_site_name || 'CodeWithJai',
      images: project.og_image ? [{ url: project.og_image }] : [],
      type: (project.og_type as any) || 'article',
    },
    twitter: {
      card: (project.twitter_card as any) || 'summary_large_image',
      title: project.twitter_title || project.seo_title || project.title,
      description: project.twitter_description || project.seo_description || project.short_description || '',
      images: project.twitter_image ? [project.twitter_image] : [],
      site: project.twitter_site || '@codewithjai',
      creator: project.twitter_creator || '@codewithjai',
    },
  }
}

export async function generateStaticParams() {
  const projects = await getAllProjectSlugs()
  return projects.map((project: any) => ({
    slug: project.slug,
  }))
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug)

  if (!project) {
    notFound()
  }

  const testimonials = await getTestimonialsByProject(project.id)

  return (
    <main className="min-h-screen bg-white dark:bg-black relative">
      {/* Animated Grid Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-50" />
      </div>

      {/* Content */}
      <div className="relative z-10 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors mb-8 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Projects
          </Link>

          {/* Project Detail Client Component */}
          <ProjectDetailClient project={project} testimonials={testimonials} />
        </div>
      </div>
    </main>
  )
}
