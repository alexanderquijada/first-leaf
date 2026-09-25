#!/usr/bin/env node
// Proves no test-only data reached the shipped build (ruling 4, Sept. 25). The big-move
// fixture carries a "TEST-ONLY" marker and an alert id the real data never has.
//
//   node scripts/check-fixtures.mjs            checks dist/
//   node scripts/check-fixtures.mjs <dir>      checks another build (to show it can fail)
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(ROOT, process.argv[2] ?? 'dist');
const MARKERS = ['TEST-ONLY', 'big-move-NVDA'];
if (!existsSync(dir)) { console.error(`✗ ${dir} does not exist; build first`); process.exit(1); }
const hits = [];
const walk = (d) => { for (const f of readdirSync(d)) { const p = join(d, f); if (statSync(p).isDirectory()) walk(p); else { const t = readFileSync(p, 'latin1'); for (const m of MARKERS) if (t.includes(m)) hits.push(`${p.slice(ROOT.length + 1)} contains "${m}"`); } } };
walk(dir);
if (hits.length) { console.error(`✗ test-only data found in ${dir.slice(ROOT.length + 1)}:\n  ${hits.join('\n  ')}`); process.exit(1); }
console.log(`✓ no test-only data in ${dir.slice(ROOT.length + 1)} (looked for ${MARKERS.map((m) => `"${m}"`).join(', ')})`);
