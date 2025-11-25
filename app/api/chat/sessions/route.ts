import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('chat_sessions')
      .select('*')
      .order('updated_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error fetching chat sessions:', error)
    return NextResponse.json([], { status: 500 })
  }
}
