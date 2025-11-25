import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'

export async function POST() {
  try {
    // Close sessions inactive for more than 30 minutes
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString()

    const { error } = await supabaseAdmin
      .from('chat_sessions')
      .update({ status: 'closed' })
      .eq('status', 'active')
      .lt('updated_at', thirtyMinutesAgo)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error cleaning up chats:', error)
    return NextResponse.json({ error: 'Failed to cleanup' }, { status: 500 })
  }
}
