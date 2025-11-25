'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import { Project } from '@/types/database'

interface ProjectCardProps {
  project: Project
  index?: number
}

export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  // Always show iframe preview on cards, images are only for detail page
  return (
    <Link href={`/projects/${project.slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "50px" }}
        transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
        className="group relative h-full bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border-2 border-gray-200 dark:border-gray-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-200 shadow-lg hover:shadow-2xl hover:-translate-y-2"
      >
        {/* Preview */}
        <div className="relative h-64 overflow-hidden bg-gray-100 dark:bg-gray-800">
          {project.website_url ? (
            <>
              <iframe
                src={project.website_url}
                className="w-full h-full scale-50 origin-top-left pointer-events-none"
                style={{ width: '200%', height: '200%' }}
                title={project.title}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center">
              <Sparkles className="w-16 h-16 text-white" />
            </div>
          )}

          {/* Category */}
          {project.category && (
            <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 dark:bg-black/90 backdrop-blur-sm text-black dark:text-white text-xs font-bold rounded-full capitalize">
              {project.category}
            </div>
          )}

          {/* Arrow */}
          <div className="absolute top-4 right-4 w-10 h-10 bg-white dark:bg-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight className="w-5 h-5 text-black dark:text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <h3 className="text-2xl font-black text-black dark:text-white group-hover:text-emerald-500 transition-colors">
            {project.title}
          </h3>

          {project.short_description && (
            <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
              {project.short_description}
            </p>
          )}

          {/* Tech Stack */}
          {project.tech_stack && project.tech_stack.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.tech_stack.slice(0, 3).map((tech) => (
                <span
                  key={tech.id}
                  className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full font-medium"
                >
                  {tech.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  )
}
