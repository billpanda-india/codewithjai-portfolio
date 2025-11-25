'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  Settings,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Home,
  Briefcase,
  User,
  Wrench,
  Mail,
  MessageCircle,
  Search,
  Share2,
  Shield,
  Ban
} from 'lucide-react'

const sitePages = [
  { title: 'Home', href: '/admin/pages/home', icon: Home },
  { title: 'Projects', href: '/admin/pages/projects', icon: Briefcase },
  { title: 'About', href: '/admin/pages/about', icon: User },
  { title: 'Services', href: '/admin/pages/services', icon: Wrench },
  { title: 'Contact', href: '/admin/pages/contact', icon: Mail },
]

const mainMenuItems = [
  { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
]

const securityMenuItems = [
  { title: 'Security Logs', href: '/admin/security/logs', icon: Shield },
  { title: 'System Logs', href: '/admin/security/system-logs', icon: FileText },
  { title: 'IP Blocking', href: '/admin/security/ip-blocking', icon: Ban },
  { title: 'Firewall Rules', href: '/admin/security/firewall', icon: Shield },
]

interface AdminSidebarProps {
  isCollapsed: boolean
}

export default function AdminSidebar({ isCollapsed }: AdminSidebarProps) {
  const pathname = usePathname()
  const [isPagesOpen, setIsPagesOpen] = useState(true)
  const [isSecurityOpen, setIsSecurityOpen] = useState(false)
  const [logo, setLogo] = useState<string | null>(null)
  const [siteName, setSiteName] = useState('CodeWithJai')

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings')
        if (res.ok) {
          const data = await res.json()
          setLogo(data.logo)
          setSiteName(data.website_name || data.title || 'CodeWithJai')
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
      }
    }
    fetchSettings()
  }, [])

  return (
    <aside
      style={{ width: isCollapsed ? '80px' : '256px' }}
      className="bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden transition-all duration-200"
    >
      {/* Logo */}
      <div className={`h-16 px-4 border-b border-gray-200 dark:border-gray-800 flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
        <Link href="/admin/dashboard" className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          {logo ? (
            <img src={logo} alt={siteName} className="h-9 w-auto object-contain flex-shrink-0" />
          ) : (
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          )}
          {!isCollapsed && (
            <div>
              <h2 className="text-base font-bold text-black dark:text-white">{siteName}</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
            </div>
          )}
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {/* Main Menu Items */}
        {mainMenuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link key={item.href} href={item.href} title={isCollapsed ? item.title : undefined}>
              <div
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors
                  ${isCollapsed ? 'justify-center' : ''}
                  ${isActive 
                    ? 'bg-emerald-500 text-white' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.title}</span>}
              </div>
            </Link>
          )
        })}

        {/* Site Pages Dropdown */}
        <div className="pt-1">
          {!isCollapsed ? (
            <>
              <button
                onClick={() => setIsPagesOpen(!isPagesOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 flex-shrink-0" />
                  <span>Site Pages</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${isPagesOpen ? 'rotate-180' : ''}`} />
              </button>

              {isPagesOpen && (
                <div className="pl-3 mt-1 space-y-1">
                  {sitePages.map((page) => {
                    const Icon = page.icon
                    const isActive = pathname === page.href
                    
                    return (
                      <Link key={page.href} href={page.href}>
                        <div
                          className={`
                            flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors
                            ${isActive 
                              ? 'bg-emerald-500 text-white' 
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }
                          `}
                        >
                          <Icon className="w-4 h-4 flex-shrink-0" />
                          <span>{page.title}</span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </>
          ) : (
            <div
              title="Site Pages"
              className="flex items-center justify-center px-3 py-2.5 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <FileText className="w-5 h-5 flex-shrink-0" />
            </div>
          )}
        </div>

        {/* SEO */}
        <Link href="/admin/seo" title={isCollapsed ? 'SEO' : undefined}>
          <div
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors
              ${isCollapsed ? 'justify-center' : ''}
              ${pathname === '/admin/seo'
                ? 'bg-emerald-500 text-white' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }
            `}
          >
            <Search className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span>SEO</span>}
          </div>
        </Link>

        {/* Social Preview */}
        <Link href="/admin/social-preview" title={isCollapsed ? 'Social Preview' : undefined}>
          <div
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors
              ${isCollapsed ? 'justify-center' : ''}
              ${pathname === '/admin/social-preview'
                ? 'bg-emerald-500 text-white' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }
            `}
          >
            <Share2 className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span>Social Preview</span>}
          </div>
        </Link>

        {/* Site Settings */}
        <Link href="/admin/settings" title={isCollapsed ? 'Site Settings' : undefined}>
          <div
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors
              ${isCollapsed ? 'justify-center' : ''}
              ${pathname === '/admin/settings'
                ? 'bg-emerald-500 text-white' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }
            `}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span>Site Settings</span>}
          </div>
        </Link>

        {/* Leads */}
        <Link href="/admin/leads" title={isCollapsed ? 'Leads' : undefined}>
          <div
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors
              ${isCollapsed ? 'justify-center' : ''}
              ${pathname === '/admin/leads'
                ? 'bg-emerald-500 text-white' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }
            `}
          >
            <Mail className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span>Leads</span>}
          </div>
        </Link>

        {/* Live Chat */}
        <Link href="/admin/live-chat" title={isCollapsed ? 'Live Chat' : undefined}>
          <div
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors
              ${isCollapsed ? 'justify-center' : ''}
              ${pathname === '/admin/live-chat'
                ? 'bg-emerald-500 text-white' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }
            `}
          >
            <MessageCircle className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span>Live Chat</span>}
          </div>
        </Link>

        {/* Security & Logs Dropdown */}
        <div>
          <button
            onClick={() => !isCollapsed && setIsSecurityOpen(!isSecurityOpen)}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors
              ${isCollapsed ? 'justify-center' : 'justify-between'}
              ${pathname.startsWith('/admin/security')
                ? 'bg-emerald-500 text-white' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }
            `}
            title={isCollapsed ? 'Security & Logs' : undefined}
          >
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>Security & Logs</span>}
            </div>
            {!isCollapsed && (
              isSecurityOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
            )}
          </button>

          {!isCollapsed && isSecurityOpen && (
            <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 dark:border-gray-800 pl-2">
              {securityMenuItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                      ${pathname === item.href
                        ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }
                    `}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.title}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-3 border-t border-gray-200 dark:border-gray-800">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              💡 Quick Tip
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              All changes save automatically
            </p>
          </div>
        </div>
      )}
    </aside>
  )
}
