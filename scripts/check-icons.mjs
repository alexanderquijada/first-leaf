#!/usr/bin/env node
// Every mdi-* icon name used in src/ must exist in the installed @mdi/font CSS.
// A misspelled icon renders blank with no error, so it has to be checked.
//
//   npm run check:icons                      check the real code
//   node scripts/check-icons.mjs --selftest  prove the check catches a fake name

import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CSS = join(ROOT, 'node_modules', '@mdi', 'font', 'css', 'materialdesignicons.css');

if (!existsSync(CSS)) { console.log(`FAIL  icon names: can't read ${relative(ROOT, CSS)}. Run npm install.`); process.exit(1); }
const css = readFileSync(CSS, 'utf8');
// Class names the stylesheet defines, e.g. .mdi-alert-circle::before, .mdi-spin
const known = new Set([...css.matchAll(/\.(mdi-[a-z0-9-]+)/g)].map((m) => m[1]));
if (known.size < 1000) { console.log(`FAIL  icon names: only ${known.size} names read from the MDI stylesheet; it looks broken.`); process.exit(1); }

const USE_RE = /\bmdi-[a-z0-9]+(?:-[a-z0-9]+)*\b/g;

export function unknownIcons(files) {
  // files: [{ path, text }] → [{ path, name }]
  const out = [];
  for (const { path, text } of files) {
    for (const [name] of text.matchAll(USE_RE)) if (!known.has(name)) out.push({ path, name });
  }
  return out;
}

if (process.argv.includes('--selftest')) {
  const bad = unknownIcons([{ path: 'src/Fake.vue', text: '<v-icon icon="mdi-alert-circle" /> <span class="mdi mdi-not-a-real-icon-xyz" />' }]);
  const ok = bad.length === 1 && bad[0].name === 'mdi-not-a-real-icon-xyz';
  console.log(ok ? 'Self-test passed: caught the fake icon "mdi-not-a-real-icon-xyz", accepted "mdi-alert-circle".' : `Self-test FAILED: ${JSON.stringify(bad)}`);
  process.exit(ok ? 0 : 1);
}

const walk = (d) => readdirSync(d).flatMap((f) => {
  const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : /\.(vue|ts|js)$/.test(f) ? [p] : [];
});
const files = walk(join(ROOT, 'src')).map((p) => ({ path: relative(ROOT, p), text: readFileSync(p, 'utf8') }));
const used = new Set(files.flatMap(({ text }) => [...text.matchAll(USE_RE)].map((m) => m[0])));
const bad = unknownIcons(files);
if (bad.length) { console.log('FAIL  icon names'); bad.forEach((b) => console.log(`  - ${b.path}: "${b.name}" is not in @mdi/font`)); process.exit(1); }
console.log(`PASS  icon names (${used.size} used: ${[...used].sort().join(', ')})`);
