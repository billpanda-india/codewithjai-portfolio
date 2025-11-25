import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
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

    let robotsTxt = ''

    if (!rules || rules.length === 0) {
      robotsTxt = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml`
    } else {
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

      // Build robots.txt content
      Object.entries(rulesByAgent).forEach(([userAgent, paths]) => {
        robotsTxt += `User-agent: ${userAgent}\n`
        paths.allow.forEach(path => {
          robotsTxt += `Allow: ${path}\n`
        })
        paths.disallow.forEach(path => {
          robotsTxt += `Disallow: ${path}\n`
        })
        robotsTxt += '\n'
      })

      robotsTxt += `Sitemap: ${baseUrl}/sitemap.xml`
    }

    return new NextResponse(robotsTxt, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch (error) {
    console.error('Error generating robots.txt:', error)
    const fallback = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml`

    return new NextResponse(fallback, {
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  }
}
