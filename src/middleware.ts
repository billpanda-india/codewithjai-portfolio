import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect admin routes (except login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const session = request.cookies.get('admin_session')

    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // Create response
  const response = NextResponse.next()

  // Allow iframe embedding ONLY for homepage (for project previews)
  if (pathname === '/' || pathname === '') {
    // Allow all sites to embed the homepage in iframe
    response.headers.delete('X-Frame-Options')
    response.headers.set('Content-Security-Policy', "frame-ancestors *")
  } else {
    // Block iframe embedding for all other pages
    response.headers.set('X-Frame-Options', 'SAMEORIGIN')
    response.headers.set('Content-Security-Policy', "frame-ancestors 'self'")
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
