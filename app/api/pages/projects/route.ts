import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { revalidatePath } from 'next/cache'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('pages')
      .select('*')
      .eq('slug', 'projects')
      .single()

    if (error) {
      console.error('Error fetching projects page:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in GET /api/pages/projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects page' },
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

    if (body.hero_title !== undefined) updateData.hero_title = body.hero_title
    if (body.hero_title_highlight !== undefined) updateData.hero_title_highlight = body.hero_title_highlight
    if (body.hero_subtitle !== undefined) updateData.hero_subtitle = body.hero_subtitle
    if (body.projects_cta_title !== undefined) updateData.projects_cta_title = body.projects_cta_title
    if (body.projects_cta_subtitle !== undefined) updateData.projects_cta_subtitle = body.projects_cta_subtitle
    if (body.projects_cta_button_text !== undefined) updateData.projects_cta_button_text = body.projects_cta_button_text
    if (body.projects_cta_button_url !== undefined) updateData.projects_cta_button_url = body.projects_cta_button_url

    const { data, error } = await supabaseAdmin
      .from('pages')
      .update(updateData)
      .eq('slug', 'projects')
      .select()
      .single()

    if (error) {
      console.error('Error updating projects page:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    revalidatePath('/projects')

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error in PUT /api/pages/projects:', error)
    return NextResponse.json(
      { error: 'Failed to update projects page' },
      { status: 500 }
    )
  }
}
