import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { revalidatePath } from 'next/cache'

export async function GET() {
  try {
    const { data: page } = await supabaseAdmin
      .from('pages')
      .select('id')
      .eq('slug', 'services')
      .single()

    if (!page) {
      return NextResponse.json({ error: 'Services page not found' }, { status: 404 })
    }

    const { data, error } = await supabaseAdmin
      .from('services')
      .select('*')
      .eq('page_id', page.id)
      .order('order_index', { ascending: true })

    if (error) throw error
    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { data: page } = await supabaseAdmin
      .from('pages')
      .select('id')
      .eq('slug', 'services')
      .single()

    if (!page) {
      return NextResponse.json({ error: 'Services page not found' }, { status: 404 })
    }

    const { data, error } = await supabaseAdmin
      .from('services')
      .insert({ ...body, page_id: page.id })
      .select()
      .single()

    if (error) throw error

    revalidatePath('/services')
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 })
  }
}
