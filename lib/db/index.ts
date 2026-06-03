import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL

// Log warning if DATABASE_URL is not set
if (!connectionString) {
  console.warn('⚠️  DATABASE_URL is not set. Database features will not work until this is configured.')
}

// Ensure the connection string uses explicit SSL mode to avoid deprecation warnings
const ensureExplicitSslMode = (connStr: string | undefined): string | undefined => {
  if (!connStr) return undefined

  // Local development, SSL not required
  if (connStr.includes('localhost') || connStr.includes('127.0.0.1')) {
    return connStr
  }

  // Remove any existing sslmode parameter to avoid deprecation warnings
  let cleanedUrl = connStr.replace(/([?&])sslmode=[^&]*/, '$1').replace(/[?&]$/, '')

  // Add explicit SSL mode for remote databases
  const separator = cleanedUrl.includes('?') ? '&' : '?'
  return `${cleanedUrl}${separator}sslmode=verify-full`
}

// Create pool with graceful fallback if DATABASE_URL is missing
const poolConfig = {
  connectionString: ensureExplicitSslMode(connectionString) || undefined,
  ssl: connectionString && process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false,
  } : false,
  // Add connection timeout to prevent hanging
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 5000,
}

export const pool = new Pool(poolConfig)

// Handle pool errors gracefully
pool.on('error', (err) => {
  console.error('Unexpected error on idle client in pool:', err)
})

export const db = drizzle(pool, { schema })
