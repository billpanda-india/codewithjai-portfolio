interface SiteLink {
  id: string
  title: string
  description: string
  url: string
}

interface SiteLinksStructuredDataProps {
  siteUrl: string
  siteName: string
  links: SiteLink[]
}

export default function SiteLinksStructuredData({ 
  siteUrl, 
  siteName, 
  links 
}: SiteLinksStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    },
    ...(links.length > 0 && {
      hasPart: links.map(link => ({
        '@type': 'WebPage',
        name: link.title,
        description: link.description,
        url: link.url.startsWith('http') ? link.url : `${siteUrl}${link.url}`
      }))
    })
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
