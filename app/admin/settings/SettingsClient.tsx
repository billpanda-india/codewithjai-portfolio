'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { Loader2, Save, CheckCircle2, XCircle, Plus, Trash2, GripVertical, Settings, Palette, Link2, Mail, FileText, Map, Sparkles } from 'lucide-react'

function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid w-full grid-cols-6 gap-2 bg-white dark:bg-gray-900 h-auto p-2 rounded-lg border border-gray-200 dark:border-gray-800">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-10 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
        ))}
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-800">
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
          <div className="space-y-2">
            <div className="h-5 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          </div>
        </div>
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded" />
            </div>
          ))}
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
      </div>
    </div>
  )
}

interface SiteSettings {
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

interface SmtpSettings {
  id: string
  host: string
  port: number
  user_email: string
  password: string
  from_email: string
  from_name: string
  use_ssl: boolean
}

interface SiteLink {
  id: string
  title: string
  description: string
  url: string
  icon: string
  order_index: number
  is_active: boolean
}

export default function SettingsClient() {
  const [activeTab, setActiveTab] = useState('general')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null)
  const [smtpSettings, setSmtpSettings] = useState<SmtpSettings | null>(null)
  const [siteLinks, setSiteLinks] = useState<SiteLink[]>([])
  const [testEmail, setTestEmail] = useState('')
  const [robotsRules, setRobotsRules] = useState<any[]>([])
  const [editingRule, setEditingRule] = useState<any | null>(null)
  const [isRobotModalOpen, setIsRobotModalOpen] = useState(false)
  const [sitemapData, setSitemapData] = useState<any>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const [siteRes, smtpRes, linksRes, robotsRes] = await Promise.all([
        fetch('/api/settings'),
        fetch('/api/settings/smtp'),
        fetch('/api/site-links'),
        fetch('/api/robots')
      ])

      if (siteRes.ok) {
        const siteData = await siteRes.json()
        setSiteSettings(siteData)
      }

      if (smtpRes.ok) {
        const smtpData = await smtpRes.json()
        setSmtpSettings(smtpData)
      }

      if (linksRes.ok) {
        const linksData = await linksRes.json()
        setSiteLinks(linksData)
      }

      if (robotsRes.ok) {
        const robotsData = await robotsRes.json()
        setRobotsRules(robotsData)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      setMessage({ type: 'error', text: 'Failed to load settings' })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSiteSettings = async () => {
    if (!siteSettings) return

    try {
      setSaving(true)
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteSettings)
      })

