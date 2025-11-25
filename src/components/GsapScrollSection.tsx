'use client'

import { useEffect, useRef, ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface GsapScrollSectionProps {
  children: ReactNode
  className?: string
  animation?: 'fade' | 'slide' | 'scale' | 'parallax'
  delay?: number
  stagger?: boolean
  staggerSelector?: string
}

export default function GsapScrollSection({
  children,
  className = '',
  animation = 'fade',
  delay = 0,
  stagger = false,
  staggerSelector = '.gsap-item',
}: GsapScrollSectionProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const ctx = gsap.context(() => {
      const element = ref.current

      if (stagger && staggerSelector) {
        // Stagger animation for child elements
        gsap.from(staggerSelector, {
          opacity: 0,
          y: 60,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        })
      } else {
        // Single element animation
        const animations: Record<string, gsap.TweenVars> = {
          fade: {
            opacity: 0,
            duration: 1,
            ease: 'power2.out',
          },
          slide: {
            opacity: 0,
            y: 100,
            duration: 1,
            ease: 'power3.out',
          },
          scale: {
            opacity: 0,
            scale: 0.8,
            duration: 1,
            ease: 'back.out(1.7)',
          },
          parallax: {
            y: 50,
            duration: 1,
            ease: 'none',
          },
        }

        gsap.from(element, {
          ...animations[animation],
          delay,
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            end: animation === 'parallax' ? 'bottom top' : 'top 20%',
            scrub: animation === 'parallax',
            toggleActions: animation === 'parallax' ? undefined : 'play none none none',
          },
        })
      }
    }, ref)

    return () => ctx.revert()
  }, [animation, delay, stagger, staggerSelector])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
