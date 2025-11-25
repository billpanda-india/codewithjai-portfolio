'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Navigation } from '@/types/database'
import ThemeToggle from './ThemeToggle'

interface NavbarProps {
  navigation: Navigation | null
  siteName: string
  logo?: string | null
}

export default function Navbar({ navigation, siteName, logo }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const getHref = (item: any) => {
    if (item.target_type === 'internal' && item.internal_page?.slug) {
      return `/${item.internal_page.slug === 'home' ? '' : item.internal_page.slug}`
    }
    return item.external_url || '#'
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-black/90 backdrop-blur-xl shadow-lg border-b border-gray-200 dark:border-gray-800'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="relative group flex items-center gap-3">
            {logo && (
              <img src={logo} alt={siteName} className="h-10 w-auto object-contain" />
            )}
            <span className="text-2xl font-black text-black dark:text-white transition-colors">
              {siteName}
            </span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 group-hover:w-full transition-all duration-300" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {navigation?.items?.map((item, index) => (
              <Link
                key={index}
                href={getHref(item)}
                className="relative px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-semibold transition-colors group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
            <div className="ml-4 pl-4 border-l border-gray-300 dark:border-gray-700">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden bg-white dark:bg-gray-900 rounded-2xl mb-4 shadow-2xl border border-gray-200 dark:border-gray-800"
            >
              <div className="py-4 space-y-1 px-4">
                {navigation?.items?.map((item, index) => (
                  <Link
                    key={index}
                    href={getHref(item)}
                    className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl font-semibold transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}
