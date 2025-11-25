'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Save, Search } from 'lucide-react'

interface ContactSEOFormProps {
  onSave: () => void
}

export default function ContactSEOForm({ onSave }: ContactSEOFormProps) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [contactData, setContactData] = useState<any>(null)

  useEffect(() => {
    fetchContactData()
  }, [])

  const fetchContactData = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/seo/pages')
      if (res.ok) {
        const data = await res.json()
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
      const res = await fetch('/api/seo/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
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
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
          <Search className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-black dark:text-white">Contact Page SEO</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Manage SEO metadata for the contact page</p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>SEO Title</Label>
          <Input
            value={contactData.seo_title || ''}
            onChange={(e) => setContactData({...contactData, seo_title: e.target.value})}
            placeholder="Contact Us - Get In Touch"
          />
          <p className="text-xs text-gray-500">Recommended: 50-60 characters</p>
        </div>

        <div className="space-y-2">
          <Label>SEO Description</Label>
          <Textarea
            value={contactData.seo_description || ''}
            onChange={(e) => setContactData({...contactData, seo_description: e.target.value})}
            placeholder="Get in touch with us..."
            rows={4}
          />
          <p className="text-xs text-gray-500">Recommended: 150-160 characters</p>
        </div>

        <div className="space-y-2">
          <Label>Meta Keywords</Label>
          <Input
            value={contactData.seo_keywords || ''}
            onChange={(e) => setContactData({...contactData, seo_keywords: e.target.value})}
            placeholder="contact, get in touch, hire"
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
