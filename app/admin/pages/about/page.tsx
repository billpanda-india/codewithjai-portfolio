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
  User,
  Briefcase,
  GraduationCap,
  Award,
  Save,
  Loader2,
  Plus,
  Trash2,
  Edit,
  X,
} from 'lucide-react'

type HeroData = {
  hero_title: string
  hero_title_highlight: string
  hero_subtitle: string
  hero_background_image: string
}

type AboutMeData = {
  title: string
  title_highlight: string
  description: string
  image: string
  years_experience: string
  projects_completed: string
  happy_clients: string
}

type ExperienceItem = {
  id?: string
  company: string
  role: string
  duration: string
  location: string
  description: string
  logo_url: string
  order_index: number
}

type EducationItem = {
  id?: string
  institution: string
  degree: string
  field: string
  duration: string
  location: string
  description: string
  logo_url: string
  order_index: number
}

type CertificationItem = {
  id?: string
  title: string
  issuer: string
  issue_date: string
  credential_id: string
  credential_url: string
  logo_url: string
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

export default function AboutPageAdmin() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  
  const [heroData, setHeroData] = useState<HeroData>({
    hero_title: '',
    hero_title_highlight: '',
    hero_subtitle: '',
    hero_background_image: '',
  })

  const [aboutMe, setAboutMe] = useState<AboutMeData>({
    title: '',
    title_highlight: '',
    description: '',
    image: '',
    years_experience: '',
    projects_completed: '',
    happy_clients: '',
  })
  const [uploadingAboutImage, setUploadingAboutImage] = useState(false)

  const [experience, setExperience] = useState<ExperienceItem[]>([])
  const [editingExperience, setEditingExperience] = useState<ExperienceItem | null>(null)
  const [isExpModalOpen, setIsExpModalOpen] = useState(false)
  const [education, setEducation] = useState<EducationItem[]>([])
  const [editingEducation, setEditingEducation] = useState<EducationItem | null>(null)
  const [isEduModalOpen, setIsEduModalOpen] = useState(false)
  const [certifications, setCertifications] = useState<CertificationItem[]>([])
  const [editingCertification, setEditingCertification] = useState<CertificationItem | null>(null)
  const [isCertModalOpen, setIsCertModalOpen] = useState(false)

  useEffect(() => {
    fetchAboutData()
  }, [])

  const fetchAboutData = async () => {
    try {
      const response = await fetch('/api/pages/about')
      if (response.ok) {
        const data = await response.json()
        setHeroData({
          hero_title: data.hero_title || '',
          hero_title_highlight: data.hero_title_highlight || '',
          hero_subtitle: data.hero_subtitle || '',
          hero_background_image: data.hero_background_image || '',
        })
        setAboutMe(data.about_me || {
          title: '',
          title_highlight: '',
          description: '',
          image: '',
          years_experience: '',
          projects_completed: '',
          happy_clients: '',
        })
        setExperience(data.experience || [])
        setEducation(data.education || [])
        setCertifications(data.certifications || [])
      }
    } catch (error) {
      console.error('Error fetching about data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveHero = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/pages/about', {
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

  const handleSaveAboutMe = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/pages/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ about_me: aboutMe }),
      })
      if (response.ok) {
        setToast({ message: 'About Me section saved!', type: 'success' })
      } else {
        setToast({ message: 'Failed to save', type: 'error' })
      }
    } catch (error) {
      setToast({ message: 'Error saving', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleAddExperience = async () => {
    const newItem: ExperienceItem = {
      company: 'Company Name',
      role: 'Job Title',
      duration: '2020 - Present',
      location: 'Location',
      description: 'Job description',
      logo_url: '',
      order_index: experience.length,
    }
    
    try {
      const response = await fetch('/api/experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      })
      if (response.ok) {
        fetchAboutData()
        setToast({ message: 'Experience added!', type: 'success' })
      }
    } catch (error) {
      setToast({ message: 'Error adding experience', type: 'error' })
    }
  }

  const handleUpdateExperience = async (item: ExperienceItem) => {
    if (!item.id) return
    setSaving(true)
    try {
      const response = await fetch(`/api/experience/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      })
      if (response.ok) {
        setToast({ message: 'Experience updated!', type: 'success' })
      }
    } catch (error) {
      setToast({ message: 'Error updating', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteExperience = async (id: string) => {
    if (!confirm('Delete this experience?')) return
    try {
      const response = await fetch(`/api/experience/${id}`, { method: 'DELETE' })
      if (response.ok) {
        fetchAboutData()
        setToast({ message: 'Experience deleted!', type: 'success' })
      }
    } catch (error) {
      setToast({ message: 'Error deleting', type: 'error' })
    }
  }

  const handleAddEducation = async () => {
    const newItem: EducationItem = {
      institution: 'University Name',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      duration: '2016 - 2020',
      location: 'Location',
      description: 'Education description',
      logo_url: '',
      order_index: education.length,
    }
    
    try {
      const response = await fetch('/api/education', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      })
      if (response.ok) {
        fetchAboutData()
        setToast({ message: 'Education added!', type: 'success' })
      }
    } catch (error) {
      setToast({ message: 'Error adding education', type: 'error' })
    }
  }

  const handleUpdateEducation = async (item: EducationItem) => {
    if (!item.id) return
    setSaving(true)
    try {
      const response = await fetch(`/api/education/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      })
      if (response.ok) {
        setToast({ message: 'Education updated!', type: 'success' })
      }
    } catch (error) {
      setToast({ message: 'Error updating', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteEducation = async (id: string) => {
    if (!confirm('Delete this education?')) return
    try {
      const response = await fetch(`/api/education/${id}`, { method: 'DELETE' })
      if (response.ok) {
        fetchAboutData()
        setToast({ message: 'Education deleted!', type: 'success' })
      }
    } catch (error) {
      setToast({ message: 'Error deleting', type: 'error' })
    }
  }

  const handleAddCertification = async () => {
    const newItem: CertificationItem = {
      title: 'Certification Name',
      issuer: 'Issuing Organization',
      issue_date: '2023',
      credential_id: '',
      credential_url: '',
      logo_url: '',
      order_index: certifications.length,
    }
    
    try {
      const response = await fetch('/api/certifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      })
      if (response.ok) {
        fetchAboutData()
        setToast({ message: 'Certification added!', type: 'success' })
      }
    } catch (error) {
      setToast({ message: 'Error adding certification', type: 'error' })
    }
  }

  const handleUpdateCertification = async (item: CertificationItem) => {
    if (!item.id) return
    setSaving(true)
    try {
      const response = await fetch(`/api/certifications/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      })
      if (response.ok) {
        setToast({ message: 'Certification updated!', type: 'success' })
      }
    } catch (error) {
      setToast({ message: 'Error updating', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteCertification = async (id: string) => {
    if (!confirm('Delete this certification?')) return
    try {
      const response = await fetch(`/api/certifications/${id}`, { method: 'DELETE' })
      if (response.ok) {
        fetchAboutData()
        setToast({ message: 'Certification deleted!', type: 'success' })
      }
    } catch (error) {
      setToast({ message: 'Error deleting', type: 'error' })
    }
  }

  return (
    <>
      <ToastContainer toast={toast} onClose={() => setToast(null)} />
      
      <div className="space-y-10">
        <Tabs defaultValue="hero" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 bg-white dark:bg-gray-900 h-auto p-2 mb-6 rounded-lg border border-gray-200 dark:border-gray-800">
            {[
              { value: 'hero', icon: Sparkles, label: 'Hero' },
              { value: 'about', icon: User, label: 'About Me' },
              { value: 'experience', icon: Briefcase, label: 'Experience' },
              { value: 'education', icon: GraduationCap, label: 'Education' },
              { value: 'certifications', icon: Award, label: 'Certifications' },
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">Top banner of your about page</p>
                </div>
              </div>

              {loading ? (
                <FormSkeleton />
              ) : (
              <div className="space-y-4">
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

          {/* ABOUT ME SECTION */}
          <TabsContent value="about">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-800">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-black dark:text-white">About Me Section</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Your story and stats</p>
                </div>
              </div>

              {loading ? (
                <FormSkeleton />
              ) : (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={aboutMe.title}
                      onChange={(e) => setAboutMe({ ...aboutMe, title: e.target.value })}
                      placeholder="About"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Title Highlight</Label>
                    <Input
                      value={aboutMe.title_highlight}
                      onChange={(e) => setAboutMe({ ...aboutMe, title_highlight: e.target.value })}
                      placeholder="Me"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={aboutMe.description}
                    onChange={(e) => setAboutMe({ ...aboutMe, description: e.target.value })}
                    rows={5}
                    placeholder="Tell your story..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Profile Image</Label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        
                        setUploadingAboutImage(true)
                        try {
                          const formData = new FormData()
                          formData.append('file', file)
                          formData.append('folder', 'about')
                          
                          const res = await fetch('/api/upload/image', {
                            method: 'POST',
                            body: formData,
                          })
                          
                          if (res.ok) {
                            const { url } = await res.json()
                            setAboutMe({ ...aboutMe, image: url })
                            setToast({ message: 'Image uploaded!', type: 'success' })
                          } else {
                            setToast({ message: 'Failed to upload image', type: 'error' })
                          }
                        } catch (error) {
                          setToast({ message: 'Error uploading image', type: 'error' })
                        } finally {
                          setUploadingAboutImage(false)
                        }
                      }}
                      disabled={uploadingAboutImage}
                      className="flex-1 text-sm text-gray-600 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 dark:file:bg-emerald-900 dark:file:text-emerald-300"
                    />
                    {uploadingAboutImage && <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />}
                  </div>
                  {aboutMe.image && (
                    <div className="mt-2">
                      <img src={aboutMe.image} alt="Preview" className="w-32 h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Years Experience</Label>
                    <Input
                      value={aboutMe.years_experience}
                      onChange={(e) => setAboutMe({ ...aboutMe, years_experience: e.target.value })}
                      placeholder="5+"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Projects Completed</Label>
                    <Input
                      value={aboutMe.projects_completed}
                      onChange={(e) => setAboutMe({ ...aboutMe, projects_completed: e.target.value })}
                      placeholder="50+"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Happy Clients</Label>
                    <Input
                      value={aboutMe.happy_clients}
                      onChange={(e) => setAboutMe({ ...aboutMe, happy_clients: e.target.value })}
                      placeholder="30+"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSaveAboutMe}
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

          {/* EXPERIENCE SECTION */}
          <TabsContent value="experience">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-black dark:text-white">Experience</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Your work history</p>
                  </div>
                </div>
                <button
                  onClick={handleAddExperience}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Experience
                </button>
              </div>

              {loading ? (
                <CardsSkeleton />
              ) : (
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                {experience.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors cursor-pointer group"
                    onClick={() => {
                      setEditingExperience(item)
                      setIsExpModalOpen(true)
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Briefcase className="w-5 h-5 text-emerald-600" />
                      <Edit className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                    </div>
                    <h3 className="font-bold text-sm text-black dark:text-white mb-1 truncate">{item.role}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{item.company}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{item.duration}</p>
                  </div>
                ))}
              </div>
              )}
            </div>

            <Dialog open={isExpModalOpen} onOpenChange={setIsExpModalOpen}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Experience</DialogTitle>
                </DialogHeader>
                {editingExperience && (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Company</Label>
                        <Input
                          value={editingExperience.company}
                          onChange={(e) => setEditingExperience({ ...editingExperience, company: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Role</Label>
                        <Input
                          value={editingExperience.role}
                          onChange={(e) => setEditingExperience({ ...editingExperience, role: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Duration</Label>
                        <Input
                          value={editingExperience.duration}
                          onChange={(e) => setEditingExperience({ ...editingExperience, duration: e.target.value })}
                          placeholder="2020 - Present"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                          value={editingExperience.location}
                          onChange={(e) => setEditingExperience({ ...editingExperience, location: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={editingExperience.description}
                        onChange={(e) => setEditingExperience({ ...editingExperience, description: e.target.value })}
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Logo URL (optional)</Label>
                      <Input
                        value={editingExperience.logo_url}
                        onChange={(e) => setEditingExperience({ ...editingExperience, logo_url: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>

                    <div className="flex gap-2 pt-4">
                      <button
                        onClick={async () => {
                          await handleUpdateExperience(editingExperience)
                          setIsExpModalOpen(false)
                        }}
                        disabled={saving}
                        className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={() => {
                          if (editingExperience.id && confirm('Delete this experience?')) {
                            handleDeleteExperience(editingExperience.id)
                            setIsExpModalOpen(false)
                          }
                        }}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* EDUCATION SECTION */}
          <TabsContent value="education">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-black dark:text-white">Education</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Your academic background</p>
                  </div>
                </div>
                <button
                  onClick={handleAddEducation}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Education
                </button>
              </div>

              {loading ? (
                <CardsSkeleton />
              ) : (
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                {education.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors cursor-pointer group"
                    onClick={() => {
                      setEditingEducation(item)
                      setIsEduModalOpen(true)
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <GraduationCap className="w-5 h-5 text-emerald-600" />
                      <Edit className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                    </div>
                    <h3 className="font-bold text-sm text-black dark:text-white mb-1 truncate">{item.degree}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{item.institution}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{item.duration}</p>
                  </div>
                ))}
              </div>
              )}
            </div>

            <Dialog open={isEduModalOpen} onOpenChange={setIsEduModalOpen}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Education</DialogTitle>
                </DialogHeader>
                {editingEducation && (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Institution</Label>
                        <Input
                          value={editingEducation.institution}
                          onChange={(e) => setEditingEducation({ ...editingEducation, institution: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Degree</Label>
                        <Input
                          value={editingEducation.degree}
                          onChange={(e) => setEditingEducation({ ...editingEducation, degree: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Field of Study</Label>
                        <Input
                          value={editingEducation.field}
                          onChange={(e) => setEditingEducation({ ...editingEducation, field: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Duration</Label>
                        <Input
                          value={editingEducation.duration}
                          onChange={(e) => setEditingEducation({ ...editingEducation, duration: e.target.value })}
                          placeholder="2016 - 2020"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input
                        value={editingEducation.location}
                        onChange={(e) => setEditingEducation({ ...editingEducation, location: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={editingEducation.description}
                        onChange={(e) => setEditingEducation({ ...editingEducation, description: e.target.value })}
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Logo URL (optional)</Label>
                      <Input
                        value={editingEducation.logo_url}
                        onChange={(e) => setEditingEducation({ ...editingEducation, logo_url: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>

                    <div className="flex gap-2 pt-4">
                      <button
                        onClick={async () => {
                          await handleUpdateEducation(editingEducation)
                          setIsEduModalOpen(false)
                        }}
                        disabled={saving}
                        className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={() => {
                          if (editingEducation.id && confirm('Delete this education?')) {
                            handleDeleteEducation(editingEducation.id)
                            setIsEduModalOpen(false)
                          }
                        }}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* CERTIFICATIONS SECTION */}
          <TabsContent value="certifications">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-black dark:text-white">Certifications</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Your professional certifications</p>
                  </div>
                </div>
                <button
                  onClick={handleAddCertification}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Certification
                </button>
              </div>

              {loading ? (
                <CardsSkeleton />
              ) : (
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                {certifications.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors cursor-pointer group"
                    onClick={() => {
                      setEditingCertification(item)
                      setIsCertModalOpen(true)
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Award className="w-5 h-5 text-emerald-600" />
                      <Edit className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                    </div>
                    <h3 className="font-bold text-sm text-black dark:text-white mb-1 truncate">{item.title}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{item.issuer}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{item.issue_date}</p>
                  </div>
                ))}
              </div>
              )}
            </div>

            <Dialog open={isCertModalOpen} onOpenChange={setIsCertModalOpen}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Certification</DialogTitle>
                </DialogHeader>
                {editingCertification && (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={editingCertification.title}
                          onChange={(e) => setEditingCertification({ ...editingCertification, title: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Issuer</Label>
                        <Input
                          value={editingCertification.issuer}
                          onChange={(e) => setEditingCertification({ ...editingCertification, issuer: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Issue Date</Label>
                        <Input
                          value={editingCertification.issue_date}
                          onChange={(e) => setEditingCertification({ ...editingCertification, issue_date: e.target.value })}
                          placeholder="2023"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Credential ID</Label>
                        <Input
                          value={editingCertification.credential_id}
                          onChange={(e) => setEditingCertification({ ...editingCertification, credential_id: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Credential URL</Label>
                      <Input
                        value={editingCertification.credential_url}
                        onChange={(e) => setEditingCertification({ ...editingCertification, credential_url: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Logo URL (optional)</Label>
                      <Input
                        value={editingCertification.logo_url}
                        onChange={(e) => setEditingCertification({ ...editingCertification, logo_url: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>

                    <div className="flex gap-2 pt-4">
                      <button
                        onClick={async () => {
                          await handleUpdateCertification(editingCertification)
                          setIsCertModalOpen(false)
                        }}
                        disabled={saving}
                        className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={() => {
                          if (editingCertification.id && confirm('Delete this certification?')) {
                            handleDeleteCertification(editingCertification.id)
                            setIsCertModalOpen(false)
                          }
                        }}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
