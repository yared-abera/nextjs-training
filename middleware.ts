import { nextCookies } from "better-auth/next-js"

export function middleware() {
  return nextCookies()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/jobs/create",
    "/jobs/:jobId/edit",
    "/messages/:path*",
    "/profile/:path*"
  ]
}