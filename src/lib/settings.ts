import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface SiteSettings {
  id: string
  website_name: string
  logo: string
  title: string
  tagline: string
  default_seo_title: string
  default_seo_description: string
  default_og_image: string
  favicon: string
  primary_color: string
  secondary_color: string
  default_background_image: string
}

let cachedSettings: SiteSettings | null = null
let lastFetch = 0
const CACHE_DURATION = 60000 // 1 minute

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const now = Date.now()
  
  // Return cached settings if still valid
  if (cachedSettings && (now - lastFetch) < CACHE_DURATION) {
    return cachedSettings
  }

  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .single()

    if (error) throw error

    cachedSettings = data
    lastFetch = now
    
    return data
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return null
  }
}

export function clearSettingsCache() {
  cachedSettings = null
  lastFetch = 0
}
