import * as SimpleIcons from 'react-icons/si'
import * as LucideIcons from 'lucide-react'
import { Skill } from '@/types/database'

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

  return (
    <section className="relative py-32 bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20 animate-fade-in-up">
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
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500 via-blue-500 to-purple-500" />

          {/* Categories */}
          <div className="space-y-24">
            {categories.map((category, catIndex) => {
              const categorySkills = skills.filter(s => s.category === category)
              const gradient = categoryGradients[category] || categoryGradients.other
              const isLeft = catIndex % 2 === 0

              return (
                <div
                  key={category}
                  className={`relative grid md:grid-cols-2 gap-8 items-center ${isLeft ? '' : 'md:grid-flow-dense'} animate-fade-in-up opacity-0`}
                  style={{ animationDelay: `${catIndex * 200}ms`, animationFillMode: 'forwards' }}
                >
                  {/* Timeline Dot */}
                  <div 
                    className={`absolute left-8 md:left-1/2 w-16 h-16 -ml-8 bg-gradient-to-br ${gradient} rounded-full border-4 border-white dark:border-black shadow-2xl flex items-center justify-center z-10 animate-scale-in opacity-0`}
                    style={{ animationDelay: `${catIndex * 200 + 300}ms`, animationFillMode: 'forwards' }}
                  >
                    <span className="text-white font-black text-xl">{catIndex + 1}</span>
                  </div>

                  {/* Category Title */}
                  <div className={`${isLeft ? 'md:text-right md:pr-16' : 'md:col-start-2 md:pl-16'} pl-24 md:pl-0`}>
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
                            className="group relative animate-scale-in opacity-0 hover:scale-110 hover:rotate-6 transition-all duration-300"
                            style={{ animationDelay: `${catIndex * 200 + index * 50}ms`, animationFillMode: 'forwards' }}
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
        <div className="mt-32 text-center animate-fade-in-up">
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
