import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    // Get recent visitor IPs from page_views table (last 24 hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    
    const { data: visitors, error } = await supabaseAdmin
      .from('page_views')
      .select('ip_address, country, city, device_type, browser, os, created_at')
      .gte('created_at', twentyFourHoursAgo)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching visitors:', error)
      throw error
    }

    // Get blocked IPs
    const { data: blockedIPs, error: blockedError } = await supabaseAdmin
      .from('blocked_ips')
      .select('ip_address')

    if (blockedError) {
      console.error('Error fetching blocked IPs:', blockedError)
    }

    const blockedIPSet = new Set(blockedIPs?.map(b => b.ip_address) || [])

    // Group by IP address and aggregate data
    const ipMap = new Map<string, any>()

    visitors?.forEach((visit) => {
      if (!visit.ip_address) return
      
      // Normalize localhost IPs for display
      let displayIP = visit.ip_address
      let isLocalhost = false
      if (visit.ip_address === '::1' || visit.ip_address === '127.0.0.1' || visit.ip_address === 'unknown') {
        displayIP = visit.ip_address
        isLocalhost = true
      }

      const key = visit.ip_address

      if (ipMap.has(key)) {
        const existing = ipMap.get(key)
        existing.total_visits++
        // Update with most recent data
        if (new Date(visit.created_at) > new Date(existing.last_visit)) {
          existing.last_visit = visit.created_at
          existing.country = visit.country || existing.country
          existing.city = visit.city || existing.city
          existing.device_type = visit.device_type || existing.device_type
          existing.browser = visit.browser || existing.browser
          existing.os = visit.os || existing.os
        }
      } else {
        ipMap.set(key, {
          ip_address: displayIP,
          actual_ip: visit.ip_address,
          country: isLocalhost ? 'Localhost' : (visit.country || 'Unknown'),
          city: isLocalhost ? 'Development' : (visit.city || 'Unknown'),
          device_type: visit.device_type || 'Unknown',
          browser: visit.browser || 'Unknown',
          os: visit.os || 'Unknown',
          last_visit: visit.created_at,
          total_visits: 1,
          is_blocked: blockedIPSet.has(visit.ip_address),
          is_localhost: isLocalhost
        })
      }
    })

    // Convert map to array and sort by last visit
    const uniqueVisitors = Array.from(ipMap.values())
      .sort((a, b) => new Date(b.last_visit).getTime() - new Date(a.last_visit).getTime())
      .slice(0, 200) // Limit to last 200 unique IPs

    console.log(`Found ${uniqueVisitors.length} unique visitors in last 24 hours`)

    return NextResponse.json(uniqueVisitors)
  } catch (error) {
    console.error('Error fetching visitor IPs:', error)
    return NextResponse.json([], { status: 500 })
  }
}
