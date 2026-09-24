#!/usr/bin/env node
// Proves the LIVE site works and serves the same build as this commit.
//
// check:deploy proves Vercel says the deploy succeeded. This goes further:
//   1. every key page (including deep links that need vercel.json's rewrite)
//      answers 200 with the app's HTML, and
//   2. the /assets/*.js and *.css file names in the live index.html match a
//      fresh local build exactly. Vite puts a content hash in each name, so a
//      match means the live site runs the same code as this checkout.
//
//   npm run check:live                 build locally, then check the production URL
//   node scripts/check-live.mjs --no-build   compare against the dist/ already on disk
//   node scripts/check-live.mjs --url https://…   check another URL

import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const urlArg = process.argv.indexOf('--url');
const BASE = (urlArg > -1 ? process.argv[urlArg + 1] : pkg.firstLeaf?.productionUrl)?.replace(/\/$/, '');
if (!BASE) { console.log('✗ No production URL. Set "firstLeaf": { "productionUrl": … } in package.json.'); process.exit(1); }

const PAGES = ['/', '/p301', '/p302', '/p303', '/p301/funds/FL-GREEN', '/p303/learn/expense-ratio'];
const assets = (html) => [...new Set(html.match(/\/assets\/[^"'\s>]+\.(?:js|css)/g) ?? [])].sort();
const isAppHtml = (html) => html.includes('<div id="app">') && html.includes('<title>First Leaf</title>');

if (!process.argv.includes('--no-build')) {
  console.log('Building locally (vite build) to compare…');
  execSync('npm run build-only', { cwd: ROOT, stdio: 'ignore' });
}
const local = assets(readFileSync(join(ROOT, 'dist', 'index.html'), 'utf8'));

console.log(`Checking ${BASE}`);
let failed = false;
let liveIndex = '';
for (const path of PAGES) {
  let status = 0, html = '';
  try {
    const res = await fetch(BASE + path, { redirect: 'manual', headers: { 'cache-control': 'no-cache' } });
    status = res.status; html = await res.text();
  } catch (e) { html = String(e); }
  const ok = status === 200 && isAppHtml(html);
  if (!ok) failed = true;
  console.log(`  ${ok ? '✓' : '✗'} ${path.padEnd(28)} ${status}${ok ? '' : status === 200 ? ' (not the app\'s HTML)' : ''}`);
  if (path === '/') liveIndex = html;
}

const live = assets(liveIndex);
const same = live.length > 0 && live.length === local.length && live.every((a, i) => a === local[i]);
if (same) console.log(`  ✓ live assets match the local build (${live.length} files: ${live.join(', ')})`);
else {
  failed = true;
  console.log('  ✗ live assets do NOT match the local build. The live site is running different code.');
  console.log(`    live:  ${live.join(', ') || '(none found)'}`);
  console.log(`    local: ${local.join(', ')}`);
}
console.log(failed ? `✗ check:live FAILED for ${BASE}` : `✓ check:live passed: ${BASE} serves this build.`);
process.exit(failed ? 1 : 0);
