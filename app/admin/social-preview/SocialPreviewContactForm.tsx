'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Save, Share2 } from 'lucide-react'

interface SocialPreviewContactFormProps {
  onSave: () => void
}

export default function SocialPreviewContactForm({ onSave }: SocialPreviewContactFormProps) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingOg, setUploadingOg] = useState(false)
  const [uploadingTwitter, setUploadingTwitter] = useState(false)
  const [contactData, setContactData] = useState<any>(null)

  useEffect(() => {
    fetchContactData()
  }, [])

  const fetchContactData = async () => {
    try {
      setLoading(true)
      // Add cache busting to force fresh data
      const res = await fetch(`/api/social-preview?t=${Date.now()}`, {
        cache: 'no-store'
      })
      if (res.ok) {
        const data = await res.json()
        console.log('Fetched contact data:', data.contactPage)
        setContactData(data.contactPage)
      }
    } catch (error) {
      console.error('Error fetching contact data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!contactData) return

    try {
      setSaving(true)
      const res = await fetch('/api/social-preview/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
      })

      if (res.ok) {
        await fetchContactData() // Refetch to confirm save
        onSave()
      } else {
        console.error('Failed to save')
      }
    } catch (error) {
      console.error('Error saving:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
        <div className="py-12 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </div>
    )
  }

  if (!contactData) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
        <div className="py-12 text-center text-gray-500">
          Contact page not found
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Open Graph Card */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-800">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Share2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-black dark:text-white">Open Graph (Facebook, LinkedIn)</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">How your contact page appears when shared</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>OG Title</Label>
            <Input
              value={contactData.og_title || ''}
              onChange={(e) => setContactData({...contactData, og_title: e.target.value})}
              placeholder="Contact Us"
            />
          </div>

          <div className="space-y-2">
            <Label>OG Description</Label>
            <Textarea
              value={contactData.og_description || ''}
              onChange={(e) => setContactData({...contactData, og_description: e.target.value})}
              placeholder="Get in touch..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>OG Image</Label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                disabled={uploadingOg}
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  
                  setUploadingOg(true)
                  const formData = new FormData()
                  formData.append('file', file)
                  formData.append('folder', 'social-preview')
                  
                  try {
                    const res = await fetch('/api/upload/image', {
                      method: 'POST',
                      body: formData,
                    })
                    
                    if (res.ok) {
                      const { url } = await res.json()
                      setContactData((prev: any) => ({...prev, og_image: url}))
                    }
                  } catch (error) {
                    console.error('Error uploading:', error)
                  } finally {
                    setUploadingOg(false)
                  }
                }}
                className="flex-1 text-sm text-gray-600 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 dark:file:bg-emerald-900 dark:file:text-emerald-300"
              />
              {uploadingOg && <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />}
            </div>
            {contactData.og_image && (
              <div className="mt-2">
                <img src={contactData.og_image} alt="OG Preview" className="w-32 h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
              </div>
            )}
            <p className="text-xs text-gray-500">Recommended: 1200x630px</p>
          </div>

          <div className="space-y-2">
            <Label>OG URL</Label>
            <Input
              value={contactData.og_url || ''}
              onChange={(e) => setContactData({...contactData, og_url: e.target.value})}
              placeholder="https://yoursite.com/contact"
            />
          </div>

          <div className="space-y-2">
            <Label>OG Site Name</Label>
            <Input
              value={contactData.og_site_name || ''}
              onChange={(e) => setContactData({...contactData, og_site_name: e.target.value})}
              placeholder="CodeWithJai"
            />
          </div>
        </div>
      </div>

      {/* Twitter Card */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-800">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Share2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-black dark:text-white">Twitter Card</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">How your contact page appears on Twitter/X</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Twitter Card Type</Label>
            <Select
              value={contactData.twitter_card || 'summary_large_image'}
              onValueChange={(value) => setContactData({...contactData, twitter_card: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="summary">Summary</SelectItem>
                <SelectItem value="summary_large_image">Summary Large Image</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Twitter Title</Label>
            <Input
              value={contactData.twitter_title || ''}
              onChange={(e) => setContactData({...contactData, twitter_title: e.target.value})}
              placeholder="Contact Us"
            />
          </div>

          <div className="space-y-2">
            <Label>Twitter Description</Label>
            <Textarea
              value={contactData.twitter_description || ''}
              onChange={(e) => setContactData({...contactData, twitter_description: e.target.value})}
              placeholder="Get in touch..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Twitter Image</Label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                disabled={uploadingTwitter}
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  
                  setUploadingTwitter(true)
                  const formData = new FormData()
                  formData.append('file', file)
                  formData.append('folder', 'social-preview')
                  
                  try {
                    const res = await fetch('/api/upload/image', {
                      method: 'POST',
                      body: formData,
                    })
                    
                    if (res.ok) {
                      const { url } = await res.json()
                      setContactData((prev: any) => ({...prev, twitter_image: url}))
                    }
                  } catch (error) {
                    console.error('Error uploading:', error)
                  } finally {
                    setUploadingTwitter(false)
                  }
                }}
                className="flex-1 text-sm text-gray-600 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 dark:file:bg-emerald-900 dark:file:text-emerald-300"
              />
              {uploadingTwitter && <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />}
            </div>
            {contactData.twitter_image && (
              <div className="mt-2">
                <img src={contactData.twitter_image} alt="Twitter Preview" className="w-32 h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
              </div>
            )}
            <p className="text-xs text-gray-500">Recommended: 1200x675px</p>
          </div>
        </div>
      </div>

      {/* Save Button - Full Width */}
      <div className="md:col-span-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Social Preview Settings
            </>
          )}
        </button>
      </div>
    </div>
  )
}
