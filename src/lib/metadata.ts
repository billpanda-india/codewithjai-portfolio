import type { Metadata } from 'next'
import { getPageBySlug } from './supabase/queries'

export async function generatePageMetadata(slug: string): Promise<Metadata> {
  const page = await getPageBySlug(slug)
  
  if (!page) {
    return {
      title: 'CodeWithJai',
      description: 'Full-stack developer portfolio',
    }
  }

  return {
    title: page.seo_title || page.title || 'CodeWithJai',
    description: page.seo_description || '',
    keywords: page.meta_keywords?.split(',').map((k: string) => k.trim()) || [],
    authors: page.meta_author ? [{ name: page.meta_author }] : [],
    robots: page.meta_robots || 'index, follow',
    alternates: {
      canonical: page.canonical_url || undefined,
    },
    openGraph: {
      title: page.og_title || page.seo_title || page.title || 'CodeWithJai',
      description: page.og_description || page.seo_description || '',
      url: page.og_url || `${process.env.NEXT_PUBLIC_SITE_URL}/${slug}`,
      siteName: page.og_site_name || 'CodeWithJai',
      images: page.og_image ? [{ url: page.og_image }] : [],
      type: (page.og_type as any) || 'website',
    },
    twitter: {
      card: (page.twitter_card as any) || 'summary_large_image',
      title: page.twitter_title || page.seo_title || page.title || 'CodeWithJai',
      description: page.twitter_description || page.seo_description || '',
      images: page.twitter_image ? [page.twitter_image] : [],
      site: page.twitter_site || '@codewithjai',
      creator: page.twitter_creator || '@codewithjai',
    },
  }
}

export async function generateContactMetadata(): Promise<Metadata> {
  const { createClient } = await import('@supabase/supabase-js')
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: contactPage } = await supabase
    .from('contact_page')
    .select('*')
    .single()

  if (!contactPage) {
    return {
      title: 'Contact - CodeWithJai',
      description: 'Get in touch',
    }
  }

  return {
    title: contactPage.seo_title || 'Contact - CodeWithJai',
    description: contactPage.seo_description || '',
    keywords: contactPage.seo_keywords?.split(',').map((k: string) => k.trim()) || [],
    robots: contactPage.meta_robots || 'index, follow',
    openGraph: {
      title: contactPage.og_title || contactPage.seo_title || 'Contact - CodeWithJai',
      description: contactPage.og_description || contactPage.seo_description || '',
      url: contactPage.og_url || `${process.env.NEXT_PUBLIC_SITE_URL}/contact`,
      siteName: contactPage.og_site_name || 'CodeWithJai',
      images: contactPage.og_image ? [{ url: contactPage.og_image }] : [],
      type: 'website',
    },
    twitter: {
      card: (contactPage.twitter_card as any) || 'summary_large_image',
      title: contactPage.twitter_title || contactPage.seo_title || 'Contact - CodeWithJai',
      description: contactPage.twitter_description || contactPage.seo_description || '',
      images: contactPage.twitter_image ? [contactPage.twitter_image] : [],
    },
  }
}
