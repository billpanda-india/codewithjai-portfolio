import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('site_links')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true })

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error fetching site links:', error)
    return NextResponse.json(
      { error: 'Failed to fetch site links' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { data, error } = await supabase
      .from('site_links')
      .insert({
        title: body.title,
        description: body.description,
        url: body.url,
        icon: body.icon,
        order_index: body.order_index || 0,
        is_active: body.is_active !== false
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating site link:', error)
    return NextResponse.json(
      { error: 'Failed to create site link' },
      { status: 500 }
    )
  }
}
