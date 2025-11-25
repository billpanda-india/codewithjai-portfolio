import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { revalidatePath } from 'next/cache'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('skills')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching skills:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in GET /api/skills:', error)
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, logo, category } = body

    const { data, error } = await supabaseAdmin
      .from('skills')
      .insert({ name, logo, category })
      .select()
      .single()

    if (error) {
      console.error('Error creating skill:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    revalidatePath('/')

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error in POST /api/skills:', error)
    return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 })
  }
}
