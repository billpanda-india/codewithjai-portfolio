import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Get IP from request
function getIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0] || 
         request.headers.get('x-real-ip') || 
         'unknown'
}

// Get location from IP (using ipapi.co free API)
async function getLocationFromIP(ip: string) {
  if (ip === 'unknown' || ip === '127.0.0.1' || ip.startsWith('192.168')) {
    return { country: 'Local', city: 'Development', latitude: 0, longitude: 0 }
  }
  
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`)
    const data = await response.json()
    return {
      country: data.country_name || 'Unknown',
      city: data.city || 'Unknown',
      latitude: data.latitude || 0,
      longitude: data.longitude || 0
    }
  } catch (error) {
    return { country: 'Unknown', city: 'Unknown', latitude: 0, longitude: 0 }
  }
}

// Parse user agent
function parseUserAgent(ua: string) {
  const isMobile = /Mobile|Android|iPhone|iPad/i.test(ua)
  const isTablet = /Tablet|iPad/i.test(ua)
  
  let browser = 'Unknown'
  if (ua.includes('Chrome')) browser = 'Chrome'
  else if (ua.includes('Safari')) browser = 'Safari'
  else if (ua.includes('Firefox')) browser = 'Firefox'
  else if (ua.includes('Edge')) browser = 'Edge'
  
  let os = 'Unknown'
  if (ua.includes('Windows')) os = 'Windows'
  else if (ua.includes('Mac')) os = 'macOS'
  else if (ua.includes('Linux')) os = 'Linux'
  else if (ua.includes('Android')) os = 'Android'
  else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS'
  
  return {
    deviceType: isTablet ? 'Tablet' : isMobile ? 'Mobile' : 'Desktop',
    browser,
    os
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pageUrl, referrer, sessionId } = body
    
    const ip = getIP(request)
    const userAgent = request.headers.get('user-agent') || ''
    const { deviceType, browser, os } = parseUserAgent(userAgent)
    const location = await getLocationFromIP(ip)
    
    // Track page view
    const { error: pageViewError } = await supabase
      .from('page_views')
      .insert({
        page_url: pageUrl,
        referrer: referrer || null,
        user_agent: userAgent,
        ip_address: ip,
        country: location.country,
        city: location.city,
        device_type: deviceType,
        browser,
        os
      })
    
    if (pageViewError) {
      console.error('Page view error:', pageViewError)
    }
    
    // Update or create visitor
    const { data: existingVisitor } = await supabase
      .from('visitors')
      .select('*')
      .eq('session_id', sessionId)
      .single()
    
    if (existingVisitor) {
      await supabase
        .from('visitors')
        .update({
          last_visit: new Date().toISOString(),
          total_visits: existingVisitor.total_visits + 1
        })
        .eq('session_id', sessionId)
    } else {
      await supabase
        .from('visitors')
        .insert({
          session_id: sessionId,
          ip_address: ip,
          country: location.country,
          city: location.city,
          latitude: location.latitude,
          longitude: location.longitude,
          device_type: deviceType,
          browser,
          os
        })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics tracking error:', error)
    return NextResponse.json({ error: 'Failed to track' }, { status: 500 })
  }
}
