import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get image record to find the file path
    const { data: imageRecord, error: fetchError } = await supabase
      .from('project_images')
      .select('image')
      .eq('id', params.id)
      .single()

    if (fetchError) throw fetchError

    // Extract file path from URL
    if (imageRecord?.image) {
      const url = new URL(imageRecord.image)
      const pathParts = url.pathname.split('/project-images/')
      if (pathParts.length > 1) {
        const filePath = pathParts[1]
        
        // Delete from storage
        await supabase.storage
          .from('project-images')
          .remove([filePath])
      }
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from('project_images')
      .delete()
      .eq('id', params.id)

    if (deleteError) throw deleteError

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting image:', error)
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 })
  }
}
