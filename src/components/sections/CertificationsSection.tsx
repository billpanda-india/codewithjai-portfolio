"use client"

import { motion } from "motion/react"
import { CertificationsColumn } from "@/components/ui/testimonials-columns"

interface Certification {
  id: string
  title: string
  issuer: string
  issue_date: string
  credential_id?: string
  credential_url?: string
  logo_url?: string
}

interface CertificationsSectionProps {
  certifications: Certification[]
}

export default function CertificationsSection({ certifications }: CertificationsSectionProps) {
  if (certifications.length === 0) return null

  return (
    <section className="bg-white dark:bg-black py-24 relative">
      <div className="container z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-black text-black dark:text-white mb-4 text-center">
            Certifications &{' '}
            <span className="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
              Awards
            </span>
          </h2>
          <p className="text-center text-lg text-gray-600 dark:text-gray-400">
            Professional certifications and achievements
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <CertificationsColumn
            certifications={certifications.slice(0, 2)}
            duration={15}
          />
          <CertificationsColumn
            certifications={certifications.slice(2, 4)}
            className="hidden md:block"
            duration={19}
          />
          <CertificationsColumn
            certifications={certifications.slice(4, 6)}
            className="hidden lg:block"
            duration={17}
          />
        </div>
      </div>
    </section>
  )
}
