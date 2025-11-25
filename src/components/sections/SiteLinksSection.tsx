import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface SiteLink {
  id: string
  title: string
  description: string
  url: string
  icon?: string
}

interface SiteLinksProps {
  links: SiteLink[]
  title?: string
  subtitle?: string
}

export default function SiteLinksSection({ links, title, subtitle }: SiteLinksProps) {
  if (!links || links.length === 0) return null

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {links.map((link) => (
            <Link
              key={link.id}
              href={link.url}
              className="group relative p-6 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {link.title}
                  </h3>
                  {link.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                      {link.description}
                    </p>
                  )}
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
