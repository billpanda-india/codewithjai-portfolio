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
    
    console.log('Updating page social preview:', params.id, body)

    const updateData = {
      og_title: body.og_title,
      og_description: body.og_description,
      og_image: body.og_image,
      og_url: body.og_url,
      og_site_name: body.og_site_name,
      og_type: body.og_type,
      twitter_title: body.twitter_title,
      twitter_description: body.twitter_description,
      twitter_image: body.twitter_image,
      twitter_card: body.twitter_card,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('pages')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    console.log('Successfully updated:', data)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating social preview:', error)
    return NextResponse.json(
      { error: 'Failed to update social preview', details: error },
      { status: 500 }
    )
  }
}
