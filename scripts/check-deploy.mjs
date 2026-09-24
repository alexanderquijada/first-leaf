#!/usr/bin/env node
// Confirms the LIVE site is serving the commit you just pushed.
//
// Why: a stale deployment and a stuck build queue both show a green "Ready"
// badge in Vercel while serving old code (this cost hours on Pelipper Post).
// So we never trust the badge. We ask GitHub, which Vercel reports to, for the
// Production deployment of the exact HEAD commit, and wait for it to succeed.
//
//   npm run check:deploy            wait up to 10 minutes for HEAD to be live
//   node scripts/check-deploy.mjs --no-wait   check once and report
//
// Needs: the GitHub CLI (gh), logged in. No Vercel login needed.

import { execSync } from 'node:child_process';

const sh = (cmd) => execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const wait = !process.argv.includes('--no-wait');
const TIMEOUT_MS = 10 * 60 * 1000, EVERY_MS = 15 * 1000;

let head, repo;
try {
  head = sh('git rev-parse HEAD');
  repo = sh('gh repo view --json nameWithOwner -q .nameWithOwner');
  const pushed = sh('git rev-parse @{u}');
  if (pushed !== head) { console.log(`✗ HEAD ${head.slice(0, 7)} is not pushed yet (remote has ${pushed.slice(0, 7)}). Run git push first.`); process.exit(1); }
} catch (e) {
  console.log('✗ Could not read git/GitHub info. Is this the project folder, and is `gh auth status` logged in?');
  process.exit(1);
}

const start = Date.now();
console.log(`Checking that ${repo} commit ${head.slice(0, 7)} is live on Vercel (Production)…`);
for (;;) {
  let deployments = [];
  try { deployments = JSON.parse(sh(`gh api "repos/${repo}/deployments?sha=${head}&per_page=20"`)); } catch { /* keep waiting */ }
  const prod = deployments.filter((d) => /^production/i.test(d.environment));
  if (prod.length) {
    const d = prod[0];
    const statuses = JSON.parse(sh(`gh api "repos/${repo}/deployments/${d.id}/statuses?per_page=1"`));
    const s = statuses[0];
    const state = s?.state || 'pending';
    if (state === 'success') {
      console.log(`✓ Live: commit ${head.slice(0, 7)} deployed to Production.`);
      if (s.environment_url || s.target_url) console.log(`  ${s.environment_url || s.target_url}`);
      process.exit(0);
    }
    if (state === 'error' || state === 'failure') {
      console.log(`✗ Vercel build for ${head.slice(0, 7)} FAILED (${state}). Open the build log: ${s.log_url || s.target_url || '(no link)'}`);
      process.exit(1);
    }
    if (state === 'inactive') {
      console.log(`! Vercel skipped building ${head.slice(0, 7)} ("inactive"). The live site is still an older commit.`);
      process.exit(1);
    }
    process.stdout.write(`  …Vercel status: ${state}\n`);
  } else {
    process.stdout.write('  …no Production deployment for this commit yet\n');
  }
  if (!wait || Date.now() - start > TIMEOUT_MS) {
    console.log(`✗ After ${Math.round((Date.now() - start) / 1000)}s, commit ${head.slice(0, 7)} is not live.`);
    console.log('  If Vercel shows it stuck in "Initializing": the free plan builds ONE project at a time across the whole account.');
    console.log('  Another project on the same Vercel account may be holding the queue. Nothing in this repo can clear that.');
    process.exit(1);
  }
  await new Promise((r) => setTimeout(r, EVERY_MS));
}
