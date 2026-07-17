import { betterAuth } from 'better-auth'
import { pool } from '@/lib/db'
import { randomBytes } from 'crypto'

const getAuthSecret = (): string => {
  const envSecret = process.env.BETTER_AUTH_SECRET
  if (envSecret && envSecret !== 'your-super-secret-key-change-this-in-production') {
    return envSecret
  }

  if (process.env.NODE_ENV === 'production') {
    // Never fall back to a hardcoded secret in production — sessions signed
    // with a known secret can be forged by anyone who reads the repo.
    throw new Error('BETTER_AUTH_SECRET must be set in production.')
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
        : 'http://localhost:3000'),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    // Registration is closed — the admin panel is invite-only. Re-enable
    // temporarily (or insert via DB) when a new admin account is needed.
    disableSignUp: true,
  },
  trustedOrigins: [
    'http://localhost:3000',
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
  advanced: {
    defaultCookieAttributes: {
      sameSite: 'lax' as const,
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
    },
  },
})
