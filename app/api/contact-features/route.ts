import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { data: page } = await supabaseAdmin
      .from('contact_page')
      .select('id')
      .single()

    if (!page) {
      return NextResponse.json({ error: 'Contact page not found' }, { status: 404 })
    }

    const { data, error } = await supabaseAdmin
      .from('contact_features')
      .insert({
        page_id: page.id,
        ...body,
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath('/contact')
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating contact feature:', error)
    return NextResponse.json(
      { error: 'Failed to create contact feature' },
      { status: 500 }
    )
  }
}
