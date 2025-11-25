'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, Mail, Calendar } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface CTASectionProps {
  badgeText?: string
  title?: string
  titleHighlight?: string
  description?: string
  primaryButtonText?: string
  primaryButtonUrl?: string
  secondaryButtonText?: string
  secondaryButtonUrl?: string
  stat1Number?: string
  stat1Label?: string
  stat2Number?: string
  stat2Label?: string
  stat3Number?: string
  stat3Label?: string
}

export default function CTASection({
  badgeText = 'Available for new projects',
  title = "Let's Build Something",
  titleHighlight = 'Amazing Together',
  description = "Have a project in mind? Let's discuss how I can help bring your vision to life with cutting-edge technology and exceptional design.",
  primaryButtonText = 'Get In Touch',
  primaryButtonUrl = '/contact',
  secondaryButtonText = 'View My Work',
  secondaryButtonUrl = '/projects',
  stat1Number = '50+',
  stat1Label = 'Projects Completed',
  stat2Number = '30+',
  stat2Label = 'Happy Clients',
  stat3Number = '5.0',
  stat3Label = 'Average Rating',
}: CTASectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const orb1Ref = useRef<HTMLDivElement>(null)
  const orb2Ref = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const highlightRef = useRef<HTMLSpanElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Premium Orb Animations - Morphing effect
      gsap.to(orb1Ref.current, {
        x: 150,
        y: -100,
        scale: 1.3,
        rotation: 360,
        duration: 12,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })

      gsap.to(orb2Ref.current, {
        x: -120,
        y: 80,
        scale: 0.8,
        rotation: -360,
        duration: 15,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })

      // Badge - Bouncing entrance with elastic effect
      gsap.from(badgeRef.current, {
        scale: 0,
        rotation: -720,
        opacity: 0,
        duration: 1.2,
        ease: 'elastic.out(1, 0.5)',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
      })

      // Continuous badge pulse
      gsap.to(badgeRef.current, {
        scale: 1.05,
        duration: 2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })

      // Title - Split reveal with wave effect
      if (titleRef.current) {
        const titleText = titleRef.current.textContent || ''
        const chars = titleText.split('')
        titleRef.current.innerHTML = chars
          .map((char) => `<span class="inline-block">${char === ' ' ? '&nbsp;' : char}</span>`)
          .join('')

        gsap.from(titleRef.current.children, {
          opacity: 0,
          y: 100,
          rotationX: -90,
          stagger: {
            each: 0.03,
            from: 'start',
          },
          duration: 0.8,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        })
      }

      // Highlight - Glowing reveal
      gsap.from(highlightRef.current, {
        opacity: 0,
        scale: 0.5,
        y: 50,
        duration: 1.2,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: highlightRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
        delay: 0.5,
      })

      // Continuous glow pulse on highlight
      gsap.to(highlightRef.current, {
        textShadow: '0 0 30px rgba(16, 185, 129, 0.8), 0 0 60px rgba(59, 130, 246, 0.6)',
        duration: 2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })

      // Description - Fade slide with blur
      gsap.from(descRef.current, {
        opacity: 0,
        y: 60,
        filter: 'blur(10px)',
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: descRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        delay: 0.8,
      })

      // Buttons - 3D flip entrance
      const buttons = buttonsRef.current?.children || []
      gsap.from(buttons, {
        opacity: 0,
        rotationY: -180,
        z: -200,
        stagger: 0.2,
        duration: 1,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: buttonsRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        delay: 1,
      })

      // Button hover animations
      Array.from(buttons).forEach((button) => {
        const btnElement = button as HTMLElement
        
        btnElement.addEventListener('mouseenter', () => {
          gsap.to(button, {
            scale: 1.1,
            rotation: 2,
            duration: 0.4,
            ease: 'back.out(2)',
          })
        })

        btnElement.addEventListener('mouseleave', () => {
          gsap.to(button, {
            scale: 1,
            rotation: 0,
            duration: 0.4,
            ease: 'power2.out',
          })
        })
      })

      // Stats - Cascading 3D cards with counter animation
      const stats = statsRef.current?.children || []
      
      Array.from(stats).forEach((stat, index) => {
        // Entrance animation
        gsap.from(stat, {
          opacity: 0,
          y: 100,
          rotationX: -90,
          scale: 0.5,
          duration: 1.2,
          ease: 'back.out(1.5)',
          scrollTrigger: {
            trigger: stat,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          delay: index * 0.15 + 1.2,
        })

        // Floating animation
        gsap.to(stat, {
          y: -15,
          duration: 2 + index * 0.3,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })

        // 3D tilt on hover
        const statElement = stat as HTMLElement
        
        statElement.addEventListener('mouseenter', () => {
          gsap.to(stat, {
            scale: 1.15,
            z: 100,
            duration: 0.5,
            ease: 'power2.out',
          })
        })

        statElement.addEventListener('mouseleave', () => {
          gsap.to(stat, {
            scale: 1,
            z: 0,
            rotationX: 0,
            rotationY: 0,
            duration: 0.5,
            ease: 'power2.out',
          })
        })

        statElement.addEventListener('mousemove', (e) => {
          const rect = statElement.getBoundingClientRect()
          const x = e.clientX - rect.left
          const y = e.clientY - rect.top
          const centerX = rect.width / 2
          const centerY = rect.height / 2
          const rotateX = ((y - centerY) / centerY) * -15
          const rotateY = ((x - centerX) / centerX) * 15

          gsap.to(stat, {
            rotationX: rotateX,
            rotationY: rotateY,
            duration: 0.3,
            ease: 'power2.out',
          })
        })

        // Counter animation for numbers
        const numberElement = stat.querySelector('.stat-number')
        if (numberElement) {
          gsap.from(numberElement, {
            textContent: 0,
            duration: 2,
            ease: 'power2.out',
            snap: { textContent: 1 },
            scrollTrigger: {
              trigger: stat,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
            delay: index * 0.15 + 1.5,
          })
        }
      })
    })

    return () => ctx.revert()
  }, [])
  return (
    <section 
      ref={sectionRef}
      className="relative py-32 bg-gray-50 dark:bg-black overflow-hidden"
      style={{ perspective: '1500px' }}
    >
      {/* Animated Grid Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 dark:from-black via-transparent to-gray-50 dark:to-black" />
      </div>

      {/* Premium Morphing Orbs */}
      <div 
        ref={orb1Ref}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 dark:bg-emerald-500/30 rounded-full blur-3xl"
      />
      <div 
        ref={orb2Ref}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 dark:bg-blue-500/30 rounded-full blur-3xl"
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          {/* Badge */}
          <div 
            ref={badgeRef}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-100 dark:bg-emerald-500/10 backdrop-blur-sm border border-emerald-200 dark:border-emerald-500/30 rounded-full text-emerald-700 dark:text-emerald-400 font-medium shadow-lg dark:shadow-emerald-500/20"
          >
            <Calendar className="w-4 h-4" />
            <span>{badgeText}</span>
          </div>

          {/* Heading */}
          <h2 
            ref={titleRef}
            className="text-5xl md:text-7xl font-black text-black dark:text-white leading-tight"
          >
            {title}
            <br />
            <span 
              ref={highlightRef}
              className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600 dark:from-emerald-400 dark:via-blue-400 dark:to-purple-400"
            >
              {titleHighlight}
            </span>
          </h2>

          {/* Description */}
          <p 
            ref={descRef}
            className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            {description}
          </p>

          {/* Buttons */}
          <div 
            ref={buttonsRef}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <Link href={primaryButtonUrl}>
              <button className="group px-8 py-4 bg-black dark:bg-gradient-to-r dark:from-emerald-500 dark:to-blue-500 text-white rounded-full font-bold text-lg shadow-2xl dark:shadow-emerald-500/50 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                {primaryButtonText}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href={secondaryButtonUrl}>
              <button className="px-8 py-4 bg-white dark:bg-white/5 text-black dark:text-white rounded-full font-bold text-lg border-2 border-gray-300 dark:border-white/20 hover:border-black dark:hover:border-white/40 dark:backdrop-blur-sm flex items-center gap-2">
                {secondaryButtonText}
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div 
            ref={statsRef}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto pt-16"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="relative group p-6 bg-white dark:bg-gray-900/50 dark:backdrop-blur-sm rounded-2xl border-2 border-gray-200 dark:border-gray-800 dark:hover:border-emerald-500/50 transition-all duration-300">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl blur-xl opacity-0 dark:group-hover:opacity-50 transition-opacity -z-10" />
              <div className="stat-number text-4xl font-black text-black dark:text-white mb-2">{stat1Number}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{stat1Label}</div>
            </div>
            <div className="relative group p-6 bg-white dark:bg-gray-900/50 dark:backdrop-blur-sm rounded-2xl border-2 border-gray-200 dark:border-gray-800 dark:hover:border-blue-500/50 transition-all duration-300">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-0 dark:group-hover:opacity-50 transition-opacity -z-10" />
              <div className="stat-number text-4xl font-black text-black dark:text-white mb-2">{stat2Number}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{stat2Label}</div>
            </div>
            <div className="relative group p-6 bg-white dark:bg-gray-900/50 dark:backdrop-blur-sm rounded-2xl border-2 border-gray-200 dark:border-gray-800 dark:hover:border-purple-500/50 transition-all duration-300">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-0 dark:group-hover:opacity-50 transition-opacity -z-10" />
              <div className="stat-number text-4xl font-black text-black dark:text-white mb-2">{stat3Number}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{stat3Label}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
