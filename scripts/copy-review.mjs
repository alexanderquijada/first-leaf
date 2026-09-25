#!/usr/bin/env node
// Builds docs/copy/COPY-REVIEW.md: every piece of text a person can read or hear, one table
// per screen, with the text as rendered, its grade (as rule L5 scores it), the other
// scenarios' versions, and the suggested rewrites in docs/copy/copy-review-suggestions.mjs.
//
//   npm run copy:review
//   npm run copy:review -- --approve [--except <id-prefix> ...]
//
// Each row is APPROVED while its text matches docs/copy/approved.json (the text Alex signed
// off) and DRAFT otherwise, so any new or changed copy shows up as DRAFT. --approve records
// the current text of every row as approved (except the listed id prefixes); run it only
// when Alex has approved the table.
//
// It builds the site, serves it on a spare port, captures the text and accessibility tree
// of every page in every scenario at phone and laptop widths (plus opened dialogs and
// states), and matches each copy template against what the screen shows. Rebuild the
// table after each round of approvals: edit the suggestions file, then run this.

import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { execSync, spawn } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import { fkGrade } from './validate-data.mjs';
import { SUGGEST, TOP, CONSISTENCY, INTRO, CHANGED } from '../docs/copy/copy-review-suggestions.mjs';
import { existsSync } from 'node:fs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(readFileSync(join(ROOT, p), 'utf8'));
const APPROVED_FILE = join(ROOT, 'docs', 'copy', 'approved.json');
const approved = existsSync(APPROVED_FILE) ? JSON.parse(readFileSync(APPROVED_FILE, 'utf8')) : {};
const APPROVE = process.argv.includes('--approve');
const EXCEPT = process.argv.flatMap((a, i, all) => (all[i - 1] === '--except' ? [a] : []));

// ---------- capture ----------
const PORT = 4179, B = `http://localhost:${PORT}`;
execSync('npx vite build --logLevel error', { cwd: ROOT, stdio: 'inherit' });
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { cwd: ROOT, stdio: 'ignore' });
for (let i = 0; i < 60; i++) { try { if ((await fetch(B)).ok) break; } catch { /* not up yet */ } await new Promise((r) => setTimeout(r, 250)); }
const acts = read('src/shared/data/activity.json')['rosa-starter'];
const returned = acts.find((a) => a.status === 'returned')?.id, buy = acts.find((a) => a.type === 'buy')?.id, div = acts.find((a) => a.type === 'dividend')?.id;
const alertIds = [...new Set(Object.values(read('src/shared/data/attention.json')).flat().map((f) => f.id))];
const PAGES = ['/', '/alerts', ...alertIds.map((id) => `/alerts/${id}`), '/alerts/nope', '/activity', `/activity/${returned}`, `/activity/${buy}`, `/activity/${div}`,
  '/funds', ...read('src/shared/data/funds.json').map((f) => `/funds/${f.ticker}`), '/story', '/practice', '/learn', '/learn/ups-and-downs', '/nope'];
