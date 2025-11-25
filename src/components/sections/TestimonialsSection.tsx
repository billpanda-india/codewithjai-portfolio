'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { Star, Quote } from 'lucide-react'
import { Testimonial } from '@/types/database'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[]
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const bgRef1 = useRef<HTMLDivElement>(null)
  const bgRef2 = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Premium Background Animation - Floating orbs
      gsap.to(bgRef1.current, {
        x: 100,
        y: -50,
        scale: 1.2,
        duration: 8,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })

      gsap.to(bgRef2.current, {
        x: -80,
        y: 60,
        scale: 0.9,
        duration: 10,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })

      // Header - Premium entrance with split text effect
      const headerTitle = headerRef.current?.querySelector('h2')
      const headerSubtitle = headerRef.current?.querySelector('p')

      if (headerTitle && headerSubtitle) {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        })

        timeline
          .from(headerTitle, {
            opacity: 0,
            y: 100,
            scale: 0.8,
            rotationX: -15,
            duration: 1.4,
            ease: 'power4.out',
          })
          .from(
            headerSubtitle,
            {
              opacity: 0,
              y: 40,
              duration: 1,
              ease: 'power3.out',
            },
            '-=0.8'
          )
      }

      // Cards - Premium 3D entrance with magnetic hover
      const cards = Array.from(cardsRef.current?.children || [])
      
      cards.forEach((card, index) => {
        // Entrance animation - 3D flip with stagger
        gsap.from(card, {
          opacity: 0,
          y: 120,
          rotationX: -25,
          rotationY: 15 * (index % 2 === 0 ? 1 : -1),
          scale: 0.85,
          duration: 1.4,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          delay: index * 0.15,
        })

        // Smooth parallax on scroll
        gsap.to(card, {
          y: index % 2 === 0 ? -40 : -20,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        })

        // Premium hover effect - 3D tilt
        const cardElement = card as HTMLElement
        
        cardElement.addEventListener('mouseenter', () => {
          gsap.to(card, {
            scale: 1.05,
            z: 50,
            duration: 0.6,
            ease: 'power2.out',
          })
        })

        cardElement.addEventListener('mouseleave', () => {
          gsap.to(card, {
            scale: 1,
            z: 0,
            rotationX: 0,
            rotationY: 0,
            duration: 0.6,
            ease: 'power2.out',
          })
        })

        cardElement.addEventListener('mousemove', (e) => {
          const rect = cardElement.getBoundingClientRect()
          const x = e.clientX - rect.left
          const y = e.clientY - rect.top
          const centerX = rect.width / 2
          const centerY = rect.height / 2
          const rotateX = ((y - centerY) / centerY) * -8
          const rotateY = ((x - centerX) / centerX) * 8

          gsap.to(card, {
            rotationX: rotateX,
            rotationY: rotateY,
            duration: 0.3,
            ease: 'power2.out',
          })
        })

        // Animate card internals
        const quote = card.querySelector('.quote-icon')
        const text = card.querySelector('.quote-text')
        const stars = card.querySelectorAll('.star')
        const avatar = card.querySelector('.avatar')
        const author = card.querySelector('.author-info')

        if (quote) {
          gsap.from(quote, {
            scale: 0,
            rotation: -180,
            opacity: 0,
            duration: 0.8,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
            delay: index * 0.15 + 0.3,
          })
        }

        if (text) {
          gsap.from(text, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
            delay: index * 0.15 + 0.5,
          })
        }

        if (stars.length > 0) {
          gsap.from(stars, {
            scale: 0,
            opacity: 0,
            stagger: 0.08,
            duration: 0.5,
            ease: 'back.out(2)',
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
            delay: index * 0.15 + 0.7,
          })
        }

        const authorElements = [avatar, author].filter(Boolean)
        if (authorElements.length > 0) {
          gsap.from(authorElements, {
            opacity: 0,
            x: -30,
            stagger: 0.1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
            delay: index * 0.15 + 0.9,
          })
        }
      })
    })

    return () => ctx.revert()
  }, [testimonials])

  return (
    <section 
      ref={sectionRef} 
      className="relative py-32 bg-gradient-to-b from-gray-50 to-white dark:from-black dark:to-gray-950 overflow-hidden"
      style={{ perspective: '1000px' }}
    >
      {/* Premium Animated Background */}
      <div 
        ref={bgRef1}
        className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/20 dark:bg-emerald-500/30 rounded-full blur-3xl"
      />
      <div 
        ref={bgRef2}
        className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-blue-500/20 dark:bg-blue-500/30 rounded-full blur-3xl"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_70%)]" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-24">
          <h2 className="text-5xl md:text-7xl font-black text-black dark:text-white mb-6">
            Client <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500">Testimonials</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            What clients say about working with me
          </p>
        </div>

        {/* Testimonials Grid - Fixed Layout */}
        <div 
          ref={cardsRef} 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr"
        >
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="group relative h-full"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Premium Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-700" />
              
              {/* Card */}
              <div className="relative h-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-3xl p-8 border border-gray-200/50 dark:border-gray-800/50 group-hover:border-emerald-500/50 dark:group-hover:border-emerald-500/50 transition-all duration-500 shadow-xl group-hover:shadow-2xl flex flex-col">
                {/* Quote Icon */}
                <div className="mb-6 quote-icon">
                  <Quote className="w-14 h-14 text-emerald-500/40 dark:text-emerald-500/50" strokeWidth={1.5} />
                </div>
                
                {/* Quote Text */}
                <p className="quote-text text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-8 flex-grow">
                  "{testimonial.quote}"
                </p>

                {/* Rating */}
                <div className="flex gap-1.5 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="star w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-sm" 
                    />
                  ))}
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent mb-6" />

                {/* Author */}
                <div className="flex items-center gap-4">
                  {testimonial.avatar && (
                    <div className="avatar w-16 h-16 relative rounded-full overflow-hidden ring-2 ring-emerald-500/30 group-hover:ring-emerald-500/60 transition-all duration-500 flex-shrink-0">
                      <Image
                        src={testimonial.avatar || '/placeholder-avatar.png'}
                        alt={testimonial.client_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="author-info flex-1 min-w-0">
                    <div className="font-bold text-black dark:text-white text-lg mb-1 truncate">
                      {testimonial.client_name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 leading-snug">
                      <div className="truncate">{testimonial.client_role}</div>
                      {testimonial.company && (
                        <div className="text-emerald-600 dark:text-emerald-400 font-medium truncate mt-0.5">
                          {testimonial.company}
                        </div>
                      )}
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
