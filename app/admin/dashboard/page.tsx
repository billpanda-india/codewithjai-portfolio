'use client'

import { useEffect, useState } from 'react'
import { Globe, ExternalLink, TrendingUp, Users, Eye, MessageSquare, Activity, BarChart3, Sparkles, Monitor, Smartphone, Tablet, Chrome, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface Stats {
  totalViews: number
  totalProjects: number
  totalMessages: number
  activePages: number
  liveVisitors: number
  avgPagesPerVisitor: string
}

interface ChartData {
  views: { date: string; count: number }[]
  projects: { name: string; views: number; color: string }[]
  topPages: { url: string; count: number }[]
  devices: { name: string; value: number; color: string }[]
  browsers: { name: string; value: number }[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalViews: 0,
    totalProjects: 0,
    totalMessages: 0,
    activePages: 0,
    liveVisitors: 0,
    avgPagesPerVisitor: '0'
  })

  const [chartData, setChartData] = useState<ChartData>({
    views: [],
    projects: [],
    topPages: [],
    devices: [],
    browsers: []
  })

  const [loading, setLoading] = useState(true)
  const [animateStats, setAnimateStats] = useState(false)
  const [timeFrame, setTimeFrame] = useState<'24h' | '7d' | '30d' | '1y'>('7d')

  useEffect(() => {
    const fetchRealData = async () => {
      try {
        // Fetch real analytics data with time frame
        const [analyticsRes, projectsRes] = await Promise.all([
          fetch(`/api/analytics/stats?timeFrame=${timeFrame}`),
          fetch('/api/projects')
        ])
        
        const data = await analyticsRes.json()
        const allProjects = await projectsRes.json()
        
        setStats({
          totalViews: data.totalPageViews || 0,
          totalProjects: allProjects?.length || 0,
          totalMessages: data.contactSubmissions || 0,
          activePages: data.pageStats?.length || 0,
          liveVisitors: data.liveVisitors || 0,
          avgPagesPerVisitor: data.avgPagesPerVisitor || '0'
        })

        // Process views data
        const viewsData = data.dailyStats?.map((day: any) => ({
          date: day.name,
          count: day.views
        })) || []

        // Process projects data with colors
        const projectColors = [
          'from-purple-500 to-pink-500',
          'from-blue-500 to-cyan-500',
          'from-emerald-500 to-teal-500',
          'from-orange-500 to-red-500',
          'from-violet-500 to-purple-500'
        ]

        const projectsData = data.pageStats?.slice(0, 5).map((page: any, index: number) => ({
          name: page.url.replace('/', '') || 'Home',
          views: page.count,
          color: projectColors[index % projectColors.length]
        })) || []

        // Process device data
        const devicesData = data.deviceStats?.map((device: any) => ({
          name: device.name,
          value: device.value,
          color: device.name === 'Desktop' ? 'from-blue-500 to-blue-600' : 
                 device.name === 'Mobile' ? 'from-purple-500 to-purple-600' : 
                 'from-pink-500 to-pink-600'
        })) || []

        setChartData({
          views: viewsData,
          projects: projectsData,
          topPages: data.pageStats?.slice(0, 5) || [],
          devices: devicesData,
          browsers: data.browserStats?.slice(0, 5) || []
        })
        
        setLoading(false)
        setAnimateStats(true)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
        setLoading(false)
      }
    }

    fetchRealData()
    
    // Auto-refresh every 10 seconds for real-time updates
    const interval = setInterval(fetchRealData, 10000)
    return () => clearInterval(interval)
  }, [timeFrame])

  const StatCard = ({ icon: Icon, label, value, gradient, pulse }: any) => (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors flex-1">
      {loading ? (
        <div className="flex items-center justify-between h-[60px]">
          <div className="flex-1 space-y-2">
            <div className="h-3 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
            <div className="h-8 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
          </div>
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-gray-600 dark:text-gray-400 text-xs font-semibold uppercase">
                {label}
              </p>
              {pulse && (
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              )}
            </div>
            <p className="text-3xl font-black text-black dark:text-white">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
          </div>
          <div className={`p-3 bg-gradient-to-br ${gradient} rounded-lg`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
      )}
    </div>
  )

  const maxViews = Math.max(...chartData.views.map(d => d.count), 1)
  const maxProjectViews = Math.max(...chartData.projects.map(p => p.views), 1)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-black dark:text-white">Dashboard</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Analytics & insights</p>
          </div>
        </div>
        <Link 
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
        >
          <Globe className="w-4 h-4" />
          <span className="text-sm">View Site</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            icon={Eye} 
            label="Total Views" 
            value={stats.totalViews}
            gradient="from-blue-500 to-blue-600"
          />
          <StatCard 
            icon={BarChart3} 
            label="Projects" 
            value={stats.totalProjects}
            gradient="from-purple-500 to-purple-600"
          />
          <StatCard 
            icon={MessageSquare} 
            label="Messages" 
            value={stats.totalMessages}
            gradient="from-emerald-500 to-emerald-600"
          />
          <StatCard 
            icon={Users} 
            label="Live Now" 
            value={stats.liveVisitors}
            gradient="from-orange-500 to-orange-600"
            pulse={true}
          />
        </div>

        {/* Time Frame Selector */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Time Frame:</span>
          <select
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value as any)}
            className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-medium text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="1y">Last Year</option>
          </select>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Weekly Views Chart */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 h-[280px] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-black dark:text-white">Weekly Views</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">Daily metrics</p>
            </div>
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
          </div>
          {loading ? (
            <div className="flex items-end justify-between gap-2 flex-1">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full h-24 bg-gray-200 dark:bg-gray-800 rounded-t animate-pulse"></div>
                  <div className="h-2 w-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-end justify-between gap-2 flex-1">
              {chartData.views.map((item) => {
                const barHeight = item.count > 0 ? Math.max((item.count / maxViews) * 140, 10) : 0
                return (
                  <div key={item.date} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="relative w-full flex-1 flex flex-col justify-end">
                      {item.count > 0 ? (
                        <div 
                          className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t hover:from-blue-600 hover:to-blue-500 cursor-pointer transition-colors flex items-start justify-center pt-1"
                          style={{ height: `${barHeight}px`, minHeight: '10px' }}
                          title={`${item.count} views`}
                        >
                          <span className="text-white font-bold text-[9px] opacity-0 group-hover:opacity-100 transition-opacity">
                            {item.count}
                          </span>
                        </div>
                      ) : (
                        <div className="w-full h-1 bg-gray-300 dark:bg-gray-700 rounded"></div>
                      )}
                    </div>
                    <span className="text-[9px] font-semibold text-gray-600 dark:text-gray-400">{item.date}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Top Pages Chart */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 h-[280px] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-black dark:text-white">Top Pages</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">Most visited</p>
            </div>
            <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
          </div>
          {loading ? (
            <div className="space-y-3 flex-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="h-3 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                    <div className="h-5 w-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3 flex-1 overflow-y-auto">
              {chartData.topPages.map((page, index) => (
                <div key={page.url} className="group">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
                      {page.url || '/'}
                    </span>
                    <span className="text-sm font-bold text-black dark:text-white">
                      {page.count.toLocaleString()}
                    </span>
                  </div>
                  <div className="relative h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className={`absolute inset-y-0 left-0 bg-gradient-to-r ${chartData.projects[index]?.color || 'from-purple-500 to-purple-600'} rounded-full transition-all`}
                      style={{ width: `${(page.count / chartData.topPages[0].count) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Device Distribution */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 h-[280px] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-black dark:text-white">Device Stats</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">By device type</p>
            </div>
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg">
              <Monitor className="w-4 h-4 text-white" />
            </div>
          </div>
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="w-12 h-12 animate-spin text-emerald-500" />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <div className="flex justify-center gap-6">
                {chartData.devices.map((device) => {
                  const Icon = device.name === 'Desktop' ? Monitor : device.name === 'Mobile' ? Smartphone : Tablet
                  return (
                    <div key={device.name} className="flex flex-col items-center gap-2">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${device.color}`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">{device.name}</span>
                      <span className="text-lg font-black text-black dark:text-white">{device.value}%</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Browser Stats */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 h-[280px] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-black dark:text-white">Browser Stats</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">By browser</p>
            </div>
            <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
              <Chrome className="w-4 h-4 text-white" />
            </div>
          </div>
          {loading ? (
            <div className="space-y-3 flex-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="h-3 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                    <div className="h-4 w-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3 flex-1 overflow-y-auto">
              {chartData.browsers.map((browser) => {
                const maxBrowserValue = Math.max(...chartData.browsers.map(b => b.value), 1)
                return (
                  <div key={browser.name}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Chrome className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                          {browser.name}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-black dark:text-white">
                        {browser.value}
                      </span>
                    </div>
                    <div className="relative h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all"
                        style={{ width: `${(browser.value / maxBrowserValue) * 100}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-lg font-bold text-black dark:text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-500" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Projects', href: '/admin/pages/projects', icon: BarChart3, color: 'from-blue-500 to-blue-600' },
            { label: 'Messages', href: '/admin/contact', icon: MessageSquare, color: 'from-purple-500 to-purple-600' },
            { label: 'Pages', href: '/admin/pages', icon: Globe, color: 'from-emerald-500 to-emerald-600' },
            { label: 'Settings', href: '/admin/settings', icon: Activity, color: 'from-orange-500 to-orange-600' }
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="group p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors"
            >
              <div className={`p-2 bg-gradient-to-br ${action.color} rounded-lg mb-2 w-fit`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-semibold text-black dark:text-white">{action.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
