import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { revalidatePath } from 'next/cache'

export async function GET() {
  try {
    const { data: page, error: pageError } = await supabaseAdmin
      .from('pages')
      .select('*')
      .eq('slug', 'services')
      .single()

    if (pageError) throw pageError

    // Fetch services
    const { data: services } = await supabaseAdmin
      .from('services')
      .select('*')
      .eq('page_id', page.id)
      .order('order_index', { ascending: true })

    // Fetch benefits
    const { data: benefits } = await supabaseAdmin
      .from('service_benefits')
      .select('*')
      .eq('page_id', page.id)
      .order('order_index', { ascending: true })

    return NextResponse.json({
      ...page,
      services: services || [],
      benefits: benefits || [],
    })
  } catch (error) {
    console.error('Error fetching services page:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services page' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
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

    const updateData: any = { updated_at: new Date().toISOString() }

    // Hero section updates
    if (body.hero_badge !== undefined) updateData.hero_badge = body.hero_badge
    if (body.hero_title !== undefined) updateData.hero_title = body.hero_title
    if (body.hero_title_highlight !== undefined) updateData.hero_title_highlight = body.hero_title_highlight
    if (body.hero_subtitle !== undefined) updateData.hero_subtitle = body.hero_subtitle
    if (body.hero_background_image !== undefined) updateData.hero_background_image = body.hero_background_image

    // Update page
    await supabaseAdmin
      .from('pages')
      .update(updateData)
      .eq('slug', 'services')

    revalidatePath('/services')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating services page:', error)
    return NextResponse.json(
      { error: 'Failed to update services page' },
      { status: 500 }
    )
  }
}
