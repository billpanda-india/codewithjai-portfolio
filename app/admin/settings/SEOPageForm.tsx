'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Save, Search } from 'lucide-react'

function FormSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
      ))}
      <div className="h-10 w-40 bg-gray-200 dark:bg-gray-800 rounded" />
    </div>
  )
}

interface SEOPageFormProps {
  pageSlug: string
  onSave: () => void
}

export default function SEOPageForm({ pageSlug, onSave }: SEOPageFormProps) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [pageData, setPageData] = useState<any>(null)

  useEffect(() => {
    fetchPageData()
  }, [pageSlug])

  const fetchPageData = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/seo/pages')
      if (res.ok) {
        const data = await res.json()
        const page = data.pages.find((p: any) => p.slug === pageSlug)
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
      const res = await fetch(`/api/seo/pages/${pageData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pageData)
      })

      if (res.ok) {
        onSave()
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
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-800 mb-6">
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
          <div className="space-y-2">
            <div className="h-5 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          </div>
        </div>
        <FormSkeleton />
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
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
          <Search className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-black dark:text-white">{pageData.title} Page SEO</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Manage SEO metadata for the {pageData.title.toLowerCase()} page</p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>SEO Title</Label>
          <Input
            value={pageData.seo_title || ''}
            onChange={(e) => setPageData({...pageData, seo_title: e.target.value})}
            placeholder="Page Title - Brand Name"
          />
          <p className="text-xs text-gray-500">Recommended: 50-60 characters</p>
        </div>

        <div className="space-y-2">
          <Label>SEO Description</Label>
          <Textarea
            value={pageData.seo_description || ''}
            onChange={(e) => setPageData({...pageData, seo_description: e.target.value})}
            placeholder="A compelling description..."
            rows={4}
          />
          <p className="text-xs text-gray-500">Recommended: 150-160 characters</p>
        </div>

        <div className="space-y-2">
          <Label>Meta Keywords</Label>
          <Input
            value={pageData.meta_keywords || ''}
            onChange={(e) => setPageData({...pageData, meta_keywords: e.target.value})}
            placeholder="keyword1, keyword2, keyword3"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save SEO Settings
            </>
          )}
        </button>
      </div>
    </div>
  )
}
