import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const { data, error } = await supabase
      .from('pages')
      .update({
        seo_title: body.seo_title,
        seo_description: body.seo_description,
        seo_image: body.seo_image,
        meta_keywords: body.meta_keywords,
        meta_author: body.meta_author,
        meta_robots: body.meta_robots,
        canonical_url: body.canonical_url,
        og_type: body.og_type,
        twitter_card: body.twitter_card,
        twitter_site: body.twitter_site,
        twitter_creator: body.twitter_creator,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating page SEO:', error)
    return NextResponse.json(
      { error: 'Failed to update page SEO' },
      { status: 500 }
    )
  }
}
