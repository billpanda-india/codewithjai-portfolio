'use client'

import { useState, useEffect, type ReactNode } from 'react'
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
  Workflow,
  FolderKanban,
  Code2,
  MessageSquare,
  Rocket,
  Save,
  Loader2,
  Plus,
  Edit,
  Trash2,
  X,
} from 'lucide-react'

type SectionCardProps = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  title: string
  description: string
  children: ReactNode
}

type SaveButtonProps = {
  onClick: () => void
  saving: boolean
}

type HeroData = {
  hero_title: string
  hero_title_highlight: string
  hero_subtitle: string
  hero_cta_label: string
  hero_cta_url: string
  hero_background_image: string
  cta_badge_text?: string
  cta_title?: string
  cta_title_highlight?: string
  cta_description?: string
  cta_primary_button_text?: string
  cta_primary_button_url?: string
  cta_secondary_button_text?: string
  cta_secondary_button_url?: string
  cta_stat1_number?: string
  cta_stat1_label?: string
  cta_stat2_number?: string
  cta_stat2_label?: string
  cta_stat3_number?: string
  cta_stat3_label?: string
}

type ProcessStep = {
  title: string
  description: string
  icon: string
  color: string
}

type Skill = {
  id: string
  name: string
  logo: string | null
  category: string
}

type Testimonial = {
  id: string
  client_name: string
  client_role: string | null
  company: string | null
  avatar: string | null
  quote: string
  rating: number
}

const SectionCard = ({ icon: Icon, title, description, children }: SectionCardProps) => (
  <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 space-y-6">
    <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-800">
      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <h2 className="text-lg font-bold text-black dark:text-white">{title}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </div>
    {children}
  </div>
)

const SaveButton = ({ onClick, saving }: SaveButtonProps) => (
  <button
    onClick={onClick}
    disabled={saving}
    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
  >
    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
    {saving ? 'Saving...' : 'Save'}
  </button>
)

const FormSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="space-y-3">
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
        <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
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

