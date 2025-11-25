import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { revalidatePath } from 'next/cache'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { data, error } = await supabaseAdmin
      .from('service_benefits')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error

    revalidatePath('/services')
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating benefit:', error)
    return NextResponse.json({ error: 'Failed to update benefit' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabaseAdmin
      .from('service_benefits')
      .delete()
      .eq('id', params.id)

    if (error) throw error

    revalidatePath('/services')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting benefit:', error)
    return NextResponse.json({ error: 'Failed to delete benefit' }, { status: 500 })
  }
}
