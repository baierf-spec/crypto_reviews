import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Basic Auth middleware for /admin
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  const user = process.env.ADMIN_USER || ''
  const pass = process.env.ADMIN_PASS || ''
  // If creds are not configured, block access by default
  if (!user || !pass) {
    return new NextResponse('Admin is disabled', { status: 503 })
  }

  const auth = request.headers.get('authorization') || ''
  if (!auth.startsWith('Basic ')) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="CryptoAI Admin"' },
    })
  }

  const [, base64] = auth.split(' ')
  const [u, p] = Buffer.from(base64, 'base64').toString().split(':')
  if (u !== user || p !== pass) {
    return new NextResponse('Unauthorized', { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="CryptoAI Admin"' } })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}


