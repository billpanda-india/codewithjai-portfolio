import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const projectId = formData.get('projectId') as string

    if (!file || !projectId) {
      return NextResponse.json({ error: 'Missing file or projectId' }, { status: 400 })
    }

    // Upload to Supabase Storage
    const fileExt = file.name.split('.').pop()
    const fileName = `${projectId}/${Date.now()}.${fileExt}`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('project-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) throw uploadError

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('project-images')
      .getPublicUrl(fileName)

    // Get current max order_index
    const { data: existingImages } = await supabase
      .from('project_images')
      .select('order_index')
      .eq('project_id', projectId)
      .order('order_index', { ascending: false })
      .limit(1)

    const nextOrderIndex = existingImages && existingImages.length > 0 
      ? existingImages[0].order_index + 1 
      : 0

    // Save to database
    const { data: imageRecord, error: dbError } = await supabase
      .from('project_images')
      .insert({
        project_id: projectId,
        image: publicUrl,
        order_index: nextOrderIndex
      })
      .select()
      .single()

    if (dbError) throw dbError

    return NextResponse.json(imageRecord)
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
  }
}
