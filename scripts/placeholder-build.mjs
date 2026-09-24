#!/usr/bin/env node
// Temporary build used ONLY until Phase 0 scaffolds the real Vue app.
// It lets the very first commit deploy successfully on Vercel, so the
// deploy check (npm run check:deploy) can be proven before any UI exists.
// Phase 0 replaces the "build" script in package.json and deletes this file.
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
const meta = JSON.parse(readFileSync(new URL('../src/shared/data/meta.json', import.meta.url)));
mkdirSync(new URL('../dist/', import.meta.url), { recursive: true });
writeFileSync(new URL('../dist/index.html', import.meta.url), `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>First Leaf</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#F5F0E6;color:#15130F;font:18px/1.5 Georgia,serif;padding:24px}
main{max-width:560px}h1{font-size:48px;margin:0 0 8px}p{margin:0 0 16px}small{color:#4F4A40}</style></head>
<body><main><h1>First Leaf</h1><p>Case studies P301, P302 and P303 are being built. Check back soon.</p>
<small>${meta.disclaimer}</small></main></body></html>\n`);
console.log('Placeholder page written to dist/index.html');
