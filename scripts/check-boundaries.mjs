#!/usr/bin/env node
// Enforces the folder rule from BRIEF.md §7:
//   a case study folder (src/p301-dashboard, src/p302-story, src/p303-mobile)
//   and src/landing may import ONLY from src/shared (plus packages).
// This keeps each case study reviewable on its own.
//
//   npm run check:boundaries             check the real code
//   node scripts/check-boundaries.mjs --selftest   prove the check catches violations

import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src');
const GUARDED = ['p301-dashboard', 'p302-story', 'p303-mobile', 'landing'];

const walk = (dir) => existsSync(dir) ? readdirSync(dir).flatMap((f) => {
  const p = join(dir, f); return statSync(p).isDirectory() ? walk(p) : /\.(vue|ts|tsx|js|mjs)$/.test(f) ? [p] : [];
}) : [];

const IMPORT_RE = /(?:import\s[^'"]*?from\s*|import\s*\(\s*|import\s+|require\s*\(\s*)['"]([^'"]+)['"]/g;

export function violations(files) {
  // files: [{ path: 'src/p301-dashboard/x.vue', text }]
  const out = [];
  for (const { path, text } of files) {
    const parts = path.split(/[\\/]/); const i = parts.indexOf('src');
    const owner = parts[i + 1];
    if (!GUARDED.includes(owner)) continue;
    let m; IMPORT_RE.lastIndex = 0;
    while ((m = IMPORT_RE.exec(text))) {
      const spec = m[1];
      let target = null;
      if (spec.startsWith('@/')) target = spec.slice(2).split('/')[0];
      else if (spec.startsWith('.')) {
        const abs = resolve(dirname(join('/', path)), spec);
        const rel = relative('/src', abs).split(sep);
        target = rel[0] === '..' ? '(outside src)' : rel[0];
      } else continue; // a package
      if (target !== owner && target !== 'shared' && !(target && target.startsWith('shared'))) out.push(`${path} imports "${spec}" (from ${target}); only ${owner}/ and shared/ are allowed`);
    }
  }
  return out;
}

if (process.argv.includes('--selftest')) {
  const bad = violations([
    { path: 'src/p301-dashboard/views/A.vue', text: "import X from '../../p303-mobile/components/Y.vue'" },
    { path: 'src/p302-story/B.ts', text: "import { z } from '@/p301-dashboard/z'" },
    { path: 'src/landing/L.vue', text: "const V = () => import('@/p302-story/views/StoryView.vue')" },
  ]);
  const good = violations([
    { path: 'src/p301-dashboard/views/A.vue', text: "import T from '@/shared/components/TermTip.vue'\nimport C from '../components/C.vue'\nimport { ref } from 'vue'" },
  ]);
  const ok = bad.length === 3 && good.length === 0;
  console.log(ok ? `Self-test passed: caught ${bad.length}/3 bad imports, 0 false alarms.` : `Self-test FAILED: bad=${bad.length} (want 3), false alarms=${good.length}`);
  bad.forEach((b) => console.log('  caught: ' + b));
  process.exit(ok ? 0 : 1);
}

const files = walk(SRC).map((p) => ({ path: relative(ROOT, p).split(sep).join('/'), text: readFileSync(p, 'utf8') }));
const v = violations(files);
if (v.length) { console.log('FAIL  folder boundaries'); v.forEach((x) => console.log('  - ' + x)); process.exit(1); }
console.log(`PASS  folder boundaries (${files.filter((f) => GUARDED.some((g) => f.path.includes(`src/${g}/`))).length} case-study files checked)`);
