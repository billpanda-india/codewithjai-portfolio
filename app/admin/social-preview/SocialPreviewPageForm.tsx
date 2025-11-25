'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Save, Share2 } from 'lucide-react'

function SocialPreviewSkeleton({ title }: { title: string }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
        <div className="space-y-2">
          <div className="h-5 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-4 w-64 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        </div>
      </div>
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}

interface SocialPreviewPageFormProps {
  pageSlug: string
  onSave: () => void
}

export default function SocialPreviewPageForm({ pageSlug, onSave }: SocialPreviewPageFormProps) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingOg, setUploadingOg] = useState(false)
  const [uploadingTwitter, setUploadingTwitter] = useState(false)
  const [pageData, setPageData] = useState<any>(null)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    fetchPageData()
  }, [pageSlug])

  const fetchPageData = async () => {
    try {
      setLoading(true)
      // Add cache busting to force fresh data
      const res = await fetch(`/api/social-preview?t=${Date.now()}`, {
        cache: 'no-store'
      })
      if (res.ok) {
        const data = await res.json()
        const page = data.pages.find((p: any) => p.slug === pageSlug)
        console.log('Fetched page data for', pageSlug, ':', page)
        console.log('OG Image:', page?.og_image)
        console.log('Twitter Image:', page?.twitter_image)
        setPageData(page)
      }
    } catch (error) {
      console.error('Error fetching page data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!pageData) return

    try {
      setSaving(true)
      setSaveError(null)
      
      console.log('Saving page data:', pageData)
      
      const res = await fetch(`/api/social-preview/pages/${pageData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pageData)
      })

      const result = await res.json()
      console.log('Save response:', result)

      if (res.ok) {
        await fetchPageData() // Refetch to confirm save
        onSave()
        alert('Saved successfully!')
      } else {
        setSaveError(result.error || 'Failed to save')
        alert('Failed to save: ' + (result.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error saving:', error)
      setSaveError('Error saving: ' + error)
      alert('Error saving: ' + error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <SocialPreviewSkeleton title="Open Graph (Facebook, LinkedIn)" />
        <SocialPreviewSkeleton title="Twitter Card" />
      </div>
    )
  }

  if (!pageData) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
        <div className="py-12 text-center text-gray-500">
          Page not found
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
            <p className="text-sm text-gray-600 dark:text-gray-400">How your page appears when shared on Facebook, LinkedIn, etc.</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>OG Title</Label>
            <Input
              value={pageData.og_title || ''}
              onChange={(e) => setPageData({...pageData, og_title: e.target.value})}
              placeholder="Your Page Title"
            />
          </div>

          <div className="space-y-2">
            <Label>OG Description</Label>
            <Textarea
              value={pageData.og_description || ''}
              onChange={(e) => setPageData({...pageData, og_description: e.target.value})}
              placeholder="A compelling description..."
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
                      setPageData((prev: any) => ({...prev, og_image: url}))
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
            {pageData.og_image && (
              <div className="mt-2">
                <img src={pageData.og_image} alt="OG Preview" className="w-32 h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
              </div>
            )}
            <p className="text-xs text-gray-500">Recommended: 1200x630px</p>
          </div>

          <div className="space-y-2">
            <Label>OG URL</Label>
            <Input
              value={pageData.og_url || ''}
              onChange={(e) => setPageData({...pageData, og_url: e.target.value})}
              placeholder="https://yoursite.com/page"
            />
          </div>

          <div className="space-y-2">
            <Label>OG Site Name</Label>
            <Input
              value={pageData.og_site_name || ''}
              onChange={(e) => setPageData({...pageData, og_site_name: e.target.value})}
              placeholder="CodeWithJai"
            />
          </div>

          <div className="space-y-2">
            <Label>OG Type</Label>
            <Select
              value={pageData.og_type || 'website'}
              onValueChange={(value) => setPageData({...pageData, og_type: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="article">Article</SelectItem>
                <SelectItem value="profile">Profile</SelectItem>
              </SelectContent>
            </Select>
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
            <p className="text-sm text-gray-600 dark:text-gray-400">How your page appears when shared on Twitter/X</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Twitter Card Type</Label>
            <Select
              value={pageData.twitter_card || 'summary_large_image'}
              onValueChange={(value) => setPageData({...pageData, twitter_card: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="summary">Summary</SelectItem>
                <SelectItem value="summary_large_image">Summary Large Image</SelectItem>
                <SelectItem value="app">App</SelectItem>
                <SelectItem value="player">Player</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Twitter Title</Label>
            <Input
              value={pageData.twitter_title || ''}
              onChange={(e) => setPageData({...pageData, twitter_title: e.target.value})}
              placeholder="Your Page Title"
            />
          </div>

          <div className="space-y-2">
            <Label>Twitter Description</Label>
            <Textarea
              value={pageData.twitter_description || ''}
              onChange={(e) => setPageData({...pageData, twitter_description: e.target.value})}
              placeholder="A compelling description..."
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
                      setPageData((prev: any) => ({...prev, twitter_image: url}))
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
            {pageData.twitter_image && (
              <div className="mt-2">
                <img src={pageData.twitter_image} alt="Twitter Preview" className="w-32 h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
              </div>
            )}
            <p className="text-xs text-gray-500">Recommended: 1200x675px</p>
          </div>

          <div className="space-y-2">
            <Label>Twitter Site Handle</Label>
            <Input
              value={pageData.twitter_site || ''}
              onChange={(e) => setPageData({...pageData, twitter_site: e.target.value})}
              placeholder="@yourhandle"
            />
          </div>

          <div className="space-y-2">
            <Label>Twitter Creator Handle</Label>
            <Input
              value={pageData.twitter_creator || ''}
              onChange={(e) => setPageData({...pageData, twitter_creator: e.target.value})}
              placeholder="@yourhandle"
            />
          </div>
        </div>
      </div>

      {/* Save Button - Full Width */}
      <div className="md:col-span-2">
        {saveError && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg text-sm">
            {saveError}
          </div>
        )}
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
