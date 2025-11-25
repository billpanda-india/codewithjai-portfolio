'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ToastContainer } from '@/components/ui/toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Sparkles,
  Phone,
  Award,
  Save,
  Loader2,
  Plus,
  Trash2,
  Edit,
} from 'lucide-react'

type HeroData = {
  hero_badge: string
  hero_title: string
  hero_title_highlight: string
  hero_subtitle: string
  contact_intro: string
  stat1_icon: string
  stat1_value: string
  stat1_label: string
  stat2_icon: string
  stat2_value: string
  stat2_label: string
  stat3_icon: string
  stat3_value: string
  stat3_label: string
}

type ContactMethod = {
  id?: string
  icon: string
  title: string
  value: string
  link: string
  order_index: number
}

type ContactFeature = {
  id?: string
  icon: string
  title: string
  description: string
  order_index: number
}

const FormSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="space-y-2">
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
      </div>
    ))}
    <div className="h-10 w-24 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
  </div>
)

const CardsSkeleton = () => (
  <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 animate-pulse">
        <div className="flex items-start justify-between mb-2">
          <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      </div>
    ))}
  </div>
)

export default function ContactPageAdmin() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  
  const [heroData, setHeroData] = useState<HeroData>({
    hero_badge: '',
    hero_title: '',
    hero_title_highlight: '',
    hero_subtitle: '',
    contact_intro: '',
    stat1_icon: '',
    stat1_value: '',
    stat1_label: '',
    stat2_icon: '',
    stat2_value: '',
    stat2_label: '',
    stat3_icon: '',
    stat3_value: '',
    stat3_label: '',
  })

  const [methods, setMethods] = useState<ContactMethod[]>([])
  const [features, setFeatures] = useState<ContactFeature[]>([])
  const [editingMethod, setEditingMethod] = useState<ContactMethod | null>(null)
  const [isMethodModalOpen, setIsMethodModalOpen] = useState(false)
  const [editingFeature, setEditingFeature] = useState<ContactFeature | null>(null)
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false)

  useEffect(() => {
    fetchContactData()
  }, [])

  const fetchContactData = async () => {
    try {
      const response = await fetch('/api/pages/contact')
      const data = await response.json()
      
      if (response.ok && data && !data.error) {
        setHeroData({
          hero_badge: data.hero_badge ?? 'Get In Touch',
          hero_title: data.hero_title ?? "Let's Build Something",
          hero_title_highlight: data.hero_title_highlight ?? 'Amazing Together',
          hero_subtitle: data.hero_subtitle ?? 'Have a project in mind?',
          contact_intro: data.contact_intro ?? "We're here to help",
          stat1_icon: data.stat1_icon ?? 'Clock',
          stat1_value: data.stat1_value ?? '24h',
          stat1_label: data.stat1_label ?? 'Response Time',
          stat2_icon: data.stat2_icon ?? 'Users',
          stat2_value: data.stat2_value ?? '100+',
          stat2_label: data.stat2_label ?? 'Happy Clients',
          stat3_icon: data.stat3_icon ?? 'Globe',
          stat3_value: data.stat3_value ?? 'Global',
          stat3_label: data.stat3_label ?? 'Reach',
        })
        setMethods(data.methods || [])
        setFeatures(data.features || [])
      } else {
        console.error('API Error:', data)
        // Set default values even if API fails
        setHeroData({
          hero_badge: 'Get In Touch',
          hero_title: "Let's Build Something",
          hero_title_highlight: 'Amazing Together',
          hero_subtitle: 'Have a project in mind?',
          contact_intro: "We're here to help",
          stat1_icon: 'Clock',
          stat1_value: '24h',
          stat1_label: 'Response Time',
          stat2_icon: 'Users',
          stat2_value: '100+',
          stat2_label: 'Happy Clients',
          stat3_icon: 'Globe',
          stat3_value: 'Global',
          stat3_label: 'Reach',
        })
      }
    } catch (error) {
      console.error('Error fetching contact data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveHero = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/pages/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(heroData),
      })
      if (response.ok) {
        setToast({ message: 'Hero section saved!', type: 'success' })
      } else {
        setToast({ message: 'Failed to save', type: 'error' })
      }
    } catch (error) {
      setToast({ message: 'Error saving', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleAddMethod = async () => {
    const newMethod: ContactMethod = {
      icon: 'Mail',
      title: 'New Method',
      value: 'value',
      link: '',
      order_index: methods.length,
    }
    
    try {
      const response = await fetch('/api/contact-methods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMethod),
      })
      if (response.ok) {
        fetchContactData()
        setToast({ message: 'Method added!', type: 'success' })
      }
    } catch (error) {
      setToast({ message: 'Error adding method', type: 'error' })
    }
  }

  const handleUpdateMethod = async (method: ContactMethod) => {
    if (!method.id) return
    setSaving(true)
    try {
      const response = await fetch(`/api/contact-methods/${method.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(method),
      })
      if (response.ok) {
        setToast({ message: 'Method updated!', type: 'success' })
      }
    } catch (error) {
      setToast({ message: 'Error updating', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteMethod = async (id: string) => {
    if (!confirm('Delete this method?')) return
    try {
      const response = await fetch(`/api/contact-methods/${id}`, { method: 'DELETE' })
      if (response.ok) {
        fetchContactData()
        setToast({ message: 'Method deleted!', type: 'success' })
      }
    } catch (error) {
      setToast({ message: 'Error deleting', type: 'error' })
    }
  }

  const handleAddFeature = async () => {
    const newFeature: ContactFeature = {
      icon: 'Zap',
      title: 'New Feature',
      description: 'Feature description',
      order_index: features.length,
    }
    
    try {
      const response = await fetch('/api/contact-features', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFeature),
      })
      if (response.ok) {
        fetchContactData()
        setToast({ message: 'Feature added!', type: 'success' })
      }
    } catch (error) {
      setToast({ message: 'Error adding feature', type: 'error' })
    }
  }

  const handleUpdateFeature = async (feature: ContactFeature) => {
    if (!feature.id) return
    setSaving(true)
    try {
      const response = await fetch(`/api/contact-features/${feature.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feature),
      })
      if (response.ok) {
        setToast({ message: 'Feature updated!', type: 'success' })
      }
    } catch (error) {
      setToast({ message: 'Error updating', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteFeature = async (id: string) => {
    if (!confirm('Delete this feature?')) return
    try {
      const response = await fetch(`/api/contact-features/${id}`, { method: 'DELETE' })
      if (response.ok) {
        fetchContactData()
        setToast({ message: 'Feature deleted!', type: 'success' })
      }
    } catch (error) {
      setToast({ message: 'Error deleting', type: 'error' })
    }
  }

  return (
    <>
      <ToastContainer toast={toast} onClose={() => setToast(null)} />
      
      {/* Contact Method Modal */}
      <Dialog open={isMethodModalOpen} onOpenChange={setIsMethodModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingMethod?.id ? 'Edit Contact Method' : 'New Contact Method'}</DialogTitle>
          </DialogHeader>
          {editingMethod && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Icon (lucide-react)</Label>
                <Input
                  value={editingMethod.icon}
                  onChange={(e) => setEditingMethod({ ...editingMethod, icon: e.target.value })}
                  placeholder="Mail"
                />
              </div>

              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={editingMethod.title}
                  onChange={(e) => setEditingMethod({ ...editingMethod, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Value</Label>
                <Input
                  value={editingMethod.value}
                  onChange={(e) => setEditingMethod({ ...editingMethod, value: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Link (optional)</Label>
                <Input
                  value={editingMethod.link}
                  onChange={(e) => setEditingMethod({ ...editingMethod, link: e.target.value })}
                  placeholder="mailto:email@example.com"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={async () => {
                    if (editingMethod.id) {
                      await handleUpdateMethod(editingMethod)
                    } else {
                      setSaving(true)
                      try {
                        const response = await fetch('/api/contact-methods', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(editingMethod),
                        })
                        if (response.ok) {
                          setToast({ message: 'Method added!', type: 'success' })
                          setIsMethodModalOpen(false)
                          fetchContactData()
                        }
                      } catch (error) {
                        setToast({ message: 'Error adding method', type: 'error' })
                      } finally {
                        setSaving(false)
                      }
                    }
                  }}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Saving...' : 'Save'}
                </button>
                {editingMethod.id && (
                  <button
                    onClick={() => {
                      if (confirm('Delete this method?')) {
                        handleDeleteMethod(editingMethod.id!)
                        setIsMethodModalOpen(false)
                      }
                    }}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Contact Feature Modal */}
      <Dialog open={isFeatureModalOpen} onOpenChange={setIsFeatureModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingFeature?.id ? 'Edit Contact Feature' : 'New Contact Feature'}</DialogTitle>
          </DialogHeader>
          {editingFeature && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Icon (lucide-react)</Label>
                <Input
                  value={editingFeature.icon}
                  onChange={(e) => setEditingFeature({ ...editingFeature, icon: e.target.value })}
                  placeholder="Zap"
                />
              </div>

              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={editingFeature.title}
                  onChange={(e) => setEditingFeature({ ...editingFeature, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={editingFeature.description}
                  onChange={(e) => setEditingFeature({ ...editingFeature, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={async () => {
                    if (editingFeature.id) {
                      await handleUpdateFeature(editingFeature)
                    } else {
                      setSaving(true)
                      try {
                        const response = await fetch('/api/contact-features', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(editingFeature),
                        })
                        if (response.ok) {
                          setToast({ message: 'Feature added!', type: 'success' })
                          setIsFeatureModalOpen(false)
                          fetchContactData()
                        }
                      } catch (error) {
                        setToast({ message: 'Error adding feature', type: 'error' })
                      } finally {
                        setSaving(false)
                      }
                    }
                  }}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Saving...' : 'Save'}
                </button>
                {editingFeature.id && (
                  <button
                    onClick={() => {
                      if (confirm('Delete this feature?')) {
                        handleDeleteFeature(editingFeature.id!)
                        setIsFeatureModalOpen(false)
                      }
                    }}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <div className="space-y-10">
        <Tabs defaultValue="hero" className="w-full">
          <TabsList className="grid w-full grid-cols-3 gap-2 bg-white dark:bg-gray-900 h-auto p-2 mb-6 rounded-lg border border-gray-200 dark:border-gray-800">
            {[
              { value: 'hero', icon: Sparkles, label: 'Hero' },
              { value: 'methods', icon: Phone, label: 'Contact Methods' },
              { value: 'features', icon: Award, label: 'Features' },
            ].map(({ value, icon: Icon, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-md font-medium transition-colors data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* HERO SECTION */}
          <TabsContent value="hero">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-800">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-black dark:text-white">Hero Section</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Top banner of your contact page</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Badge Text</Label>
                  <Input
                    value={heroData.hero_badge}
                    onChange={(e) => setHeroData({ ...heroData, hero_badge: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Title (First Part)</Label>
                  <Input
                    value={heroData.hero_title}
                    onChange={(e) => setHeroData({ ...heroData, hero_title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Title Highlight (Gradient)</Label>
                  <Input
                    value={heroData.hero_title_highlight}
                    onChange={(e) => setHeroData({ ...heroData, hero_title_highlight: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Textarea
                    value={heroData.hero_subtitle}
                    onChange={(e) => setHeroData({ ...heroData, hero_subtitle: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Contact Intro Text</Label>
                  <Textarea
                    value={heroData.contact_intro}
                    onChange={(e) => setHeroData({ ...heroData, contact_intro: e.target.value })}
                    rows={2}
                  />
                </div>

                <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
                  <h3 className="text-lg font-bold text-black dark:text-white mb-4">Hero Stats</h3>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    {/* Stat 1 */}
                    <div className="space-y-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <Label>Stat 1 Icon</Label>
                      <Input
                        value={heroData.stat1_icon}
                        onChange={(e) => setHeroData({ ...heroData, stat1_icon: e.target.value })}
                        placeholder="Clock"
                      />
                      <Label>Stat 1 Value</Label>
                      <Input
                        value={heroData.stat1_value}
                        onChange={(e) => setHeroData({ ...heroData, stat1_value: e.target.value })}
                        placeholder="24h"
                      />
                      <Label>Stat 1 Label</Label>
                      <Input
                        value={heroData.stat1_label}
                        onChange={(e) => setHeroData({ ...heroData, stat1_label: e.target.value })}
                        placeholder="Response Time"
                      />
                    </div>

                    {/* Stat 2 */}
                    <div className="space-y-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <Label>Stat 2 Icon</Label>
                      <Input
                        value={heroData.stat2_icon}
                        onChange={(e) => setHeroData({ ...heroData, stat2_icon: e.target.value })}
                        placeholder="Users"
                      />
                      <Label>Stat 2 Value</Label>
                      <Input
                        value={heroData.stat2_value}
                        onChange={(e) => setHeroData({ ...heroData, stat2_value: e.target.value })}
                        placeholder="100+"
                      />
                      <Label>Stat 2 Label</Label>
                      <Input
                        value={heroData.stat2_label}
                        onChange={(e) => setHeroData({ ...heroData, stat2_label: e.target.value })}
                        placeholder="Happy Clients"
                      />
                    </div>

                    {/* Stat 3 */}
                    <div className="space-y-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <Label>Stat 3 Icon</Label>
                      <Input
                        value={heroData.stat3_icon}
                        onChange={(e) => setHeroData({ ...heroData, stat3_icon: e.target.value })}
                        placeholder="Globe"
                      />
                      <Label>Stat 3 Value</Label>
                      <Input
                        value={heroData.stat3_value}
                        onChange={(e) => setHeroData({ ...heroData, stat3_value: e.target.value })}
                        placeholder="Global"
                      />
                      <Label>Stat 3 Label</Label>
                      <Input
                        value={heroData.stat3_label}
                        onChange={(e) => setHeroData({ ...heroData, stat3_label: e.target.value })}
                        placeholder="Reach"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSaveHero}
                  disabled={saving}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </TabsContent>

          {/* CONTACT METHODS SECTION */}
          <TabsContent value="methods">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-black dark:text-white">Contact Methods</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Ways to reach you</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setEditingMethod({
                      icon: 'Mail',
                      title: 'New Method',
                      value: 'value',
                      link: '',
                      order_index: methods.length,
                    })
                    setIsMethodModalOpen(true)
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Method
                </button>
              </div>

              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                {methods.map((method) => (
                  <div
                    key={method.id}
                    className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors cursor-pointer group"
                    onClick={() => {
                      setEditingMethod(method)
                      setIsMethodModalOpen(true)
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Phone className="w-5 h-5 text-emerald-600" />
                      <Edit className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                    </div>
                    <h3 className="font-bold text-sm text-black dark:text-white mb-1 truncate">{method.title}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{method.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* FEATURES SECTION */}
          <TabsContent value="features">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-black dark:text-white">Contact Features</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Why contact us benefits</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setEditingFeature({
                      icon: 'Zap',
                      title: 'New Feature',
                      description: 'Feature description',
                      order_index: features.length,
                    })
                    setIsFeatureModalOpen(true)
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Feature
                </button>
              </div>

              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                {features.map((feature) => (
                  <div
                    key={feature.id}
                    className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors cursor-pointer group"
                    onClick={() => {
                      setEditingFeature(feature)
                      setIsFeatureModalOpen(true)
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Award className="w-5 h-5 text-emerald-600" />
                      <Edit className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                    </div>
                    <h3 className="font-bold text-sm text-black dark:text-white mb-1 truncate">{feature.title}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
