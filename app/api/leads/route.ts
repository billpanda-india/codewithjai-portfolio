import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    console.log('Fetching leads from database...')
    
    const { data: leads, error } = await supabaseAdmin
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      throw error
    }

    console.log(`Found ${leads?.length || 0} leads`)
    
    return NextResponse.json(leads || [], {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      }
    })
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json([], { status: 500 })
  }
}
