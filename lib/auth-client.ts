'use client'

import { createAuthClient } from 'better-auth/react'

const getBaseURL = () => {
  // In browser environment
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  
  // Server-side fallback
  return process.env.BETTER_AUTH_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.V0_RUNTIME_URL
      ? process.env.V0_RUNTIME_URL
      : 'http://localhost:3000')
}

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
})

export const { signIn, signUp, signOut, useSession } = authClient
