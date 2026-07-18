import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL

// Log warning if DATABASE_URL is not set
if (!connectionString) {
  console.warn('⚠️  DATABASE_URL is not set. Database features will not work until this is configured.')
}

const hasSslInUrl = (connStr: string): boolean => {
  return /[?&]sslmode=/i.test(connStr)
}

const isLocal = (connStr: string): boolean => {
  return connStr.includes('localhost') || connStr.includes('127.0.0.1')
}

// Create pool with graceful fallback if DATABASE_URL is missing
const poolConfig: import('pg').PoolConfig = {
  connectionTimeoutMillis: 15000,
  idleTimeoutMillis: 10000,
  max: 5,
}

if (connectionString) {
  if (isLocal(connectionString)) {
    // Local dev — no SSL
    poolConfig.connectionString = connectionString
    poolConfig.ssl = false
  } else if (hasSslInUrl(connectionString)) {
    // URL already has sslmode — don't double-configure SSL
    poolConfig.connectionString = connectionString
    poolConfig.ssl = false
  } else {
    // Remote URL without sslmode — add it
    const separator = connectionString.includes('?') ? '&' : '?'
    poolConfig.connectionString = `${connectionString}${separator}sslmode=require`
    poolConfig.ssl = { rejectUnauthorized: false }
  }
}

export const pool = new Pool(poolConfig)

// Handle pool errors gracefully
pool.on('error', (err) => {
  console.error('Unexpected error on idle client in pool:', err)
})

export const db = drizzle(pool, { schema })
