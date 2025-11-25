import { NextResponse } from 'next/server'
import { getAllPageSlugs, getAllProjectSlugs } from '@/lib/supabase/queries'

export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://codewithjai.in'

    const [pages, projects] = await Promise.all([
      getAllPageSlugs(),
      getAllProjectSlugs(),
    ])

    const pageUrls = pages.map((page: any) => ({
      url: `${baseUrl}/${page.slug === 'home' ? '' : page.slug}`,
      lastModified: new Date().toISOString(),
      type: 'page'
    }))

    const projectUrls = projects.map((project: any) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: new Date().toISOString(),
      type: 'project'
    }))

    const allUrls = [
      {
        url: baseUrl,
        lastModified: new Date().toISOString(),
        type: 'home'
      },
      ...pageUrls,
      ...projectUrls,
    ]

    return NextResponse.json(allUrls)
  } catch (error) {
    console.error('Error generating sitemap preview:', error)
    return NextResponse.json({ error: 'Failed to generate sitemap preview' }, { status: 500 })
  }
}
