import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { revalidatePath } from 'next/cache'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { id } = params

    const { data, error } = await supabaseAdmin
      .from('contact_features')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    revalidatePath('/contact')
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating contact feature:', error)
    return NextResponse.json(
      { error: 'Failed to update contact feature' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const { error} = await supabaseAdmin
      .from('contact_features')
      .delete()
      .eq('id', id)

    if (error) throw error

    revalidatePath('/contact')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting contact feature:', error)
    return NextResponse.json(
      { error: 'Failed to delete contact feature' },
      { status: 500 }
    )
  }
}
