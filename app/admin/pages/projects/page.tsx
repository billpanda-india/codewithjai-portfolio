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
import { Save, Loader2, FolderKanban, Rocket, Plus, Trash2, Edit, X } from 'lucide-react'

type Project = {
  id: string
  title: string
  slug: string
  short_description: string | null
  long_description: string | null
  category: string | null
  logo: string | null
  website_url: string | null
  github_url: string | null
  highlighted: boolean
  order_index: number
  seo_title?: string | null
  seo_description?: string | null
  meta_keywords?: string | null
  og_image?: string | null
  technologies?: string[] | null
  client_feedback?: string | null
  content_blocks?: ContentBlock[] | null
}

type ProjectImage = {
  id?: string
  image: string
  order_index: number
}

type ContentBlock = {
  id: string
  type: 'heading' | 'paragraph' | 'bullets' | 'quote'
  content: string
  order: number
}

type PageData = {
  hero_title: string
  hero_title_highlight: string
  hero_subtitle: string
  projects_cta_title: string
  projects_cta_subtitle: string
  projects_cta_button_text: string
  projects_cta_button_url: string
}

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

export default function ProjectsPageAdmin() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isPageModalOpen, setIsPageModalOpen] = useState(false)
  const [editingSection, setEditingSection] = useState<'hero' | 'cta' | null>(null)
  const [projectImages, setProjectImages] = useState<ProjectImage[]>([])
  const [uploadingImage, setUploadingImage] = useState(false)
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([])
  const [pageData, setPageData] = useState<PageData>({
    hero_title: '',
    hero_title_highlight: '',
    hero_subtitle: '',
    projects_cta_title: '',
    projects_cta_subtitle: '',
    projects_cta_button_text: '',
    projects_cta_button_url: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [pageResponse, projectsResponse] = await Promise.all([
        fetch('/api/pages/projects'),
        fetch('/api/projects')
      ])

      if (pageResponse.ok) {
        const data = await pageResponse.json()
        setPageData({
          hero_title: data.hero_title || '',
          hero_title_highlight: data.hero_title_highlight || '',
          hero_subtitle: data.hero_subtitle || '',
          projects_cta_title: data.projects_cta_title || '',
          projects_cta_subtitle: data.projects_cta_subtitle || '',
          projects_cta_button_text: data.projects_cta_button_text || '',
          projects_cta_button_url: data.projects_cta_button_url || '',
        })
      }

      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json()
        setProjects(projectsData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const openPageModal = (section: 'hero' | 'cta') => {
    setEditingSection(section)
    setIsPageModalOpen(true)
  }

  const handleSavePageData = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/pages/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pageData),
      })

      if (response.ok) {
        setToast({ message: 'Page content saved!', type: 'success' })
        setIsPageModalOpen(false)
        setEditingSection(null)
      } else {
        setToast({ message: 'Failed to save', type: 'error' })
      }
    } catch (error) {
      setToast({ message: 'Error saving', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const openEditModal = (project: Project | null = null) => {
    setEditingProject(project || {
      id: '',
      title: '',
      slug: '',
      short_description: '',
      long_description: '',
      category: 'web',
      logo: '',
      website_url: '',
      github_url: '',
      highlighted: false,
      order_index: projects.length,
      seo_title: '',
      seo_description: '',
      meta_keywords: '',
      og_image: '',
      technologies: [],
      client_feedback: '',
    } as Project)
    setIsModalOpen(true)
  }

  const openDetailModal = async (project: Project) => {
    setEditingProject(project)
    setContentBlocks(project.content_blocks || [])
    // Fetch project images
    try {
      const res = await fetch(`/api/projects/${project.id}/images`)
      if (res.ok) {
        const images = await res.json()
        setProjectImages(images)
      }
    } catch (error) {
      console.error('Error fetching images:', error)
    }
    setIsDetailModalOpen(true)
  }

  const addContentBlock = (type: ContentBlock['type']) => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type,
      content: '',
      order: contentBlocks.length
    }
    setContentBlocks([...contentBlocks, newBlock])
  }

  const updateContentBlock = (id: string, content: string) => {
    setContentBlocks(contentBlocks.map(block => 
      block.id === id ? { ...block, content } : block
    ))
  }

  const deleteContentBlock = (id: string) => {
    setContentBlocks(contentBlocks.filter(block => block.id !== id))
  }

  const moveContentBlock = (id: string, direction: 'up' | 'down') => {
    const index = contentBlocks.findIndex(b => b.id === id)
    if (index === -1) return
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === contentBlocks.length - 1) return

    const newBlocks = [...contentBlocks]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    ;[newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]]
    
    // Update order
    newBlocks.forEach((block, idx) => {
      block.order = idx
    })
    
    setContentBlocks(newBlocks)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editingProject?.id) return

    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('projectId', editingProject.id)

      const res = await fetch('/api/projects/images/upload', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const newImage = await res.json()
        setProjectImages([...projectImages, newImage])
        setToast({ message: 'Image uploaded!', type: 'success' })
      } else {
        setToast({ message: 'Failed to upload image', type: 'error' })
      }
    } catch (error) {
      setToast({ message: 'Error uploading image', type: 'error' })
    } finally {
      setUploadingImage(false)
    }
  }

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('Delete this image?')) return

    try {
      const res = await fetch(`/api/projects/images/${imageId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setProjectImages(projectImages.filter(img => img.id !== imageId))
        setToast({ message: 'Image deleted!', type: 'success' })
      } else {
        setToast({ message: 'Failed to delete image', type: 'error' })
      }
    } catch (error) {
      setToast({ message: 'Error deleting image', type: 'error' })
    }
  }

  const handleSaveModal = async () => {
    if (!editingProject || !editingProject.title || !editingProject.slug) {
      setToast({ message: 'Title and slug are required', type: 'error' })
      return
    }

    setSaving(true)
    try {
      const isNew = !editingProject.id
      const url = isNew ? '/api/projects' : `/api/projects/${editingProject.id}`
      const method = isNew ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProject),
      })

      if (response.ok) {
        setToast({ message: isNew ? 'Project added!' : 'Project updated!', type: 'success' })
        setIsModalOpen(false)
        setEditingProject(null)
        fetchData()
      } else {
        setToast({ message: 'Failed to save project', type: 'error' })
      }
    } catch (error) {
      setToast({ message: 'Error saving project', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setToast({ message: 'Project deleted!', type: 'success' })
        fetchData()
      } else {
        setToast({ message: 'Failed to delete project', type: 'error' })
      }
    } catch (error) {
      setToast({ message: 'Error deleting project', type: 'error' })
    }
  }

  return (
    <>
      <ToastContainer toast={toast} onClose={() => setToast(null)} />
      
      {/* Page Content Edit Modal */}
      <Dialog open={isPageModalOpen} onOpenChange={setIsPageModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingSection === 'hero' ? 'Edit Page Header' : 'Edit Bottom CTA'}</DialogTitle>
          </DialogHeader>
          {editingSection && (
            <div className="space-y-4">
              {editingSection === 'hero' ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Title (First Part)</Label>
                      <Input
                        value={pageData.hero_title}
                        onChange={(e) => setPageData({ ...pageData, hero_title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Title Highlight</Label>
                      <Input
                        value={pageData.hero_title_highlight}
                        onChange={(e) => setPageData({ ...pageData, hero_title_highlight: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Subtitle</Label>
                    <Textarea
                      value={pageData.hero_subtitle}
                      onChange={(e) => setPageData({ ...pageData, hero_subtitle: e.target.value })}
                      rows={2}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label>CTA Title</Label>
                    <Input
                      value={pageData.projects_cta_title}
                      onChange={(e) => setPageData({ ...pageData, projects_cta_title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>CTA Subtitle</Label>
                    <Textarea
                      value={pageData.projects_cta_subtitle}
                      onChange={(e) => setPageData({ ...pageData, projects_cta_subtitle: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Button Text</Label>
                      <Input
                        value={pageData.projects_cta_button_text}
                        onChange={(e) => setPageData({ ...pageData, projects_cta_button_text: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Button URL</Label>
                      <Input
                        value={pageData.projects_cta_button_url}
                        onChange={(e) => setPageData({ ...pageData, projects_cta_button_url: e.target.value })}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-2 pt-4">
                <button
                  onClick={async () => {
                    await handleSavePageData()
                  }}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Project Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProject?.id ? 'Edit Project' : 'New Project'}</DialogTitle>
          </DialogHeader>
          {editingProject && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Basic Information</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title *</Label>
                    <Input
                      value={editingProject.title}
                      onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                      placeholder="Project Title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Slug *</Label>
                    <Input
                      value={editingProject.slug}
                      onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                      placeholder="project-slug"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Short Description</Label>
                  <Textarea
                    value={editingProject.short_description || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, short_description: e.target.value })}
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <select
                      value={editingProject.category || 'web'}
                      onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                    >
                      <option value="web">Web</option>
                      <option value="mobile">Mobile</option>
                      <option value="fullstack">Fullstack</option>
                      <option value="design">Design</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Featured</Label>
                    <select
                      value={editingProject.highlighted ? 'true' : 'false'}
                      onChange={(e) => setEditingProject({ ...editingProject, highlighted: e.target.value === 'true' })}
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                    >
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Order</Label>
                    <Input
                      type="number"
                      value={editingProject.order_index}
                      onChange={(e) => setEditingProject({ ...editingProject, order_index: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Website URL</Label>
                  <Input
                    value={editingProject.website_url || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, website_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* SEO Section */}
              <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-lg text-emerald-600">SEO & Social Preview</h3>
                
                <div className="space-y-2">
                  <Label>SEO Title</Label>
                  <Input
                    value={editingProject.seo_title || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, seo_title: e.target.value })}
                    placeholder={`${editingProject.title || 'Project'} - Project Case Study | CodeWithJai`}
                  />
                </div>

                <div className="space-y-2">
                  <Label>SEO Description</Label>
                  <Textarea
                    value={editingProject.seo_description || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, seo_description: e.target.value })}
                    placeholder="Describe this project for search engines..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Meta Keywords</Label>
                  <Input
                    value={editingProject.meta_keywords || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, meta_keywords: e.target.value })}
                    placeholder="web development, react, portfolio"
                  />
                </div>

                <div className="space-y-2">
                  <Label>OG Image URL</Label>
                  <Input
                    value={editingProject.og_image || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, og_image: e.target.value })}
                    placeholder="https://example.com/og-image.jpg"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">For social media previews (1200x630px recommended)</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <button
                  onClick={async () => {
                    await handleSaveModal()
                  }}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Saving...' : 'Save Project'}
                </button>
                {editingProject.id && (
                  <button
                    onClick={() => {
                      if (confirm('Delete this project?')) {
                        handleDeleteProject(editingProject.id)
                        setIsModalOpen(false)
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

      {/* Project Detail Edit Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Project Details - {editingProject?.title}</DialogTitle>
          </DialogHeader>
          {editingProject && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Long Description (Detail Page Content)</Label>
                <Textarea
                  value={editingProject.long_description || ''}
                  onChange={(e) => setEditingProject({...editingProject, long_description: e.target.value})}
                  placeholder="Enter detailed project description..."
                  rows={8}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-gray-500">This content appears on the project detail page</p>
              </div>

              <div className="space-y-2">
                <Label>Technologies Used</Label>
                <Input
                  value={editingProject.technologies?.join(', ') || ''}
                  onChange={(e) => setEditingProject({
                    ...editingProject, 
                    technologies: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                  })}
                  placeholder="React, Next.js, TypeScript, Tailwind CSS"
                />
                <p className="text-xs text-gray-500">Comma-separated list of technologies</p>
              </div>

              <div className="space-y-2">
                <Label>Client Feedback / Testimonial</Label>
                <Textarea
                  value={editingProject.client_feedback || ''}
                  onChange={(e) => setEditingProject({...editingProject, client_feedback: e.target.value})}
                  placeholder="Enter client testimonial or feedback..."
                  rows={4}
                />
                <p className="text-xs text-gray-500">Optional client testimonial for this project</p>
              </div>

              {/* Page Builder Section */}
              <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Content Blocks (Page Builder)</Label>
                    <p className="text-xs text-gray-500 mt-1">Add custom sections to your project detail page</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => addContentBlock('heading')}
                      className="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                    >
                      + Heading
                    </button>
                    <button
                      onClick={() => addContentBlock('paragraph')}
                      className="px-3 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
                    >
                      + Paragraph
                    </button>
                    <button
                      onClick={() => addContentBlock('bullets')}
                      className="px-3 py-1 text-xs bg-purple-500 hover:bg-purple-600 text-white rounded-md transition-colors"
                    >
                      + Bullets
                    </button>
                    <button
                      onClick={() => addContentBlock('quote')}
                      className="px-3 py-1 text-xs bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors"
                    >
                      + Quote
                    </button>
                  </div>
                </div>

                {/* Content Blocks List */}
                {contentBlocks.length > 0 && (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {contentBlocks.map((block, index) => (
                      <div key={block.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
                              block.type === 'heading' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                              block.type === 'paragraph' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                              block.type === 'bullets' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' :
                              'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                            }`}>
                              {block.type}
                            </span>
                            <span className="text-xs text-gray-500">#{index + 1}</span>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => moveContentBlock(block.id, 'up')}
                              disabled={index === 0}
                              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded disabled:opacity-30"
                            >
                              ↑
                            </button>
                            <button
                              onClick={() => moveContentBlock(block.id, 'down')}
                              disabled={index === contentBlocks.length - 1}
                              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded disabled:opacity-30"
                            >
                              ↓
                            </button>
                            <button
                              onClick={() => deleteContentBlock(block.id)}
                              className="p-1 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 rounded"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <Textarea
                          value={block.content}
                          onChange={(e) => updateContentBlock(block.id, e.target.value)}
                          placeholder={
                            block.type === 'heading' ? 'Enter heading text...' :
                            block.type === 'paragraph' ? 'Enter paragraph content...' :
                            block.type === 'bullets' ? 'Enter bullet points (one per line)...' :
                            'Enter quote text...'
                          }
                          rows={block.type === 'heading' ? 1 : block.type === 'bullets' ? 4 : 3}
                          className="text-sm"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <Label>Project Screenshots</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Upload images for the carousel</p>
                
                {/* Image Upload */}
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="flex-1 text-sm text-gray-600 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 dark:file:bg-emerald-900 dark:file:text-emerald-300"
                  />
                  {uploadingImage && <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />}
                </div>

                {/* Image Grid */}
                {projectImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {projectImages.map((img, idx) => (
                      <div key={img.id || idx} className="relative group">
                        <img 
                          src={img.image} 
                          alt={`Screenshot ${idx + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                        />
                        <button
                          onClick={() => img.id && handleDeleteImage(img.id)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                        <div className="absolute bottom-1 left-1 px-2 py-0.5 bg-black/50 text-white text-xs rounded">
                          #{idx + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={async () => {
                    setSaving(true)
                    try {
                      const res = await fetch(`/api/projects/${editingProject.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                          long_description: editingProject.long_description,
                          technologies: editingProject.technologies,
                          client_feedback: editingProject.client_feedback,
                          content_blocks: contentBlocks
                        })
                      })
                      if (res.ok) {
                        setToast({ message: 'Project details saved successfully!', type: 'success' })
                        setIsDetailModalOpen(false)
                        fetchData()
                      } else {
                        setToast({ message: 'Failed to save', type: 'error' })
                      }
                    } catch (error) {
                      setToast({ message: 'Error saving', type: 'error' })
                    } finally {
                      setSaving(false)
                    }
                  }}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Saving...' : 'Save Details'}
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="grid w-full grid-cols-3 gap-2 bg-white dark:bg-gray-900 h-auto p-2 mb-6 rounded-lg border border-gray-200 dark:border-gray-800">
          <TabsTrigger value="projects" className="flex items-center justify-center gap-2 px-3 py-2 rounded-md font-medium transition-colors data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
            <FolderKanban className="w-4 h-4" />
            <span className="text-sm">Projects</span>
          </TabsTrigger>
          <TabsTrigger value="project-details" className="flex items-center justify-center gap-2 px-3 py-2 rounded-md font-medium transition-colors data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
            <Edit className="w-4 h-4" />
            <span className="text-sm">Project Details</span>
          </TabsTrigger>
          <TabsTrigger value="cta" className="flex items-center justify-center gap-2 px-3 py-2 rounded-md font-medium transition-colors data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
            <Rocket className="w-4 h-4" />
            <span className="text-sm">Page Content</span>
          </TabsTrigger>
        </TabsList>

        {/* PROJECTS TAB */}
        <TabsContent value="projects">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <FolderKanban className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-black dark:text-white">Projects</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Manage your portfolio projects</p>
                </div>
              </div>
              <button
                onClick={() => openEditModal()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add New Project
              </button>
            </div>

            {loading ? (
              <CardsSkeleton />
            ) : (
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors cursor-pointer group"
                  onClick={() => openEditModal(project)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <FolderKanban className="w-5 h-5 text-emerald-600" />
                    <Edit className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                  </div>
                  <h3 className="font-bold text-sm text-black dark:text-white mb-1 truncate">{project.title}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">{project.short_description}</p>
                  <div className="flex gap-1 flex-wrap">
                    <span className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded capitalize">
                      {project.category}
                    </span>
                    {project.highlighted && (
                      <span className="text-xs px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        </TabsContent>

        {/* PROJECT DETAILS TAB */}
        <TabsContent value="project-details">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Edit className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-black dark:text-white">Project Details</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Manage detailed content for each project</p>
                </div>
              </div>
            </div>

            {loading ? (
              <CardsSkeleton />
            ) : (
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                {projects.map((project) => (
                  <div key={project.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-emerald-500 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <FolderKanban className="w-5 h-5 text-emerald-500" />
                      <button
                        onClick={() => openDetailModal(project)}
                        className="text-gray-600 dark:text-gray-400 hover:text-emerald-500"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                    <h3 className="font-bold text-black dark:text-white mb-1">{project.title}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{project.short_description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* PAGE CONTENT TAB */}
        <TabsContent value="cta">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-800">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-black dark:text-white">Page Content</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Edit page sections</p>
              </div>
            </div>

            {loading ? (
              <CardsSkeleton />
            ) : (
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Hero Section Card */}
              <div
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors cursor-pointer group"
                onClick={() => openPageModal('hero')}
              >
                <div className="flex items-start justify-between mb-2">
                  <FolderKanban className="w-5 h-5 text-emerald-600" />
                  <Edit className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                </div>
                <h3 className="font-bold text-sm text-black dark:text-white mb-1">Page Header</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Top section</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 line-clamp-2">{pageData.hero_title} {pageData.hero_title_highlight}</p>
              </div>

              {/* CTA Section Card */}
              <div
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors cursor-pointer group"
                onClick={() => openPageModal('cta')}
              >
                <div className="flex items-start justify-between mb-2">
                  <Rocket className="w-5 h-5 text-purple-600" />
                  <Edit className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                </div>
                <h3 className="font-bold text-sm text-black dark:text-white mb-1">Bottom CTA</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Call-to-action</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 line-clamp-2">{pageData.projects_cta_title}</p>
              </div>
            </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}
