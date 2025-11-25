'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle2, XCircle, Share2 } from 'lucide-react'
import SocialPreviewPageForm from './SocialPreviewPageForm'
import SocialPreviewContactForm from './SocialPreviewContactForm'

export default function SocialPreviewClient() {
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

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

        <Tabs defaultValue="home" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 gap-2 bg-white dark:bg-gray-900 h-auto p-2 rounded-lg border border-gray-200 dark:border-gray-800">
            <TabsTrigger value="home" className="px-3 py-2 rounded-md font-medium transition-colors data-[state=active]:bg-emerald-500 data-[state=active]:text-white">Home</TabsTrigger>
            <TabsTrigger value="projects" className="px-3 py-2 rounded-md font-medium transition-colors data-[state=active]:bg-emerald-500 data-[state=active]:text-white">Projects</TabsTrigger>
            <TabsTrigger value="about" className="px-3 py-2 rounded-md font-medium transition-colors data-[state=active]:bg-emerald-500 data-[state=active]:text-white">About</TabsTrigger>
            <TabsTrigger value="services" className="px-3 py-2 rounded-md font-medium transition-colors data-[state=active]:bg-emerald-500 data-[state=active]:text-white">Services</TabsTrigger>
            <TabsTrigger value="contact" className="px-3 py-2 rounded-md font-medium transition-colors data-[state=active]:bg-emerald-500 data-[state=active]:text-white">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="home">
            <SocialPreviewPageForm 
              pageSlug="home" 
              onSave={() => {
                setMessage({ type: 'success', text: 'Home social preview saved successfully!' })
                setTimeout(() => setMessage(null), 3000)
              }}
            />
          </TabsContent>

          <TabsContent value="projects">
            <SocialPreviewPageForm 
              pageSlug="projects" 
              onSave={() => {
                setMessage({ type: 'success', text: 'Projects social preview saved successfully!' })
                setTimeout(() => setMessage(null), 3000)
              }}
            />
          </TabsContent>

          <TabsContent value="about">
            <SocialPreviewPageForm 
              pageSlug="about" 
              onSave={() => {
                setMessage({ type: 'success', text: 'About social preview saved successfully!' })
                setTimeout(() => setMessage(null), 3000)
              }}
            />
          </TabsContent>

          <TabsContent value="services">
            <SocialPreviewPageForm 
              pageSlug="services" 
              onSave={() => {
                setMessage({ type: 'success', text: 'Services social preview saved successfully!' })
                setTimeout(() => setMessage(null), 3000)
              }}
            />
          </TabsContent>

          <TabsContent value="contact">
            <SocialPreviewContactForm 
              onSave={() => {
                setMessage({ type: 'success', text: 'Contact social preview saved successfully!' })
                setTimeout(() => setMessage(null), 3000)
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
