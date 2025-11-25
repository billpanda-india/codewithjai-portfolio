import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabaseAdmin
      .from('contact_submissions')
      .update({ 
        status: 'read',
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error marking as read:', error)
    return NextResponse.json({ error: 'Failed to mark as read' }, { status: 500 })
  }
}
