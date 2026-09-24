#!/usr/bin/env node
// First Leaf: data validator. Zero dependencies (Node 20+).
//
// Checks the fictional data in src/shared/data/ against the rules written in
// BRIEF.md and docs/briefs/*.md. Every rule has an ID (e.g. A3). The same IDs
// appear in the briefs, so a failure points straight at the rule it breaks.
//
//   npm run validate            check the real data (exit 1 on any failure)
//   npm run validate:selftest   prove every rule FAILS on deliberately broken data
//
// It recalculates everything from scratch and never trusts a stored total.

import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const DATA_DIR = join(ROOT, 'src', 'shared', 'data');
export const DATA_FILES = ['meta', 'persona', 'funds', 'account', 'account-all-clear', 'account-new', 'activity', 'attention', 'scenarios', 'practice', 'story-p302', 'glossary'];
const BRIEF_FILES = ['BRIEF.md', 'docs/briefs/P301-BRIEF.md', 'docs/briefs/P302-BRIEF.md', 'docs/briefs/P303-BRIEF.md'];

// ---------------- helpers ----------------
const r2 = (n) => Math.round(n * 100) / 100;
const r4 = (n) => Math.round(n * 10000) / 10000;
const floor4 = (n) => Math.floor(n * 10000 + 1e-9) / 10000;
const eq = (a, b, tol = 0.005) => typeof a === 'number' && typeof b === 'number' && Math.abs(a - b) <= tol;
const HOLIDAYS_2026 = ['2026-01-01','2026-01-19','2026-02-16','2026-04-03','2026-05-25','2026-06-19','2026-07-03','2026-09-07','2026-11-26','2026-12-25'];
const dow = (s) => new Date(s + 'T00:00:00Z').getUTCDay();
const isTradingDay = (s) => dow(s) !== 0 && dow(s) !== 6 && !HOLIDAYS_2026.includes(s);
const addDays = (s, n) => { const d = new Date(s + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const nextTradingDay = (s) => { let d = s; while (!isTradingDay(d)) d = addDays(d, 1); return d; };
const daysBetween = (a, b) => Math.round((new Date(b + 'T00:00:00Z') - new Date(a + 'T00:00:00Z')) / 864e5);
function* strings(obj, path = '') {
  if (typeof obj === 'string') yield [path, obj];
  else if (Array.isArray(obj)) for (let i = 0; i < obj.length; i++) yield* strings(obj[i], `${path}[${i}]`);
  else if (obj && typeof obj === 'object') for (const [k, v] of Object.entries(obj)) yield* strings(v, path ? `${path}.${k}` : k);
}

// ---------------- plain-language tools ----------------
// Flesch-Kincaid grade level: 0.39*(words/sentences) + 11.8*(syllables/words) - 15.59
export function syllables(word) {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return 0;
  if (w.length <= 3) return 1;
  const s = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
  const groups = s.match(/[aeiouy]{1,2}/g);
  return Math.max(1, groups ? groups.length : 1);
}
export function fkGrade(text) {
  const clean = text
    .replace(/\bU\.S\./g, 'US')
    .replace(/\b(Jan|Feb|Aug|Sept|Oct|Nov|Dec)\./g, '$1')
    .replace(/\$?\d[\d,]*(\.\d+)?%?/g, ' num ');
  const sentences = clean.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean);
  const words = clean.split(/\s+/).map((w) => w.replace(/[^A-Za-z'-]/g, '')).filter(Boolean);
  if (!words.length || !sentences.length) return 0;
  const syl = words.reduce((s, w) => s + (w === 'num' ? 2 : syllables(w)), 0);
  return 0.39 * (words.length / sentences.length) + 11.8 * (syl / words.length) - 15.59;
}
export const MAX_GRADE = 8.0;
// Words that must never appear in beginner-facing text (unless they ARE the term being
// explained, listed in that glossary entry's own "alsoCalled").
export const JARGON = ['volatility', 'volatile', 'liquidity', 'equity', 'equities', 'securities', 'yield', 'basis point', 'asset class',
  'allocation', 'portfolio', 'net asset value', 'nav', 'prospectus', 'benchmark', 'capital gain', 'appreciation', 'principal',
  'instrument', 'leverage', 'margin', 'derivative', 'underlying', 'holdings', 'diversify', 'diversification', 'expense ratio',
  'cost basis', 'accrue', 'amortize', 'fiduciary', 'arbitrage', 'bps', 'ytd', 'aum', 'etf', 'compounding', 'money market'];
const hasWord = (text, w) => new RegExp(`(^|[^a-z])${w.replace(/ /g, '\\s+')}([^a-z]|$)`, 'i').test(text);

// ---------------- finance guardrails ----------------
// A representative denylist of the most-traded U.S. tickers and major financial brands. Extend freely.
export const REAL_TICKERS = ['AAPL','MSFT','AMZN','GOOG','GOOGL','META','NVDA','TSLA','BRK','JPM','V','MA','UNH','JNJ','XOM','PG','HD','KO','PEP','COST',
  'WMT','DIS','NFLX','INTC','AMD','CRM','ORCL','ADBE','CSCO','BAC','WFC','C','GS','MS','SCHW','PYPL','SQ','HOOD','COIN','UBER','ABNB','NKE','MCD','SBUX',
  'T','VZ','BA','GE','F','GM','PFE','MRK','ABBV','LLY','CVX','SPY','VOO','VTI','VTSAX','VFIAX','VXUS','BND','BNDX','AGG','QQQ','IVV','IWM','DIA','VT',
  'SCHD','VYM','VNQ','GLD','SLV','TLT','ARKK','FXAIX','FZROX','FSKAX','SWPPX','VGT','XLK','XLF','XLE','ICLN','TAN','QCLN','PBW','SPAXX','VMFXX'];
export const REAL_NAMES = ['Apple','Microsoft','Amazon','Alphabet','Google','Meta','Nvidia','Tesla','Berkshire','JPMorgan','Chase','Visa','Mastercard',
  'Vanguard','Fidelity','Schwab','BlackRock','iShares','SPDR','State Street','Invesco','Robinhood','Acorns','Stash','Betterment','Wealthfront','SoFi',
  'E*TRADE','ETRADE','TD Ameritrade','Merrill','Morgan Stanley','Goldman','Wells Fargo','Bank of America','Citi','Coinbase','Public.com','Webull',
  'Ally','Capital One','Nasdaq','NYSE','Dow Jones','S&P','Russell','MSCI','FTSE','Morningstar','Greenlight','Groundwork','Saguaro Credit Union'];
// Calls to action about specific investments are advice; education is not (FINRA Rule 2111 FAQ).
// Absolute safety claims are also banned: nothing in investing is "safe" without qualification.
// Real-app ruling (Sept. 24): inside the site, First Leaf reads as a real app, so no
// project language may reach the screen. The data itself stays marked fictional (G1, G5).
export const PROJECT_LANGUAGE = [/made[- ]up/i, /\bdemo\b/i, /case stud(y|ies)/i, /this project/i, /for reviewers/i, /\bfictional\b/i];
export const ADVICE_PATTERNS = [/you should (buy|sell|invest|move|switch)/i, /we recommend/i, /\bbest (fund|investment|stock)s?\b/i, /guarantee/i,
  /can'?t lose/i, /risk[- ]free/i, /\bsure thing\b/i, /\bbuy now\b/i, /\bsell now\b/i, /will (definitely|surely) (grow|go up)/i,
  /\b(is|are|very) safe\b/i, /\bcompare fees\b/i, /\bswitch (to|funds)\b/i, /\bmost people\b/i];

// ---------------- loading ----------------
export function loadData(dir = DATA_DIR) {
  const data = {}; const missing = [];
  for (const f of DATA_FILES) {
    const p = join(dir, `${f}.json`);
    if (!existsSync(p)) { missing.push(f); continue; }
    data[f] = JSON.parse(readFileSync(p, 'utf8'));
  }
  return { data, missing };
}
export function loadBriefExamples(root = ROOT) {
  const examples = [];
  for (const b of BRIEF_FILES) {
    const p = join(root, b);
    if (!existsSync(p)) continue;
    const text = readFileSync(p, 'utf8');
    const re = /```json brief-example\n([\s\S]*?)```/g; let m;
    while ((m = re.exec(text))) examples.push({ file: b, body: m[1] });
  }
  return examples;
}

// ---------------- rules ----------------
export function validate(data, { missing = [], briefExamples = [] } = {}) {
  const results = [];
  const rule = (id, name, fn) => {
    const errors = [];
    try { fn((msg) => errors.push(msg)); } catch (e) { errors.push(`crashed: ${e.message}`); }
    results.push({ id, name, ok: errors.length === 0, errors });
  };
  rule('S1', 'Every data file exists and parses', (fail) => { for (const m of missing) fail(`missing ${m}.json`); });
  if (missing.length) return results;

  const { meta, persona, funds, activity, attention, scenarios, practice, glossary } = data;
  const story = data['story-p302'], accountNew = data['account-new'];
  const funded = [data.account, data['account-all-clear']];       // accounts with money in them
  const allAccounts = [...funded, accountNew];
  const fundBy = Object.fromEntries(funds.map((f) => [f.ticker, f]));
  const glossIds = new Set(glossary.map((g) => g.id));
  const closeOn = (t, d) => fundBy[t]?.history.daily.find((x) => x.date === d)?.close;
  const feeOn = (t, d) => fundBy[t].expenseRatioHistory.filter((e) => e.effective <= d).at(-1)?.value;
  const acts = (acc) => activity[acc.id] || [];
  const flagsOf = (acc) => attention[acc.id] || [];
  const forEachFunded = (fn) => { for (const a of funded) fn(a, acts(a), `[${a.id}] `); };

  // Everything a learner can read (used by G6 and the L rules).
  const flagTexts = allAccounts.flatMap((acc) => flagsOf(acc).map((a) => [`attention:${acc.id}:${a.id}`, `${a.title}. ${a.body} ${a.nextStep}`]));
  const glossTexts = glossary.flatMap((g) => [[`glossary:${g.id}`, `${g.short} ${g.detail}`], [`glossary:${g.id}.example`, g.example]]);
  const rosaTexts = Object.values(story.rosaStory || {}).filter(Boolean).flatMap((r) => [
    [`story:rosaStory:${r.accountId}.pointOfView`, r.pointOfView],
    ...r.claims.map((c) => [`story:rosaStory:${r.accountId}:${c.id}`, c.text]),
  ]);
  const otherTexts = [
    ...rosaTexts,
    ['meta:disclaimer', meta.disclaimer], ['story:pointOfView', story.pointOfView], ['story:note', story.assumptions.note],
    ['story:bumpy.note', story.bumpy.note], ['story:yourTurn.note', story.yourTurn.note], ['practice:timeMachine.note', practice.timeMachine.note],
    ...story.claims.map((c) => [`story:claim:${c.id}`, c.text]),
    ...funds.map((f) => [`funds:${f.ticker}.inside`, f.inside]),
    ...scenarios.map((s) => [`scenarios:${s.id}.description`, s.description]), // README-only: exempt from G6, still plain
    ...allAccounts.flatMap((acc) => (activity[acc.id] || []).filter((a) => a.returnReason).map((a) => [`activity:${a.id}.returnReason`, a.returnReason])),
  ];

  // ----- S: structure -----
  rule('S2', 'Required fields are present', (fail) => {
    const req = {
      meta: ['product', 'asOf', 'lastClose', 'lastReview', 'wordOfTheDay', 'cashWaitingThreshold', 'fictional', 'disclaimer'],
      persona: ['id', 'firstName', 'age', 'fictional', 'moments'],
      practice: ['startingCash', 'funds', 'priceDate', 'fictional', 'timeMachine'],
      'story-p302': ['assumptions', 'savers', 'catchUp', 'bumpy', 'yourTurn', 'claims', 'startAgeSlider'],
    };
    for (const [file, keys] of Object.entries(req)) for (const k of keys) if (data[file]?.[k] === undefined) fail(`${file}.${k} missing`);
    for (const a of funded) for (const k of ['id', 'ownerId', 'balance', 'investedValue', 'cash', 'moneyIn', 'gainLoss', 'holdings', 'goal', 'weeklyChange', 'history', 'recurringDeposit', 'targetMix', 'autoInvest']) if (a[k] === undefined) fail(`${a.id}.${k} missing`);
    for (const f of funds) for (const k of ['ticker', 'name', 'fictional', 'kind', 'upsAndDowns', 'expenseRatioHistory', 'latestPrice', 'history', 'inside']) if (f[k] === undefined) fail(`funds[${f.ticker}].${k} missing`);
    for (const acc of allAccounts) {
      if (!Array.isArray(activity[acc.id])) fail(`activity has no list for ${acc.id}`);
      if (!Array.isArray(attention[acc.id])) fail(`attention has no list for ${acc.id}`);
      for (const a of flagsOf(acc)) for (const k of ['id', 'severity', 'title', 'body', 'nextStep', 'terms', 'route', 'raisedOn', 'newSinceLastReview']) if (a[k] === undefined) fail(`attention[${acc.id}][${a.id}].${k} missing`);
    }
    for (const g of glossary) for (const k of ['id', 'term', 'short', 'detail', 'example', 'related']) if (g[k] === undefined) fail(`glossary[${g.id}].${k} missing`);
  });
  rule('S3', 'The footer disclosure says "risk", "simulated" and "not investment advice"', (fail) => {
    if (meta.fictional !== true) fail('meta.fictional must be true');
    if (!/\brisk\b/i.test(meta.disclaimer)) fail('disclosure must say "risk"');
    if (!/\bsimulated\b/i.test(meta.disclaimer)) fail('disclosure must say the accounts, funds and prices are "simulated"');
    if (!/\b(not|nothing here is) investment advice\b/i.test(meta.disclaimer)) fail('disclosure must say it is not investment advice');
  });

  // ----- G: finance guardrails -----
  rule('G1', 'Every fund is marked fictional and uses an FL- ticker', (fail) => {
    for (const f of funds) {
      if (f.fictional !== true) fail(`${f.ticker} not marked fictional`);
      if (!/^FL-[A-Z]{3,6}$/.test(f.ticker)) fail(`${f.ticker} does not match the FL-XXX pattern`);
    }
    for (const t of practice.funds) if (!fundBy[t]) fail(`practice fund ${t} does not exist`);
  });
  rule('G2', 'No real tickers or real company/brand names anywhere in the data', (fail) => {
    for (const [file, obj] of Object.entries(data)) for (const [path, s] of strings(obj)) {
      if (/url$/i.test(path)) continue;
      for (const t of REAL_TICKERS) {
        if (!new RegExp(`(^|[^A-Za-z-])${t}([^A-Za-z-]|$)`).test(s)) continue;
        if (t.length <= 2 && !new RegExp(`(^|\\s|\\()${t}(\\s|\\)|$)`).test(s)) continue; // V, C, T, F only as stand-alone tokens
        fail(`${file}:${path} contains real ticker "${t}": "${s.slice(0, 60)}"`);
      }
      for (const n of REAL_NAMES) if (new RegExp(`(^|[^A-Za-z])${n.replace(/[*&.]/g, (c) => '\\' + c)}([^A-Za-z]|$)`, 'i').test(s)) fail(`${file}:${path} contains real name "${n}"`);
    }
  });
  rule('G3', 'No advice language, no absolute safety claims, no invented crowd claims', (fail) => {
    for (const [file, obj] of Object.entries(data)) for (const [path, s] of strings(obj)) for (const re of ADVICE_PATTERNS) if (re.test(s)) fail(`${file}:${path} matches ${re}: "${s.slice(0, 80)}"`);
  });
  rule('G4', 'No account numbers or routing numbers', (fail) => {
    for (const [file, obj] of Object.entries(data)) for (const [path, s] of strings(obj)) {
      if (/\b\d{8,17}\b/.test(s)) fail(`${file}:${path} contains a long digit string that could be an account number`);
      if (/routing|account number|acct\s*#/i.test(s)) fail(`${file}:${path} mentions routing/account numbers`);
    }
  });
  rule('G5', 'Every person and account in the data is marked fictional', (fail) => {
    if (persona.fictional !== true) fail('persona not fictional');
    for (const s of story.savers) if (s.fictional !== true) fail(`saver ${s.id} not fictional`);
    for (const a of allAccounts) if (a.fictional !== true) fail(`${a.id} not fictional`);
  });

  rule('G6', 'No project language on screen (made up, demo, case study, this project, for reviewers, fictional)', (fail) => {
    const screen = [
      ...glossary.flatMap((g) => [[`glossary:${g.id}.term`, g.term], [`glossary:${g.id}.alsoCalled`, (g.alsoCalled || []).join(', ')], [`glossary:${g.id}.short`, g.short], [`glossary:${g.id}.detail`, g.detail], [`glossary:${g.id}.example`, g.example]]),
      ...allAccounts.flatMap((acc) => flagsOf(acc).flatMap((a) => [[`attention:${acc.id}:${a.id}`, `${a.title}. ${a.body} ${a.nextStep} ${a.action?.label ?? ''}`]])),
      ...funds.flatMap((f) => [[`funds:${f.ticker}.name`, f.name], [`funds:${f.ticker}.inside`, f.inside]]),
      ['story:title', story.title], ...story.claims.map((c) => [`story:claim:${c.id}`, c.text]),
      ...otherTexts.filter(([where]) => !where.startsWith('scenarios:')),
    ];
    for (const [where, text] of screen) for (const re of PROJECT_LANGUAGE) if (re.test(text)) fail(`${where} uses project language ${re}: "${text.slice(0, 80)}"`);
  });

  // ----- F: funds -----
  rule('F1', 'Fund prices are positive, dated in order, and only on trading days', (fail) => {
    for (const f of funds) for (const key of ['weekly', 'daily']) {
      const h = f.history[key];
      for (let i = 0; i < h.length; i++) {
        if (!(h[i].close > 0)) fail(`${f.ticker} ${key} ${h[i].date} price not positive`);
        if (i && h[i].date <= h[i - 1].date) fail(`${f.ticker} ${key} dates not ascending at ${h[i].date}`);
        if (dow(h[i].date) === 0 || dow(h[i].date) === 6) fail(`${f.ticker} ${key} ${h[i].date} is a weekend`);
        if (key === 'daily' && HOLIDAYS_2026.includes(h[i].date)) fail(`${f.ticker} daily ${h[i].date} is a market holiday`);
      }
    }
  });
  rule('F2', 'Daily and weekly prices agree on the same dates', (fail) => {
    for (const f of funds) {
      const w = Object.fromEntries(f.history.weekly.map((x) => [x.date, x.close]));
      for (const d of f.history.daily) if (w[d.date] !== undefined && w[d.date] !== d.close) fail(`${f.ticker} ${d.date}: daily ${d.close} vs weekly ${w[d.date]}`);
    }
  });
  rule('F3', 'Latest price, practice dates and the time machine agree with the price history', (fail) => {
    for (const f of funds) {
      const ld = f.history.daily.at(-1), lw = f.history.weekly.at(-1);
      if (ld.date !== meta.lastClose || lw.date !== meta.lastClose) fail(`${f.ticker} last price date is not ${meta.lastClose}`);
      if (f.latestPrice !== ld.close || f.latestPrice !== lw.close) fail(`${f.ticker} latestPrice ${f.latestPrice} != last close`);
    }
    if (practice.priceDate !== meta.lastClose) fail('practice.priceDate != meta.lastClose');
    if (practice.timeMachine.from !== funds[0].history.weekly[0].date) fail(`timeMachine.from ${practice.timeMachine.from} != first weekly price ${funds[0].history.weekly[0].date}`);
    if (practice.timeMachine.to !== meta.lastClose) fail('timeMachine.to != lastClose');
    for (const a of allAccounts) if (a.lastClose !== meta.lastClose) fail(`${a.id}.lastClose != meta.lastClose`);
  });
  rule('F4', 'Fund fees, ratings and the reserve fund price are in range', (fail) => {
    for (const f of funds) {
      for (const e of f.expenseRatioHistory) {
        if (!(e.value >= 0 && e.value <= 2)) fail(`${f.ticker} fee ${e.value}% out of 0-2% range`);
        if (e.announcedOn && e.announcedOn >= e.effective) fail(`${f.ticker} fee change announced on/after it takes effect`);
      }
      for (let i = 1; i < f.expenseRatioHistory.length; i++) if (f.expenseRatioHistory[i].effective <= f.expenseRatioHistory[i - 1].effective) fail(`${f.ticker} fee history not in date order`);
      if (!Number.isInteger(f.upsAndDowns) || f.upsAndDowns < 1 || f.upsAndDowns > 5) fail(`${f.ticker} upsAndDowns ${f.upsAndDowns} not 1-5`);
      if (!['stocks', 'bonds', 'reserve'].includes(f.kind)) fail(`${f.ticker} kind ${f.kind} invalid`);
      if (f.kind === 'reserve' && f.history.daily.some((d) => d.close !== 1)) fail(`${f.ticker} reserve fund price must stay $1.00`);
    }
  });

  // ----- A: accounts (checked for EVERY funded account, so every demo scenario is true) -----
  const buysOf = (list) => list.filter((a) => a.type === 'buy' && a.status === 'completed');
  const divsOf = (list) => list.filter((a) => a.type === 'dividend' && a.status === 'completed');
  const depsOf = (list) => list.filter((a) => a.type === 'deposit' && a.status === 'completed');
  rule('A1', "Each fund you own is worth shares x today's price", (fail) => forEachFunded((acc, _, p) => {
    for (const h of acc.holdings) {
      if (!fundBy[h.ticker]) { fail(`${p}${h.ticker} is not a known fund`); continue; }
      if (h.price !== fundBy[h.ticker].latestPrice) fail(`${p}${h.ticker} price ${h.price} != latest ${fundBy[h.ticker].latestPrice}`);
      if (!eq(h.value, r2(h.shares * h.price))) fail(`${p}${h.ticker} value ${h.value} != ${r2(h.shares * h.price)}`);
    }
  }));
  rule('A2', 'Up/down per fund = value minus what you paid', (fail) => forEachFunded((acc, _, p) => {
    for (const h of acc.holdings) if (!eq(h.gainLoss, r2(h.value - h.costBasis))) fail(`${p}${h.ticker} gainLoss ${h.gainLoss} != ${r2(h.value - h.costBasis)}`);
  }));
  rule('A3', 'Balance = funds + cash', (fail) => forEachFunded((acc, _, p) => {
    const inv = r2(acc.holdings.reduce((s, h) => s + h.value, 0));
    if (!eq(acc.investedValue, inv)) fail(`${p}investedValue ${acc.investedValue} != sum of holdings ${inv}`);
    if (!eq(acc.balance, r2(inv + acc.cash))) fail(`${p}balance ${acc.balance} != ${r2(inv + acc.cash)}`);
  }));
  rule('A4', 'Money you put in = deposits that went through (returned deposits excluded)', (fail) => forEachFunded((acc, list, p) => {
    const s = r2(depsOf(list).reduce((t, a) => t + a.amount, 0));
    if (!eq(acc.moneyIn, s)) fail(`${p}moneyIn ${acc.moneyIn} != completed deposits ${s}`);
    for (const a of list.filter((x) => x.type === 'deposit' && x.status === 'returned')) if (!a.returnedDate || a.returnedDate < a.date) fail(`${p}returned deposit ${a.id} has a bad returnedDate`);
  }));
  rule('A5', 'What you paid per fund = its buys; shares = its buys', (fail) => forEachFunded((acc, list, p) => {
    for (const h of acc.holdings) {
      const b = buysOf(list).filter((a) => a.ticker === h.ticker);
      if (!eq(h.costBasis, r2(b.reduce((s, a) => s + a.amount, 0)))) fail(`${p}${h.ticker} costBasis ${h.costBasis} != buys`);
      if (!eq(h.shares, r4(b.reduce((s, a) => s + a.shares, 0)), 0.00005)) fail(`${p}${h.ticker} shares ${h.shares} != buys`);
    }
  }));
  rule('A6', 'Cash = deposits - buys + dividends', (fail) => forEachFunded((acc, list, p) => {
    const c = r2(depsOf(list).reduce((s, a) => s + a.amount, 0) - buysOf(list).reduce((s, a) => s + a.amount, 0) + divsOf(list).reduce((s, a) => s + a.amount, 0));
    if (!eq(acc.cash, c)) fail(`${p}cash ${acc.cash} != ${c}`);
    if (!eq(acc.dividendsTotal, r2(divsOf(list).reduce((s, a) => s + a.amount, 0)))) fail(`${p}dividendsTotal != sum of dividends`);
  }));
  rule('A7', 'Up/down overall = balance - money put in', (fail) => forEachFunded((acc, _, p) => {
    if (!eq(acc.gainLoss, r2(acc.balance - acc.moneyIn))) fail(`${p}gainLoss ${acc.gainLoss} != ${r2(acc.balance - acc.moneyIn)}`);
    if (!eq(acc.gainLossPercent, r4(acc.gainLoss / acc.moneyIn), 0.00005)) fail(`${p}gainLossPercent wrong`);
  }));
  rule('A8', "Balance history ends at today's balance and uses trading days", (fail) => forEachFunded((acc, _, p) => {
    const h = acc.history, last = h.at(-1);
    if (last.date !== meta.lastClose) fail(`${p}history ends ${last.date}, expected ${meta.lastClose}`);
    if (!eq(last.balance, acc.balance)) fail(`${p}history last balance ${last.balance} != balance ${acc.balance}`);
    if (!eq(last.moneyIn, acc.moneyIn)) fail(`${p}history last moneyIn ${last.moneyIn} != moneyIn`);
    if (!eq(last.cash, acc.cash)) fail(`${p}history last cash != cash`);
    const dates = funds[0].history.daily.map((d) => d.date);
    if (h.length !== dates.length || h.some((r, i) => r.date !== dates[i])) fail(`${p}history dates do not match fund trading days`);
    if (h[0].date !== acc.openedOn) fail(`${p}history does not start on openedOn`);
  }));
  rule('A9', 'Your target mix adds up to 100% and uses real (fictional) funds', (fail) => forEachFunded((acc, _, p) => {
    const s = r4(Object.values(acc.targetMix).reduce((a, b) => a + b, 0));
    if (s !== 1) fail(`${p}targetMix sums to ${s}`);
    for (const t of Object.keys(acc.targetMix)) if (!fundBy[t]) fail(`${p}targetMix fund ${t} unknown`);
  }));
  rule('A10', "This week's change adds up to the cent (start + deposits + dividends + market = end; funds = market)", (fail) => forEachFunded((acc, list, p) => {
    const w = acc.weeklyChange;
    const start = acc.history.find((r) => r.date === w.from);
    if (!start) fail(`${p}no history row for ${w.from}`); else if (!eq(start.balance, w.startBalance)) fail(`${p}startBalance ${w.startBalance} != history ${start.balance}`);
    if (!eq(r2(w.startBalance + w.deposits - w.withdrawals + w.dividends + w.marketChange), w.endBalance)) fail(`${p}pieces do not add up to endBalance`);
    if (!eq(w.totalChange, r2(w.endBalance - w.startBalance))) fail(`${p}totalChange wrong`);
    if (!eq(w.endBalance, acc.balance)) fail(`${p}endBalance ${w.endBalance} != balance ${acc.balance}`);
    const wd = r2(divsOf(list).filter((a) => a.date > w.from && a.date <= w.to).reduce((s, a) => s + a.amount, 0));
    if (!eq(w.dividends, wd)) fail(`${p}dividends ${w.dividends} != activity in window ${wd}`);
    const bf = r2(w.byFund.reduce((s, x) => s + x.change, 0));
    if (!eq(bf, w.marketChange)) fail(`${p}byFund sums to ${bf}, marketChange is ${w.marketChange} (must match to the cent)`);
  }));
  rule('A11', 'The goal measures deposits only, is reachable on plan, and its numbers agree', (fail) => forEachFunded((acc, list, p) => {
    const g = acc.goal;
    if (g.measures !== 'moneyIn') fail(`${p}goal must measure moneyIn (deposits), not the market`);
    const planned = r2(list.filter((a) => a.type === 'deposit').reduce((s, a) => s + a.amount, 0));
    if (!eq(g.plannedMoneyInToDate, planned)) fail(`${p}planned ${g.plannedMoneyInToDate} != all requested deposits ${planned}`);
    if (!eq(g.actualMoneyInToDate, acc.moneyIn)) fail(`${p}actual != moneyIn`);
    if (!eq(g.behindBy, r2(g.plannedMoneyInToDate - g.actualMoneyInToDate))) fail(`${p}behindBy wrong`);
    if (!eq(g.progress, r4(acc.moneyIn / g.target), 0.00005)) fail(`${p}progress must be moneyIn / target`);
    if (!(g.plannedMoneyInByTarget >= g.target)) fail(`${p}the plan only reaches ${g.plannedMoneyInByTarget} by ${g.targetDate}, below the ${g.target} target`);
    if (g.plan.monthly !== acc.recurringDeposit.amount) fail(`${p}goal plan monthly != recurring deposit`);
  }));
  rule('A12', "Buys use that day's price, settle next business day (T+1), and share math is right", (fail) => forEachFunded((acc, list, p) => {
    for (const b of buysOf(list)) {
      const px = closeOn(b.ticker, b.date);
      if (px === undefined) { fail(`${p}${b.id} no price on ${b.date}`); continue; }
      if (b.price !== px) fail(`${p}${b.id} price ${b.price} != close ${px}`);
      if (!eq(b.shares, floor4(b.amount / b.price), 0.00005)) fail(`${p}${b.id} shares ${b.shares} != ${floor4(b.amount / b.price)}`);
      if (b.settledDate !== nextTradingDay(addDays(b.date, 1))) fail(`${p}${b.id} settles ${b.settledDate}, T+1 is ${nextTradingDay(addDays(b.date, 1))}`);
    }
    for (const d of divsOf(list)) if (!isTradingDay(d.date)) fail(`${p}${d.id} dividend on non-trading day`);
    const ids = list.map((a) => a.id); if (new Set(ids).size !== ids.length) fail(`${p}activity ids not unique`);
  }));
  rule('A13', '"Waiting in cash since" date is true', (fail) => forEachFunded((acc, _, p) => {
    const T = meta.cashWaitingThreshold, h = acc.history;
    if (acc.cash < T) { if (acc.cashSince !== null) fail(`${p}cash ${acc.cash} is under $${T} but cashSince is set`); return; }
    const i = h.findIndex((r) => r.date === acc.cashSince);
    if (i < 1) { fail(`${p}cashSince ${acc.cashSince} not in history`); return; }
    if (!(h[i - 1].cash < T)) fail(`${p}cash was already ${h[i - 1].cash} the day before cashSince`);
    for (let k = i; k < h.length; k++) if (h[k].cash < T) fail(`${p}cash dropped below $${T} on ${h[k].date}, after cashSince`);
  }));
  rule('A14', 'Auto-invest behaves as stated: each deposit is invested in the mix while on, and nothing is bought while paused', (fail) => forEachFunded((acc, list, p) => {
    const paused = acc.autoInvest.pausedOn;
    if (acc.autoInvest.on === Boolean(paused)) fail(`${p}autoInvest.on must be false exactly when pausedOn is set`);
    for (const d of depsOf(list)) {
      const buys = buysOf(list).filter((b) => b.date === d.settledDate);
      const shouldInvest = !paused || d.settledDate < paused;
      const spent = r2(buys.reduce((s, b) => s + b.amount, 0));
      if (shouldInvest && !eq(spent, d.amount, 0.011)) fail(`${p}deposit ${d.id} on ${d.settledDate} should be fully invested; buys total ${spent}`);
      if (!shouldInvest && buys.length) fail(`${p}buys on ${d.settledDate} happened while auto-invest was paused`);
      for (const b of buys) if (!eq(b.amount, r2(d.amount * (acc.targetMix[b.ticker] || 0)))) fail(`${p}${b.id} does not follow the target mix`);
    }
    if (paused) for (const b of buysOf(list)) if (b.date >= paused) fail(`${p}${b.id} bought on ${b.date}, after auto-invest was paused`);
  }));

  // ----- N: attention flags (checked for every account) -----
  const SEV = ['needs-you', 'heads-up', 'fyi'];
  const ROUTES = ['overview', 'activity', 'practice', 'fund', 'holdings', 'glossary'];
  rule('N1', 'Flags are well formed: known severity, route and terms; most urgent first; "new" is true', (fail) => {
    for (const acc of allAccounts) {
      const list = flagsOf(acc), p = `[${acc.id}] `;
      const ids = list.map((a) => a.id); if (new Set(ids).size !== ids.length) fail(`${p}flag ids not unique`);
      let last = 0;
      for (const a of list) {
        if (!SEV.includes(a.severity)) fail(`${p}${a.id} severity ${a.severity}`);
        if (!ROUTES.includes(a.route)) fail(`${p}${a.id} route ${a.route}`);
        for (const t of a.terms) if (!glossIds.has(t)) fail(`${p}${a.id} term ${t} not in glossary`);
        if (a.route === 'fund' && !fundBy[a.ticker]) fail(`${p}${a.id} routes to a fund but ticker is missing`);
        const s = SEV.indexOf(a.severity); if (s < last) fail(`${p}${a.id} is out of order (most urgent first)`); last = s;
        if (a.raisedOn > meta.asOf) fail(`${p}${a.id} raised after asOf`);
        if (a.newSinceLastReview !== (a.raisedOn > meta.lastReview)) fail(`${p}${a.id} newSinceLastReview is wrong`);
      }
    }
  });
  rule('N2', 'Every flag is there exactly when the account facts call for it, and its numbers match', (fail) => {
    for (const acc of funded) {
      const list = acts(acc), flags = flagsOf(acc), by = Object.fromEntries(flags.map((f) => [f.id, f])), p = `[${acc.id}] `;
      const expect = (id, cond) => { if (cond && !by[id]) fail(`${p}${id} should be shown but is missing`); if (!cond && by[id]) fail(`${p}${id} is shown but the account facts don't call for it`); return cond && by[id]; };
      const ret = list.filter((a) => a.status === 'returned' && daysBetween(a.returnedDate, meta.asOf) <= 30).at(-1);
      const f1 = expect('deposit-returned', !!ret); if (f1 && !eq(f1.amount, ret.amount)) fail(`${p}deposit-returned amount wrong`);
      const f2 = expect('goal-behind', acc.goal.behindBy > 0); if (f2 && !eq(f2.amount, acc.goal.behindBy)) fail(`${p}goal-behind amount wrong`);
      const f3 = expect('cash-sitting', acc.cash >= meta.cashWaitingThreshold);
      if (f3 && (!eq(f3.amount, acc.cash) || f3.date !== acc.cashSince)) fail(`${p}cash-sitting amount/date != cash/cashSince`);
      if (f3 && acc.autoInvest.pausedOn && !f3.body.includes('paused')) fail(`${p}cash-sitting must explain that auto-invest is paused`);
      const rising = acc.holdings.map((h) => ({ h, up: fundBy[h.ticker].expenseRatioHistory.find((e) => e.effective > meta.asOf && daysBetween(meta.asOf, e.effective) <= 30) })).filter((x) => x.up);
      const f4 = expect('fee-going-up', rising.length > 0);
      if (f4) {
        const { h, up } = rising[0]; const from = feeOn(h.ticker, meta.asOf);
        if (f4.ticker !== h.ticker || f4.feeFrom !== from || f4.feeTo !== up.value) fail(`${p}fee-going-up fund/fees wrong`);
        if (!eq(f4.amount, r2(h.value * (up.value - from) / 100))) fail(`${p}fee amount ${f4.amount} != ${r2(h.value * (up.value - from) / 100)}`);
      }
      const div = divsOf(list).filter((a) => daysBetween(a.date, meta.asOf) <= 7).at(-1);
      const f5 = expect('dividend-paid', !!div); if (f5 && (!eq(f5.amount, div.amount) || f5.ticker !== div.ticker)) fail(`${p}dividend-paid does not match the latest dividend`);
    }
    if (flagsOf(accountNew).length) fail('[rosa-new] a brand-new account has nothing to flag');
  });
  rule('N3', 'Every dollar figure written in a flag is a real number in that account', (fail) => {
    for (const acc of funded) {
      const known = new Set(); const add = (n) => typeof n === 'number' && known.add(r2(n).toFixed(2));
      for (const v of Object.values(acc)) add(v);
      for (const v of Object.values(acc.goal)) add(v);
      for (const h of acc.holdings) Object.values(h).forEach(add);
      for (const a of acts(acc)) add(a.amount);
      for (const a of flagsOf(acc)) add(a.amount);
      for (const a of flagsOf(acc)) for (const field of ['title', 'body', 'nextStep']) for (const m of a[field].match(/\$[\d,]+(\.\d\d)?/g) || []) {
        const n = Number(m.replace(/[$,]/g, '')).toFixed(2);
        if (!known.has(n)) fail(`[${acc.id}] ${a.id}.${field} says ${m}, which is not a number in this account`);
      }
    }
  });

  // ----- C: scenarios -----
  rule('C1', 'Demo scenarios exist and point at real accounts; "Nothing needs you" has nothing that needs you', (fail) => {
    const ids = scenarios.map((s) => s.id);
    for (const need of ['normal', 'all-clear', 'brand-new']) if (!ids.includes(need)) fail(`scenario ${need} missing`);
    const accIds = allAccounts.map((a) => a.id);
    for (const s of scenarios) if (!accIds.includes(s.accountId)) fail(`${s.id} accountId ${s.accountId} unknown`);
    const calm = scenarios.find((s) => s.id === 'all-clear');
    if (calm) for (const f of attention[calm.accountId] || []) if (f.severity !== 'fyi') fail(`all-clear shows "${f.id}" (${f.severity})`);
    const normal = scenarios.find((s) => s.id === 'normal');
    if (normal && !(attention[normal.accountId] || []).some((f) => f.severity === 'needs-you')) fail('the normal scenario should show at least one needs-you flag');
  });
  rule('C2', 'The brand-new account is truly empty and consistent', (fail) => {
    for (const k of ['balance', 'investedValue', 'cash', 'moneyIn', 'gainLoss', 'dividendsTotal']) if (accountNew[k] !== 0) fail(`account-new.${k} must be 0`);
    if (accountNew.holdings.length || accountNew.history.length) fail('account-new must have no holdings or history');
    if ((activity[accountNew.id] || []).length) fail('account-new must have no activity');
    if (accountNew.ownerId !== persona.id) fail('account-new ownerId != persona');
  });

  // ----- T: P302 story -----
  const proj = (startAge, monthly, rate, endAge) => { const i = rate / 12; let v = 0; for (let m = 0; m < (endAge - startAge) * 12; m++) v = v * (1 + i) + monthly; return v; };
  const sv = Object.fromEntries(story.savers.map((s) => [s.id, s]));
  rule('T1', "Each saver's numbers match the growth formula", (fail) => {
    const { annualRate, endAge } = story.assumptions;
    for (const s of story.savers) {
      const v = r2(proj(s.startAge, s.monthly, annualRate, endAge)), putIn = s.monthly * 12 * (endAge - s.startAge);
      if (!eq(s.final.value, v, 0.02)) fail(`${s.id} final value ${s.final.value} != ${v}`);
      if (!eq(s.final.putIn, putIn)) fail(`${s.id} putIn ${s.final.putIn} != ${putIn}`);
      if (!eq(s.final.earned, r2(s.final.value - s.final.putIn), 0.02)) fail(`${s.id} earned wrong`);
      if (s.yearly.length !== endAge - s.startAge + 1) fail(`${s.id} yearly has ${s.yearly.length} rows`);
      if (!eq(s.yearly.at(-1).value, s.final.value, 0.02)) fail(`${s.id} last yearly != final`);
    }
  });
  rule('T2', 'Every claim the story makes is true in the data, and the sliders can reach them', (fail) => {
    const n = sv.nia, t = sv.theo, ids = story.claims.map((c) => c.id);
    for (const need of ['early-ends-ahead', 'early-puts-in-less', 'early-earned-share', 'catch-up-costs-more', 'early-ahead-when-bumpy']) if (!ids.includes(need)) fail(`claim ${need} missing`);
    if (!(n.final.value > t.final.value)) fail('early-ends-ahead is false');
    if (!(n.final.putIn < t.final.putIn)) fail('early-puts-in-less is false');
    if (!(n.final.earned / n.final.value > 0.5)) fail('early-earned-share is false');
    if (!(n.startAge < t.startAge && n.monthly < t.monthly)) fail('"start early vs start big" setup is broken');
    if (!(story.bumpy.nia.at(-1).value > story.bumpy.theo.at(-1).value)) fail('early-ahead-when-bumpy is false');
    const { annualRate, endAge } = story.assumptions, need = story.catchUp.monthlyNeeded, sl = story.catchUp.slider;
    if (!(proj(t.startAge, need, annualRate, endAge) >= n.final.value)) fail(`catch-up $${need} is not enough`);
    if (proj(t.startAge, need - 1, annualRate, endAge) >= n.final.value) fail(`catch-up $${need} is not the smallest amount`);
    if (!(need >= sl.min && need <= sl.max && (need - sl.min) % sl.step === 0)) fail(`Theo's slider (${sl.min}-${sl.max}, step ${sl.step}) cannot land on $${need}`);
    if (!(story.claims.find((c) => c.id === 'catch-up-costs-more')?.text || '').includes(`$${need}`)) fail('catch-up claim text does not show the computed amount');
    const as = story.startAgeSlider; if (!(as.min <= n.startAge && as.max >= t.startAge)) fail('start-age slider does not cover both savers');
  });
  rule('T3', 'The bumpy version has the same overall growth and no staged crash', (fail) => {
    const r = story.bumpy.yearlyReturns;
    const gm = Math.pow(r.reduce((p, x) => p * (1 + x), 1), 1 / r.length) - 1;
    if (Math.abs(gm - story.assumptions.annualRate) > 0.0005) fail(`bumpy overall growth ${gm.toFixed(4)} != ${story.assumptions.annualRate}`);
    if (r.length !== story.assumptions.endAge - sv.nia.startAge) fail('bumpy has the wrong number of years');
    if (!r.some((x) => x < 0)) fail('bumpy has no down years, so it does not show ups and downs');
    if (Math.min(...r) < -0.2) fail(`bumpy has a year of ${(Math.min(...r) * 100).toFixed(1)}%, worse than -20% (reads like a crash forecast)`);
    for (const [who, path, smooth] of [['nia', story.bumpy.nia, sv.nia.final.value], ['theo', story.bumpy.theo, sv.theo.final.value]]) {
      if (Math.abs(path.at(-1).value / smooth - 1) > 0.15) fail(`${who}'s bumpy ending is more than 15% away from the smooth ending`);
    }
    let peak = 0, dd = 0; for (const y of story.bumpy.nia.slice(5)) { peak = Math.max(peak, y.value); if (peak) dd = Math.max(dd, 1 - y.value / peak); }
    if (dd > 0.25) fail(`Nia's bumpy balance falls ${(dd * 100).toFixed(0)}% from a peak (limit 25%)`);
    if (!/overall growth/i.test(story.bumpy.note)) fail('bumpy note must say "overall growth" (the simple average of the years is higher)');
  });
  rule('T4', 'The story says its rate is an example that nobody can promise', (fail) => {
    const a = story.assumptions;
    if (!(a.annualRate > 0 && a.annualRate <= 0.1)) fail(`annualRate ${a.annualRate} out of range`);
    if (!/\bexample\b/i.test(a.note)) fail('assumptions.note must say the rate is an example');
    if (!/nobody can promise/i.test(a.note)) fail('assumptions.note must say nobody can promise a rate');
  });

  // ----- R: Rosa's own story (Your money story, chapters 1-4) -----
  // Every fact is recomputed from the price and balance history; every number in a
  // story sentence must be one of that account's checked facts.
  const rosa = story.rosaStory || {};
  const money = (n) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const pct1 = (x) => (Math.round(x * 1000) / 10).toFixed(1);
  const claimOf = (r, id) => r.claims.find((c) => c.id === id);
  function recomputeDip(win, ticker) {
    const rows = fundBy[ticker].history.daily.filter((d) => d.date >= win.from && d.date <= win.to);
    let peak = rows[0], best = { high: rows[0], low: rows[0], drop: 0 };
    for (const r of rows) { if (r.close > peak.close) peak = r; const drop = r.close / peak.close - 1; if (drop < best.drop) best = { high: peak, low: r, drop }; }
    return { highDate: best.high.date, high: best.high.close, lowDate: best.low.date, low: best.low.close, drop: r4(best.low.close / best.high.close - 1) };
  }
  rule('R1', 'The deposits share of her balance is what the story says; "almost all" only when it is at least 90%', (fail) => {
    if (/right now|almost all/i.test(story.pointOfView)) fail('the general point of view (no history yet) must not claim "right now, almost all"');
    for (const acc of funded) {
      const r = rosa[acc.id], p = `[${acc.id}] `; if (!r) continue; // R4 reports a missing story
      const share = r4(acc.moneyIn / acc.balance), f = r.facts;
      if (!eq(f.depositsShare, share, 0.00005)) fail(`${p}depositsShare ${f.depositsShare} != moneyIn / balance ${share}`);
      if (!eq(f.moneyIn, acc.moneyIn) || !eq(f.balance, acc.balance) || !eq(f.earned, acc.gainLoss)) fail(`${p}moneyIn, balance or earned do not match the account`);
      const c = claimOf(r, 'deposits-share');
      if (!c) fail(`${p}no deposits-share claim`);
      else if (acc.gainLoss >= 0 && !c.text.includes(`${Math.round(share * 100)}%`)) fail(`${p}deposits-share says "${c.text}" but the share is ${Math.round(share * 100)}%`);
      const saysAlmostAll = /almost all/i.test(r.pointOfView);
      if (saysAlmostAll !== (share >= 0.9)) fail(`${p}point of view ${saysAlmostAll ? 'says' : 'does not say'} "almost all" but the share is ${(share * 100).toFixed(1)}%`);
    }
  });
  // The dip rule (ruling, Sept. 24): the largest high-to-low drop in FL-BROAD in the 30
  // calendar days before Rosa paused auto-invest. The market is the same for every
  // account, so accounts that never paused use the same window.
  const pauseAnchor = funded.map((a) => a.autoInvest.pausedOn).find(Boolean);
  const DIP_WINDOW = pauseAnchor ? { from: addDays(pauseAnchor, -30), to: pauseAnchor } : null;
  rule('R2', "The July dip (largest drop in the 30 days before the pause) and her balance at the low match the history", (fail) => {
    if (!DIP_WINDOW) { fail('no account paused auto-invest, so the dip has no anchor'); return; }
    for (const acc of funded) {
      const r = rosa[acc.id], p = `[${acc.id}] `; if (!r) continue;
      const d = r.facts.dip;
      if (d.ticker !== 'FL-BROAD') fail(`${p}the dip must be measured on FL-BROAD, not ${d.ticker}`);
      if (d.window.from !== DIP_WINDOW.from || d.window.to !== DIP_WINDOW.to) fail(`${p}dip window is ${d.window.from} to ${d.window.to}; the rule says the 30 days before the pause: ${DIP_WINDOW.from} to ${DIP_WINDOW.to}`);
      const re = recomputeDip(DIP_WINDOW, 'FL-BROAD');
      for (const k of ['highDate', 'high', 'lowDate', 'low', 'drop']) if (d[k] !== re[k]) fail(`${p}dip.${k} is ${d[k]}, the prices say ${re[k]} (window ${d.window.from} to ${d.window.to})`);
      const row = acc.history.find((x) => x.date === re.lowDate), a = r.facts.atLow;
      if (!row) { fail(`${p}no balance history on the low ${re.lowDate}`); continue; }
      if (a.date !== re.lowDate || !eq(a.balance, row.balance) || !eq(a.moneyIn, row.moneyIn) || !eq(a.below, r2(row.moneyIn - row.balance))) fail(`${p}atLow does not match the balance history on ${re.lowDate}`);
      const dc = claimOf(r, 'dip');
      if (!dc || !dc.text.includes(money(re.high)) || !dc.text.includes(money(re.low)) || !dc.text.includes(`${pct1(-re.drop)}%`)) fail(`${p}the dip sentence does not state the recomputed high, low and drop`);
      if (Boolean(claimOf(r, 'at-low')) !== (r2(row.moneyIn - row.balance) > 0)) fail(`${p}"below what you had put in" is ${claimOf(r, 'at-low') ? 'said' : 'missing'} but the balance was ${row.balance} vs ${row.moneyIn}`);
    }
  });
  rule('R3', 'The auto-invest pause date and everything the story says happened "after" it are true', (fail) => {
    for (const acc of funded) {
      const r = rosa[acc.id], p = `[${acc.id}] `; if (!r) continue;
      const f = r.facts, paused = acc.autoInvest.pausedOn;
      if ((f.pause?.date ?? null) !== paused) fail(`${p}pause ${f.pause?.date ?? null} != autoInvest.pausedOn ${paused}`);
      if (paused && f.pause && f.pause.date !== nextTradingDay(addDays(f.dip.lowDate, 1))) fail(`${p}the story says she paused "the next day", but ${f.pause.date} is not the trading day after the low ${f.dip.lowDate}`);
      const since = paused || f.dip.lowDate;
      const back = acc.history.find((x) => x.date > since && x.balance > x.moneyIn);
      if (!back || f.after.backAboveDate !== back.date || !eq(f.after.backAboveBalance, back.balance)) fail(`${p}back above what she put in on ${f.after.backAboveDate}, the history says ${back?.date}`);
      const deps = acts(acc).filter((x) => x.type === 'deposit' && x.status === 'completed' && x.settledDate > since).map((x) => ({ date: x.settledDate, amount: x.amount }));
      if (JSON.stringify(deps) !== JSON.stringify(f.after.deposits)) fail(`${p}deposits after ${since} do not match the activity`);
      for (const dp of deps) {
        const bought = buysOf(acts(acc)).some((b) => b.date === dp.date);
        if (bought !== !paused) fail(`${p}the ${dp.date} deposit ${bought ? 'was' : 'was not'} invested, but the story says it ${paused ? 'stayed as cash' : 'bought the mix'}`);
      }
      if (f.after.depositsInvested !== !paused) fail(`${p}after.depositsInvested must be ${!paused}`);
      if (!eq(f.after.upNow, acc.gainLoss)) fail(`${p}upNow != gainLoss`);
      const has = (id) => Boolean(claimOf(r, id));
      if (paused && !(has('pause') && has('cash-after') && !has('kept-buying'))) fail(`${p}a paused account must tell the pause and cash-after, not kept-buying`);
      if (!paused && (has('pause') || has('cash-after') || !has('kept-buying'))) fail(`${p}an account that never paused must say auto-invest stayed on, and never tell a pause`);
    }
  });
  rule('R4', 'Every scenario has its own true story, and every number in a story sentence is a checked fact', (fail) => {
    for (const acc of funded) if (!rosa[acc.id]) fail(`[${acc.id}] has no story of its own`);
    if (rosa[accountNew.id] !== null) fail(`[${accountNew.id}] a brand-new account has no history, so it must have no story (null)`);
    for (const acc of funded) {
      const r = rosa[acc.id]; if (!r) continue;
      if (r.accountId !== acc.id) fail(`[${acc.id}] story accountId ${r.accountId}`);
      const nums = new Set(), pcts = new Set();
      const walk = (o) => { if (typeof o === 'number') { nums.add(Math.abs(r2(o)).toFixed(2)); } else if (o && typeof o === 'object') Object.values(o).forEach(walk); };
      walk(r.facts);
      pcts.add(String(Math.round(r.facts.depositsShare * 100))); pcts.add(pct1(-r.facts.dip.drop));
      for (const c of r.claims) {
        if (!(c.chapter >= 1 && c.chapter <= 4)) fail(`[${acc.id}] ${c.id} chapter ${c.chapter} is not 1-4`);
        for (const m of c.text.match(/\$[\d,]+(\.\d\d)?/g) || []) if (!nums.has(Number(m.replace(/[$,]/g, '')).toFixed(2))) fail(`[${acc.id}] ${c.id} says ${m}, which is not one of this account's checked facts`);
        for (const m of c.text.match(/[\d.]+%/g) || []) if (!pcts.has(m.slice(0, -1))) fail(`[${acc.id}] ${c.id} says ${m}, which is not a checked percentage`);
      }
    }
  });

  // ----- X: cross-case-study consistency -----
  rule('X1', 'The same learner means the same thing in every lens (P301, P302, P303)', (fail) => {
    for (const a of allAccounts) if (a.ownerId !== persona.id) fail(`${a.id} owner != persona`);
    if (story.yourTurn.personaId !== persona.id) fail('P302 yourTurn persona != persona');
    if (story.yourTurn.startAge !== persona.age) fail(`P302 yourTurn age ${story.yourTurn.startAge} != persona age ${persona.age}`);
    if (story.yourTurn.monthly !== data.account.recurringDeposit.amount) fail(`P302 yourTurn monthly ${story.yourTurn.monthly} != recurring deposit ${data.account.recurringDeposit.amount}`);
    for (const k of ['P301', 'P302', 'P303']) if (!persona.moments?.[k]) fail(`persona has no moment for ${k}`);
  });
  rule('X2', 'Dates agree across every file', (fail) => {
    for (const a of allAccounts) if (a.asOf !== meta.asOf) fail(`${a.id}.asOf differs from meta`);
    if (!(meta.lastReview < meta.lastClose && meta.lastClose <= meta.asOf)) fail('lastReview < lastClose <= asOf must hold');
    for (const acc of allAccounts) for (const a of activity[acc.id] || []) if (a.date > meta.asOf) fail(`${a.id} is dated after asOf`);
  });

  // ----- L: plain language (everything a learner can read) -----
  rule('L1', 'Glossary is complete: unique ids, links resolve, word of the day exists, sources are https or deliberately none', (fail) => {
    const ids = glossary.map((g) => g.id); if (new Set(ids).size !== ids.length) fail('glossary ids not unique');
    for (const g of glossary) for (const r of g.related) if (!glossIds.has(r)) fail(`${g.id} related ${r} missing`);
    for (const g of glossary) if (g.source !== null && !/^https:\/\//.test(g.source?.url || '')) fail(`${g.id} source must be an https link or null`);
    if (!glossIds.has(meta.wordOfTheDay)) fail(`wordOfTheDay ${meta.wordOfTheDay} not in glossary`);
  });
  rule('L2', `Reading level is grade ${MAX_GRADE} or below (Flesch-Kincaid) for every learner-facing text`, (fail) => {
    for (const [where, text] of [...glossTexts, ...flagTexts, ...otherTexts]) {
      const g = fkGrade(text); if (g > MAX_GRADE) fail(`${where} is grade ${g.toFixed(1)}: "${text.slice(0, 70)}..."`);
    }
  });
  rule('L3', 'No jargon in learner-facing text', (fail) => {
    for (const g of glossary) {
      const allowed = [g.term, ...(g.alsoCalled || [])].map((s) => s.toLowerCase());
      for (const field of ['short', 'detail', 'example']) for (const w of JARGON) {
        if (allowed.some((a) => a.includes(w))) continue;
        if (hasWord(g[field], w)) fail(`glossary:${g.id}.${field} uses jargon "${w}"`);
      }
    }
    for (const [where, text] of [...flagTexts, ...otherTexts]) for (const w of JARGON) if (hasWord(text, w)) fail(`${where} uses jargon "${w}"`);
  });
  rule('L4', 'Explanation first lines are short (16 words or fewer)', (fail) => {
    for (const g of glossary) { const n = g.short.split(/\s+/).length; if (n > 16) fail(`${g.id}.short has ${n} words`); }
  });

  // ----- B: briefs -----
  rule('B1', 'Every example record in the briefs matches the data', (fail) => {
    if (!briefExamples.length) { fail('no ```json brief-example blocks found in the briefs'); return; }
    const get = (path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[/^\d+$/.test(k) ? Number(k) : k]), data);
    for (const ex of briefExamples) {
      let obj; try { obj = JSON.parse(ex.body); } catch { fail(`${ex.file}: brief-example is not valid JSON`); continue; }
      for (const [path, expected] of Object.entries(obj)) {
        const actual = get(path);
        const ok = typeof expected === 'number' ? eq(actual, expected) : JSON.stringify(actual) === JSON.stringify(expected);
        if (!ok) fail(`${ex.file}: ${path} is ${JSON.stringify(expected)} in the brief but ${JSON.stringify(actual)} in the data`);
      }
    }
  });

  return results;
}

export function report(results, { quiet = false } = {}) {
  let failed = 0;
  for (const r of results) {
    if (!r.ok) failed++;
    if (!quiet) {
      console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.id.padEnd(4)} ${r.name}`);
      for (const e of r.errors.slice(0, 8)) console.log(`        - ${e}`);
      if (r.errors.length > 8) console.log(`        - ...and ${r.errors.length - 8} more`);
    }
  }
  if (!quiet) console.log(`\n${results.length - failed}/${results.length} rules passed${failed ? `, ${failed} FAILED` : ''}.`);
  return failed;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { data, missing } = loadData();
  const failed = report(validate(data, { missing, briefExamples: loadBriefExamples() }));
  process.exit(failed ? 1 : 0);
}
