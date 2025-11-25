import { useEffect, useState } from 'react'

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

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/settings')
      
      if (!res.ok) {
        throw new Error('Failed to fetch settings')
      }

      const data = await res.json()
      setSettings(data)
    } catch (err) {
      console.error('Error fetching site settings:', err)
      setError(err instanceof Error ? err.message : 'Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  return { settings, loading, error, refetch: fetchSettings }
}
