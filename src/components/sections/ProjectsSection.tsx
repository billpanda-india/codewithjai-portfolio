
'use client'

import Link from 'next/link'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { Project } from '@/types/database'

interface ProjectsSectionProps {
  heading?: string
  description?: string
  projects: Project[]
}

export default function ProjectsSection({ heading, description, projects }: ProjectsSectionProps) {
  return (
    <section className="relative py-32 bg-white dark:bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-20 animate-fade-in-up">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-5xl md:text-7xl font-black text-black dark:text-white mb-4">
                {heading || "Featured Work"}
              </h2>
              {description && (
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl">
                  {description}
                </p>
              )}
            </div>
            <Link href="/projects" className="hidden lg:block">
              <button className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform duration-200">
                View All
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
          <div className="h-px bg-gradient-to-r from-gray-300 via-gray-200 to-transparent dark:from-gray-700 dark:via-gray-800 dark:to-transparent" />
        </div>

        {/* Projects - Staggered Cards Layout */}
        <div className="space-y-32">
          {projects.slice(0, 3).map((project, index) => {
            const isEven = index % 2 === 0

            return (
              <div
                key={project.id}
                className={`grid lg:grid-cols-2 gap-12 items-center ${isEven ? '' : 'lg:grid-flow-dense'} animate-fade-in-up opacity-0`}
                style={{ animationDelay: `${index * 200}ms`, animationFillMode: 'forwards' }}
              >
                {/* Website Preview */}
                <Link 
                  href={`/projects/${project.slug}`}
                  className={`group relative ${isEven ? '' : 'lg:col-start-2'}`}
                >
                  <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-white dark:bg-gray-950 border-2 border-gray-200 dark:border-gray-800 hover:scale-[1.02] transition-transform duration-300 shadow-2xl">
                    {project.website_url ? (
                      <>
                        {/* Live Website Preview */}
                        <iframe
                          src={project.website_url}
                          className="w-full h-full border-0"
                          title={`Live preview of ${project.title}`}
                          loading="lazy"
                          style={{
                            width: '100%',
                            height: '100%',
                            border: 'none',
                            pointerEvents: 'none'
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600">
                        <span className="text-8xl">🚀</span>
                      </div>
                    )}
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                      <div className="px-6 py-3 bg-white dark:bg-black text-black dark:text-white rounded-full font-bold flex items-center gap-2 shadow-xl transform group-hover:scale-110 transition-transform duration-300">
                        View Project
                        <ExternalLink className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Floating Number */}
                  <div 
                    className="absolute -top-8 -left-8 w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white font-black text-3xl shadow-2xl animate-scale-in opacity-0"
                    style={{ animationDelay: `${index * 200 + 500}ms`, animationFillMode: 'forwards' }}
                  >
                    {index + 1}
                  </div>
                </Link>

                {/* Content */}
                <div className={`space-y-6 ${isEven ? '' : 'lg:col-start-1 lg:row-start-1'}`}>
                  {/* Category */}
                  {project.category && (
                    <div className="inline-block px-4 py-2 bg-gray-100 dark:bg-gray-900 rounded-full text-sm font-bold text-gray-700 dark:text-gray-300">
                      {project.category}
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-4xl md:text-5xl font-black text-black dark:text-white">
                    {project.title}
                  </h3>

                  {/* Description */}
                  {project.short_description && (
                    <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                      {project.short_description}
                    </p>
                  )}

                  {/* Tech Stack */}
                  {project.tech_stack && project.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {project.tech_stack.map((tech: any) => (
                        <span
                          key={tech.id}
                          className="px-4 py-2 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300"
                        >
                          {tech.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex gap-4 pt-4">
                    {project.website_url && (
                      <a
                        href={project.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold hover:scale-105 transition-transform"
                      >
                        Live Site
                      </a>
                    )}
                    <Link
                      href={`/projects/${project.slug}`}
                      className="px-6 py-3 border-2 border-black dark:border-white text-black dark:text-white rounded-full font-bold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                    >
                      Case Study
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* View All Mobile */}
        <div className="mt-20 text-center lg:hidden animate-fade-in-up">
          <Link href="/projects">
            <button className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold flex items-center gap-2 mx-auto">
              View All Projects
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
