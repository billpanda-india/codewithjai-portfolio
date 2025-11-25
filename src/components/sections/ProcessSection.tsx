'use client'

import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'

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
  if (steps.length === 0) return null
  return (
    <section className="relative py-32 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-black text-black dark:text-white mb-6">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-500">Process</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            A proven approach to delivering exceptional results
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const IconComponent = (Icons as any)[step.icon] || Icons.Circle
            
            return (
              <div
                key={index}
                className="relative group transition-transform hover:-translate-y-2"
              >
                {/* Number */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center font-black text-xl shadow-xl z-10">
                  {index + 1}
                </div>

                {/* Card */}
                <div className="relative bg-gray-50 dark:bg-gray-900 rounded-3xl p-8 border-2 border-gray-200 dark:border-gray-800 group-hover:border-transparent transition-all z-0">
                  {/* Gradient Border on Hover */}
                  <div className={`absolute -inset-1 bg-gradient-to-r ${step.color} rounded-3xl blur opacity-0 group-hover:opacity-75 transition-opacity -z-10`} />
                  
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
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
