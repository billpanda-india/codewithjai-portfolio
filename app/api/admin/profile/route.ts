import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET - Fetch admin profile
export async function GET(request: NextRequest) {
  try {
    const session = request.cookies.get('admin_session')
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error} = await supabase
      .from('admin_users')
      .select('id, name, email, avatar')
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

// PUT - Update admin profile
export async function PUT(request: NextRequest) {
  try {
    const session = request.cookies.get('admin_session')
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, email, avatar } = body

    // Get current admin
    const { data: admin } = await supabase
      .from('admin_users')
      .select('id')
      .single()

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    // Update profile
    const { data, error } = await supabase
      .from('admin_users')
      .update({
        name,
        email,
        avatar,
        updated_at: new Date().toISOString()
      })
      .eq('id', admin.id)
      .select('id, name, email, avatar')
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