export default function HomePageAdmin() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [heroData, setHeroData] = useState<HeroData>({
    hero_title: '',
    hero_title_highlight: '',
    hero_subtitle: '',
    hero_cta_label: '',
    hero_cta_url: '',
    hero_background_image: '',
    cta_badge_text: '',
    cta_title: '',
    cta_title_highlight: '',
    cta_description: '',
    cta_primary_button_text: '',
    cta_primary_button_url: '',
    cta_secondary_button_text: '',
    cta_secondary_button_url: '',
    cta_stat1_number: '',
    cta_stat1_label: '',
    cta_stat2_number: '',
    cta_stat2_label: '',
    cta_stat3_number: '',
    cta_stat3_label: '',
  })
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false)
  const [editingProcessStep, setEditingProcessStep] = useState<{step: ProcessStep, index: number} | null>(null)
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false)

  useEffect(() => {
    fetchHomeData()
  }, [])

  const fetchHomeData = async () => {
    try {
      const [homeResponse, skillsResponse, testimonialsResponse] = await Promise.all([
        fetch('/api/pages/home'),
        fetch('/api/skills'),
        fetch('/api/testimonials')
      ])
      
      if (homeResponse.ok) {
        const data = await homeResponse.json()
        setHeroData({
          hero_title: data.hero_title || '',
          hero_title_highlight: data.hero_title_highlight || '',
          hero_subtitle: data.hero_subtitle || '',
          hero_cta_label: data.hero_cta_label || '',
          hero_cta_url: data.hero_cta_url || '',
          hero_background_image: data.hero_background_image || '',
          cta_badge_text: data.cta_badge_text || '',
          cta_title: data.cta_title || '',
          cta_title_highlight: data.cta_title_highlight || '',
          cta_description: data.cta_description || '',
          cta_primary_button_text: data.cta_primary_button_text || '',
          cta_primary_button_url: data.cta_primary_button_url || '',
          cta_secondary_button_text: data.cta_secondary_button_text || '',
          cta_secondary_button_url: data.cta_secondary_button_url || '',
          cta_stat1_number: data.cta_stat1_number || '',
          cta_stat1_label: data.cta_stat1_label || '',
          cta_stat2_number: data.cta_stat2_number || '',
          cta_stat2_label: data.cta_stat2_label || '',
          cta_stat3_number: data.cta_stat3_number || '',
          cta_stat3_label: data.cta_stat3_label || '',
        })

        // Load process steps from the same page data
        if (data.process_steps && Array.isArray(data.process_steps)) {
          setProcessSteps(data.process_steps)
        }
      }

      if (skillsResponse.ok) {
        const skillsData = await skillsResponse.json()
        setSkills(skillsData)
      }

      if (testimonialsResponse.ok) {
        const testimonialsData = await testimonialsResponse.json()
        setTestimonials(testimonialsData)
      }
    } catch (error) {
      console.error('Error fetching home data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveHero = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/pages/home', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hero_title: heroData.hero_title,
          hero_title_highlight: heroData.hero_title_highlight,
          hero_subtitle: heroData.hero_subtitle,
          hero_cta_label: heroData.hero_cta_label,
          hero_cta_url: heroData.hero_cta_url,
          hero_background_image: heroData.hero_background_image,
        }),
      })

      if (response.ok) {
        setToast({ message: 'Changes saved successfully!', type: 'success' })
      } else {
        setToast({ message: 'Failed to save changes', type: 'error' })
      }
    } catch (error) {
      console.error('Error saving hero data:', error)
      setToast({ message: 'Error saving changes', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleSaveCTA = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/pages/home', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cta_badge_text: heroData.cta_badge_text,
          cta_title: heroData.cta_title,
          cta_title_highlight: heroData.cta_title_highlight,
          cta_description: heroData.cta_description,
          cta_primary_button_text: heroData.cta_primary_button_text,
          cta_primary_button_url: heroData.cta_primary_button_url,
          cta_secondary_button_text: heroData.cta_secondary_button_text,
          cta_secondary_button_url: heroData.cta_secondary_button_url,
          cta_stat1_number: heroData.cta_stat1_number,
          cta_stat1_label: heroData.cta_stat1_label,
          cta_stat2_number: heroData.cta_stat2_number,
          cta_stat2_label: heroData.cta_stat2_label,
          cta_stat3_number: heroData.cta_stat3_number,
          cta_stat3_label: heroData.cta_stat3_label,
        }),
      })

      if (response.ok) {
        setToast({ message: 'CTA changes saved successfully!', type: 'success' })
      } else {
        setToast({ message: 'Failed to save CTA changes', type: 'error' })
      }
    } catch (error) {
      console.error('Error saving CTA data:', error)
      setToast({ message: 'Error saving CTA changes', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleSaveProcess = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/pages/home', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ process_steps: processSteps }),
      })

      if (response.ok) {
        setToast({ message: 'Process steps saved successfully!', type: 'success' })
        setIsProcessModalOpen(false)
        setEditingProcessStep(null)
      } else {
        setToast({ message: 'Failed to save process steps', type: 'error' })
      }
    } catch (error) {
      console.error('Error saving process steps:', error)
      setToast({ message: 'Error saving process steps', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const openProcessModal = (step: ProcessStep, index: number) => {
    setEditingProcessStep({ step: { ...step }, index })
    setIsProcessModalOpen(true)
  }

  const openNewProcessModal = () => {
    const newStep = {
      title: `Step ${processSteps.length + 1}`,
      description: 'Add description here',
      icon: 'Lightbulb',
      color: 'from-blue-500 to-purple-500'
    }
    setEditingProcessStep({ step: newStep, index: -1 })
    setIsProcessModalOpen(true)
  }

  const saveProcessModal = async () => {
    if (!editingProcessStep) return
    
    const newSteps = [...processSteps]
    if (editingProcessStep.index === -1) {
      newSteps.push(editingProcessStep.step)
    } else {
      newSteps[editingProcessStep.index] = editingProcessStep.step
    }
    setProcessSteps(newSteps)
    await handleSaveProcess()
  }

  const openSkillModal = (skill: Skill | null = null) => {
    setEditingSkill(skill || {
      id: '',
      name: '',
      logo: '',
      category: 'frontend'
    })
    setIsSkillModalOpen(true)
  }

  const saveSkillModal = async () => {
    if (!editingSkill) return
    
    setSaving(true)
    try {
      const isNew = !editingSkill.id
      const url = isNew ? '/api/skills' : `/api/skills/${editingSkill.id}`
      const method = isNew ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingSkill),
      })

      if (response.ok) {
        setToast({ message: isNew ? 'Skill added!' : 'Skill updated!', type: 'success' })
        setIsSkillModalOpen(false)
        setEditingSkill(null)
        fetchHomeData()
      } else {
        setToast({ message: 'Failed to save skill', type: 'error' })
      }
    } catch (error) {
      setToast({ message: 'Error saving skill', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const openTestimonialModal = (testimonial: Testimonial | null = null) => {
    setEditingTestimonial(testimonial || {
      id: '',
      client_name: '',
      client_role: '',
      company: '',
      avatar: '',
      quote: '',
      rating: 5
    })
    setIsTestimonialModalOpen(true)
  }

  const saveTestimonialModal = async () => {
    if (!editingTestimonial) return
    
    setSaving(true)
    try {
      const isNew = !editingTestimonial.id
      const url = isNew ? '/api/testimonials' : `/api/testimonials/${editingTestimonial.id}`
      const method = isNew ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTestimonial),
      })

      if (response.ok) {
        setToast({ message: isNew ? 'Testimonial added!' : 'Testimonial updated!', type: 'success' })
        setIsTestimonialModalOpen(false)
        setEditingTestimonial(null)
        fetchHomeData()
      } else {
        setToast({ message: 'Failed to save testimonial', type: 'error' })
      }
    } catch (error) {
      setToast({ message: 'Error saving testimonial', type: 'error' })
    } finally {
      setSaving(false)
    }
  }



  const handleDeleteSkill = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return

    try {
      const response = await fetch(`/api/skills/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setToast({ message: 'Skill deleted successfully!', type: 'success' })
        fetchHomeData()
      } else {
        setToast({ message: 'Failed to delete skill', type: 'error' })
      }
    } catch (error) {
      console.error('Error deleting skill:', error)
      setToast({ message: 'Error deleting skill', type: 'error' })
    }
  }

  const handleSaveTestimonial = async (testimonial: Testimonial) => {
    setSaving(true)
    try {
      const response = await fetch(`/api/testimonials/${testimonial.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testimonial),
      })

      if (response.ok) {
        setToast({ message: 'Testimonial updated successfully!', type: 'success' })
        fetchHomeData()
      } else {
        setToast({ message: 'Failed to update testimonial', type: 'error' })
      }
    } catch (error) {
      console.error('Error saving testimonial:', error)
      setToast({ message: 'Error saving testimonial', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleAddTestimonial = async (testimonial: Omit<Testimonial, 'id'>) => {
    setSaving(true)
    try {
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testimonial),
      })

      if (response.ok) {
        setToast({ message: 'Testimonial added successfully!', type: 'success' })
        fetchHomeData()
      } else {
        setToast({ message: 'Failed to add testimonial', type: 'error' })
      }
    } catch (error) {
      console.error('Error adding testimonial:', error)
      setToast({ message: 'Error adding testimonial', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return

    try {
      const response = await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setToast({ message: 'Testimonial deleted successfully!', type: 'success' })
        fetchHomeData()
      } else {
        setToast({ message: 'Failed to delete testimonial', type: 'error' })
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error)
      setToast({ message: 'Error deleting testimonial', type: 'error' })
    }
  }

  return (
    <>
      <ToastContainer toast={toast} onClose={() => setToast(null)} />

      {/* Process Step Modal */}
      <Dialog open={isProcessModalOpen} onOpenChange={setIsProcessModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProcessStep?.index === -1 ? 'New Process Step' : `Edit Step ${(editingProcessStep?.index ?? 0) + 1}`}</DialogTitle>
          </DialogHeader>
          {editingProcessStep && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={editingProcessStep.step.title}
                  onChange={(e) => setEditingProcessStep({...editingProcessStep, step: {...editingProcessStep.step, title: e.target.value}})}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={editingProcessStep.step.description}
                  onChange={(e) => setEditingProcessStep({...editingProcessStep, step: {...editingProcessStep.step, description: e.target.value}})}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Icon</Label>
                  <Input
                    value={editingProcessStep.step.icon}
                    onChange={(e) => setEditingProcessStep({...editingProcessStep, step: {...editingProcessStep.step, icon: e.target.value}})}
                    placeholder="Lightbulb"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Color</Label>
                  <Input
                    value={editingProcessStep.step.color}
                    onChange={(e) => setEditingProcessStep({...editingProcessStep, step: {...editingProcessStep.step, color: e.target.value}})}
                    placeholder="from-blue-500 to-purple-500"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  onClick={async () => {
                    await saveProcessModal()
                  }}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Saving...' : 'Save'}
                </button>
                {editingProcessStep.index !== -1 && (
                  <button
                    onClick={() => {
                      if (confirm('Delete this step?')) {
                        const newSteps = processSteps.filter((_, i) => i !== editingProcessStep.index)
                        setProcessSteps(newSteps)
                        handleSaveProcess()
                        setIsProcessModalOpen(false)
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

      {/* Skill Modal */}
      <Dialog open={isSkillModalOpen} onOpenChange={setIsSkillModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingSkill?.id ? 'Edit Skill' : 'New Skill'}</DialogTitle>
          </DialogHeader>
          {editingSkill && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name *</Label>
                  <Input
                    value={editingSkill.name}
                    onChange={(e) => setEditingSkill({...editingSkill, name: e.target.value})}
                    placeholder="React"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <select
                    value={editingSkill.category}
                    onChange={(e) => setEditingSkill({...editingSkill, category: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                  >
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="database">Database</option>
                    <option value="devops">DevOps</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Icon (react-icons name)</Label>
                <Input
                  value={editingSkill.logo || ''}
                  onChange={(e) => setEditingSkill({...editingSkill, logo: e.target.value})}
                  placeholder="SiReact, SiDocker, Cloud"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  onClick={async () => {
                    await saveSkillModal()
                  }}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Saving...' : 'Save'}
                </button>
                {editingSkill.id && (
                  <button
                    onClick={() => {
                      if (confirm('Delete this skill?')) {
                        handleDeleteSkill(editingSkill.id)
                        setIsSkillModalOpen(false)
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

      {/* Testimonial Modal */}
      <Dialog open={isTestimonialModalOpen} onOpenChange={setIsTestimonialModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTestimonial?.id ? 'Edit Testimonial' : 'New Testimonial'}</DialogTitle>
          </DialogHeader>
          {editingTestimonial && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Client Name *</Label>
                <Input
                  value={editingTestimonial.client_name}
                  onChange={(e) => setEditingTestimonial({...editingTestimonial, client_name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input
                    value={editingTestimonial.client_role || ''}
                    onChange={(e) => setEditingTestimonial({...editingTestimonial, client_role: e.target.value})}
                    placeholder="CEO"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input
                    value={editingTestimonial.company || ''}
                    onChange={(e) => setEditingTestimonial({...editingTestimonial, company: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Quote *</Label>
                <Textarea
                  value={editingTestimonial.quote}
                  onChange={(e) => setEditingTestimonial({...editingTestimonial, quote: e.target.value})}
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Avatar URL</Label>
                  <Input
                    value={editingTestimonial.avatar || ''}
                    onChange={(e) => setEditingTestimonial({...editingTestimonial, avatar: e.target.value})}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Rating</Label>
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    value={editingTestimonial.rating}
                    onChange={(e) => setEditingTestimonial({...editingTestimonial, rating: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  onClick={async () => {
                    await saveTestimonialModal()
                  }}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Saving...' : 'Save'}
                </button>
                {editingTestimonial.id && (
                  <button
                    onClick={() => {
                      if (confirm('Delete this testimonial?')) {
                        handleDeleteTestimonial(editingTestimonial.id)
                        setIsTestimonialModalOpen(false)
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

        {/* TABS WRAPPER — IMPORTANT */}
        <Tabs defaultValue="hero" className="w-full">

        {/* TAB BUTTONS */}
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 bg-white dark:bg-gray-900 h-auto p-2 mb-6 rounded-lg border border-gray-200 dark:border-gray-800">
          {[
            { value: 'hero', icon: Sparkles, label: 'Hero' },
            { value: 'process', icon: Workflow, label: 'Process' },
            { value: 'techstack', icon: Code2, label: 'Tech' },
            { value: 'testimonials', icon: MessageSquare, label: 'Reviews' },
            { value: 'cta', icon: Rocket, label: 'CTA' },
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
          <SectionCard icon={Sparkles} title="Hero Section" description="Top banner of your homepage">
            {loading ? (
              <FormSkeleton />
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Title (First Line)</Label>
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

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>CTA Button Text</Label>
                    <Input
                      value={heroData.hero_cta_label}
                      onChange={(e) => setHeroData({ ...heroData, hero_cta_label: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>CTA Button URL</Label>
                    <Input
                      value={heroData.hero_cta_url}
                      onChange={(e) => setHeroData({ ...heroData, hero_cta_url: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Background Image URL (optional)</Label>
                  <Input
                    value={heroData.hero_background_image}
                    onChange={(e) => setHeroData({ ...heroData, hero_background_image: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <SaveButton onClick={handleSaveHero} saving={saving} />
              </div>
            )}
          </SectionCard>
        </TabsContent>

        {/* PROCESS SECTION */}
        <TabsContent value="process">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Workflow className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-black dark:text-white">Process Steps</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Your workflow</p>
                </div>
              </div>
              <button
                onClick={openNewProcessModal}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Step
              </button>
            </div>

            {loading ? (
              <CardsSkeleton />
            ) : (
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                {processSteps.map((step, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors cursor-pointer group"
                    onClick={() => openProcessModal(step, index)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-blue-500 text-white rounded-full flex items-center justify-center font-bold text-xs">
                        {index + 1}
                      </div>
                      <Edit className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                    </div>
                    <h3 className="font-bold text-sm text-black dark:text-white mb-1 truncate">{step.title}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{step.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>



        {/* TECH STACK */}
        <TabsContent value="techstack">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-black dark:text-white">Tech Stack</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Your skills</p>
                </div>
              </div>
              <button
                onClick={() => openSkillModal()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Skill
              </button>
            </div>

            {loading ? (
              <CardsSkeleton />
            ) : (
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors cursor-pointer group"
                    onClick={() => openSkillModal(skill)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Code2 className="w-5 h-5 text-emerald-600" />
                      <Edit className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                    </div>
                    <h3 className="font-bold text-sm text-black dark:text-white mb-1 truncate">{skill.name}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">{skill.category}</p>
                    {skill.logo && <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 truncate">{skill.logo}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* TESTIMONIALS */}
        <TabsContent value="testimonials">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-black dark:text-white">Testimonials</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Client reviews</p>
                </div>
              </div>
              <button
                onClick={() => openTestimonialModal()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Review
              </button>
            </div>

            {loading ? (
              <CardsSkeleton />
            ) : (
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors cursor-pointer group"
                    onClick={() => openTestimonialModal(testimonial)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <MessageSquare className="w-5 h-5 text-emerald-600" />
                      <Edit className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                    </div>
                    <h3 className="font-bold text-sm text-black dark:text-white mb-1 truncate">{testimonial.client_name}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {testimonial.client_role}{testimonial.company && ` at ${testimonial.company}`}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 line-clamp-2 italic">"{testimonial.quote}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* CTA */}
        <TabsContent value="cta">
          <SectionCard icon={Rocket} title="Call to Action" description="Final CTA section">
            {loading ? (
              <FormSkeleton />
            ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Badge Text</Label>
                <Input
                  value={heroData.cta_badge_text || ''}
                  onChange={(e) => setHeroData({ ...heroData, cta_badge_text: e.target.value })}
                  placeholder="Available for new projects"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title (First Line)</Label>
                  <Input
                    value={heroData.cta_title || ''}
                    onChange={(e) => setHeroData({ ...heroData, cta_title: e.target.value })}
                    placeholder="Let's Build Something"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title Highlight (Second Line)</Label>
                  <Input
                    value={heroData.cta_title_highlight || ''}
                    onChange={(e) => setHeroData({ ...heroData, cta_title_highlight: e.target.value })}
                    placeholder="Amazing Together"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={heroData.cta_description || ''}
                  onChange={(e) => setHeroData({ ...heroData, cta_description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Primary Button Text</Label>
                  <Input
                    value={heroData.cta_primary_button_text || ''}
                    onChange={(e) => setHeroData({ ...heroData, cta_primary_button_text: e.target.value })}
                    placeholder="Get In Touch"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Primary Button URL</Label>
                  <Input
                    value={heroData.cta_primary_button_url || ''}
                    onChange={(e) => setHeroData({ ...heroData, cta_primary_button_url: e.target.value })}
                    placeholder="/contact"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Secondary Button Text</Label>
                  <Input
                    value={heroData.cta_secondary_button_text || ''}
                    onChange={(e) => setHeroData({ ...heroData, cta_secondary_button_text: e.target.value })}
                    placeholder="View My Work"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Secondary Button URL</Label>
                  <Input
                    value={heroData.cta_secondary_button_url || ''}
                    onChange={(e) => setHeroData({ ...heroData, cta_secondary_button_url: e.target.value })}
                    placeholder="/projects"
                  />
                </div>
              </div>

              <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-6 mt-6">
                <h3 className="text-lg font-bold text-black dark:text-white mb-4">Statistics</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Stat 1 Number</Label>
                    <Input
                      value={heroData.cta_stat1_number || ''}
                      onChange={(e) => setHeroData({ ...heroData, cta_stat1_number: e.target.value })}
                      placeholder="50+"
                    />
                    <Label>Stat 1 Label</Label>
                    <Input
                      value={heroData.cta_stat1_label || ''}
                      onChange={(e) => setHeroData({ ...heroData, cta_stat1_label: e.target.value })}
                      placeholder="Projects Completed"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Stat 2 Number</Label>
                    <Input
                      value={heroData.cta_stat2_number || ''}
                      onChange={(e) => setHeroData({ ...heroData, cta_stat2_number: e.target.value })}
                      placeholder="30+"
                    />
                    <Label>Stat 2 Label</Label>
                    <Input
                      value={heroData.cta_stat2_label || ''}
                      onChange={(e) => setHeroData({ ...heroData, cta_stat2_label: e.target.value })}
                      placeholder="Happy Clients"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Stat 3 Number</Label>
                    <Input
                      value={heroData.cta_stat3_number || ''}
                      onChange={(e) => setHeroData({ ...heroData, cta_stat3_number: e.target.value })}
                      placeholder="5.0"
                    />
                    <Label>Stat 3 Label</Label>
                    <Input
                      value={heroData.cta_stat3_label || ''}
                      onChange={(e) => setHeroData({ ...heroData, cta_stat3_label: e.target.value })}
                      placeholder="Average Rating"
                    />
                  </div>
                </div>
              </div>

              <SaveButton onClick={handleSaveCTA} saving={saving} />
            </div>
            )}
          </SectionCard>
        </TabsContent>

        </Tabs>
      </div>
    </>
  )
}
