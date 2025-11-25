import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { revalidatePath } from 'next/cache'

export async function GET() {
  try {
    const { data: page, error: pageError } = await supabaseAdmin
      .from('pages')
      .select('*')
      .eq('slug', 'about')
      .single()

    if (pageError) throw pageError

    // Fetch about me section
    const { data: aboutMe } = await supabaseAdmin
      .from('about_me_section')
      .select('*')
      .eq('page_id', page.id)
      .single()

    // Fetch experience items
    const { data: experience } = await supabaseAdmin
      .from('experience_items')
      .select('*')
      .eq('page_id', page.id)
      .order('order_index', { ascending: true })

    // Fetch education items
    const { data: education } = await supabaseAdmin
      .from('education_items')
      .select('*')
      .eq('page_id', page.id)
      .order('order_index', { ascending: true })

    // Fetch certifications
    const { data: certifications } = await supabaseAdmin
      .from('certifications')
      .select('*')
      .eq('page_id', page.id)
      .order('order_index', { ascending: true })

    return NextResponse.json({
      ...page,
      about_me: aboutMe,
      experience: experience || [],
      education: education || [],
      certifications: certifications || [],
    })
  } catch (error) {
    console.error('Error fetching about page:', error)
    return NextResponse.json(
      { error: 'Failed to fetch about page' },
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
      .eq('slug', 'about')
      .single()

    if (!page) {
      return NextResponse.json({ error: 'About page not found' }, { status: 404 })
    }

    const updateData: any = { updated_at: new Date().toISOString() }

    // Hero section updates
    if (body.hero_title !== undefined) updateData.hero_title = body.hero_title
    if (body.hero_title_highlight !== undefined) updateData.hero_title_highlight = body.hero_title_highlight
    if (body.hero_subtitle !== undefined) updateData.hero_subtitle = body.hero_subtitle
    if (body.hero_background_image !== undefined) updateData.hero_background_image = body.hero_background_image

    // Update page
    await supabaseAdmin
      .from('pages')
      .update(updateData)
      .eq('slug', 'about')

    // Update about me section
    if (body.about_me) {
      const { data: existing } = await supabaseAdmin
        .from('about_me_section')
        .select('id')
        .eq('page_id', page.id)
        .single()

      if (existing) {
        await supabaseAdmin
          .from('about_me_section')
          .update({ ...body.about_me, updated_at: new Date().toISOString() })
          .eq('id', existing.id)
      } else {
        await supabaseAdmin
          .from('about_me_section')
          .insert({ ...body.about_me, page_id: page.id })
      }
    }

    revalidatePath('/about')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating about page:', error)
    return NextResponse.json(
      { error: 'Failed to update about page' },
      { status: 500 }
    )
  }
}
