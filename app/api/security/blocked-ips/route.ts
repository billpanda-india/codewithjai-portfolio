import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'

export async function GET() {
  try {
    const { data: blockedIPs, error } = await supabaseAdmin
      .from('blocked_ips')
      .select('*')
      .order('blocked_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(blockedIPs || [])
  } catch (error) {
    console.error('Error fetching blocked IPs:', error)
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { ip_address, reason, is_permanent, duration_hours } = body

    let expires_at = null
    if (!is_permanent && duration_hours) {
      const expiryDate = new Date()
      expiryDate.setHours(expiryDate.getHours() + duration_hours)
      expires_at = expiryDate.toISOString()
    }

    const { data, error } = await supabaseAdmin
      .from('blocked_ips')
      .insert({
        ip_address,
        reason,
        is_permanent,
        expires_at,
        blocked_by: 'admin',
        blocked_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error blocking IP:', error)
    return NextResponse.json({ error: 'Failed to block IP' }, { status: 500 })
  }
}
