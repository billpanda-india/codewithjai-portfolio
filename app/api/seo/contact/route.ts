import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function PUT(request: Request) {
  try {
    const body = await request.json()

    const { data, error } = await supabase
      .from('contact_page')
      .update({
        seo_title: body.seo_title,
        seo_description: body.seo_description,
        seo_keywords: body.seo_keywords,
        og_image: body.og_image,
        meta_robots: body.meta_robots,
        updated_at: new Date().toISOString()
      })
      .eq('id', body.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating contact page SEO:', error)
    return NextResponse.json(
      { error: 'Failed to update contact page SEO' },
      { status: 500 }
    )
  }
}
