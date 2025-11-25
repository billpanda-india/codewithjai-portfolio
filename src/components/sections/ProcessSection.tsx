'use client'

import { useEffect, useRef } from 'react'
import * as Icons from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

type ProcessStep = {
  title: string
  description: string
  icon: string
  color: string
}

type ProcessSectionProps = {
  steps?: ProcessStep[]
}

export default function ProcessSection({ steps = [] }: ProcessSectionProps) {
  const headerRef = useRef<HTMLDivElement>(null)
  const stepsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (steps.length === 0) return

    const ctx = gsap.context(() => {
      // Header - Slide from top with fade
      gsap.from(headerRef.current, {
        y: -80,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      })

      // Steps - Each card with unique animation
      const cards = stepsRef.current?.children || []
      Array.from(cards).forEach((card, index) => {
        // Rotate and scale in from different angles
        const rotateFrom = index % 2 === 0 ? -15 : 15
        
        gsap.from(card, {
          opacity: 0,
          scale: 0.5,
          rotation: rotateFrom,
          y: 100,
          duration: 0.8,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          delay: index * 0.15,
        })

        // Animate number badge separately
        const numberBadge = card.querySelector('.number-badge')
        if (numberBadge) {
          gsap.from(numberBadge, {
            scale: 0,
            rotation: 360,
            duration: 0.6,
            ease: 'back.out(2)',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
            delay: index * 0.15 + 0.3,
          })
        }

        // Animate icon separately with bounce
        const icon = card.querySelector('.process-icon')
        if (icon) {
          gsap.from(icon, {
            scale: 0,
            rotation: -180,
            duration: 0.7,
            ease: 'elastic.out(1, 0.5)',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
            delay: index * 0.15 + 0.5,
          })
        }
      })
    })

    return () => ctx.revert()
  }, [steps])

  if (steps.length === 0) return null
  
  return (
    <section className="relative py-32 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-black text-black dark:text-white mb-6">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-500 animate-gradient">Process</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            A proven approach to delivering exceptional results
          </p>
        </div>

        {/* Steps */}
        <div ref={stepsRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const IconComponent = (Icons as any)[step.icon] || Icons.Circle
            
            return (
              <div
                key={index}
                className="relative group hover:-translate-y-2 transition-all"
              >
                {/* Number */}
                <div className="number-badge absolute -top-4 -left-4 w-12 h-12 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center font-black text-xl shadow-xl z-10">
                  {index + 1}
                </div>

                {/* Card */}
                <div className="relative bg-gray-50 dark:bg-gray-900 rounded-3xl p-8 border-2 border-gray-200 dark:border-gray-800 group-hover:border-transparent transition-all z-0">
                  {/* Gradient Border on Hover */}
                  <div className={`absolute -inset-1 bg-gradient-to-r ${step.color} rounded-3xl blur opacity-0 group-hover:opacity-75 transition-opacity -z-10`} />
                  
                  {/* Icon */}
                  <div className={`process-icon w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-black text-black dark:text-white mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
