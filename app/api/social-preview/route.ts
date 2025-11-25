import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Disable caching for this route
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const { data: pages, error: pagesError } = await supabase
      .from('pages')
      .select('id, slug, title, og_title, og_description, og_image, og_url, og_site_name, og_type, twitter_title, twitter_description, twitter_image, twitter_card, twitter_site, twitter_creator')
      .order('slug')

    const { data: contactPage, error: contactError } = await supabase
      .from('contact_page')
      .select('id, og_title, og_description, og_image, og_url, og_site_name, twitter_title, twitter_description, twitter_image, twitter_card')
      .single()

    if (pagesError) throw pagesError

    console.log('Fetched pages from DB:', pages)
    console.log('Home page images:', pages?.find((p: any) => p.slug === 'home'))

    return NextResponse.json({
      pages: pages || [],
      contactPage: contactPage || null
    })
  } catch (error) {
    console.error('Error fetching social preview data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch social preview data' },
      { status: 500 }
    )
  }
}
