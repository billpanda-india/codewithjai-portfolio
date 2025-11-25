import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { revalidatePath } from 'next/cache'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('pages')
      .select('*')
      .eq('slug', 'home')
      .single()

    if (error) {
      console.error('Error fetching home page:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in GET /api/pages/home:', error)
    return NextResponse.json(
      { error: 'Failed to fetch home page' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    // Only update fields that are provided
    if (body.hero_title !== undefined) updateData.hero_title = body.hero_title
    if (body.hero_title_highlight !== undefined) updateData.hero_title_highlight = body.hero_title_highlight
    if (body.hero_subtitle !== undefined) updateData.hero_subtitle = body.hero_subtitle
    if (body.hero_cta_label !== undefined) updateData.hero_cta_label = body.hero_cta_label
    if (body.hero_cta_url !== undefined) updateData.hero_cta_url = body.hero_cta_url
    if (body.hero_background_image !== undefined) updateData.hero_background_image = body.hero_background_image
    if (body.process_steps !== undefined) updateData.process_steps = body.process_steps
    
    // CTA fields
    if (body.cta_badge_text !== undefined) updateData.cta_badge_text = body.cta_badge_text
    if (body.cta_title !== undefined) updateData.cta_title = body.cta_title
    if (body.cta_title_highlight !== undefined) updateData.cta_title_highlight = body.cta_title_highlight
    if (body.cta_description !== undefined) updateData.cta_description = body.cta_description
    if (body.cta_primary_button_text !== undefined) updateData.cta_primary_button_text = body.cta_primary_button_text
    if (body.cta_primary_button_url !== undefined) updateData.cta_primary_button_url = body.cta_primary_button_url
    if (body.cta_secondary_button_text !== undefined) updateData.cta_secondary_button_text = body.cta_secondary_button_text
    if (body.cta_secondary_button_url !== undefined) updateData.cta_secondary_button_url = body.cta_secondary_button_url
    if (body.cta_stat1_number !== undefined) updateData.cta_stat1_number = body.cta_stat1_number
    if (body.cta_stat1_label !== undefined) updateData.cta_stat1_label = body.cta_stat1_label
    if (body.cta_stat2_number !== undefined) updateData.cta_stat2_number = body.cta_stat2_number
    if (body.cta_stat2_label !== undefined) updateData.cta_stat2_label = body.cta_stat2_label
    if (body.cta_stat3_number !== undefined) updateData.cta_stat3_number = body.cta_stat3_number
    if (body.cta_stat3_label !== undefined) updateData.cta_stat3_label = body.cta_stat3_label

    // Update the home page in the database
    const { data, error } = await supabaseAdmin
      .from('pages')
      .update(updateData)
      .eq('slug', 'home')
      .select()
      .single()

    if (error) {
      console.error('Error updating home page:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Revalidate the home page to show updated content
    revalidatePath('/')

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error in PUT /api/pages/home:', error)
    return NextResponse.json(
      { error: 'Failed to update home page' },
      { status: 500 }
    )
  }
}
