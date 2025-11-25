'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { 
  SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiVuedotjs,
  SiNodedotjs, SiExpress, SiNestjs, SiGraphql,
  SiMongodb, SiPostgresql, SiRedis,
  SiDocker, SiKubernetes, SiFigma
} from 'react-icons/si'
import { Cloud } from 'lucide-react'
import { Skill } from '@/types/database'

interface SkillsSectionProps {
  heading?: string
  description?: string
  skills: Skill[]
}

const techIcons: Record<string, any> = {
  // By name (lowercase)
  'react': SiReact,
  'next.js': SiNextdotjs,
  'nextjs': SiNextdotjs,
  'typescript': SiTypescript,
  'tailwind css': SiTailwindcss,
  'tailwind': SiTailwindcss,
  'vue.js': SiVuedotjs,
  'vue': SiVuedotjs,
  'node.js': SiNodedotjs,
  'nodejs': SiNodedotjs,
  'express': SiExpress,
  'nestjs': SiNestjs,
  'graphql': SiGraphql,
  'mongodb': SiMongodb,
  'postgresql': SiPostgresql,
  'postgres': SiPostgresql,
  'redis': SiRedis,
  'docker': SiDocker,
  'kubernetes': SiKubernetes,
  'aws': Cloud,
  'figma': SiFigma,
  // By icon name (from database logo field)
  'SiReact': SiReact,
  'SiNextdotjs': SiNextdotjs,
  'SiTypescript': SiTypescript,
  'SiTailwindcss': SiTailwindcss,
  'SiVuedotjs': SiVuedotjs,
  'SiNodedotjs': SiNodedotjs,
  'SiExpress': SiExpress,
  'SiNestjs': SiNestjs,
  'SiGraphql': SiGraphql,
  'SiMongodb': SiMongodb,
  'SiPostgresql': SiPostgresql,
  'SiRedis': SiRedis,
  'SiDocker': SiDocker,
  'SiKubernetes': SiKubernetes,
  'Cloud': Cloud,
  'SiFigma': SiFigma,
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

  return (
    <section className="relative py-32 bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-black text-black dark:text-white mb-6">
            {heading || "Tech Stack"}
          </h2>
          {description && (
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {description}
            </p>
          )}
        </motion.div>

        {/* Vertical Showcase with Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500 via-blue-500 to-purple-500" />

          {/* Categories */}
          <div className="space-y-24">
            {categories.map((category, catIndex) => {
              const categorySkills = skills.filter(s => s.category === category)
              const gradient = categoryGradients[category] || categoryGradients.other
              const isLeft = catIndex % 2 === 0

              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8 }}
                  className={`relative grid md:grid-cols-2 gap-8 items-center ${isLeft ? '' : 'md:grid-flow-dense'}`}
                >
                  {/* Timeline Dot */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    className={`absolute left-8 md:left-1/2 w-16 h-16 -ml-8 bg-gradient-to-br ${gradient} rounded-full border-4 border-white dark:border-black shadow-2xl flex items-center justify-center z-10`}
                  >
                    <span className="text-white font-black text-xl">{catIndex + 1}</span>
                  </motion.div>

                  {/* Category Title */}
                  <div className={`${isLeft ? 'md:text-right md:pr-16' : 'md:col-start-2 md:pl-16'} pl-24 md:pl-0`}>
                    <motion.h3
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="text-4xl md:text-5xl font-black text-black dark:text-white mb-4 capitalize"
                    >
                      {category}
                    </motion.h3>
                    <div className={`h-1 w-24 bg-gradient-to-r ${gradient} rounded-full ${isLeft ? 'md:ml-auto' : ''}`} />
                  </div>

                  {/* Skills Grid */}
                  <div className={`${isLeft ? 'md:col-start-2 md:pl-16' : 'md:col-start-1 md:row-start-1 md:pr-16'} pl-24 md:pl-0 md:pr-0`}>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {categorySkills.map((skill, index) => {
                        // Use logo field from database (contains icon name like "SiReact", "Cloud")
                        const Icon = skill.logo ? (techIcons[skill.logo] || techIcons[skill.name.toLowerCase()]) : techIcons[skill.name.toLowerCase()]
                        
                        return (
                          <motion.div
                            key={skill.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="group relative"
                          >
                            <div className={`absolute -inset-1 bg-gradient-to-r ${gradient} rounded-2xl blur opacity-0 group-hover:opacity-75 transition-opacity`} />
                            <div className="relative bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 p-4 flex flex-col items-center gap-3 transition-all">
                              {Icon ? (
                                <Icon className="w-10 h-10 text-gray-700 dark:text-gray-300" />
                              ) : (
                                <div className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-white font-bold`}>
                                  {skill.name[0]}
                                </div>
                              )}
                              <span className="text-xs font-bold text-gray-700 dark:text-gray-300 text-center">
                                {skill.name}
                              </span>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 text-center"
        >
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
        </motion.div>
      </div>
    </section>
  )
}
