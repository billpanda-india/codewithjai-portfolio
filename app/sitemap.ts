import { MetadataRoute } from 'next'
import { getAllPageSlugs, getAllProjectSlugs } from '@/lib/supabase/queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://codewithjai.in'

  const [pages, projects] = await Promise.all([
    getAllPageSlugs(),
    getAllProjectSlugs(),
  ])

  const pageUrls = pages.map((page: any) => ({
    url: `${baseUrl}/${page.slug === 'home' ? '' : page.slug}`,
    lastModified: new Date(),
  }))

  const projectUrls = projects.map((project: any) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(),
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    ...pageUrls,
    ...projectUrls,
  ]
}
