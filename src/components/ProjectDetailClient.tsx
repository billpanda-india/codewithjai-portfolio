'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, ExternalLink, Github, X } from 'lucide-react'

interface ProjectDetailClientProps {
  project: any
  testimonials: any[]
}

export default function ProjectDetailClient({ project, testimonials }: ProjectDetailClientProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  const images = project.images || []
  const hasImages = images.length > 0

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-black dark:text-white mb-4">
              {project.title}
            </h1>
            {project.short_description && (
              <p className="text-xl text-gray-600 dark:text-gray-400">
                {project.short_description}
              </p>
            )}
          </div>
          {project.category && (
            <span className="px-4 py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full capitalize font-semibold w-fit">
              {project.category}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          {project.website_url && (
            <a
              href={project.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-bold rounded-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
            >
              <ExternalLink className="w-5 h-5" />
              Visit Website
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 text-black dark:text-white font-bold rounded-lg hover:border-emerald-500 transition-all flex items-center gap-2"
            >
              <Github className="w-5 h-5" />
              View Code
            </a>
          )}
        </div>
      </div>

      {/* Image Carousel */}
      {hasImages && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black dark:text-white">Project Screenshots</h2>
          <div className="relative group">
            {/* Main Image */}
            <div 
              className="relative h-[500px] rounded-2xl overflow-hidden cursor-pointer"
              onClick={() => setIsLightboxOpen(true)}
            >
              <img
                src={images[currentImageIndex].image}
                alt={`Screenshot ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                >
                  <ChevronLeft className="w-6 h-6 text-black dark:text-white" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                >
                  <ChevronRight className="w-6 h-6 text-black dark:text-white" />
                </button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 backdrop-blur-sm text-white text-sm font-semibold rounded-full">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((image: any, index: number) => (
                <button
                  key={image.id}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentImageIndex
                      ? 'border-emerald-500 scale-105'
                      : 'border-gray-200 dark:border-gray-800 hover:border-emerald-500/50'
                  }`}
                >
                  <img
                    src={image.image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Description */}
      {project.long_description && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 p-8">
          <h2 className="text-2xl font-bold text-black dark:text-white mb-4">About This Project</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {project.long_description}
          </p>
        </div>
      )}

      {/* Dynamic Content Blocks */}
      {project.content_blocks && project.content_blocks.length > 0 && (
        <div className="space-y-6">
          {project.content_blocks.map((block: any) => {
            switch (block.type) {
              case 'heading':
                return (
                  <h2 key={block.id} className="text-3xl font-bold text-black dark:text-white">
                    {block.content}
                  </h2>
                )
              case 'paragraph':
                return (
                  <div key={block.id} className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 p-6">
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {block.content}
                    </p>
                  </div>
                )
              case 'bullets':
                return (
                  <div key={block.id} className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 p-6">
                    <ul className="space-y-3">
                      {block.content.split('\n').filter((line: string) => line.trim()).map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-lg text-gray-700 dark:text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              case 'quote':
                return (
                  <div key={block.id} className="bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 p-8">
                    <div className="flex gap-4">
                      <span className="text-6xl text-emerald-500 font-serif leading-none">"</span>
                      <p className="text-xl italic text-gray-700 dark:text-gray-300 leading-relaxed pt-4">
                        {block.content}
                      </p>
                    </div>
                  </div>
                )
              default:
                return null
            }
          })}
        </div>
      )}

      {/* Tech Stack */}
      {project.technologies && project.technologies.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Technologies Used</h2>
          <div className="flex flex-wrap gap-3">
            {project.technologies.map((tech: string, index: number) => (
              <div
                key={index}
                className="px-4 py-2 bg-white dark:bg-gray-900 rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:border-emerald-500 transition-all hover:scale-105"
              >
                <span className="text-sm font-semibold text-black dark:text-white">
                  {tech}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Client Feedback */}
      {project.client_feedback && (
        <div>
          <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Client Feedback</h2>
          <div className="bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-8 rounded-2xl border-2 border-gray-200 dark:border-gray-800">
            <p className="text-lg italic text-gray-700 dark:text-gray-300">
              "{project.client_feedback}"
            </p>
          </div>
        </div>
      )}

      {/* Testimonials (from testimonials table) */}
      {testimonials && testimonials.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Additional Testimonials</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((testimonial: any) => (
              <div
                key={testimonial.id}
                className="bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-800"
              >
                <p className="text-lg italic text-gray-700 dark:text-gray-300 mb-4">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-4">
                  {testimonial.avatar && (
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.client_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="font-bold text-black dark:text-white">
                      {testimonial.client_name}
                    </p>
                    {testimonial.client_role && testimonial.company && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonial.client_role} at {testimonial.company}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <div className="relative max-w-7xl w-full h-full flex items-center justify-center">
              <img
                src={images[currentImageIndex].image}
                alt={`Screenshot ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      prevImage()
                    }}
                    className="absolute left-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      nextImage()
                    }}
                    className="absolute right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                  >
                    <ChevronRight className="w-6 h-6 text-white" />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
