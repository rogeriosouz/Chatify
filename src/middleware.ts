import { NextRequest, NextResponse } from 'next/server'
import { getAllRoutersMiddleware, routersType } from './routers'

export const config = {
  matcher: getAllRoutersMiddleware(),
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('refreshToken')

  const signinUrl = new URL('/auth/login', request.url)
  const chatsUrl = new URL('/chats', request.url)
  const routerType = routersType(request.nextUrl.pathname)

  if (request.nextUrl.pathname === '/' && token) {
    const response = NextResponse.redirect(chatsUrl)

    return response
  }

  if (request.nextUrl.pathname.includes('/chats') && !token) {
    const response = NextResponse.redirect(signinUrl)

    return response
  }

  if (routerType === 'private' && !token) {
    const response = NextResponse.redirect(signinUrl)

    return response
  }

  if (routerType === 'auth' && token) {
    const response = NextResponse.redirect(chatsUrl)

    return response
  }

  return NextResponse.next()
}