const SNAP = {};
const browser = await chromium.launch();
try {
  for (const w of [390, 1280]) for (const sc of ['normal', 'all-clear', 'brand-new']) for (const p of PAGES) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    await page.goto(`${B}${p}?scenario=${sc}`); await page.locator('main').waitFor(); await page.waitForTimeout(250);
    const show = page.getByRole('button', { name: 'Show as table' }); while (await show.count()) await show.first().click();
    const why = page.getByRole('button', { name: 'Why it moved this week' }); if (await why.count()) await why.click();
    SNAP[`${w} ${sc} ${p}`] = { text: await page.evaluate(() => document.body.innerText), aria: await page.locator('body').ariaSnapshot() };
    await page.close();
  }
  const states = {
    'dialog retry': async (pg) => { await pg.goto(B + '/alerts/deposit-returned'); await pg.getByRole('button', { name: 'Try the deposit again' }).click(); await pg.waitForTimeout(400); },
    'dialog auto': async (pg) => { await pg.goto(B + '/alerts/cash-sitting'); await pg.getByRole('button', { name: 'See auto-invest settings' }).click(); await pg.waitForTimeout(400); },
    'termtip': async (pg) => { await pg.goto(B + '/'); await pg.locator('main .fl-termtip__button').first().click(); },
    'practice error': async (pg) => { await pg.goto(B + '/practice'); await pg.getByLabel('Amount in dollars').fill('1.234'); },
    'practice bought': async (pg) => { await pg.goto(B + '/practice'); await pg.getByLabel('Amount in dollars').fill('100'); await pg.getByRole('button', { name: 'Review' }).click(); await pg.getByRole('button', { name: 'Confirm' }).click(); },
    'learn none': async (pg) => { await pg.goto(B + '/learn'); await pg.getByLabel('Search words').fill('zebra'); },
    'phone view': async (pg) => { await pg.goto(B + '/p303'); await pg.waitForTimeout(600); },
  };
  for (const [k, fn] of Object.entries(states)) { const page = await browser.newPage({ viewport: { width: 1280, height: 900 } }); await fn(page); SNAP['state ' + k] = { text: await page.evaluate(() => document.body.innerText), aria: await page.locator('body').ariaSnapshot() }; await page.close(); }
} finally { await browser.close(); server.kill(); }

