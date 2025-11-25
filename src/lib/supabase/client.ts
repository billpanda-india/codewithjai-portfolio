import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Service role client for admin operations (server-side only)
// Only create this on the server where SUPABASE_SERVICE_ROLE_KEY is available
export const supabaseAdmin = typeof window === 'undefined' && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(
      supabaseUrl,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
  : supabase // Fallback to regular client on client-side (shouldn't be used there anyway)

// Storage helper to get public URL
export function getPublicUrl(bucket: string, path: string) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

// Upload file helper
export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<string | null> {
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, file, {
      upsert: true
    })

  if (error) {
    console.error('Upload error:', error)
    return null
  }

  return getPublicUrl(bucket, data.path)
}

// Delete file helper
export async function deleteFile(bucket: string, path: string) {
  const { error } = await supabaseAdmin.storage.from(bucket).remove([path])
  
  if (error) {
    console.error('Delete error:', error)
    return false
  }
  
  return true
}
