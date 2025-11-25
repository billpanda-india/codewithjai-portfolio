import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// PUT - Change password
export async function PUT(request: NextRequest) {
  try {
    const session = request.cookies.get('admin_session')
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    // Get current admin
    const { data: admin, error: fetchError } = await supabase
      .from('admin_users')
      .select('id, password_hash')
      .single()

    if (fetchError || !admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, admin.password_hash)
    if (!isValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update password
    const { error: updateError } = await supabase
      .from('admin_users')
      .update({
        password_hash: hashedPassword,
        updated_at: new Date().toISOString()
      })
      .eq('id', admin.id)

    if (updateError) throw updateError

    return NextResponse.json({ message: 'Password changed successfully' })
  } catch (error) {
    console.error('Error changing password:', error)
    return NextResponse.json({ error: 'Failed to change password' }, { status: 500 })
  }
}
