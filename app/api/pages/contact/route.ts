import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { revalidatePath } from 'next/cache'

export async function GET() {
  try {
    const { data: pages, error: pageError } = await supabaseAdmin
      .from('contact_page')
      .select('*')
      .limit(1)

    if (pageError) {
      console.error('Page error:', pageError)
      throw pageError
    }

    const page = pages && pages.length > 0 ? pages[0] : null

    if (!page) {
      console.error('No contact page found')
      return NextResponse.json(
        { error: 'Contact page not found' },
        { status: 404 }
      )
    }

    // Fetch contact methods
    const { data: methods, error: methodsError } = await supabaseAdmin
      .from('contact_methods')
      .select('*')
      .eq('page_id', page.id)
      .order('order_index', { ascending: true })

    if (methodsError) {
      console.error('Methods error:', methodsError)
    }

    // Fetch contact features
    const { data: features, error: featuresError } = await supabaseAdmin
      .from('contact_features')
      .select('*')
      .eq('page_id', page.id)
      .order('order_index', { ascending: true })

    if (featuresError) {
      console.error('Features error:', featuresError)
    }

    return NextResponse.json({
      ...page,
      methods: methods || [],
      features: features || [],
    })
  } catch (error: any) {
    console.error('Error fetching contact page:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact page', details: error?.message || 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    const { data: page } = await supabaseAdmin
      .from('contact_page')
      .select('id')
      .single()

    if (!page) {
      return NextResponse.json({ error: 'Contact page not found' }, { status: 404 })
    }

    const updateData: any = { updated_at: new Date().toISOString() }

    if (body.hero_badge !== undefined) updateData.hero_badge = body.hero_badge
    if (body.hero_title !== undefined) updateData.hero_title = body.hero_title
    if (body.hero_title_highlight !== undefined) updateData.hero_title_highlight = body.hero_title_highlight
    if (body.hero_subtitle !== undefined) updateData.hero_subtitle = body.hero_subtitle
    if (body.contact_intro !== undefined) updateData.contact_intro = body.contact_intro
    if (body.stat1_icon !== undefined) updateData.stat1_icon = body.stat1_icon
    if (body.stat1_value !== undefined) updateData.stat1_value = body.stat1_value
    if (body.stat1_label !== undefined) updateData.stat1_label = body.stat1_label
    if (body.stat2_icon !== undefined) updateData.stat2_icon = body.stat2_icon
    if (body.stat2_value !== undefined) updateData.stat2_value = body.stat2_value
    if (body.stat2_label !== undefined) updateData.stat2_label = body.stat2_label
    if (body.stat3_icon !== undefined) updateData.stat3_icon = body.stat3_icon
    if (body.stat3_value !== undefined) updateData.stat3_value = body.stat3_value
    if (body.stat3_label !== undefined) updateData.stat3_label = body.stat3_label

    await supabaseAdmin
      .from('contact_page')
      .update(updateData)
      .eq('id', page.id)

    revalidatePath('/contact')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating contact page:', error)
    return NextResponse.json(
      { error: 'Failed to update contact page' },
      { status: 500 }
    )
  }
}
