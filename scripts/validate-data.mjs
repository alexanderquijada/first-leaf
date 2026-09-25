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

import { readFileSync, existsSync, readdirSync } from 'node:fs';
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
const HOLIDAYS = ['2025-11-27','2025-12-25','2026-01-01','2026-01-19','2026-02-16','2026-04-03','2026-05-25','2026-06-19','2026-07-03','2026-09-07','2026-11-26','2026-12-25'];
const dow = (s) => new Date(s + 'T00:00:00Z').getUTCDay();
const isTradingDay = (s) => dow(s) !== 0 && dow(s) !== 6 && !HOLIDAYS.includes(s);
const prevTradingDay = (s) => { let d = addDays(s, -1); while (!isTradingDay(d)) d = addDays(d, -1); return d; };
const roundN = (n, d) => Math.round(n * 10 ** d) / 10 ** d;
const floorN = (n, d) => Math.floor(n * 10 ** d + 1e-9) / 10 ** d;
const DECIMALS = { stock: 4, crypto: 8 };
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
  // A hyphenated word counts the syllables of each part ("one-time" is 2, not 3).
  const syl = words.reduce((s, w) => s + (w === 'num' ? 2 : w.split('-').filter(Boolean).reduce((n, part) => n + syllables(part), 0) || 1), 0);
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
// Ruling B (Phase 2.5): exactly these real names and tickers are allowed. Every other real
// ticker or brand below is still blocked.
export const LINEUP = { AAPL: 'Apple', MSFT: 'Microsoft', NVDA: 'NVIDIA', COST: 'Costco', NKE: 'Nike', AMZN: 'Amazon', TSLA: 'Tesla', BTC: 'Bitcoin', ETH: 'Ethereum', SOL: 'Solana' };
// A representative denylist of the most-traded U.S. tickers and major financial brands. Extend freely.
export const REAL_TICKERS = ['AAPL','MSFT','AMZN','GOOG','GOOGL','META','NVDA','TSLA','BRK','JPM','V','MA','UNH','JNJ','XOM','PG','HD','KO','PEP','COST',
  'WMT','DIS','NFLX','INTC','AMD','CRM','ORCL','ADBE','CSCO','BAC','WFC','C','GS','MS','SCHW','PYPL','SQ','HOOD','COIN','UBER','ABNB','NKE','MCD','SBUX',
  'T','VZ','BA','GE','F','GM','PFE','MRK','ABBV','LLY','CVX','SPY','VOO','VTI','VTSAX','VFIAX','VXUS','BND','BNDX','AGG','QQQ','IVV','IWM','DIA','VT',
  'SCHD','VYM','VNQ','GLD','SLV','TLT','ARKK','FXAIX','FZROX','FSKAX','SWPPX','VGT','XLK','XLF','XLE','ICLN','TAN','QCLN','PBW','SPAXX','VMFXX',
  'DOGE','XRP','ADA','BNB','USDT','USDC','AVAX','LTC','SHIB','GME','AMC','PLTR'];
export const REAL_NAMES = ['Apple','Microsoft','Amazon','Alphabet','Google','Meta','Nvidia','Tesla','Berkshire','JPMorgan','Chase','Visa','Mastercard',
  'Vanguard','Fidelity','Schwab','BlackRock','iShares','SPDR','State Street','Invesco','Robinhood','Acorns','Stash','Betterment','Wealthfront','SoFi',
  'E*TRADE','ETRADE','TD Ameritrade','Merrill','Morgan Stanley','Goldman','Wells Fargo','Bank of America','Citi','Coinbase','Public.com','Webull',
  'Ally','Capital One','Nasdaq','NYSE','Dow Jones','S&P','Russell','MSCI','FTSE','Morningstar','Greenlight','Groundwork','Saguaro Credit Union',
  'Dogecoin','Ripple','Cardano','Binance','Tether','Kraken','Gemini','Walmart','Target','Adidas','Starbucks','Netflix','Disney'];
// Calls to action about specific investments are advice; education is not (FINRA Rule 2111 FAQ).
// Absolute safety claims are also banned: nothing in investing is "safe" without qualification.
// Real-app ruling (Sept. 24): inside the site, First Leaf reads as a real app, so no
// project language may reach the screen. The data itself stays marked fictional (G1, G5).
// Ruling B (Phase 2.5): no disclaimer of any kind either, so "simulated", "concept" and "not real" are banned too.
export const PROJECT_LANGUAGE = [/made[- ]up/i, /\bdemo\b/i, /case stud(y|ies)/i, /this project/i, /for reviewers/i, /\bfictional\b/i, /\bsimulated\b/i, /\bconcept\b/i, /\bnot real\b/i];
export const ADVICE_PATTERNS = [/you should (buy|sell|invest|move|switch)/i, /we recommend/i, /\bbest (fund|investment|stock)s?\b/i, /guarantee/i,
  /can'?t lose/i, /risk[- ]free/i, /\bsure thing\b/i, /\bbuy now\b/i, /\bsell now\b/i, /\bbuy the dip\b/i, /will (definitely|surely) (grow|go up)/i,
  /\b(is|are|very) safe\b/i, /\bcompare fees\b/i, /\bswitch (to|funds)\b/i, /\bmost people\b/i];

