import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const timeFrame = searchParams.get('timeFrame') || '7d'
    
    const now = new Date()
    let startDate: Date
    
    switch (timeFrame) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    }
    
    const sevenDaysAgo = startDate
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    
    // Get page views for selected time frame
    const { data: weeklyViews } = await supabase
      .from('page_views')
      .select('created_at, page_url')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true })
    
    // Get unique visitors
    const { data: visitors } = await supabase
      .from('visitors')
      .select('*')
      .gte('last_visit', startDate.toISOString())
    
    // Get location data
    const { data: locations } = await supabase
      .from('visitors')
      .select('country, city, latitude, longitude')
      .gte('last_visit', thirtyDaysAgo.toISOString())
    
    // Get device breakdown
    const { data: devices } = await supabase
      .from('page_views')
      .select('device_type')
      .gte('created_at', thirtyDaysAgo.toISOString())
    
    // Get browser breakdown
    const { data: browsers } = await supabase
      .from('page_views')
      .select('browser')
      .gte('created_at', thirtyDaysAgo.toISOString())
    
    // Get top pages
    const { data: topPages } = await supabase
      .from('page_views')
      .select('page_url')
      .gte('created_at', sevenDaysAgo.toISOString())
    
    // Get contact submissions count
    const { count: contactCount } = await supabase
      .from('contact_submissions')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startDate.toISOString())
    
    // Process data for charts
    const dailyStats = processDailyViewsData(weeklyViews || [], timeFrame)
    const locationStats = processLocationData(locations || [])
    const deviceStats = processDeviceData(devices || [])
    const browserStats = processBrowserData(browsers || [])
    const pageStats = processPageData(topPages || [])
    
    // Calculate metrics
    const totalVisitors = visitors?.length || 0
    const totalPageViews = weeklyViews?.length || 0
    const avgPagesPerVisitor = totalVisitors > 0 ? (totalPageViews / totalVisitors).toFixed(1) : '0'
    
    // Get live visitors (last 5 minutes)
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)
    const { data: liveVisitors } = await supabase
      .from('visitors')
      .select('*')
      .gte('last_visit', fiveMinutesAgo.toISOString())
    
    return NextResponse.json({
      totalVisitors,
      totalPageViews,
      avgPagesPerVisitor,
      liveVisitors: liveVisitors?.length || 0,
      contactSubmissions: contactCount || 0,
      dailyStats,
      locationStats,
      deviceStats,
      browserStats,
      pageStats,
      recentVisitors: visitors?.slice(0, 10) || []
    })
  } catch (error) {
    console.error('Analytics stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}

function processDailyViewsData(views: any[], timeFrame?: string) {
  if (timeFrame === '24h') {
    // 24 bars - one for each hour
    const hourlyData: any = {}
    views.forEach(view => {
      const date = new Date(view.created_at)
      const hour = date.getHours()
      hourlyData[hour] = (hourlyData[hour] || 0) + 1
    })
    return Array.from({ length: 24 }, (_, i) => ({
      name: i.toString(),
      views: hourlyData[i] || 0
    }))
  } else if (timeFrame === '30d') {
    // 30 bars - one for each day, labeled with actual day of month
    const now = new Date()
    const dailyData: any = {}
    
    views.forEach(view => {
      const date = new Date(view.created_at)
      const dayKey = date.toISOString().split('T')[0]
      dailyData[dayKey] = (dailyData[dayKey] || 0) + 1
    })
    
    // Generate last 30 days with actual day numbers
    return Array.from({ length: 30 }, (_, i) => {
      const date = new Date(now)
      date.setDate(date.getDate() - (29 - i))
      const dayKey = date.toISOString().split('T')[0]
      const dayOfMonth = date.getDate()
      return {
        name: dayOfMonth.toString(),
        views: dailyData[dayKey] || 0
      }
    })
  } else if (timeFrame === '1y') {
    // 12 bars - one for each month
    const monthData: any = {}
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    views.forEach(view => {
      const date = new Date(view.created_at)
      const monthName = months[date.getMonth()]
      monthData[monthName] = (monthData[monthName] || 0) + 1
    })
    
    return months.map(month => ({
      name: month,
      views: monthData[month] || 0
    }))
  } else {
    // 7 bars - one for each day of the week
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const dailyData: any = {}
    
    views.forEach(view => {
      const date = new Date(view.created_at)
      const dayName = days[date.getDay()]
      dailyData[dayName] = (dailyData[dayName] || 0) + 1
    })
    
    return days.map(day => ({
      name: day,
      views: dailyData[day] || 0
    }))
  }
}

function processLocationData(locations: any[]) {
  const countryCount: any = {}
  locations.forEach(loc => {
    countryCount[loc.country] = (countryCount[loc.country] || 0) + 1
  })
  
  return Object.entries(countryCount)
    .map(([country, count]) => ({ country, count }))
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 10)
}

function processDeviceData(devices: any[]) {
  const deviceCount: any = {}
  devices.forEach(d => {
    deviceCount[d.device_type] = (deviceCount[d.device_type] || 0) + 1
  })
  
  return Object.entries(deviceCount).map(([name, value]) => ({ name, value }))
}

function processBrowserData(browsers: any[]) {
  const browserCount: any = {}
  browsers.forEach(b => {
    browserCount[b.browser] = (browserCount[b.browser] || 0) + 1
  })
  
  return Object.entries(browserCount).map(([name, value]) => ({ name, value }))
}

function processPageData(pages: any[]) {
  const pageCount: any = {}
  pages.forEach(p => {
    pageCount[p.page_url] = (pageCount[p.page_url] || 0) + 1
  })
  
  return Object.entries(pageCount)
    .map(([url, count]) => ({ url, count }))
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 5)
}
