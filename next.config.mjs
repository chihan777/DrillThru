/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  async headers() {
    const securityHeaders = [
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
    ]
    const adminHeaders = [
      ...securityHeaders,
      { key: "Cache-Control", value: "no-store, max-age=0" },
      // Real crawler exclusion — unlike robots.txt, this cannot be ignored
      // and does not advertise the path.
      { key: "X-Robots-Tag", value: "noindex, nofollow" },
    ]
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/admin", headers: adminHeaders },
      { source: "/admin/:path*", headers: adminHeaders },
      { source: "/louda/:path*", headers: adminHeaders },
    ]
  },
}

export default nextConfig