// ---------- snapshot corpus: plain lines per snapshot ----------
function linesOf({ text, aria }) {
  const out = text.split('\n').map((l) => l.trim()).filter(Boolean);
  for (const l of aria.split('\n')) {
    let m = l.match(/^\s*- [\w-]+ "(.*?)"(?:\s|:|$)/); if (m) out.push(m[1].replace(/\\"/g, '"'));
    m = l.match(/^\s*- text: (.*)$/); if (m) out.push(m[1].replace(/^"|"$/g, ''));
    m = l.match(/^\s*- [\w-]+(?: "[^"]*")?(?: \[[^\]]*\])*: (.+)$/); if (m && !/^\//.test(m[1])) out.push(m[1].replace(/^"|"$/g, ''));
  }
  return out;
}
const corpus = Object.entries(SNAP).map(([k, v]) => {
  const [w, sc, path] = k.startsWith('state ') ? ['1280', 'normal', k] : k.split(' ');
  return { w, sc, path, lines: linesOf(v) };
});
const SCREEN = (p) => p.startsWith('state ') ? { 'state dialog retry': 'Try-again dialog', 'state dialog auto': 'Auto-invest dialog', 'state termtip': 'Word explanation', 'state practice error': 'Practice (error)', 'state practice bought': 'Practice (after buying)', 'state learn none': 'Words (no match)', 'state phone view': 'Phone view' }[p]
  : p === '/' ? 'Home' : p.startsWith('/alerts') ? 'Alerts' : p.startsWith('/activity') ? 'Activity' : p.startsWith('/funds') ? 'Investments' : p === '/story' ? 'Your money story'
  : p === '/practice' ? 'Practice' : p.startsWith('/learn') ? 'Words' : 'Page not found';

const lastGroups = new Map();
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function matcher(t) {
  const names = [...t.matchAll(/\{(\w+)\}/g)].map((m) => m[1]);
  const literal = t.replace(/\{\w+\}/g, '');
  if (!names.length) return literal.trim().length < 1 ? null : (line) => (line === t.trim() ? { text: t.trim(), pri: 0 } : t.trim().split(/\s+/).length > 3 && line.includes(t.trim()) ? { text: t.trim(), pri: 2 } : null);
  if (!/[A-Za-z]{2,}/.test(literal) && literal.replace(/\s/g, '').length < 2) return null; // a bare value: can't be found reliably
  const parts = t.trim().split(/(\{\w+\})/).filter((p) => p !== '');
  // A value never spans a sentence break (". A"); whole sentences from the data may.
  const SENT = ['claim', 'note', 'reply', 'short', 'example', 'title'];
  const src = parts.map((p) => { const n = p.match(/^\{(\w+)\}$/)?.[1]; return n ? (SENT.includes(n) ? '(.+?)' : '((?:(?!\\. [A-Z]).)+?)') : esc(p); }).join('');
  // Prefer a match that is the whole line, then one that starts it, then anywhere. A match
  // never ends just before a digit, so "$15.07" isn't read as "$15" plus a period.
  const res = [new RegExp(`^${src}$`), new RegExp(`^${src}(?![\\d,])`), new RegExp(`${src}(?![\\d,])`)];
  return (line) => { for (let i = 0; i < res.length; i++) { const r = line.match(res[i]); if (r) { lastGroups.set(r[0], r); return { text: r[0], pri: i }; } } return null; };
}
function find(t) {
  const m = matcher(t); const hits = { normal: [], 'all-clear': [], 'brand-new': [] }; const where = new Map();
  if (!m) return null;
  for (const c of corpus) for (const l of c.lines) {
    const x = m(l); if (!x) continue;
    hits[c.sc]?.push(x);
    if (c.sc === 'normal' || !where.size) { const s = SCREEN(c.path); if (!where.has(s)) where.set(s, new Set()); if (!c.path.startsWith('state ')) where.get(s).add(c.w === '390' ? 'phone' : 'laptop'); }
  }
  for (const k of Object.keys(hits)) hits[k] = hits[k].sort((a, b) => a.pri - b.pri).map((x) => x.text); // best match first
  return { hits, where };
}
const uniq = (a) => [...new Set(a)];

// ---------- grade as L5 scores it ----------
const words = (t) => t.split(/\s+/).filter((x) => /[A-Za-z]/.test(x)).length;
const QUOTED = ['name', 'label', 'series', 'kind', 'status', 'type', 'term', 'terms', 'link', 'page', 'query', 'region', 'ticker'];
function grade(t) {
  let g = t ?? ''; const lead = g.match(/^([^.:!?]+):\s+/); if (lead && words(lead[1]) <= 3) g = g.slice(lead[0].length);
  if (!g.split(/[.!?]+/).some((x) => words(x) > 3)) return 'label';
  return fkGrade(g).toFixed(1);
}
// A copy row is graded the way L5 grades it: a quoted name (term, source, ticker) is one word.
function gradeTemplate(t, shown, match) {
  if (!/\{\w+\}/.test(t) || !match) return grade(shown);
  const parts = t.trim().split(/(\{\w+\})/).filter((p) => p !== '');
  let gi = 0; const m = match; // match groups in order
  return grade(parts.map((p) => { const n = p.match(/^\{(\w+)\}$/)?.[1]; if (!n) return p; const v = m[++gi]; return QUOTED.includes(n) ? 'Name' : v; }).join(''));
}

// ---------- the rows ----------
const SECTIONS = ['App frame (every screen)', 'Home', 'Alerts', 'Money actions (deposit and auto-invest)', 'Activity', 'Investments', 'Your money story', 'Practice', 'Words', 'Charts (every chart)', 'Word explanations and sheets (every screen)', 'Numbers and dates (every screen)', 'Page not found'];
const LETTER = { 'App frame (every screen)': 'A', Home: 'H', Alerts: 'L', 'Money actions (deposit and auto-invest)': 'M', Activity: 'V', Investments: 'F', 'Your money story': 'S', Practice: 'P', Words: 'W', 'Charts (every chart)': 'C', 'Word explanations and sheets (every screen)': 'E', 'Numbers and dates (every screen)': 'N', 'Page not found': 'X' };
const sectionOf = (file, key) => {
  if (file.includes('/layouts/')) return 'App frame (every screen)';
  const f = file.match(/features\/([\w-]+)\//)?.[1];
  if (f) return { home: 'Home', alerts: 'Alerts', activity: 'Activity', funds: 'Investments', story: 'Your money story', practice: 'Practice', learn: 'Words', 'not-found': 'Page not found' }[f];
  const p = key.split('.')[0];
  return { deposit: 'Money actions (deposit and auto-invest)', moneyFlow: 'Money actions (deposit and auto-invest)', activity: 'Activity', practiceErrors: 'Practice', severity: 'Alerts', alerts: 'Alerts',
    chart: 'Charts (every chart)', ranges: 'Charts (every chart)', change: 'Numbers and dates (every screen)', dates: 'Numbers and dates (every screen)' }[p] ?? 'Word explanations and sheets (every screen)';
};
const rows = Object.fromEntries(SECTIONS.map((s) => [s, []]));
const short = (file) => file.replace('src/features/', '').replace('src/', '').replace('/copy.json', '');

function addRow(section, id, t, fallbackWhere, example) {
  const f = find(t);
  const normal = f ? uniq(f.hits.normal) : [];
  let shown = normal[0] ?? null, note = '';
  if (!shown && f) { for (const [sc, label] of [['all-clear', 'Nothing needs you'], ['brand-new', 'brand-new']]) { const h = uniq(f.hits[sc]); if (h.length) { shown = h[0]; note = ` *(only in the ${label} account)*`; break; } } }
  if (!shown) { note = ''; shown = example ?? t; note = f ? ' *(not on a captured screen; example values)*' : (/\{\w+\}/.test(t) ? ' *(a bare value; example values)*' : ''); }
  if (normal.length > 1) note += ` *(and ${normal.length - 1} more like it)*`;
  const anyHit = f && Object.values(f.hits).some((h) => h.length);
  const other = !anyHit ? (/\{\w+\}/.test(t) ? 'Not on a captured screen; the values change with the account' : 'Same words wherever it shows') : ['all-clear', 'brand-new'].map((sc) => {
    const label = sc === 'all-clear' ? 'Nothing needs you' : 'Brand-new';
    if (!f) return `${label}: same`;
    const h = uniq(f.hits[sc]);
    if (!h.length) return `${label}: not shown`;
    if (!/\{\w+\}/.test(t) || h.every((x) => normal.includes(x))) return `${label}: same`;
    return `${label}: “${h[0]}”`;
  }).join('<br>');
  const places = f && f.where.size ? [...f.where].map(([s, ws]) => (ws.size ? `${s} (${[...ws].sort().join(', ')})` : s)) : [];
  const whereText = places.length > 4 ? `${places.slice(0, 3).join('; ')}; and ${places.length - 3} more screens` : places.length ? places.join('; ') : fallbackWhere;
  const sug = SUGGEST[id] ?? (CHANGED[id] ? { rewrite: '—', why: CHANGED[id] } : {});
  rows[section].push({ id, t, where: `${whereText}<br><sub>\`${id}\`</sub>`, shown: `${shown}${note}`, grade: normal[0] ? gradeTemplate(t, shown, lastGroups.get(shown)) : grade(shown.replace(/\{\w+\}/g, 'Name')), other, rewrite: sug.rewrite ?? '—', why: sug.why ?? '' });
}

// copy files
const files = ['src/shared/copy.json', 'src/layouts/copy.json', ...readdirSync(join(ROOT, 'src', 'features')).sort().map((f) => `src/features/${f}/copy.json`)];
const EX = { amount: '$150', balance: '$1,336.80', cash: '$452.11', date: 'Sept. 18', count: '2', ticker: 'AAPL', value: '$246.92', pct: '52', fee: '0.45', dollars: '150',
  term: 'Ups and downs', title: 'Your $150 deposit from Sept. 1 was sent back', change: 'down $10.99', name: 'Rosa', price: '$336.13', shares: '0.7346', earned: '$5.00', moneyIn: '$1,250.00',
  status: 'Pending', kind: 'Stock', age: '30', endAge: '65', nia: '$242,251', theo: '$186,213', monthly: '$150', label: 'Start age', setting: 'Start at 30', market: 'down $10.99',
  short: "How much an investment's price tends to jump around.", page: 'Activity', series: 'Balance', month: 'May', direction: 'up',
  example: 'Costco is a 1. Solana is a 5.', terms: 'volatility', link: 'Investor.gov glossary (U.S. SEC)', rating: '3', set: '35', now: '40', decimals: '2', putIn: '$9,600' };
const example = (t, parent = {}, key = '') => t.replace(/\{(\w+)\}/g, (m, n) =>
  typeof parent[`${n}Word`] === 'string' ? parent[`${n}Word`] : n === 'count' && /One$/.test(key) ? '1' : EX[n] ?? m);
for (const file of files) {
  const walk = (o, p) => { for (const [k, v] of Object.entries(o)) { const key = p ? `${p}.${k}` : k;
    if (typeof v === 'string') { const lit = v.replace(/\{(\w+)\}/g, (m, n) => (typeof o[`${n}Word`] === 'string' ? o[`${n}Word`] : m)); addRow(sectionOf(file, key), `${short(file)}:${key}`, lit, sectionOf(file, key), example(v, o, k)); }
    else if (Array.isArray(v)) addRow(sectionOf(file, key), `${short(file)}:${key}`, v.join(', '), 'Every date', v.join(', '));
    else walk(v, key); } };
  walk(read(file), '');
}
// data text that reaches the screen
const flags = read('src/shared/data/attention.json'), glossary = read('src/shared/data/glossary.json'), story = read('src/shared/data/story-p302.json');
const funds = read('src/shared/data/funds.json'), practice = read('src/shared/data/practice.json'), meta = read('src/shared/data/meta.json');
const byId = (acc) => Object.fromEntries((flags[acc] || []).map((f) => [f.id, f]));
const [fN, fA, fB] = ['rosa-starter', 'rosa-all-clear', 'rosa-new'].map(byId);
for (const id of uniq([...Object.keys(fN), ...Object.keys(fA), ...Object.keys(fB)])) for (const field of ['title', 'body', 'nextStep', 'action.label']) {
  const get = (f) => field === 'action.label' ? f?.action?.label : f?.[field];
  const t = get(fN[id]) ?? get(fA[id]) ?? get(fB[id]); if (!t) continue;
  addRow('Alerts', `data:attention.${id}.${field}`, t, 'Alerts');
  const r = rows.Alerts.at(-1);
  r.other = [['Nothing needs you', fA], ['Brand-new', fB]].map(([l, set]) => `${l}: ${get(set[id]) === undefined ? 'not shown' : get(set[id]) === t ? 'same' : `“${get(set[id])}”`}`).join('<br>');
}
for (const f of funds) for (const field of ['name', 'about']) addRow('Investments', `data:funds.${f.ticker}.${field}`, f[field], 'Investments');
const rosaN = story.rosaStory['rosa-starter'], rosaA = story.rosaStory['rosa-all-clear'];
addRow('Your money story', 'data:rosaStory.pointOfView', rosaN.pointOfView, 'Your money story');
rows['Your money story'].at(-1).other = `Nothing needs you: ${rosaA.pointOfView === rosaN.pointOfView ? 'same' : `“${rosaA.pointOfView}”`}<br>Brand-new: “${story.pointOfView}”`;
for (const c of rosaN.claims) {
  addRow('Your money story', `data:rosaStory.${c.id}`, c.text, 'Your money story');
  const a = rosaA.claims.find((x) => x.id === c.id);
  rows['Your money story'].at(-1).other = `Nothing needs you: ${!a ? 'not shown' : a.text === c.text ? 'same' : `“${a.text}”`}<br>Brand-new: not shown (short story)`;
}
for (const c of rosaA.claims.filter((c) => !rosaN.claims.some((x) => x.id === c.id))) {
  addRow('Your money story', `data:rosaStory.${c.id}`, c.text, 'Your money story');
  const r = rows['Your money story'].at(-1); r.shown = `${c.text} *(the “Nothing needs you” account only)*`; r.other = 'Normal: not shown<br>Brand-new: not shown';
}
for (const c of story.claims) addRow('Your money story', `data:story.claims.${c.id}`, c.text, 'Your money story, chapter 5');
for (const [k, t] of [['assumptions.note', story.assumptions.note], ['bumpy.note', story.bumpy.note]]) addRow('Your money story', `data:story.${k}`, t, 'Your money story, chapter 5');
addRow('Practice', 'data:practice.timeMachine.note', practice.timeMachine.note, 'Practice');
for (const g of glossary) for (const field of ['term', 'alsoCalled', 'short', 'detail', 'example']) {
  const t = field === 'alsoCalled' ? g.alsoCalled.join(', ') : g[field]; if (!t) continue;
  addRow('Words', `data:glossary.${g.id}.${field}`, t, 'Words, and every explanation of this word');
  rows.Words.at(-1).other = 'Same in every scenario';
}

// ---------- write ----------
const cell = (s) => String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ');
let n = 0; const total = Object.values(rows).reduce((s, r) => s + r.length, 0);
const out = [];
out.push(INTRO(total).trim(), '');
out.push('## Recommended rewrites, in order', '');
out.push('At most ten, most important first. Each one links to its row below.', '');
TOP.forEach((t, i) => out.push(`${i + 1}. ${t}`));
out.push('', '## Consistency pass', '');
out.push(CONSISTENCY.trim(), '');
out.push('## Screen by screen', '');
for (const s of SECTIONS) {
  if (!rows[s].length) continue;
  out.push(`### ${s}`, '', '| # | Where it appears | Text as shown (normal scenario) | Grade | Other scenario versions | Suggested rewrite | Why |', '|---|---|---|---|---|---|---|');
  rows[s].forEach((r, i) => { n++; out.push(`| ${LETTER[s]}${i + 1}<br>${approved[r.id] === r.t ? 'APPROVED' : 'DRAFT'} | ${cell(r.where)} | ${cell(r.shown)} | ${r.grade} | ${cell(r.other)} | ${cell(r.rewrite)} | ${cell(r.why)} |`); r.num = `${LETTER[s]}${i + 1}`; });
  out.push('');
}
mkdirSync(join(ROOT, 'docs', 'copy'), { recursive: true });
let md = out.join('\n');
// Link "[[id]]" references in TOP / CONSISTENCY to row numbers.
const numOf = Object.fromEntries(Object.values(rows).flat().map((r) => [r.id, r.num]));
if (APPROVE) {
  const snap = Object.fromEntries(Object.values(rows).flat().filter((r) => !EXCEPT.some((x) => r.id.startsWith(x))).map((r) => [r.id, r.t]));
  writeFileSync(APPROVED_FILE, JSON.stringify(snap, null, 2) + '\n');
  console.log(`recorded ${Object.keys(snap).length} approved rows (${EXCEPT.length ? `except ${EXCEPT.join(', ')}` : 'all'})`);
}
md = md.replace(/\[\[([^\]]+)\]\]/g, (m, id) => { if (!numOf[id]) throw new Error(`unknown row ${id}`); return `**${numOf[id]}**`; });
const missing = Object.keys(SUGGEST).filter((k) => !numOf[k]); if (missing.length) throw new Error(`suggestions for unknown rows: ${missing.join(', ')}`);
writeFileSync(join(ROOT, 'docs', 'copy', 'COPY-REVIEW.md'), md + '\n');
console.log(`${n} rows, ${Object.keys(SUGGEST).length} suggestions, ${TOP.length} top picks`);
const gradeOver = Object.values(rows).flat().filter((r) => r.grade !== 'label' && Number(r.grade) > 8);
console.log('rows over grade 8:', gradeOver.map((r) => `${r.num} ${r.grade} ${r.shown.slice(0, 60)}`));
const missingChanged = Object.keys(CHANGED).filter((k) => !numOf[k]); if (missingChanged.length) throw new Error(`CHANGED lists unknown rows: ${missingChanged.join(', ')}`);
const notFound = Object.values(rows).flat().filter((r) => /not on a captured/.test(r.shown)).length;
console.log('rows with example values:', notFound);

