import Image from 'next/image'
import { Star, Quote } from 'lucide-react'
import { Testimonial } from '@/types/database'

interface TestimonialsSectionProps {
  testimonials: Testimonial[]
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  return (
    <section className="relative py-32 bg-gray-50 dark:bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(16,185,129,0.1),transparent_50%)] dark:opacity-100 opacity-50" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20 animate-fade-in-up">
          <h2 className="text-5xl md:text-7xl font-black text-black dark:text-white mb-6">
            Client <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-500">Testimonials</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            What clients say about working with me
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="group relative animate-fade-in-up opacity-0 hover:-translate-y-2 transition-transform duration-300"
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
            >
              {/* Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-3xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity" />
              
              {/* Card */}
              <div className="relative bg-white dark:bg-gray-900 rounded-3xl p-8 border-2 border-gray-200 dark:border-gray-800 group-hover:border-emerald-500 dark:group-hover:border-emerald-500 transition-all">
                {/* Quote Icon */}
                <Quote className="w-12 h-12 text-emerald-500/20 mb-6" />
                
                {/* Quote */}
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  "{testimonial.quote}"
                </p>

                {/* Rating */}
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Author */}
                <div className="flex items-center gap-4">
                  {testimonial.avatar && (
                    <div className="w-12 h-12 relative rounded-full overflow-hidden">
                      <Image
                        src={testimonial.avatar || '/placeholder-avatar.png'}
                        alt={testimonial.client_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-black dark:text-white">{testimonial.client_name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.client_role} {testimonial.company && `at ${testimonial.company}`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
