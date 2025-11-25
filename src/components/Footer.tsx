'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Github, Linkedin, Twitter, Mail, ArrowUpRight } from 'lucide-react'
import { Footer as FooterType } from '@/types/database'

interface FooterProps {
  footer: FooterType | null
  siteName: string
  logo?: string | null
}

export default function Footer({ footer, siteName, logo }: FooterProps) {
  const getHref = (link: any) => {
    if (link.target_type === 'internal' && link.internal_page?.slug) {
      return `/${link.internal_page.slug === 'home' ? '' : link.internal_page.slug}`
    }
    return link.external_url || '#'
  }

  const socialIcons: Record<string, any> = {
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
    email: Mail,
  }

  return (
    <footer className="relative bg-gray-100 dark:bg-black overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-100 dark:from-black via-transparent to-gray-100 dark:to-black" />
      </div>

      {/* Floating Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 dark:bg-emerald-500/30 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 dark:bg-blue-500/30 rounded-full blur-3xl"
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
          {/* Left - CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-5xl lg:text-6xl font-black leading-tight text-black dark:text-white">
              Let's Create
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 dark:from-emerald-400 dark:via-blue-400 dark:to-purple-400 animate-gradient">
                Something Amazing
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Ready to bring your ideas to life? Let's talk about your next project.
            </p>
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-full font-bold flex items-center gap-2 shadow-2xl shadow-emerald-500/50 hover:shadow-emerald-500/70 transition-all"
              >
                Start a Project
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>

          {/* Right - Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {footer?.columns?.map((column, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="font-black text-lg mb-4 text-black dark:text-white">{column.title}</h3>
                <ul className="space-y-3">
                  {column.links?.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={getHref(link)}
                        className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors inline-flex items-center gap-1 group font-medium"
                      >
                        {link.label}
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-300 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Brand */}
            <div className="flex items-center gap-3">
              {logo && (
                <img src={logo} alt={siteName} className="h-8 w-auto object-contain" />
              )}
              <span className="text-2xl font-black text-black dark:text-white">
                {siteName}
              </span>
            </div>

            {/* Social Links */}
            {footer?.socials && footer.socials.length > 0 && (
              <div className="flex items-center gap-3">
                {footer.socials.map((social, index) => {
                  const Icon = socialIcons[social.icon_name?.toLowerCase() || 'github'] || Github
                  return (
                    <motion.a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit our ${social.icon_name || 'social'} profile`}
                      whileHover={{ scale: 1.1, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative group w-11 h-11 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-800 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-blue-500 hover:border-transparent rounded-full flex items-center justify-center transition-all shadow-lg hover:shadow-emerald-500/50"
                    >
                      <Icon className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-white transition-colors" />
                    </motion.a>
                  )
                })}
              </div>
            )}

            {/* Copyright */}
            <div className="text-gray-500 dark:text-gray-500 text-sm font-medium">
              © {new Date().getFullYear()} {siteName}. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
