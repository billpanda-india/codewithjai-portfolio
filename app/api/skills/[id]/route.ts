import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { revalidatePath } from 'next/cache'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, logo, category } = body

    const { data, error } = await supabaseAdmin
      .from('skills')
      .update({
        name,
        logo,
        category,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating skill:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    revalidatePath('/')

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error in PUT /api/skills/[id]:', error)
    return NextResponse.json({ error: 'Failed to update skill' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabaseAdmin
      .from('skills')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting skill:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    revalidatePath('/')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/skills/[id]:', error)
    return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 })
  }
}
