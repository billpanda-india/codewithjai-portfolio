import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { data, error } = await supabaseAdmin
      .from('chat_messages')
      .select('*')
      .eq('session_id', params.sessionId)
      .order('created_at', { ascending: true })

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json([], { status: 500 })
  }
}
