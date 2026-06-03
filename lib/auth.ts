import { betterAuth } from 'better-auth'
import { pool } from '@/lib/db'
import { randomBytes } from 'crypto'

const getAuthSecret = (): string => {
  const envSecret = process.env.BETTER_AUTH_SECRET
  if (envSecret && envSecret !== 'your-super-secret-key-change-this-in-production') {
    return envSecret
  }

  if (process.env.NODE_ENV === 'production') {
    console.warn(
      '⚠️ Missing BETTER_AUTH_SECRET in production. Using a fallback secret to allow deployment. Set BETTER_AUTH_SECRET in your Vercel environment for a secure production build.'
    )
    return 'fallback-production-better-auth-secret-do-not-use-in-production'
  }

  const generated = randomBytes(32).toString('base64')
  console.warn(
    '⚠️ BETTER_AUTH_SECRET not set — using a temporary generated secret for development. Set BETTER_AUTH_SECRET for production.'
  )
  return generated
}

export const auth = betterAuth({
  secret: getAuthSecret(),
  database: pool,
  baseURL:
    process.env.BETTER_AUTH_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.V0_RUNTIME_URL),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  trustedOrigins: [
    ...(process.env.V0_RUNTIME_URL ? [process.env.V0_RUNTIME_URL] : []),
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
    ...(process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`]
      : []),
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  ...(process.env.NODE_ENV === 'development' && process.env.BETTER_AUTH_URL?.startsWith('https://')
    ? {
        advanced: {
          // In dev (v0 preview iframe), force cross-site cookies so the
          // session cookie is stored by the browser.
          defaultCookieAttributes: {
            sameSite: 'none' as const,
            secure: true,
          },
        },
      }
    : {}),
})