      if (res.ok) {
        const data = await res.json()
        setSiteSettings(data)
        setMessage({ type: 'success', text: 'Settings saved successfully!' })
        setTimeout(() => setMessage(null), 3000)
      } else {
        throw new Error('Failed to save')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      setMessage({ type: 'error', text: 'Failed to save settings' })
    } finally {
      setSaving(false)
    }
  }

  const handleSaveSmtpSettings = async () => {
    if (!smtpSettings) return

    try {
      setSaving(true)
      const res = await fetch('/api/settings/smtp', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(smtpSettings)
      })

      if (res.ok) {
        const data = await res.json()
        setSmtpSettings(data)
        setMessage({ type: 'success', text: 'SMTP settings saved successfully!' })
        setTimeout(() => setMessage(null), 3000)
      } else {
        throw new Error('Failed to save')
      }
    } catch (error) {
      console.error('Error saving SMTP settings:', error)
      setMessage({ type: 'error', text: 'Failed to save SMTP settings' })
    } finally {
      setSaving(false)
    }
  }

  const handleTestSmtp = async () => {
    if (!testEmail) {
      setMessage({ type: 'error', text: 'Please enter a test email address' })
      return
    }

    try {
      setTesting(true)
      const res = await fetch('/api/settings/smtp/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testEmail })
      })

      const data = await res.json()

      if (res.ok) {
        setMessage({ type: 'success', text: 'Test email sent successfully! Check your inbox.' })
        setTimeout(() => setMessage(null), 5000)
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to send test email' })
      }
    } catch (error) {
      console.error('Error testing SMTP:', error)
      setMessage({ type: 'error', text: 'Failed to send test email' })
    } finally {
      setTesting(false)
    }
  }

  const handleAddSiteLink = () => {
    const newLink: SiteLink = {
      id: `temp-${Date.now()}`,
      title: '',
      description: '',
      url: '',
      icon: '',
      order_index: siteLinks.length,
      is_active: true
    }
    setSiteLinks([...siteLinks, newLink])
  }

  const handleDeleteSiteLink = async (id: string) => {
    if (id.startsWith('temp-')) {
      setSiteLinks(siteLinks.filter(link => link.id !== id))
      return
    }

    try {
      const res = await fetch(`/api/site-links/${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        setSiteLinks(siteLinks.filter(link => link.id !== id))
        setMessage({ type: 'success', text: 'Site link deleted successfully' })
        setTimeout(() => setMessage(null), 3000)
      } else {
        throw new Error('Failed to delete')
      }
    } catch (error) {
      console.error('Error deleting site link:', error)
      setMessage({ type: 'error', text: 'Failed to delete site link' })
    }
  }

  const handleSaveSiteLinks = async () => {
    try {
      setSaving(true)

      for (const link of siteLinks) {
        if (link.id.startsWith('temp-')) {
          // Create new link
          const res = await fetch('/api/site-links', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(link)
          })
          if (!res.ok) throw new Error('Failed to create link')
        } else {
          // Update existing link
          const res = await fetch(`/api/site-links/${link.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(link)
          })
          if (!res.ok) throw new Error('Failed to update link')
        }
      }

      // Refresh links
      const res = await fetch('/api/site-links')
      if (res.ok) {
        const data = await res.json()
        setSiteLinks(data)
      }

      setMessage({ type: 'success', text: 'Site links saved successfully!' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('Error saving site links:', error)
      setMessage({ type: 'error', text: 'Failed to save site links' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SettingsSkeleton />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
              : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <XCircle className="h-5 w-5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 gap-2 bg-white dark:bg-gray-900 h-auto p-2 rounded-lg border border-gray-200 dark:border-gray-800">
            <TabsTrigger value="general" className="px-3 py-2 rounded-md font-medium transition-colors data-[state=active]:bg-emerald-500 data-[state=active]:text-white">General</TabsTrigger>
            <TabsTrigger value="branding" className="px-3 py-2 rounded-md font-medium transition-colors data-[state=active]:bg-emerald-500 data-[state=active]:text-white">Branding</TabsTrigger>
            <TabsTrigger value="sitelinks" className="px-3 py-2 rounded-md font-medium transition-colors data-[state=active]:bg-emerald-500 data-[state=active]:text-white">Site Links</TabsTrigger>
            <TabsTrigger value="smtp" className="px-3 py-2 rounded-md font-medium transition-colors data-[state=active]:bg-emerald-500 data-[state=active]:text-white">SMTP</TabsTrigger>
            <TabsTrigger value="robots" className="px-3 py-2 rounded-md font-medium transition-colors data-[state=active]:bg-emerald-500 data-[state=active]:text-white">Robots.txt</TabsTrigger>
            <TabsTrigger value="sitemap" className="px-3 py-2 rounded-md font-medium transition-colors data-[state=active]:bg-emerald-500 data-[state=active]:text-white">Sitemap</TabsTrigger>
          </TabsList>

          {/* General Settings Tab */}
          <TabsContent value="general" className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-800">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-black dark:text-white">General Settings</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Basic site information and configuration</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="website_name">Website Name</Label>
                    <Input
                      id="website_name"
                      value={siteSettings?.website_name || ''}
                      onChange={(e) => setSiteSettings(prev => prev ? {...prev, website_name: e.target.value} : null)}
                      placeholder="CodeWithJai"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Site Title</Label>
                    <Input
                      id="title"
                      value={siteSettings?.title || ''}
                      onChange={(e) => setSiteSettings(prev => prev ? {...prev, title: e.target.value} : null)}
                      placeholder="CodeWithJai"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input
                      id="tagline"
                      value={siteSettings?.tagline || ''}
                      onChange={(e) => setSiteSettings(prev => prev ? {...prev, tagline: e.target.value} : null)}
                      placeholder="Crafting Digital Excellence"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSaveSiteSettings}
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
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </TabsContent>

          {/* Branding Tab */}
          <TabsContent value="branding" className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-800">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-black dark:text-white">Branding & Theme</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Customize your site's visual identity</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid gap-4">
                  {/* Logo Upload */}
                  <div className="space-y-2">
                    <Label>Logo</Label>
                    <div className="flex items-center gap-4">
                      {siteSettings?.logo ? (
                        <img
                          src={siteSettings.logo}
                          alt="Logo"
                          className="w-20 h-20 object-contain border-2 border-gray-200 dark:border-gray-800 rounded-lg p-2"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-800 rounded-lg flex items-center justify-center">
                          <Sparkles className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <label
                          htmlFor="logo-upload"
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors cursor-pointer inline-flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Upload Logo
                        </label>
                        <input
                          id="logo-upload"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              if (file.size > 2 * 1024 * 1024) {
                                setMessage({ type: 'error', text: 'Image must be less than 2MB' })
                                return
                              }
                              const reader = new FileReader()
                              reader.onloadend = () => {
                                setSiteSettings(prev => prev ? {...prev, logo: reader.result as string} : null)
                              }
                              reader.readAsDataURL(file)
                            }
                          }}
                          className="hidden"
                        />
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG or SVG. Max 2MB</p>
                      </div>
                    </div>
                  </div>

                  {/* Favicon Upload */}
                  <div className="space-y-2">
                    <Label>Favicon</Label>
                    <div className="flex items-center gap-4">
                      {siteSettings?.favicon ? (
                        <img
                          src={siteSettings.favicon}
                          alt="Favicon"
                          className="w-12 h-12 object-contain border-2 border-gray-200 dark:border-gray-800 rounded-lg p-1"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-800 rounded-lg flex items-center justify-center">
                          <Sparkles className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <label
                          htmlFor="favicon-upload"
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors cursor-pointer inline-flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Upload Favicon
                        </label>
                        <input
                          id="favicon-upload"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              if (file.size > 1 * 1024 * 1024) {
                                setMessage({ type: 'error', text: 'Favicon must be less than 1MB' })
                                return
                              }
                              const reader = new FileReader()
                              reader.onloadend = () => {
                                setSiteSettings(prev => prev ? {...prev, favicon: reader.result as string} : null)
                              }
                              reader.readAsDataURL(file)
                            }
                          }}
                          className="hidden"
                        />
                        <p className="text-xs text-gray-500 mt-1">ICO, PNG. Max 1MB. Recommended: 32x32px</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="primary_color">Primary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="primary_color"
                          type="color"
                          value={siteSettings?.primary_color || '#2563EB'}
                          onChange={(e) => setSiteSettings(prev => prev ? {...prev, primary_color: e.target.value} : null)}
                          className="w-20 h-10"
                        />
                        <Input
                          value={siteSettings?.primary_color || '#2563EB'}
                          onChange={(e) => setSiteSettings(prev => prev ? {...prev, primary_color: e.target.value} : null)}
                          placeholder="#2563EB"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="secondary_color">Secondary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="secondary_color"
                          type="color"
                          value={siteSettings?.secondary_color || '#1E293B'}
                          onChange={(e) => setSiteSettings(prev => prev ? {...prev, secondary_color: e.target.value} : null)}
                          className="w-20 h-10"
                        />
                        <Input
                          value={siteSettings?.secondary_color || '#1E293B'}
                          onChange={(e) => setSiteSettings(prev => prev ? {...prev, secondary_color: e.target.value} : null)}
                          placeholder="#1E293B"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="default_background_image">Default Background Image</Label>
                    <Input
                      id="default_background_image"
                      value={siteSettings?.default_background_image || ''}
                      onChange={(e) => setSiteSettings(prev => prev ? {...prev, default_background_image: e.target.value} : null)}
                      placeholder="https://example.com/bg.jpg"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSaveSiteSettings}
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
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </TabsContent>



          {/* Site Links Tab */}
          <TabsContent value="sitelinks" className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-800">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Link2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-black dark:text-white">Site Links</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Manage important links that appear in search results and site navigation</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-4">
                  {siteLinks.map((link, index) => (
                    <div key={link.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="mt-2 cursor-move">
                          <GripVertical className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label>Title</Label>
                              <Input
                                value={link.title}
                                onChange={(e) => {
                                  const newLinks = [...siteLinks]
                                  newLinks[index].title = e.target.value
                                  setSiteLinks(newLinks)
                                }}
                                placeholder="Mobile Phones"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>URL</Label>
                              <Input
                                value={link.url}
                                onChange={(e) => {
                                  const newLinks = [...siteLinks]
                                  newLinks[index].url = e.target.value
                                  setSiteLinks(newLinks)
                                }}
                                placeholder="/products/mobile-phones"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Input
                              value={link.description}
                              onChange={(e) => {
                                const newLinks = [...siteLinks]
                                newLinks[index].description = e.target.value
                                setSiteLinks(newLinks)
                              }}
                              placeholder="Buy mobile phones at best prices"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Icon (optional)</Label>
                            <Input
                              value={link.icon}
                              onChange={(e) => {
                                const newLinks = [...siteLinks]
                                newLinks[index].icon = e.target.value
                                setSiteLinks(newLinks)
                              }}
                              placeholder="Smartphone"
                            />
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteSiteLink(link.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={handleAddSiteLink}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Site Link
                </Button>

                <button
                  onClick={handleSaveSiteLinks}
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
                      Save Site Links
                    </>
                  )}
                </button>
              </div>
            </div>
          </TabsContent>

          {/* SMTP Tab */}
          <TabsContent value="smtp" className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-800">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-black dark:text-white">SMTP Configuration</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Configure email server settings for contact form</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="host">SMTP Host</Label>
                    <Input
                      id="host"
                      value={smtpSettings?.host || ''}
                      onChange={(e) => setSmtpSettings(prev => prev ? {...prev, host: e.target.value} : null)}
                      placeholder="smtp.hostinger.com"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="port">SMTP Port</Label>
                      <Input
                        id="port"
                        type="number"
                        value={smtpSettings?.port || ''}
                        onChange={(e) => setSmtpSettings(prev => prev ? {...prev, port: parseInt(e.target.value)} : null)}
                        placeholder="465"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="use_ssl">Encryption</Label>
                      <select
                        id="use_ssl"
                        value={smtpSettings?.use_ssl ? 'ssl' : 'tls'}
                        onChange={(e) => setSmtpSettings(prev => prev ? {...prev, use_ssl: e.target.value === 'ssl'} : null)}
                        className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="ssl">SSL/TLS (Port 465)</option>
                        <option value="tls">STARTTLS (Port 587)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="user_email">User Email (Authentication)</Label>
                    <Input
                      id="user_email"
                      type="email"
                      value={smtpSettings?.user_email || ''}
                      onChange={(e) => setSmtpSettings(prev => prev ? {...prev, user_email: e.target.value} : null)}
                      placeholder="your-email@domain.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={smtpSettings?.password || ''}
                      onChange={(e) => setSmtpSettings(prev => prev ? {...prev, password: e.target.value} : null)}
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="from_email">From Email</Label>
                    <Input
                      id="from_email"
                      type="email"
                      value={smtpSettings?.from_email || ''}
                      onChange={(e) => setSmtpSettings(prev => prev ? {...prev, from_email: e.target.value} : null)}
                      placeholder="noreply@domain.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="from_name">From Name</Label>
                    <Input
                      id="from_name"
                      value={smtpSettings?.from_name || ''}
                      onChange={(e) => setSmtpSettings(prev => prev ? {...prev, from_name: e.target.value} : null)}
                      placeholder="Your Website"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button onClick={handleSaveSmtpSettings} disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save SMTP Settings
                      </>
                    )}
                  </Button>
                </div>

                <div className="border-t pt-4 mt-4">
                  <h3 className="text-sm font-medium mb-3">Test SMTP Configuration</h3>
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      placeholder="Enter email to send test"
                      className="flex-1"
                    />
                    <Button onClick={handleTestSmtp} disabled={testing} variant="outline">
                      {testing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        'Send Test Email'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Robots.txt Tab */}
          <TabsContent value="robots" className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-black dark:text-white">Robots.txt Rules</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Manage search engine crawler rules</p>
                  </div>
                </div>
                <div className="flex gap-2">
                    <Button
                      onClick={async () => {
                        setSaving(true)
                        try {
                          await fetch('/api/robots/regenerate', { method: 'POST' })
                          setMessage({ type: 'success', text: 'Robots.txt regenerated!' })
                        } catch (error) {
                          setMessage({ type: 'error', text: 'Failed to regenerate' })
                        } finally {
                          setSaving(false)
                        }
                      }}
                      variant="outline"
                      disabled={saving}
                    >
                      Regenerate
                    </Button>
                    <Button onClick={() => {
                      setEditingRule({
                        id: '',
                        user_agent: '*',
                        rule_type: 'disallow',
                        path: '/',
                        order_index: robotsRules.length
                      })
                      setIsRobotModalOpen(true)
                    }}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Rule
                    </Button>
                  </div>
                </div>
              <div className="space-y-4">
                <div className="space-y-3">
                  {robotsRules.map((rule) => (
                    <div
                      key={rule.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                            {rule.user_agent}
                          </span>
                          <span className={`text-sm px-2 py-1 rounded ${
                            rule.rule_type === 'allow' 
                              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                              : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                          }`}>
                            {rule.rule_type}
                          </span>
                          <span className="font-mono text-sm">{rule.path}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingRule(rule)
                            setIsRobotModalOpen(true)
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={async () => {
                            if (!confirm('Delete this rule?')) return
                            try {
                              await fetch(`/api/robots/${rule.id}`, { method: 'DELETE' })
                              setMessage({ type: 'success', text: 'Rule deleted!' })
                              fetchSettings()
                            } catch (error) {
                              setMessage({ type: 'error', text: 'Failed to delete' })
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Sitemap Tab */}
          <TabsContent value="sitemap" className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Map className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-black dark:text-white">Sitemap.xml</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">View and manage your sitemap</p>
                  </div>
                </div>
                <div className="flex gap-2">
                    <Button
                      onClick={async () => {
                        setSaving(true)
                        try {
                          const response = await fetch('/api/sitemap/preview')
                          if (response.ok) {
                            const data = await response.json()
                            setSitemapData(data)
                            setMessage({ type: 'success', text: 'Sitemap loaded!' })
                          }
                        } catch (error) {
                          setMessage({ type: 'error', text: 'Failed to load sitemap' })
                        } finally {
                          setSaving(false)
                        }
                      }}
                      variant="outline"
                      disabled={saving}
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Load Sitemap
                    </Button>
                    <Button
                      onClick={async () => {
                        setSaving(true)
                        try {
                          await fetch('/api/sitemap/regenerate', { method: 'POST' })
                          setMessage({ type: 'success', text: 'Sitemap regenerated!' })
                        } catch (error) {
                          setMessage({ type: 'error', text: 'Failed to regenerate' })
                        } finally {
                          setSaving(false)
                        }
                      }}
                      disabled={saving}
                    >
                      Regenerate
                    </Button>
                  </div>
                </div>
              <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Auto-Generated:</strong> Your sitemap is automatically generated from your database.
                      It includes all pages and projects. Visit{' '}
                      <a href="/sitemap.xml" target="_blank" className="underline font-mono">
                        /sitemap.xml
                      </a>{' '}
                      to view it.
                    </p>
                  </div>

                  {sitemapData && (
                    <div className="space-y-3">
                      <h3 className="font-semibold">Sitemap URLs ({sitemapData.length})</h3>
                      <div className="max-h-96 overflow-y-auto space-y-2">
                        {sitemapData.map((item: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                          >
                            <div className="flex-1">
                              <a
                                href={item.url}
                                target="_blank"
                                className="font-mono text-sm text-blue-600 dark:text-blue-400 hover:underline"
                              >
                                {item.url}
                              </a>
                              <p className="text-xs text-gray-500 mt-1">
                                Last Modified: {new Date(item.lastModified).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {!sitemapData && (
                    <div className="text-center py-12 text-gray-500">
                      Click "Load Sitemap" to view all URLs in your sitemap
                    </div>
                  )}
                </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Robot Rule Modal */}
        {isRobotModalOpen && editingRule && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full">
              <div className="border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">{editingRule.id ? 'Edit Rule' : 'New Rule'}</h2>
                <button onClick={() => setIsRobotModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label>User Agent</Label>
                  <Input
                    value={editingRule.user_agent}
                    onChange={(e) => setEditingRule({ ...editingRule, user_agent: e.target.value })}
                    placeholder="* (all bots) or Googlebot"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Rule Type</Label>
                  <select
                    value={editingRule.rule_type}
                    onChange={(e) => setEditingRule({ ...editingRule, rule_type: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="allow">Allow</option>
                    <option value="disallow">Disallow</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Path</Label>
                  <Input
                    value={editingRule.path}
                    onChange={(e) => setEditingRule({ ...editingRule, path: e.target.value })}
                    placeholder="/admin/ or /"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Order</Label>
                  <Input
                    type="number"
                    value={editingRule.order_index}
                    onChange={(e) => setEditingRule({ ...editingRule, order_index: parseInt(e.target.value) })}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={async () => {
                      if (!editingRule) return
                      setSaving(true)
                      try {
                        const isNew = !editingRule.id
                        const url = isNew ? '/api/robots' : `/api/robots/${editingRule.id}`
                        const method = isNew ? 'POST' : 'PUT'

                        const response = await fetch(url, {
                          method,
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(editingRule),
                        })

                        if (response.ok) {
                          setMessage({ type: 'success', text: isNew ? 'Rule added!' : 'Rule updated!' })
                          setIsRobotModalOpen(false)
                          setEditingRule(null)
                          fetchSettings()
                        } else {
                          setMessage({ type: 'error', text: 'Failed to save rule' })
                        }
                      } catch (error) {
                        setMessage({ type: 'error', text: 'Error saving rule' })
                      } finally {
                        setSaving(false)
                      }
                    }}
                    disabled={saving}
                    className="flex-1"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                  <Button
                    onClick={() => setIsRobotModalOpen(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
