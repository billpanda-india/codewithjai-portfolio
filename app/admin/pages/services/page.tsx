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
  Briefcase,
  Award,
  Save,
  Loader2,
  Plus,
  Trash2,
  Edit,
  X,
} from 'lucide-react'

type HeroData = {
  hero_badge: string
  hero_title: string
  hero_title_highlight: string
  hero_subtitle: string
  hero_background_image: string
}

type Service = {
  id?: string
  title: string
  description: string
  icon: string
  features: string[]
  price_starting: string
  order_index: number
}

type Benefit = {
  id?: string
  title: string
  description: string
  icon: string
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

export default function ServicesPageAdmin() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  
  const [heroData, setHeroData] = useState<HeroData>({
    hero_badge: '',
    hero_title: '',
    hero_title_highlight: '',
    hero_subtitle: '',
    hero_background_image: '',
  })

  const [services, setServices] = useState<Service[]>([])
  const [benefits, setBenefits] = useState<Benefit[]>([])
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false)
  const [editingBenefit, setEditingBenefit] = useState<Benefit | null>(null)
  const [isBenefitModalOpen, setIsBenefitModalOpen] = useState(false)

  useEffect(() => {
    fetchServicesData()
  }, [])

  const fetchServicesData = async () => {
    try {
      const response = await fetch('/api/pages/services')
      if (response.ok) {
        const data = await response.json()
        setHeroData({
          hero_badge: data.hero_badge || '',
          hero_title: data.hero_title || '',
          hero_title_highlight: data.hero_title_highlight || '',
          hero_subtitle: data.hero_subtitle || '',
          hero_background_image: data.hero_background_image || '',
        })
        setServices(data.services || [])
        setBenefits(data.benefits || [])
      }
    } catch (error) {
      console.error('Error fetching services data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveHero = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/pages/services', {
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

  const handleAddService = async () => {
    const newService: Service = {
      title: 'New Service',
      description: 'Service description',
      icon: 'Code2',
      features: ['Feature 1', 'Feature 2'],
      price_starting: '$1,000',
      order_index: services.length,
    }
    
    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newService),
      })
      if (response.ok) {
        fetchServicesData()
        setToast({ message: 'Service added!', type: 'success' })
      }
    } catch (error) {
      setToast({ message: 'Error adding service', type: 'error' })
    }
  }

  const handleUpdateService = async (service: Service) => {
    if (!service.id) return
    setSaving(true)
    try {
      const response = await fetch(`/api/services/${service.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(service),
      })
      if (response.ok) {
        setToast({ message: 'Service updated!', type: 'success' })
      }
    } catch (error) {
      setToast({ message: 'Error updating', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteService = async (id: string) => {
    if (!confirm('Delete this service?')) return
    try {
      const response = await fetch(`/api/services/${id}`, { method: 'DELETE' })
      if (response.ok) {
        fetchServicesData()
        setToast({ message: 'Service deleted!', type: 'success' })
      }
    } catch (error) {
      setToast({ message: 'Error deleting', type: 'error' })
    }
  }

  const handleAddBenefit = async () => {
    const newBenefit: Benefit = {
      title: 'New Benefit',
      description: 'Benefit description',
      icon: 'CheckCircle',
      order_index: benefits.length,
    }
    
    try {
      const response = await fetch('/api/service-benefits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBenefit),
      })
      if (response.ok) {
        fetchServicesData()
        setToast({ message: 'Benefit added!', type: 'success' })
      }
    } catch (error) {
      setToast({ message: 'Error adding benefit', type: 'error' })
    }
  }

  const handleUpdateBenefit = async (benefit: Benefit) => {
    if (!benefit.id) return
    setSaving(true)
    try {
      const response = await fetch(`/api/service-benefits/${benefit.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(benefit),
      })
      if (response.ok) {
        setToast({ message: 'Benefit updated!', type: 'success' })
      }
    } catch (error) {
      setToast({ message: 'Error updating', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteBenefit = async (id: string) => {
    if (!confirm('Delete this benefit?')) return
    try {
      const response = await fetch(`/api/service-benefits/${id}`, { method: 'DELETE' })
      if (response.ok) {
        fetchServicesData()
        setToast({ message: 'Benefit deleted!', type: 'success' })
      }
    } catch (error) {
      setToast({ message: 'Error deleting', type: 'error' })
    }
  }

  return (
    <>
      <ToastContainer toast={toast} onClose={() => setToast(null)} />
      
      {/* Service Modal */}
      <Dialog open={isServiceModalOpen} onOpenChange={setIsServiceModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingService?.id ? 'Edit Service' : 'New Service'}</DialogTitle>
          </DialogHeader>
          {editingService && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={editingService.title}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Icon (lucide-react)</Label>
                  <Input
                    value={editingService.icon}
                    onChange={(e) => setEditingService({ ...editingService, icon: e.target.value })}
                    placeholder="Code2"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Starting Price</Label>
                  <Input
                    value={editingService.price_starting}
                    onChange={(e) => setEditingService({ ...editingService, price_starting: e.target.value })}
                    placeholder="$1,000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Features (comma separated)</Label>
                <Textarea
                  value={editingService.features.join(', ')}
                  onChange={(e) => setEditingService({ ...editingService, features: e.target.value.split(',').map(f => f.trim()) })}
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={async () => {
                    if (editingService.id) {
                      await handleUpdateService(editingService)
                    } else {
                      setSaving(true)
                      try {
                        const response = await fetch('/api/services', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(editingService),
                        })
                        if (response.ok) {
                          setToast({ message: 'Service added!', type: 'success' })
                          setIsServiceModalOpen(false)
                          fetchServicesData()
                        }
                      } catch (error) {
                        setToast({ message: 'Error adding service', type: 'error' })
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
                {editingService.id && (
                  <button
                    onClick={() => {
                      if (confirm('Delete this service?')) {
                        handleDeleteService(editingService.id!)
                        setIsServiceModalOpen(false)
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

      {/* Benefit Modal */}
      <Dialog open={isBenefitModalOpen} onOpenChange={setIsBenefitModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingBenefit?.id ? 'Edit Benefit' : 'New Benefit'}</DialogTitle>
          </DialogHeader>
          {editingBenefit && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={editingBenefit.title}
                  onChange={(e) => setEditingBenefit({ ...editingBenefit, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={editingBenefit.description}
                  onChange={(e) => setEditingBenefit({ ...editingBenefit, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Icon (lucide-react)</Label>
                <Input
                  value={editingBenefit.icon}
                  onChange={(e) => setEditingBenefit({ ...editingBenefit, icon: e.target.value })}
                  placeholder="CheckCircle"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={async () => {
                    if (editingBenefit.id) {
                      await handleUpdateBenefit(editingBenefit)
                    } else {
                      setSaving(true)
                      try {
                        const response = await fetch('/api/service-benefits', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(editingBenefit),
                        })
                        if (response.ok) {
                          setToast({ message: 'Benefit added!', type: 'success' })
                          setIsBenefitModalOpen(false)
                          fetchServicesData()
                        }
                      } catch (error) {
                        setToast({ message: 'Error adding benefit', type: 'error' })
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
                {editingBenefit.id && (
                  <button
                    onClick={() => {
                      if (confirm('Delete this benefit?')) {
                        handleDeleteBenefit(editingBenefit.id!)
                        setIsBenefitModalOpen(false)
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
              { value: 'services', icon: Briefcase, label: 'Services' },
              { value: 'benefits', icon: Award, label: 'Benefits' },
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">Top banner of your services page</p>
                </div>
              </div>

              {loading ? (
                <FormSkeleton />
              ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Badge (Small text above title)</Label>
                  <Input
                    value={heroData.hero_badge}
                    onChange={(e) => setHeroData({ ...heroData, hero_badge: e.target.value })}
                    placeholder="Our Services"
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
                  <Label>Background Image URL (optional)</Label>
                  <Input
                    value={heroData.hero_background_image}
                    onChange={(e) => setHeroData({ ...heroData, hero_background_image: e.target.value })}
                    placeholder="https://..."
                  />
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
              )}
            </div>
          </TabsContent>

          {/* SERVICES SECTION */}
          <TabsContent value="services">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-black dark:text-white">Services</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Manage your service offerings</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setEditingService({
                      title: 'New Service',
                      description: 'Service description',
                      icon: 'Code2',
                      features: ['Feature 1', 'Feature 2'],
                      price_starting: '$1,000',
                      order_index: services.length,
                    })
                    setIsServiceModalOpen(true)
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Service
                </button>
              </div>

              {loading ? (
                <CardsSkeleton />
              ) : (
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors cursor-pointer group"
                    onClick={() => {
                      setEditingService(service)
                      setIsServiceModalOpen(true)
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Briefcase className="w-5 h-5 text-emerald-600" />
                      <Edit className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                    </div>
                    <h3 className="font-bold text-sm text-black dark:text-white mb-1 truncate">{service.title}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">{service.description}</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{service.price_starting}</p>
                  </div>
                ))}
              </div>
              )}
            </div>
          </TabsContent>

          {/* BENEFITS SECTION */}
          <TabsContent value="benefits">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-black dark:text-white">Benefits</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Why choose your services</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setEditingBenefit({
                      title: 'New Benefit',
                      description: 'Benefit description',
                      icon: 'CheckCircle',
                      order_index: benefits.length,
                    })
                    setIsBenefitModalOpen(true)
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Benefit
                </button>
              </div>

              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                {benefits.map((benefit) => (
                  <div
                    key={benefit.id}
                    className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors cursor-pointer group"
                    onClick={() => {
                      setEditingBenefit(benefit)
                      setIsBenefitModalOpen(true)
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Award className="w-5 h-5 text-emerald-600" />
                      <Edit className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                    </div>
                    <h3 className="font-bold text-sm text-black dark:text-white mb-1 truncate">{benefit.title}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{benefit.description}</p>
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
