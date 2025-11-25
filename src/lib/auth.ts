import { cookies } from 'next/headers'
import { supabaseAdmin } from './supabase/client'
import bcrypt from 'bcryptjs'

const SESSION_COOKIE_NAME = 'admin_session'

export interface AdminSession {
  userId: string
  email: string
  name?: string
}

// Verify admin credentials
export async function verifyAdminCredentials(email: string, password: string): Promise<AdminSession | null> {
  const { data: user, error } = await supabaseAdmin
    .from('admin_users')
    .select('*')
    .eq('email', email)
    .single()

  if (error || !user) {
    return null
  }

  const isValid = await bcrypt.compare(password, user.password_hash)
  
  if (!isValid) {
    return null
  }

  return {
    userId: user.id,
    email: user.email,
    name: user.name
  }
}

// Create admin session
export async function createAdminSession(session: AdminSession) {
  const cookieStore = await cookies()
  const sessionData = JSON.stringify(session)
  
  cookieStore.set(SESSION_COOKIE_NAME, sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  })
}

// Get current admin session
export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)

  if (!sessionCookie) {
    return null
  }

  try {
    return JSON.parse(sessionCookie.value)
  } catch {
    return null
  }
}

// Delete admin session
export async function deleteAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

// Check if user is admin (middleware helper)
export async function isAdmin(): Promise<boolean> {
  const session = await getAdminSession()
  return session !== null
}

// Hash password for new admin users
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}
