'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Generate or get session ID
function getSessionId() {
  if (typeof window === 'undefined') return ''
  
  let sessionId = sessionStorage.getItem('analytics_session_id')
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
    sessionStorage.setItem('analytics_session_id', sessionId)
  }
  return sessionId
}

export default function AnalyticsTracker() {
  const pathname = usePathname()
  
  useEffect(() => {
    const trackPageView = async () => {
      try {
        const currentUrl = window.location.href
        
        // Skip tracking for localhost
        if (currentUrl.includes('localhost')) {
          return
        }
        
        // Skip tracking for admin pages
        if (pathname?.startsWith('/admin')) {
          return
        }
        
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pageUrl: currentUrl,
            referrer: document.referrer,
            sessionId: getSessionId()
          })
        })
      } catch (error) {
        console.error('Analytics tracking failed:', error)
      }
    }
    
    trackPageView()
  }, [pathname])
  
  return null
}
