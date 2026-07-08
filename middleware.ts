import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const publicPaths = ["/admin/sign-in", "/admin/sign-up"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (publicPaths.includes(pathname) || pathname.startsWith("/api/auth")) {
    return NextResponse.next()
  }

  const sessionCookie =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value

  if (!sessionCookie) {
    const signInUrl = new URL("/admin/sign-in", request.url)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin", "/admin/", "/admin/:path*"],
}
