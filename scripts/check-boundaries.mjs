#!/usr/bin/env node
// Enforces the folder rules in CLAUDE.md §6 (one app, feature folders):
//   src/shared/              imports only from shared/ (never layouts/ or features/)
//   src/layouts/             imports only from layouts/ itself and shared/
//   src/features/<feature>/  imports only from its own feature folder and shared/,
//                            never from another feature or from layouts/
//   src/router/, App.vue, main.ts may import anything (the router wires layouts to features).
// Legacy folders (landing/, p301-dashboard/, p302-story/, p303-mobile/) keep the old
// rule, shared/ only, until they are deleted.
//
//   npm run check:boundaries                        check the real code
//   node scripts/check-boundaries.mjs --selftest    prove the check catches violations

import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src');
const GUARDED_TOPS = ['shared', 'layouts', 'features', 'landing', 'p301-dashboard', 'p302-story', 'p303-mobile'];

const walk = (dir) => existsSync(dir) ? readdirSync(dir).flatMap((f) => {
  const p = join(dir, f); return statSync(p).isDirectory() ? walk(p) : /\.(vue|ts|tsx|js|mjs)$/.test(f) ? [p] : [];
}) : [];

const IMPORT_RE = /(?:import\s[^'"]*?from\s*|import\s*\(\s*|import\s+|require\s*\(\s*)['"]([^'"]+)['"]/g;

// "Area" of a path inside src/: 'shared', 'layouts', 'features/home', 'router', …
const areaOf = (partsAfterSrc) => partsAfterSrc[0] === 'features' ? `features/${partsAfterSrc[1] ?? ''}` : partsAfterSrc[0];

export function violations(files) {
  // files: [{ path: 'src/features/home/HomeView.vue', text }]
  const out = [];
  for (const { path, text } of files) {
    const parts = path.split(/[\\/]/); const i = parts.indexOf('src');
    const after = parts.slice(i + 1);
    if (!GUARDED_TOPS.includes(after[0]) || after.length < 2) continue;
    const owner = areaOf(after);
    let m; IMPORT_RE.lastIndex = 0;
    while ((m = IMPORT_RE.exec(text))) {
      const spec = m[1];
      let target;
      if (spec.startsWith('@/')) target = areaOf(spec.slice(2).split('/'));
      else if (spec.startsWith('.')) {
        const abs = resolve(dirname(join('/', path)), spec);
        const rel = relative('/src', abs).split(sep);
        target = rel[0] === '..' ? '(outside src)' : areaOf(rel);
      } else continue; // a package
      const ok = target === owner || target === 'shared';
      if (!ok) out.push(`${path} imports "${spec}" (from ${target}); ${owner}/ may import only from itself and shared/`);
    }
  }
  return out;
}

if (process.argv.includes('--selftest')) {
  const bad = violations([
    { path: 'src/features/home/HomeView.vue', text: "import A from '@/features/alerts/AlertsView.vue'" },
    { path: 'src/features/story/StoryView.vue', text: "import P from '../practice/PracticeView.vue'" },
    { path: 'src/features/funds/FundsView.vue', text: "import L from '@/layouts/AppLayout.vue'" },
    { path: 'src/layouts/AppLayout.vue', text: "const H = () => import('@/features/home/HomeView.vue')" },
    { path: 'src/shared/components/X.vue', text: "import R from '../../layouts/Rail.vue'" },
    { path: 'src/shared/composables/useX.ts', text: "import { y } from '@/features/learn/y'" },
  ]);
  const good = violations([
    { path: 'src/features/home/HomeView.vue', text: "import T from '@/shared/components/TermTip.vue'\nimport C from './HomeCard.vue'\nimport { ref } from 'vue'" },
    { path: 'src/layouts/AppLayout.vue', text: "import Rail from './DesktopRail.vue'\nimport D from '../shared/components/DemoMenu.vue'" },
    { path: 'src/shared/components/X.vue', text: "import { meta } from '../data'" },
    { path: 'src/router/index.ts', text: "import H from '@/features/home/HomeView.vue'\nimport L from '@/layouts/AppLayout.vue'" },
  ]);
  const ok = bad.length === 6 && good.length === 0;
  console.log(ok ? `Self-test passed: caught ${bad.length}/6 bad imports (including feature-to-feature), 0 false alarms.` : `Self-test FAILED: bad=${bad.length} (want 6), false alarms=${good.length}`);
  bad.forEach((b) => console.log('  caught: ' + b));
  good.forEach((g) => console.log('  FALSE ALARM: ' + g));
  process.exit(ok ? 0 : 1);
}

const files = walk(SRC).map((p) => ({ path: relative(ROOT, p).split(sep).join('/'), text: readFileSync(p, 'utf8') }));
const v = violations(files);
if (v.length) { console.log('FAIL  folder boundaries'); v.forEach((x) => console.log('  - ' + x)); process.exit(1); }
const checked = files.filter((f) => GUARDED_TOPS.some((g) => f.path.startsWith(`src/${g}/`))).length;
console.log(`PASS  folder boundaries (${checked} guarded files checked: shared, layouts, features)`);
