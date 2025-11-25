import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('smtp_settings')
      .select('*')
      .single()

    if (error) throw error

    // Mask password for security
    if (data && data.password) {
      data.password = '••••••••'
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching SMTP settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch SMTP settings' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    
    // Don't update password if it's masked
    const updateData: any = {
      host: body.host,
      port: body.port,
      user_email: body.user_email,
      from_email: body.from_email,
      from_name: body.from_name,
      updated_at: new Date().toISOString()
    }

    // Only update password if it's not masked
    if (body.password && body.password !== '••••••••') {
      updateData.password = body.password
    }

    const { data, error } = await supabase
      .from('smtp_settings')
      .update(updateData)
      .eq('id', body.id)
      .select()
      .single()

    if (error) throw error

    // Mask password in response
    if (data && data.password) {
      data.password = '••••••••'
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating SMTP settings:', error)
    return NextResponse.json(
      { error: 'Failed to update SMTP settings' },
      { status: 500 }
    )
  }
}
