#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const VERCEL_API = 'https://api.vercel.com'

function parseEnv(content) {
  const lines = content.split(/\r?\n/)
  const env = {}
  for (let line of lines) {
    line = line.trim()
    if (!line || line.startsWith('#')) continue
    const m = line.match(/^([A-Za-z0-9_]+)=(?:"([^"]*)"|'([^']*)'|(.*))$/)
    if (m) {
      env[m[1]] = m[2] ?? m[3] ?? m[4] ?? ''
    }
  }
  return env
}

async function api(path_, opts = {}) {
  const token = process.env.VERCEL_TOKEN
  if (!token) throw new Error('Set VERCEL_TOKEN environment variable (Personal token)')
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
  const res = await fetch(`${VERCEL_API}${path_}`, { headers, ...opts })
  const text = await res.text()
  let body
  try { body = JSON.parse(text) } catch (e) { body = text }
  if (!res.ok) throw new Error(`Vercel API ${res.status}: ${JSON.stringify(body)}`)
  return body
}

async function ensureEnv(projectId, key, value, target = ['production']) {
  const list = await api(`/v9/projects/${projectId}/env`)
  const existing = list.find(e => e.key === key && JSON.stringify(e.target) === JSON.stringify(target))
  if (existing) {
    // update
    return api(`/v9/projects/${projectId}/env/${existing.uid}`, { method: 'PATCH', body: JSON.stringify({ value }) })
  }
  return api(`/v9/projects/${projectId}/env`, { method: 'POST', body: JSON.stringify({ key, value, target }) })
}

async function main() {
  const projectId = process.env.VERCEL_PROJECT_ID || process.env.VERCEL_PROJECT
  if (!projectId) {
    console.error('Missing VERCEL_PROJECT_ID (set env var VERCEL_PROJECT_ID)')
    process.exit(1)
  }
  const envPath = path.resolve(process.cwd(), '.env')
  if (!fs.existsSync(envPath)) {
    console.error('.env not found in project root')
    process.exit(1)
  }
  const content = fs.readFileSync(envPath, 'utf8')
  const env = parseEnv(content)
  const shouldSkipSecret = value => !value || value === 'your-super-secret-key-change-this-in-production'
  const isLocalUrl = value => /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(value)
  const settings = [
    {
      key: 'BETTER_AUTH_SECRET',
      value: env.BETTER_AUTH_SECRET,
      skip: shouldSkipSecret(env.BETTER_AUTH_SECRET),
      skipReason: 'placeholder or missing secret',
    },
    {
      key: 'DATABASE_URL',
      value: env.DATABASE_URL,
      skip: !env.DATABASE_URL,
      skipReason: 'missing DATABASE_URL',
    },
    {
      key: 'BETTER_AUTH_URL',
      value: env.BETTER_AUTH_URL,
      skip: !env.BETTER_AUTH_URL || isLocalUrl(env.BETTER_AUTH_URL),
      skipReason: 'missing or localhost URL',
    },
    {
      key: 'NEXT_PUBLIC_SITE_URL',
      value: env.NEXT_PUBLIC_SITE_URL,
      skip: !env.NEXT_PUBLIC_SITE_URL || isLocalUrl(env.NEXT_PUBLIC_SITE_URL),
      skipReason: 'missing or localhost URL',
    },
  ]

  for (const { key, value, skip, skipReason } of settings) {
    if (skip) {
      console.log('Skipping', key, '—', skipReason)
      continue
    }
    console.log('Setting', key)
    await ensureEnv(projectId, key, value)
  }
  console.log('Done. Remember to redeploy on Vercel.')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