// ---------------- copy files (rule L5) ----------------
// Every sentence on screen lives in a copy file with named placeholders. Each
// placeholder name has ONE meaning everywhere, so L5 can fill every sentence with
// each scenario's real values and read it the way a person will. A name that is
// not listed here fails L5: give a new placeholder a meaning before you use it.
export const PLACEHOLDERS = {
  money: ['amount', 'balance', 'cash', 'moneyIn', 'price', 'start', 'end', 'first', 'last', 'paid', 'target', 'actual', 'planned', 'behind',
    'dividends', 'earned', 'value', 'nia', 'theo', 'monthly', 'niaMonthly', 'theoMonthly', 'putIn'],
  change: ['change', 'market'],       // "up $15.57", "down $5.88", "no change" (the market's part of this week's move is a change too)
  date: ['date', 'from', 'to'],       // "Sept. 18"
  count: ['count', 'shown', 'total', 'n', 'decimals'],
  number: ['age', 'endAge', 'startAge', 'niaAge', 'theoAge', 'rating', 'now', 'set', 'pct', 'points', 'fee', 'oldFee', 'newFee', 'shares', 'dollars'],
  ticker: ['ticker'],
  // Words, not values: names, labels, terms and whole sentences from the data.
  text: ['name', 'title', 'label', 'series', 'kind', 'status', 'type', 'term', 'terms', 'short', 'example', 'link', 'page', 'query', 'region',
    'claim', 'note', 'reply', 'setting', 'month', 'direction'],
};
// Names the app quotes rather than writes: a term, the industry's words for it, a
// source, a fund or a person. The reading level grades OUR words, so a quoted name
// counts as one short word. (Whole sentences from the data, such as a term's
// explanation, a story claim or an alert title, are graded in full.)
export const QUOTED_NAMES = ['name', 'label', 'series', 'kind', 'status', 'type', 'term', 'terms', 'link', 'page', 'query', 'region', 'ticker'];
// A placeholder {x} whose object also has a key "xWord" is a word shown as a term
// button (for example {putIn} with putInWord "put in"): it is filled with that word.
//
// A value with no words around it must be labeled by something the person can see.
// These are the only ones allowed, each with the label that says what it measures.
export const LABELED_ELSEWHERE = {
  'src/features/funds/copy.json:percent': 'a table cell under the "Yearly fee" column',
  'src/features/story/copy.json:share.percent': 'a table cell under the "Share" column',
  'src/features/story/copy.json:mix.percent': 'a table cell under the "Share of balance" column',
  'src/features/story/copy.json:mix.rowNums': 'a row under the line "Each row shows the amount and its share of your balance."',
  'src/features/practice/copy.json:percent': 'a row in the list headed "Your practice mix"',
  'src/features/practice/copy.json:order.phoneAmount': 'the amount being typed, shown under and labeled by "Amount"',
};
// Data-source credits keep the exact wording set by Alex's ruling B (the stock data note) or
// by the provider's attribution guide (CoinGecko). They are checked for everything except
// the reading level, which their fixed wording can't meet.
export const FIXED_WORDING = { 'src/shared/copy.json:dataNotes.stock': "ruling B's exact wording", 'src/shared/copy.json:dataNotes.crypto': "CoinGecko's attribution guide" };
export function loadCopy(root = ROOT) {
  const out = {};
  const add = (rel) => { const p = join(root, rel); if (existsSync(p)) out[rel] = JSON.parse(readFileSync(p, 'utf8')); };
  add('src/shared/copy.json'); add('src/layouts/copy.json');
  const features = join(root, 'src', 'features');
  if (existsSync(features)) for (const f of readdirSync(features).sort()) add(`src/features/${f}/copy.json`);
  return out;
}
// Every template in a copy file, with the object it sits in (for "xWord" lookups).
function* templates(obj, path = '') {
  for (const [k, v] of Object.entries(obj)) {
    const p = path ? `${path}.${k}` : k;
    if (typeof v === 'string') yield [p, v, obj];
    else if (Array.isArray(v)) for (let i = 0; i < v.length; i++) { if (typeof v[i] === 'string') yield [`${p}[${i}]`, v[i], obj]; }
    else if (v && typeof v === 'object') yield* templates(v, p);
  }
}
const KIND_OF = Object.fromEntries(Object.entries(PLACEHOLDERS).flatMap(([kind, names]) => names.map((n) => [n, kind])));
// House money format (BRIEF.md §5): "$1,313.72" or whole dollars "$150" in sentences.
const MONEY_TOKEN = /^\$\d{1,3}(,\d{3})*(\.\d{2})?$/;
export function moneyProblems(text) {
  const out = [];
  if (/\$\$/.test(text)) out.push('has "$$"');
  if (/-\$/.test(text)) out.push('uses a hyphen before "$" (a loss uses a true minus sign "−")');
  for (const m of text.matchAll(/\$[^\s]*/g)) {
    const tok = m[0].replace(/[.,;:!?)"”]+$/, '');
    if (tok !== '$' && !MONEY_TOKEN.test(tok) && !/^\$\$/.test(tok)) out.push(`writes money as "${tok}"`);
    if (tok === '$' && text.trim() !== '$') out.push('has a "$" with no amount after it');
  }
  if (/[.!?]$/.test(text.trim()) && /[+−]\$/.test(text)) out.push('shows a signed amount in a sentence (write "up $X" or "down $X")');
  if (/\b(up|down)\s+[+−-]\$/i.test(text)) out.push('says "up/down" and also shows a sign');
  if (/\d\s*(dollars|USD)\b/i.test(text)) out.push('spells out "dollars" or "USD" after a number');
  return out;
}
// A rate (a fee, a return rate) changes by percentage points, never "+X%".
export function rateProblems(text) {
  const out = [];
  if (/[+−-]\s?\d[\d.]*\s?%/.test(text)) out.push('shows a rate change as "+X%" (write "up X percentage points")');
  if (/\b(fee|rate)/i.test(text) && /\b(up|down|rose|fell|by|increased?|decreased?)\s+\d[\d.]*\s?%/i.test(text)) out.push('says a rate went up or down by "X%" (write "X percentage points")');
  return out;
}

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
// The verified stock anchors and dividends (docs/research/PRICE-ANCHORS.md) and the saved
// CoinGecko files (src/shared/data/raw/). P1, P2 and A12 check the data against these.
export function loadSources(root = ROOT) {
  const doc = readFileSync(join(root, 'docs', 'research', 'PRICE-ANCHORS.md'), 'utf8');
  const block = (name) => { const m = doc.match(new RegExp('```json ' + name + '\\n([\\s\\S]*?)```')); return m ? JSON.parse(m[1]) : null; };
  const raw = {};
  const dir = join(root, 'src', 'shared', 'data', 'raw');
  if (existsSync(dir)) for (const f of readdirSync(dir)) if (/^coingecko-.*\.json$/.test(f)) { const j = JSON.parse(readFileSync(join(dir, f), 'utf8')); raw[j.ticker] = j; }
  return { anchors: block('price-anchors'), dividends: block('dividends'), raw };
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
export function validate(data, { missing = [], briefExamples = [], copy = null, sources = null } = {}) {
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
  const decOf = (t) => DECIMALS[fundBy[t]?.kind] ?? 4;
  const stockDates = (funds.find((f) => f.kind === 'stock')?.history.daily ?? []).map((d) => d.date);
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
    ['story:pointOfView', story.pointOfView], ['story:note', story.assumptions.note],
    ['story:bumpy.note', story.bumpy.note], ['story:yourTurn.note', story.yourTurn.note], ['practice:timeMachine.note', practice.timeMachine.note],
    ...story.claims.map((c) => [`story:claim:${c.id}`, c.text]),
    ...funds.map((f) => [`funds:${f.ticker}.about`, f.about]),
    ...scenarios.map((s) => [`scenarios:${s.id}.description`, s.description]), // README-only: exempt from G6, still plain
    ...allAccounts.flatMap((acc) => (activity[acc.id] || []).filter((a) => a.returnReason).map((a) => [`activity:${a.id}.returnReason`, a.returnReason])),
  ];

  // ----- S: structure -----
  rule('S2', 'Required fields are present', (fail) => {
    const req = {
      meta: ['product', 'asOf', 'lastClose', 'lastReview', 'wordOfTheDay', 'cashWaitingThreshold', 'bigMoveThreshold'],
      persona: ['id', 'firstName', 'age', 'fictional', 'moments'],
      practice: ['startingCash', 'funds', 'priceDate', 'fictional', 'timeMachine'],
      'story-p302': ['assumptions', 'savers', 'catchUp', 'bumpy', 'yourTurn', 'claims', 'startAgeSlider'],
    };
    for (const [file, keys] of Object.entries(req)) for (const k of keys) if (data[file]?.[k] === undefined) fail(`${file}.${k} missing`);
    for (const a of funded) for (const k of ['id', 'ownerId', 'balance', 'investedValue', 'cash', 'moneyIn', 'gainLoss', 'holdings', 'goal', 'weeklyChange', 'history', 'recurringDeposit', 'targetMix', 'autoInvest']) if (a[k] === undefined) fail(`${a.id}.${k} missing`);
    for (const f of funds) for (const k of ['ticker', 'name', 'kind', 'priceSource', 'volatility', 'upsAndDowns', 'dividends', 'latestPrice', 'history', 'about']) if (f[k] === undefined) fail(`funds[${f.ticker}].${k} missing`);
    for (const acc of allAccounts) {
      if (!Array.isArray(activity[acc.id])) fail(`activity has no list for ${acc.id}`);
      if (!Array.isArray(attention[acc.id])) fail(`attention has no list for ${acc.id}`);
      for (const a of flagsOf(acc)) for (const k of ['id', 'severity', 'title', 'body', 'nextStep', 'terms', 'route', 'raisedOn', 'newSinceLastReview']) if (a[k] === undefined) fail(`attention[${acc.id}][${a.id}].${k} missing`);
    }
    for (const g of glossary) for (const k of ['id', 'term', 'short', 'detail', 'example', 'related']) if (g[k] === undefined) fail(`glossary[${g.id}].${k} missing`);
  });
  // ----- G: finance guardrails -----
  rule('G1', 'Only the approved lineup: every investment is one of its tickers, with its own name', (fail) => {
    for (const f of funds) {
      if (!LINEUP[f.ticker]) fail(`${f.ticker} is not in the approved lineup`);
      else if (f.name !== LINEUP[f.ticker]) fail(`${f.ticker} is named "${f.name}", the lineup says "${LINEUP[f.ticker]}"`);
    }
    for (const t of practice.funds) if (!fundBy[t]) fail(`practice investment ${t} does not exist`);
    for (const a of allAccounts) for (const t of Object.keys(a.targetMix || {})) if (!LINEUP[t]) fail(`${a.id} mix uses ${t}, which is not in the lineup`);
  });
  rule('G2', 'No real tickers or brand names outside the approved lineup, anywhere in the data', (fail) => {
    for (const [file, obj] of Object.entries(data)) for (const [path, s] of strings(obj)) {
      if (/url$/i.test(path)) continue;
      for (const t of REAL_TICKERS) {
        if (LINEUP[t]) continue;
        if (!new RegExp(`(^|[^A-Za-z-])${t}([^A-Za-z-]|$)`).test(s)) continue;
        if (t.length <= 2 && !new RegExp(`(^|\\s|\\()${t}(\\s|\\)|$)`).test(s)) continue; // V, C, T, F only as stand-alone tokens
        fail(`${file}:${path} contains real ticker "${t}": "${s.slice(0, 60)}"`);
      }
      for (const n of REAL_NAMES) if (!Object.values(LINEUP).some((x) => x.toLowerCase() === n.toLowerCase()) && new RegExp(`(^|[^A-Za-z])${n.replace(/[*&.]/g, (c) => '\\' + c)}([^A-Za-z]|$)`, 'i').test(s)) fail(`${file}:${path} contains real name "${n}"`);
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

  rule('G6', 'No project or disclaimer language on screen (made up, demo, case study, this project, for reviewers, fictional, simulated, concept, not real)', (fail) => {
    const screen = [
      ...glossary.flatMap((g) => [[`glossary:${g.id}.term`, g.term], [`glossary:${g.id}.alsoCalled`, (g.alsoCalled || []).join(', ')], [`glossary:${g.id}.short`, g.short], [`glossary:${g.id}.detail`, g.detail], [`glossary:${g.id}.example`, g.example]]),
      ...allAccounts.flatMap((acc) => flagsOf(acc).flatMap((a) => [[`attention:${acc.id}:${a.id}`, `${a.title}. ${a.body} ${a.nextStep} ${a.action?.label ?? ''}`]])),
      ...funds.flatMap((f) => [[`funds:${f.ticker}.name`, f.name], [`funds:${f.ticker}.about`, f.about]]),
      ['story:title', story.title], ...story.claims.map((c) => [`story:claim:${c.id}`, c.text]),
      ...otherTexts.filter(([where]) => !where.startsWith('scenarios:')),
    ];
    for (const [where, text] of screen) for (const re of PROJECT_LANGUAGE) if (re.test(text)) fail(`${where} uses project language ${re}: "${text.slice(0, 80)}"`);
  });

  // ----- F: prices -----
  rule('F1', 'Prices are positive and in date order; stocks only on trading days, crypto every day', (fail) => {
    for (const f of funds) for (const key of ['weekly', 'daily']) {
      const h = f.history[key];
      for (let i = 0; i < h.length; i++) {
        if (!(h[i].close > 0)) fail(`${f.ticker} ${key} ${h[i].date} price not positive`);
        if (i && h[i].date <= h[i - 1].date) fail(`${f.ticker} ${key} dates not ascending at ${h[i].date}`);
        if (f.kind === 'stock' && !isTradingDay(h[i].date)) fail(`${f.ticker} ${key} ${h[i].date} is not a trading day (weekend or market holiday)`);
        if (f.kind === 'crypto' && key === 'daily' && i && h[i].date !== addDays(h[i - 1].date, 1)) fail(`${f.ticker} daily skips from ${h[i - 1].date} to ${h[i].date} (crypto trades every day)`);
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
    const weeks = (funds.find((f) => f.kind === 'stock')?.history.weekly ?? []).map((w) => w.date);
    const first = weeks.find((d) => funds.every((f) => f.history.daily.some((x) => x.date === d)));
    if (practice.timeMachine.from !== first) fail(`timeMachine.from ${practice.timeMachine.from} != the first weekly close every investment has (${first})`);
    if (practice.timeMachine.to !== meta.lastClose) fail('timeMachine.to != lastClose');
    for (const a of allAccounts) if (a.lastClose !== meta.lastClose) fail(`${a.id}.lastClose != meta.lastClose`);
  });
  rule('F4', '"Ups and downs" matches each price history\'s 12-month volatility (BRIEF.md §4 thresholds)', (fail) => {
    for (const f of funds) {
      if (!['stock', 'crypto'].includes(f.kind)) fail(`${f.ticker} kind ${f.kind} invalid`);
      if (f.priceSource !== (f.kind === 'stock' ? 'modeled' : 'coingecko')) fail(`${f.ticker} priceSource ${f.priceSource} does not fit a ${f.kind}`);
      const c = f.history.daily.map((x) => x.close), r = [];
      for (let i = 1; i < c.length; i++) r.push(Math.log(c[i] / c[i - 1]));
      const m = r.reduce((a, b) => a + b, 0) / r.length;
      const vol = Math.sqrt(r.reduce((a, b) => a + (b - m) ** 2, 0) / (r.length - 1)) * Math.sqrt(f.kind === 'stock' ? 252 : 365);
      if (!eq(f.volatility, r4(vol), 0.00011)) fail(`${f.ticker} volatility ${f.volatility} != ${r4(vol)} from its prices`);
      const want = 1 + [0.2, 0.3, 0.45, 0.65].filter((b) => vol >= b).length;
      if (f.upsAndDowns !== want) fail(`${f.ticker} "Ups and downs" is ${f.upsAndDowns}, its ${(vol * 100).toFixed(1)}% volatility gives ${want}`);
    }
  });

  // ----- P: price sources (ruling B, Phase 2.5) -----
  rule('P1', 'Each stock hits its three real anchor closes in PRICE-ANCHORS.md exactly', (fail) => {
    const anchors = sources?.anchors;
    if (!anchors) { fail('no price-anchors block was loaded from docs/research/PRICE-ANCHORS.md'); return; }
    for (const f of funds.filter((x) => x.kind === 'stock')) {
      const a = anchors[f.ticker];
      if (!a) { fail(`${f.ticker} has no anchors`); continue; }
      const dates = Object.keys(a).sort();
      for (const d of dates) { const c = closeOn(f.ticker, d); if (c !== a[d]) fail(`${f.ticker} closes at ${c} on ${d}; the real close is ${a[d]}`); }
      if (f.history.daily[0].date !== dates[0] || f.history.daily.at(-1).date !== dates.at(-1)) fail(`${f.ticker} history must run from ${dates[0]} to ${dates.at(-1)}`);
    }
  });
  rule('P2', 'Crypto prices match the saved CoinGecko series exactly', (fail) => {
    const raw = sources?.raw ?? {};
    for (const f of funds.filter((x) => x.kind === 'crypto')) {
      const r = raw[f.ticker];
      if (!r) { fail(`${f.ticker} has no saved CoinGecko file`); continue; }
      if (r.daily.length !== f.history.daily.length) fail(`${f.ticker} has ${f.history.daily.length} daily prices, CoinGecko's file has ${r.daily.length}`);
      r.daily.forEach((x, i) => { const y = f.history.daily[i]; if (!y || y.date !== x.date || y.close !== x.close) fail(`${f.ticker} ${x.date}: the data says ${y?.date} ${y?.close}, CoinGecko says ${x.close}`); });
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
      if (!eq(h.shares, roundN(b.reduce((s, a) => s + a.shares, 0), decOf(h.ticker)), 0.5 / 10 ** decOf(h.ticker))) fail(`${p}${h.ticker} shares ${h.shares} != buys`);
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
    const dates = stockDates.filter((d) => d >= acc.openedOn);
    if (h.length !== dates.length || h.some((r, i) => r.date !== dates[i])) fail(`${p}history dates do not match the stock market's trading days`);
    if (h[0].date !== acc.openedOn) fail(`${p}history does not start on openedOn`);
  }));
  rule('A9', 'Your target mix adds up to 100% and uses investments in the data', (fail) => forEachFunded((acc, _, p) => {
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
  rule('A12', "Buys use that day's price; stocks settle T+1, crypto the same day; dividends are the real ones, paid on shares held before the ex-date", (fail) => forEachFunded((acc, list, p) => {
    for (const b of buysOf(list)) {
      const px = closeOn(b.ticker, b.date);
      if (px === undefined) { fail(`${p}${b.id} no price on ${b.date}`); continue; }
      if (b.price !== px) fail(`${p}${b.id} price ${b.price} != close ${px}`);
      const dec = decOf(b.ticker);
      if (!eq(b.shares, floorN(b.amount / b.price, dec), 0.5 / 10 ** dec)) fail(`${p}${b.id} shares ${b.shares} != ${floorN(b.amount / b.price, dec)}`);
      const settle = fundBy[b.ticker].kind === 'crypto' ? b.date : nextTradingDay(addDays(b.date, 1));
      if (b.settledDate !== settle) fail(`${p}${b.id} settles ${b.settledDate}; a ${fundBy[b.ticker].kind} bought ${b.date} settles ${settle}`);
    }
    const documented = sources?.dividends ?? [];
    for (const d of divsOf(list)) {
      if (!isTradingDay(d.date)) fail(`${p}${d.id} dividend on non-trading day`);
      const doc = documented.find((x) => x.ticker === d.ticker && x.exDate === d.exDate);
      if (!doc) { fail(`${p}${d.id} is not a documented ${d.ticker} dividend (ex-date ${d.exDate})`); continue; }
      if (d.perShare !== doc.perShare || d.date !== nextTradingDay(doc.payDate)) fail(`${p}${d.id} per-share amount or pay date differs from PRICE-ANCHORS.md`);
      const held = roundN(buysOf(list).filter((b) => b.ticker === d.ticker && b.date < d.exDate).reduce((s, b) => s + b.shares, 0), decOf(d.ticker));
      if (!eq(d.sharesOnExDate, held, 0.00005)) fail(`${p}${d.id} paid on ${d.sharesOnExDate} shares; ${held} were held before ${d.exDate}`);
      if (!eq(d.amount, r2(held * d.perShare))) fail(`${p}${d.id} amount ${d.amount} != ${r2(held * d.perShare)}`);
    }
    for (const doc of documented) {
      if (!acc.targetMix[doc.ticker] || doc.exDate <= acc.openedOn || doc.payDate > meta.lastClose) continue;
      const held = buysOf(list).filter((b) => b.ticker === doc.ticker && b.date < doc.exDate).reduce((s, b) => s + b.shares, 0);
      if (r2(held * doc.perShare) > 0 && !divsOf(list).some((d) => d.ticker === doc.ticker && d.exDate === doc.exDate)) fail(`${p}the ${doc.ticker} dividend with ex-date ${doc.exDate} was owed but never paid`);
    }
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
      for (const h of acc.holdings) {
        const move = h.price / closeOn(h.ticker, acc.weeklyChange.from) - 1;
        const fb = expect(`big-move-${h.ticker}`, h.shares > 0 && Math.abs(move) >= meta.bigMoveThreshold);
        if (fb && !eq(fb.movePercent, r4(move), 0.00005)) fail(`${p}big-move-${h.ticker} says ${fb.movePercent}, the prices say ${r4(move)}`);
      }
      for (const f of flags) if (f.id.startsWith('big-move-') && !acc.holdings.some((h) => `big-move-${h.ticker}` === f.id)) fail(`${p}${f.id} is about something the account does not hold`);
      expect('sipc-crypto', acc.holdings.some((h) => fundBy[h.ticker]?.kind === 'crypto' && h.shares > 0));
      if (flags.some((f) => /fee/i.test(f.id))) fail(`${p}a fee alert is shown; stocks and crypto have no yearly fund fee (ruling B)`);
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
      for (const h of acc.holdings) { add(closeOn(h.ticker, acc.weeklyChange.from)); }
      for (const x of acc.weeklyChange.byFund) add(Math.abs(x.change));
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
  // The dip (ruling B, Phase 2.5): the largest 10-trading-day fall in the account's portfolio
  // value between April 15 and Aug. 15, 2026: the change in balance with deposits and
  // dividends taken out. Recomputed here from the account's own history.
  const DIP_RULE = { from: '2026-04-15', to: '2026-08-15', tradingDays: 10 };
  const FULL_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  function recomputeDip(acc) {
    const rows = acc.history.filter((r) => r.date >= DIP_RULE.from && r.date <= DIP_RULE.to);
    const divIn = (a, b) => r2(divsOf(acts(acc)).filter((x) => x.date > a && x.date <= b).reduce((s, x) => s + x.amount, 0));
    let best = null;
    for (let i = 0; i + DIP_RULE.tradingDays < rows.length; i++) {
      const a = rows[i], b = rows[i + DIP_RULE.tradingDays];
      const change = r2(b.balance - a.balance - (b.moneyIn - a.moneyIn) - divIn(a.date, b.date));
      if (!best || change / a.balance < best.pct) best = { a, b, change, pct: change / a.balance };
    }
    return { highDate: best.a.date, highBalance: best.a.balance, lowDate: best.b.date, lowBalance: best.b.balance, fall: r2(-best.change), drop: r4(best.pct), month: FULL_MONTHS[Number(best.b.date.slice(5, 7)) - 1] };
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
  rule('R2', 'The dip (largest 10-trading-day fall in her portfolio value, April 15 to Aug. 15) and her balance at the low match her history', (fail) => {
    for (const acc of funded) {
      const r = rosa[acc.id], p = `[${acc.id}] `; if (!r) continue;
      const d = r.facts.dip, re = recomputeDip(acc);
      if (d.window.from !== DIP_RULE.from || d.window.to !== DIP_RULE.to || d.tradingDays !== DIP_RULE.tradingDays) fail(`${p}dip window is ${d.window.from} to ${d.window.to} over ${d.tradingDays} trading days; the rule says ${DIP_RULE.from} to ${DIP_RULE.to} over ${DIP_RULE.tradingDays}`);
      for (const k of ['highDate', 'highBalance', 'lowDate', 'lowBalance', 'fall', 'drop', 'month']) if (d[k] !== re[k]) fail(`${p}dip.${k} is ${d[k]}, the history says ${re[k]}`);
      const row = acc.history.find((x) => x.date === re.lowDate), a = r.facts.atLow;
      if (a.date !== re.lowDate || !eq(a.balance, row.balance) || !eq(a.moneyIn, row.moneyIn) || !eq(a.below, r2(row.moneyIn - row.balance))) fail(`${p}atLow does not match the balance history on ${re.lowDate}`);
      const dc = claimOf(r, 'dip');
      if (!dc || !dc.text.includes(money(re.fall)) || !dc.text.includes(`${pct1(-re.drop)}%`)) fail(`${p}the dip sentence does not state the recomputed fall and drop`);
      if (Boolean(claimOf(r, 'at-low')) !== (r2(row.moneyIn - row.balance) > 0)) fail(`${p}"below what you had put in" is ${claimOf(r, 'at-low') ? 'said' : 'missing'} but the balance was ${row.balance} vs ${row.moneyIn}`);
    }
  });
  rule('R3', 'The auto-invest pause date and everything the story says happened "after" it are true', (fail) => {
    for (const acc of funded) {
      const r = rosa[acc.id], p = `[${acc.id}] `; if (!r) continue;
      const f = r.facts, paused = acc.autoInvest.pausedOn;
      if ((f.pause?.date ?? null) !== paused) fail(`${p}pause ${f.pause?.date ?? null} != autoInvest.pausedOn ${paused}`);
      if (paused && f.pause && f.pause.date !== nextTradingDay(addDays(f.dip.lowDate, 1))) fail(`${p}the story says she paused "the next trading day", but ${f.pause.date} is not the trading day after the low ${f.dip.lowDate}`);
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
      if (paused && !(has('pause') && has('cash-after') === deps.length > 0 && !has('kept-buying'))) fail(`${p}a paused account must tell the pause (and cash-after when deposits came after it), not kept-buying`);
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

  rule('L5', 'Every on-screen sentence follows the copy rules: grade 8, no jargon, no advice or project language, rates in percentage points, house money format, every value labeled', (fail) => {
    if (!copy || !Object.keys(copy).length) { fail('no copy files were loaded'); return; }
    const shared = copy['src/shared/copy.json'];
    const months = shared?.dates?.months;
    const fmtDate = (iso) => { const [, m, d] = iso.split('-').map(Number); return `${months?.[m - 1] ?? '?'} ${d}`; };
    const fmtMoney = (n) => { const a = Math.abs(r2(n)); const t = '$' + a.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); return n < 0 && a > 0 ? `−${t}` : t; };
    const fill = (t, v) => t.replace(/\{(\w+)\}/g, (m, k) => (k in v ? String(v[k]) : m));
    const fmtChange = (n) => { const r = r2(n); return r > 0 ? fill(shared.change.up, { amount: fmtMoney(r) }) : r < 0 ? fill(shared.change.down, { amount: fmtMoney(-r) }) : shared.change.none; };
    const flagAny = allAccounts.flatMap(flagsOf)[0];
    // Words that come from the glossary or a flag are filled with EVERY entry, not one sample.
    const glossaryVariants = glossary.map((g) => ({ term: g.term, terms: g.alsoCalled.join(', ') || g.term, short: g.short, example: g.example, link: g.source?.label ?? g.term }));
    // Each scenario's own values: what a person in that scenario would read.
    const valuesFor = (acc) => {
      const w = acc.weeklyChange, goal = acc.goal, flag = flagsOf(acc)[0] ?? flagAny;
      const money = { balance: acc.balance, cash: acc.cash, moneyIn: acc.moneyIn, earned: acc.gainLoss, market: w?.marketChange ?? 0, dividends: w?.dividends ?? 0,
        target: goal?.target ?? 0, actual: goal?.actualMoneyInToDate ?? 0, planned: goal?.plannedMoneyInToDate ?? 0, behind: goal?.behindBy ?? 0,
        price: funds[0].latestPrice, amount: acc.recurringDeposit?.amount ?? 0 };
      const v = {};
      for (const n of PLACEHOLDERS.money) v[n] = fmtMoney(money[n] ?? acc.balance);
      v.change = fmtChange(w?.totalChange ?? 0);
      v.market = fmtChange(w?.marketChange ?? 0);
      for (const n of PLACEHOLDERS.date) v[n] = fmtDate(acc.asOf);
      for (const n of PLACEHOLDERS.count) v[n] = n === 'decimals' ? String(practice.maxDecimals) : '3';
      Object.assign(v, { age: '22', endAge: '65', startAge: '22', niaAge: '22', theoAge: '32', rating: String(funds[0].upsAndDowns), now: '40', set: '35',
        pct: '95', points: '0.10', fee: '0.45', oldFee: '0.45', newFee: '0.55', shares: '0.5190', dollars: '196' });
      v.ticker = acc.holdings[0]?.ticker ?? funds[0].ticker;
      Object.assign(v, { name: persona.firstName, title: flag.title, label: 'Your balance since March', series: 'Balance', kind: 'Stocks', status: 'Pending',
        type: 'Deposits', page: 'Activity', query: 'fee', region: funds[0].region ?? 'United States',
        claim: story.claims[0].text, note: story.bumpy.note, reply: 'Here is how it turns out.', setting: 'Start at 30',
        month: story.rosaStory?.[acc.id]?.facts.dip.month ?? 'May', direction: 'up' });
      const flags = flagsOf(acc).length ? flagsOf(acc) : [flag];
      return [...glossaryVariants.map((g) => ({ ...v, ...g })), ...flags.map((f) => ({ ...v, ...glossaryVariants[0], title: f.title }))];
    };
    const scenarioAccounts = scenarios.map((sc) => [sc.id, allAccounts.find((a) => a.id === sc.accountId)]).filter(([, a]) => a);
    const words = (t) => t.split(/\s+/).filter((x) => /[A-Za-z]/.test(x)).length;
    // Labels of 3 words or fewer are exempt from the grade ("Type: Deposits. Status: Pending." is two labels).
    // A leading label of 3 words or fewer ("Example:", "Source:") is a label too.
    const lint = (where, filled, bare, graded = filled) => {
      const lead = graded.match(/^([^.:!?]+):\s+/);
      if (lead && words(lead[1]) <= 3) graded = graded.slice(lead[0].length);
      if (graded.split(/[.!?]+/).some((x) => words(x) > 3)) { const g = fkGrade(graded); if (g > MAX_GRADE) fail(`${where} is grade ${g.toFixed(1)}: "${filled.slice(0, 90)}"`); }
      for (const w of JARGON) if (hasWord(bare, w)) fail(`${where} uses jargon "${w}"`);
      for (const re of [...ADVICE_PATTERNS, ...PROJECT_LANGUAGE]) if (re.test(bare)) fail(`${where} matches ${re}: "${bare.slice(0, 90)}"`);
      for (const p of [...rateProblems(filled), ...moneyProblems(filled)]) fail(`${where} ${p}: "${filled.slice(0, 90)}"`);
    };
    for (const [file, obj] of Object.entries(copy)) for (const [path, t, parent] of templates(obj)) {
      const names = [...t.matchAll(/\{(\w+)\}/g)].map((m) => m[1]);
      const isWord = (n) => typeof parent[`${n}Word`] === 'string';
      for (const n of names) if (!isWord(n) && !KIND_OF[n]) fail(`${file}:${path} uses {${n}}, which has no meaning in PLACEHOLDERS`);
      // A value needs words around it that say what it measures (or a listed visible label).
      const valueNames = names.filter((n) => !isWord(n) && KIND_OF[n] && !['text', 'ticker'].includes(KIND_OF[n]));
      const hasWords = /[A-Za-z]{2,}/.test(t.replace(/\{\w+\}/g, '')) || names.some((n) => isWord(n) || ['text', 'ticker'].includes(KIND_OF[n]));
      if (valueNames.length && !hasWords && !LABELED_ELSEWHERE[`${file}:${path}`]) fail(`${file}:${path} shows {${valueNames.join('}, {')}} with no words saying what it measures: "${t}"`);
      const bare = t.replace(/\{\w+\}/g, ' ');
      for (const [scId, acc] of scenarioAccounts) {
        const seen = new Set();
        for (const v of valuesFor(acc)) {
          for (const n of names) if (isWord(n)) v[n] = parent[`${n}Word`];
          const filled = fill(t, v);
          const graded = fill(t, { ...v, ...Object.fromEntries(QUOTED_NAMES.filter((n) => !isWord(n)).map((n) => [n, 'Name'])) });
          if (!seen.has(filled)) { seen.add(filled); lint(`${file}:${path} [${scId}]`, filled, bare, FIXED_WORDING[`${file}:${path}`] ? '' : graded); }
        }
      }
    }
    // The generated story sentences, per scenario, as they appear on screen.
    const storySentences = [
      ...Object.values(story.rosaStory || {}).filter(Boolean).flatMap((r) => [[`story:rosaStory:${r.accountId}.pointOfView`, r.pointOfView], ...r.claims.map((c) => [`story:rosaStory:${r.accountId}:${c.id}`, c.text])]),
      ['story:pointOfView', story.pointOfView], ['story:assumptions.note', story.assumptions.note], ['story:bumpy.note', story.bumpy.note],
      ['story:yourTurn.note', story.yourTurn.note], ['practice:timeMachine.note', practice.timeMachine.note],
      ...story.claims.map((c) => [`story:claim:${c.id}`, c.text]),
    ];
    for (const [where, text] of storySentences) lint(where, text, text);
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
  const failed = report(validate(data, { missing, briefExamples: loadBriefExamples(), copy: loadCopy(), sources: loadSources() }));
  process.exit(failed ? 1 : 0);
}
