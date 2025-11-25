'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, ExternalLink, Sparkles } from 'lucide-react'
import { Project } from '@/types/database'

// Removed heavy animations for better performance

interface ProjectsClientProps {
  projects: Project[]
}

export default function ProjectsClient({ projects }: ProjectsClientProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProjects = projects.filter((project) => {
    const query = searchQuery.toLowerCase()
    return (
      project.title.toLowerCase().includes(query) ||
      project.short_description?.toLowerCase().includes(query) ||
      project.category?.toLowerCase().includes(query) ||
      project.tech_stack?.some((tech) => tech.name.toLowerCase().includes(query))
    )
  })

  return (
    <div className="pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="mb-12 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects by name, tech stack, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-2xl text-black dark:text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 transition-colors"
            />
          </div>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 text-center">
            {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'} found
          </p>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map((project) => (
              <ProjectPreviewCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500 dark:text-gray-400">
              {searchQuery ? 'No projects match your search.' : 'No projects found.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

interface ProjectPreviewCardProps {
  project: Project
}

function ProjectPreviewCard({ project }: ProjectPreviewCardProps) {
  // Always show iframe preview on cards, images are only for detail page
  return (
    <div className="group relative w-full h-[300px] rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-200 shadow-lg hover:shadow-2xl hover:scale-[1.02]"
    >
      {/* Preview Image */}
      <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800">
        {project.website_url ? (
          <iframe
            src={project.website_url}
            className="w-full h-full scale-50 origin-top-left pointer-events-none"
            style={{ width: '200%', height: '200%' }}
            title={project.title}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Category Badge */}
      {project.category && (
        <div className="absolute top-2 left-2 px-2 py-1 bg-white/90 dark:bg-black/90 backdrop-blur-sm text-black dark:text-white text-[10px] font-bold rounded-full capitalize z-10">
          {project.category}
        </div>
      )}

      {/* Title - Always Visible */}
      <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
        <h3 className="text-sm font-bold text-white line-clamp-2 mb-1">
          {project.title}
        </h3>
      </div>

      {/* Hover Overlay - Optimized */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 overflow-hidden">
        {/* Single layer glass effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/80 to-black/40 backdrop-blur-sm" />
        
        {/* Content with staggered slide-up animation */}
        <div className="absolute inset-0 p-4 flex flex-col justify-end">
          {/* Title - slides up first */}
          <h3 className="text-base font-bold text-white drop-shadow-2xl mb-2 translate-y-8 group-hover:translate-y-0 transition-all duration-300 ease-out">
            {project.title}
          </h3>

          {/* Description - slides up second */}
          {project.short_description && (
            <p className="text-xs text-gray-100 line-clamp-3 drop-shadow-lg mb-3 translate-y-8 group-hover:translate-y-0 transition-all duration-300 ease-out delay-75">
              {project.short_description}
            </p>
          )}

          {/* Tech Stack - slides up third */}
          {project.tech_stack && project.tech_stack.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3 translate-y-8 group-hover:translate-y-0 transition-all duration-300 ease-out delay-100">
              {project.tech_stack.slice(0, 4).map((tech) => (
                <span
                  key={tech.id}
                  className="text-[10px] px-2.5 py-1 bg-gradient-to-r from-emerald-500/40 to-emerald-600/40 backdrop-blur-md text-emerald-100 rounded-full font-semibold border border-emerald-400/50"
                >
                  {tech.name}
                </span>
              ))}
            </div>
          )}

          {/* Action Buttons - slides up last */}
          <div className="flex gap-2 translate-y-8 group-hover:translate-y-0 transition-all duration-300 ease-out delay-150">
            <Link
              href={`/projects/${project.slug}`}
              className="flex-1 px-3 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 backdrop-blur-md hover:from-emerald-600 hover:to-emerald-700 text-white text-xs font-bold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/50 flex items-center justify-center gap-1.5 border border-emerald-400/30"
            >
              View Details
            </Link>
            {project.website_url && (
              <a
                href={project.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2.5 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center border border-white/30"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
