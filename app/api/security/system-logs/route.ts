import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'

export async function GET() {
  try {
    const { data: logs, error } = await supabaseAdmin
      .from('system_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(500)

    if (error) throw error

    return NextResponse.json(logs || [])
  } catch (error) {
    console.error('Error fetching system logs:', error)
    return NextResponse.json([], { status: 500 })
  }
}
