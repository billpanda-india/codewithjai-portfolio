import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://codewithjai.in'
  
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: rules } = await supabase
      .from('robots_rules')
      .select('*')
      .order('order_index', { ascending: true })

    if (!rules || rules.length === 0) {
      // Fallback to defaults
      return {
        rules: {
          userAgent: '*',
          allow: '/',
          disallow: ['/admin/', '/api/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
      }
    }

    // Group rules by user agent
    const rulesByAgent: Record<string, { allow: string[], disallow: string[] }> = {}
    
    rules.forEach((rule: any) => {
      if (!rulesByAgent[rule.user_agent]) {
        rulesByAgent[rule.user_agent] = { allow: [], disallow: [] }
      }
      
      if (rule.rule_type === 'allow') {
        rulesByAgent[rule.user_agent].allow.push(rule.path)
      } else {
        rulesByAgent[rule.user_agent].disallow.push(rule.path)
      }
    })

    // Convert to Next.js format
    const robotRules = Object.entries(rulesByAgent).map(([userAgent, paths]) => ({
      userAgent,
      allow: paths.allow.length > 0 ? paths.allow : undefined,
      disallow: paths.disallow.length > 0 ? paths.disallow : undefined,
    }))

    return {
      rules: robotRules.length > 0 ? robotRules : {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      sitemap: `${baseUrl}/sitemap.xml`,
    }
  } catch (error) {
    console.error('Error generating robots.txt:', error)
    // Fallback to defaults
    return {
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      sitemap: `${baseUrl}/sitemap.xml`,
    }
  }
}
