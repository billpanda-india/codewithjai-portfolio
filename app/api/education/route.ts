import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { revalidatePath } from 'next/cache'

export async function GET() {
  try {
    const { data: page } = await supabaseAdmin
      .from('pages')
      .select('id')
      .eq('slug', 'about')
      .single()

    if (!page) {
      return NextResponse.json({ error: 'About page not found' }, { status: 404 })
    }

    const { data, error } = await supabaseAdmin
      .from('education_items')
      .select('*')
      .eq('page_id', page.id)
      .order('order_index', { ascending: true })

    if (error) throw error
    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error fetching education:', error)
    return NextResponse.json({ error: 'Failed to fetch education' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { data: page } = await supabaseAdmin
      .from('pages')
      .select('id')
      .eq('slug', 'about')
      .single()

    if (!page) {
      return NextResponse.json({ error: 'About page not found' }, { status: 404 })
    }

    const { data, error } = await supabaseAdmin
      .from('education_items')
      .insert({ ...body, page_id: page.id })
      .select()
      .single()

    if (error) throw error

    revalidatePath('/about')
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating education:', error)
    return NextResponse.json({ error: 'Failed to create education' }, { status: 500 })
  }
}
