'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { Project } from '@/types/database'

interface ProjectsSectionProps {
  heading?: string
  description?: string
  projects: Project[]
}

export default function ProjectsSection({ heading, description, projects }: ProjectsSectionProps) {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  return (
    <section ref={containerRef} className="relative py-32 bg-white dark:bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
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
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold flex items-center gap-2"
              >
                View All
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </div>
          <div className="h-px bg-gradient-to-r from-gray-300 via-gray-200 to-transparent dark:from-gray-700 dark:via-gray-800 dark:to-transparent" />
        </motion.div>

        {/* Projects - Staggered Cards Layout */}
        <div className="space-y-32">
          {projects.slice(0, 3).map((project, index) => {
            const isEven = index % 2 === 0

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`grid lg:grid-cols-2 gap-12 items-center ${isEven ? '' : 'lg:grid-flow-dense'}`}
              >
                {/* Website Preview */}
                <Link 
                  href={`/projects/${project.slug}`}
                  className={`group relative ${isEven ? '' : 'lg:col-start-2'}`}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800"
                  >
                    {project.website_url ? (
                      <>
                        <iframe
                          src={project.website_url}
                          className="w-full h-full pointer-events-none"
                          title={project.title}
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500 to-blue-500">
                        <span className="text-6xl">🚀</span>
                      </div>
                    )}
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="px-6 py-3 bg-white dark:bg-black text-black dark:text-white rounded-full font-bold flex items-center gap-2">
                        View Project
                        <ExternalLink className="w-4 h-4" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Floating Number */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="absolute -top-8 -left-8 w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white font-black text-3xl shadow-2xl"
                  >
                    {index + 1}
                  </motion.div>
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
              </motion.div>
            )
          })}
        </div>

        {/* View All Mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center lg:hidden"
        >
          <Link href="/projects">
            <button className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold flex items-center gap-2 mx-auto">
              View All Projects
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
