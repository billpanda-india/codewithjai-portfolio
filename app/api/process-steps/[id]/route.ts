import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { revalidatePath } from 'next/cache'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, description, icon, color, order_index } = body

    const { data, error } = await supabaseAdmin
      .from('process_steps')
      .update({
        title,
        description,
        icon,
        color,
        order_index,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating process step:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    revalidatePath('/')

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error in PUT /api/process-steps/[id]:', error)
    return NextResponse.json(
      { error: 'Failed to update process step' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabaseAdmin
      .from('process_steps')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting process step:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    revalidatePath('/')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/process-steps/[id]:', error)
    return NextResponse.json(
      { error: 'Failed to delete process step' },
      { status: 500 }
    )
  }
}
