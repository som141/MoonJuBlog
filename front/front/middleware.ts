import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get token from cookies or headers
  const token = request.cookies.get("moonju_token")?.value

  // Protected routes that require authentication
  const protectedPaths = ["/write", "/profile"]
  const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  // Redirect to signin if accessing protected route without token
  if (isProtectedPath && !token) {
    const signInUrl = new URL("/signin", request.url)
    signInUrl.searchParams.set("redirect", request.nextUrl.pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Redirect authenticated users away from auth pages
  const authPaths = ["/signin", "/signup"]
  const isAuthPath = authPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  if (isAuthPath && token) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
