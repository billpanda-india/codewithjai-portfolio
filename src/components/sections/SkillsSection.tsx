'use client'

import { useEffect, useRef } from 'react'
import * as SimpleIcons from 'react-icons/si'
import * as LucideIcons from 'lucide-react'
import { Skill } from '@/types/database'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface SkillsSectionProps {
  heading?: string
  description?: string
  skills: Skill[]
}

// Dynamic icon loader - loads ANY icon from react-icons
function getIconComponent(iconName: string) {
  if (!iconName) return null
  
  // Try Simple Icons (Si prefix)
  if (iconName.startsWith('Si')) {
    const Icon = (SimpleIcons as any)[iconName]
    if (Icon) return Icon
  }
  
  // Try Lucide Icons
  const LucideIcon = (LucideIcons as any)[iconName]
  if (LucideIcon) return LucideIcon
  
  return null
}

const categoryGradients: Record<string, string> = {
  frontend: 'from-cyan-500 to-blue-500',
  backend: 'from-green-500 to-emerald-500',
  database: 'from-purple-500 to-pink-500',
  devops: 'from-orange-500 to-red-500',
  design: 'from-pink-500 to-rose-500',
  other: 'from-yellow-500 to-amber-500',
}

export default function SkillsSection({ heading, description, skills }: SkillsSectionProps) {
  const categories = Array.from(new Set(skills.map(s => s.category)))
  const headerRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const categoriesRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header - Zoom in with fade
      gsap.from(headerRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 1,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      })

      // Timeline - Draw from top to bottom
      gsap.from(timelineRef.current, {
        scaleY: 0,
        transformOrigin: 'top',
        duration: 1.5,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: timelineRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      })

      // Each category section
      const categoryCards = categoriesRef.current?.children || []
      Array.from(categoryCards).forEach((card, catIndex) => {
        const isLeft = catIndex % 2 === 0

        // Timeline dot - Pop in with bounce
        const dot = card.querySelector('.timeline-dot')
        if (dot) {
          gsap.from(dot, {
            scale: 0,
            rotation: 360,
            duration: 0.8,
            ease: 'elastic.out(1, 0.5)',
            scrollTrigger: {
              trigger: card,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          })
        }

        // Category title - Slide from side
        const title = card.querySelector('.category-title')
        if (title) {
          gsap.from(title, {
            x: isLeft ? 100 : -100,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
            delay: 0.2,
          })
        }

        // Skills - Each with unique flip animation
        const skillCards = card.querySelectorAll('.skill-card')
        skillCards.forEach((skillCard, index) => {
          gsap.from(skillCard, {
            rotationY: 180,
            opacity: 0,
            scale: 0.5,
            duration: 0.8,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: skillCard,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
            delay: index * 0.08,
          })
        })
      })

      // Stats - Stagger with bounce
      const statItems = statsRef.current?.querySelectorAll('div > div') || []
      gsap.from(statItems, {
        y: 50,
        opacity: 0,
        scale: 0.5,
        duration: 0.8,
        stagger: 0.15,
        ease: 'back.out(2)',
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      })
    })

    return () => ctx.revert()
  }, [skills, categories])

  return (
    <section className="relative py-32 bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-black text-black dark:text-white mb-6">
            {heading || "Tech Stack"}
          </h2>
          {description && (
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {description}
            </p>
          )}
        </div>

        {/* Vertical Showcase with Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div ref={timelineRef} className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500 via-blue-500 to-purple-500" />

          {/* Categories */}
          <div ref={categoriesRef} className="space-y-24">
            {categories.map((category, catIndex) => {
              const categorySkills = skills.filter(s => s.category === category)
              const gradient = categoryGradients[category] || categoryGradients.other
              const isLeft = catIndex % 2 === 0

              return (
                <div
                  key={category}
                  className={`relative grid md:grid-cols-2 gap-8 items-center ${isLeft ? '' : 'md:grid-flow-dense'}`}
                >
                  {/* Timeline Dot */}
                  <div className={`timeline-dot absolute left-8 md:left-1/2 w-16 h-16 -ml-8 bg-gradient-to-br ${gradient} rounded-full border-4 border-white dark:border-black shadow-2xl flex items-center justify-center z-10`}>
                    <span className="text-white font-black text-xl">{catIndex + 1}</span>
                  </div>

                  {/* Category Title */}
                  <div className={`category-title ${isLeft ? 'md:text-right md:pr-16' : 'md:col-start-2 md:pl-16'} pl-24 md:pl-0`}>
                    <h3 className="text-4xl md:text-5xl font-black text-black dark:text-white mb-4 capitalize">
                      {category}
                    </h3>
                    <div className={`h-1 w-24 bg-gradient-to-r ${gradient} rounded-full ${isLeft ? 'md:ml-auto' : ''}`} />
                  </div>

                  {/* Skills Grid */}
                  <div className={`${isLeft ? 'md:col-start-2 md:pl-16' : 'md:col-start-1 md:row-start-1 md:pr-16'} pl-24 md:pl-0 md:pr-0`}>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {categorySkills.map((skill, index) => {
                        // Dynamically load icon from database logo field
                        const Icon = skill.logo ? getIconComponent(skill.logo) : null
                        
                        return (
                          <div
                            key={skill.id}
                            className="skill-card group relative hover:scale-110 hover:rotate-6 transition-all duration-300"
                          >
                            <div className={`absolute -inset-1 bg-gradient-to-r ${gradient} rounded-2xl blur opacity-0 group-hover:opacity-75 transition-opacity`} />
                            <div className="relative bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 p-4 flex flex-col items-center gap-3 transition-all">
                              {Icon ? (
                                <Icon className="w-10 h-10 text-gray-700 dark:text-gray-300" />
                              ) : (
                                <div className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-white font-bold text-lg`}>
                                  {skill.name[0]}
                                </div>
                              )}
                              <span className="text-xs font-bold text-gray-700 dark:text-gray-300 text-center">
                                {skill.name}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom Stats */}
        <div ref={statsRef} className="mt-32 text-center">
          <div className="inline-flex items-center gap-8 px-8 py-6 bg-white dark:bg-gray-900 rounded-3xl border-2 border-gray-200 dark:border-gray-800 shadow-xl">
            <div>
              <div className="text-3xl font-black text-black dark:text-white">{skills.length}+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Technologies</div>
            </div>
            <div className="w-px h-12 bg-gray-300 dark:bg-gray-700" />
            <div>
              <div className="text-3xl font-black text-black dark:text-white">{categories.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
            </div>
            <div className="w-px h-12 bg-gray-300 dark:bg-gray-700" />
            <div>
              <div className="text-3xl font-black text-black dark:text-white">5+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Years</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
