const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const nodeModules = path.join(root, 'node_modules')

const removeNestedKysely = () => {
  const nested = path.join(nodeModules, 'better-auth', 'node_modules', 'kysely')
  if (fs.existsSync(nested)) {
    fs.rmSync(nested, { recursive: true, force: true })
    console.log('Removed nested kysely')
  }
}

const replacements = [
  {
    from: 'import { CompiledQuery, DEFAULT_MIGRATION_LOCK_TABLE, DEFAULT_MIGRATION_TABLE, DefaultQueryCompiler, sql } from "kysely";',
    to: 'import { CompiledQuery, DefaultQueryCompiler, sql } from "kysely";\nimport { DEFAULT_MIGRATION_LOCK_TABLE, DEFAULT_MIGRATION_TABLE } from "kysely/migration";'
  },
  {
    from: 'import { DEFAULT_MIGRATION_LOCK_TABLE, DEFAULT_MIGRATION_TABLE, SqliteAdapter, SqliteQueryCompiler } from "kysely";',
    to: 'import { SqliteAdapter, SqliteQueryCompiler } from "kysely";\nimport { DEFAULT_MIGRATION_LOCK_TABLE, DEFAULT_MIGRATION_TABLE } from "kysely/migration";'
  }
]

const fileNames = new Set([
  'bun-sqlite-dialect-DzNwOpKv.mjs',
  'd1-sqlite-dialect-C2B7YsIT.mjs',
  'node-sqlite-dialect.mjs',
])

const patchFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8')
  let changed = false

  replacements.forEach(({ from, to }) => {
    if (content.includes(from)) {
      content = content.replace(from, to)
      changed = true
    }
  })

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8')
    console.log('Patched', filePath)
  }
}

const walk = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      walk(fullPath)
      continue
    }

    if (fileNames.has(entry.name) && fullPath.includes(path.join('@better-auth', 'kysely-adapter', 'dist'))) {
      patchFile(fullPath)
    }
  }
}

removeNestedKysely()
if (fs.existsSync(nodeModules)) {
  walk(nodeModules)
} else {
  console.warn('node_modules directory not found; skipping better-auth patch')
}
