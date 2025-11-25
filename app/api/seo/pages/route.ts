import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data: pages, error: pagesError } = await supabase
      .from('pages')
      .select('id, slug, title, seo_title, seo_description, seo_image, meta_keywords, meta_author, meta_robots, canonical_url, og_type, twitter_card, twitter_site, twitter_creator')
      .order('slug')

    const { data: contactPage, error: contactError } = await supabase
      .from('contact_page')
      .select('id, seo_title, seo_description, seo_keywords, og_image, meta_robots')
      .single()

    if (pagesError) throw pagesError

    return NextResponse.json({
      pages: pages || [],
      contactPage: contactPage || null
    })
  } catch (error) {
    console.error('Error fetching SEO data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch SEO data' },
      { status: 500 }
    )
  }
}
