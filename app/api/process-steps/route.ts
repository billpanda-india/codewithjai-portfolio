import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { revalidatePath } from 'next/cache'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('process_steps')
      .select('*')
      .order('order_index', { ascending: true })

    if (error) {
      console.error('Error fetching process steps:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in GET /api/process-steps:', error)
    return NextResponse.json(
      { error: 'Failed to fetch process steps' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, icon, color, order_index } = body

    const { data, error } = await supabaseAdmin
      .from('process_steps')
      .insert({
        title,
        description,
        icon,
        color,
        order_index,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating process step:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    revalidatePath('/')

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error in POST /api/process-steps:', error)
    return NextResponse.json(
      { error: 'Failed to create process step' },
      { status: 500 }
    )
  }
}
