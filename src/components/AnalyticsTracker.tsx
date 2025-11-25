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
    // Track ALL pages including admin (for IP monitoring)
    // Note: Admin pages are tracked for security monitoring purposes
    
    const trackPageView = async () => {
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pageUrl: window.location.href,
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
