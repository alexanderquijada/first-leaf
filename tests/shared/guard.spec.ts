import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { test, expect } from '../fixtures'

// Keeps the guard in force: a spec that imports test from '@playwright/test'
// directly would skip the console and NaN checks.
test('every spec uses the shared guard fixture', () => {
  const root = join(dirname(fileURLToPath(import.meta.url)), '..')
  const walk = (d: string): string[] =>
    readdirSync(d).flatMap((f) => {
      const p = join(d, f)
      return statSync(p).isDirectory() ? walk(p) : p.endsWith('.spec.ts') ? [p] : []
    })
  const offenders = walk(root).filter((p) =>
    /import\s*\{[^}]*\btest\b[^}]*\}\s*from\s*['"]@playwright\/test['"]/.test(readFileSync(p, 'utf8')),
  )
  expect(offenders).toEqual([])
})
